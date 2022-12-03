import React, { useEffect, useState } from 'react';
import Autocomplete from '@mui/material/Autocomplete';
import { useDebouncedCallback } from 'use-debounce';
import { Box, TextField, Typography } from '@mui/material';
import { compareId } from '../../helpers';

export const DEFAULT_AUTOCOMPLETE_OPTION = {
  label: '',
  value: '',
  id: '',
};

export const DEFAULT_AUTOCOMPLETE_FIELD = {
  label: 'label',
  value: 'value',
  id: 'id',
};

const autocompleteSx = {
  width: 300,
  '& .MuiInputLabel-root': {
    pr: 3,
  },
  '&.error': {
    fieldset: {
      border: ({ palette }) => `1px solid ${palette.error.main}`,
    },
  },
  '.MuiInputBase-root.MuiInputBase-formControl': {
    borderRadius: '8px',
  },
  fieldset: {
    border: 'none',
  },
};

const disableHoverEffect = { background: 'initial !important' };

function CustomAutocomplete({
  required,
  onChange,
  value,
  name,
  asyncSearch,
  noOptionComponent = <Typography>Нет совпадений</Typography>,
  options,
  fields,
  label,
  filterOptions,
  placeholder,
  sx,
  containerSx,
  error,
  loading,
  id,
  disabled,
  useDefaultFilter,
  selectFirstOption,
  multiline = true,
  ...rest
}) {
  const [innerValue, setInnerValue] = useState('');
  const [isSelectedFirstOption, setIsSelectedFirstOption] = useState(false);
  const errorClass = (!disabled && error) ? 'error' : '';

  const [innerFields] = useState({
    value: 'value',
    label: 'label',
    id: 'id',
    ...fields,
  });

  const textInputValue = value[innerFields.label];

  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const makeAsyncSearch = useDebouncedCallback((newValue) => {
    asyncSearch(newValue);
  }, 500);

  const debounceChangeValue = useDebouncedCallback((e, newValue, index) => {
    if (e) {
      e.target.name = name;
      let currentOption = typeof index === 'number' ? options[index] : value;
      if (newValue === '') {
        currentOption = {
          [innerFields.label]: '',
          [innerFields.value]: '',
          [innerFields.id]: '',
        };
      }
      onChange?.({
        event: e,
        value: { ...currentOption, [innerFields.label]: newValue },
        name: e.target.name,
      });
    } else return;

    if (asyncSearch) {
      makeAsyncSearch(newValue ? { search: newValue } : '');
    }
  }, 150);

  const onInputChange = (e, newValue, index) => {
    debounceChangeValue(e, newValue, index);
    if (asyncSearch) setIsLoading(true);
    setInnerValue(newValue);
  };

  const innerFilterOptions = (innerOptions) => {
    let filteredOptions = innerOptions;

    if (filterOptions) {
      filteredOptions = filterOptions(innerOptions, textInputValue);
    } else if (!asyncSearch || useDefaultFilter) {
      filteredOptions = innerOptions.filter((item) => {
        const filterLowerCase = item?.[innerFields.label]?.toLowerCase();
        return filterLowerCase?.includes?.(textInputValue?.toLowerCase?.());
      });
    }

    if (!isLoading && !filteredOptions.length) {
      filteredOptions.push({ noOptionComponent });

      return filteredOptions;
    }

    return filteredOptions;
  };

  const checkOptionEqual = (
    option,
    nextOption,
  ) => option?.[innerFields.id] === nextOption?.[innerFields.id];

  useEffect(() => {
    if (textInputValue !== innerValue) setInnerValue(textInputValue);
    // eslint-disable-next-line
  }, [textInputValue]);

  const isAsyncLoading = asyncSearch && isLoading;

  useEffect(() => {
    if (loading === false) {
      setIsLoading(false);
    }
  }, [loading]);

  useEffect(() => {
    if (selectFirstOption && options.length && !isSelectedFirstOption) {
      setIsSelectedFirstOption(true);

      const optionIndex = typeof selectFirstOption !== 'boolean'
        ? options.findIndex((option) => compareId(option[innerFields.id], selectFirstOption)) || 0
        : 0;

      onInputChange({ target: { name } }, options[optionIndex][innerFields.label], optionIndex);
    }
    /* eslint-disable-next-line */
  }, [selectFirstOption, isSelectedFirstOption, options]);

  return (
    <Box sx={containerSx}>
      <Autocomplete
        disabled={Boolean(disabled)}
        freeSolo
        clearOnBlur={false}
        className={errorClass}
        clearOnEscape={false}
        id={id}
        sx={{ ...autocompleteSx, ...sx }}
        open={isOpen}
        onOpen={() => setIsOpen(true)}
        onClose={() => setIsOpen(false)}
        isOptionEqualToValue={checkOptionEqual}
        getOptionLabel={(option) => option?.[innerFields.label] || ''}
        options={isAsyncLoading ? [] : options || []}
        loading={isLoading}
        loadingText="Загрузка..."
        filterOptions={innerFilterOptions}
        onInputChange={onInputChange}
        inputValue={innerValue || ''}
        renderOption={(props, option) => (
          <Typography
            component="li"
            {...props}
            sx={option?.noOptionComponent && disableHoverEffect}
            onClick={(e) => {
              if (option?.noOptionComponent) return;

              props.onClick(e, props.key);
              onInputChange(e, props.key, props['data-option-index']);
            }}
            key={option[innerFields.id]}
          >
            {option?.noOptionComponent || option[innerFields.label]}
          </Typography>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            name={name}
            {...rest}
            required={required}
            placeholder={placeholder}
            error={Boolean(error)}
            helperText={error}
            label={label}
            multiline={multiline}
          />
        )}
      />
    </Box>
  );
}

export default CustomAutocomplete;
