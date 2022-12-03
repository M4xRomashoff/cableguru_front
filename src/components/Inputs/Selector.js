import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { Box, Chip, CircularProgress, FormControl, InputAdornment, MenuItem, TextField } from '@mui/material';
import useApi from '../../hooks/useApi';
import { ArrowDropDown } from '@mui/icons-material';

const innerFormSx = {
  position: 'relative',
  width: 'fit-content',
  minWidth: '160px',
  '&.form-selector.opened': {
    svg: {
      transform: 'rotate(180deg)',
    },
  },
  '&.error': {
    fieldset: {
      border: ({ palette }) => `1px solid ${palette.error.main}`,
    },
  },
  '& .dropdown-icon': {
    pointerEvents: 'none',
    userSelect: 'none',
    position: 'absolute',
    top: 'initial',
    right: 12,
  },
  '.MuiInputBase-root.MuiInputBase-formControl': {
    borderRadius: '8px',
    background: 'rgb(192, 192, 192)',
  },
  fieldset: {
    border: 'none',
  },
};

function SelectedChip({ selected, onChange, name, fields }) {
  return (
    <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
      {selected.map((item, index) => (
        <Chip
          key={item[fields.value]}
          label={item[fields.label]}
          onDelete={(e) => onChange(
            {
              preventDefault: e.preventDefault,
              stopPropagation: e.stopPropagation,
              target: { name },
            },
            { props: { item: selected[index] } },
          )}
        />
      ))}
    </Box>
  );
}

export const DEFAULT_SELECTOR_FIELDS = { label: 'label', value: 'value', id: 'id' };
export const DEFAULT_SELECTOR_OPTION = { label: '', value: '', id: '' };

function IconComponent(props) {
  const { className } = props;
  return <ArrowDropDown params={props} className={`material-icons dropdown-icon ${className}`} />;
}

function Selector({
  fields,
  multiple,
  request,
  className = '',
  disabled,
  useEmpty,
  error,
  required,
  value,
  sx,
  onChange,
  label,
  isLoading,
  options = [],
  name,
  StartIconComponent,
  placeholder,
  inputSx,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [innerOptions, setInnerOptions] = useState([]);
  const [innerValue, setInnerValue] = useState(multiple ? [''] : '');
  const errorClass = (!disabled && error) ? 'error' : '';
  const multipleValuesClass = multiple && value.length ? 'multiple-values' : '';

  useApi({
    setter: setInnerOptions,
    shouldRequestOnMount: Boolean(request),
    request,
  });

  const mainFields = useMemo(() => ({
    value: 'value',
    label: 'label',
    ...fields,
  }), [fields]);

  const mainOptions = useMemo(() => {
    if (useEmpty) {
      return [
        {
          [mainFields.label]: 'Нет значения',
          [mainFields.value]: null,
        },
        ...options,
      ];
    }

    if (multiple && request) return innerOptions;

    return options || [];
  }, [options, innerOptions, multiple, useEmpty, mainFields.value, mainFields.label]);

  const handleChange = (e, { props }) => {
    if (!multiple) {
      return onChange({ event: e, value: props.item, name });
    }

    const existingOptionIndex = value
      .findIndex((item) => props.item[mainFields.value] === item[mainFields.value]);

    if (existingOptionIndex === -1) {
      onChange({ event: e, value: [...value, props.item], name });
    } else {
      const copyValue = value.slice();
      copyValue.splice(existingOptionIndex, 1);
      onChange({ event: e, value: copyValue, name });
    }
  };

  useEffect(() => {
    setInnerValue(multiple ? value.map((item) => item[mainFields.value] || '') : value?.[mainFields.value] ?? '');
  }, [value, mainFields.value, multiple]);

  const isOpenedClass = isOpen ? ' opened' : '';

  const getSelectedChip = useCallback(() => (
    <SelectedChip fields={mainFields} selected={value} name={name} onChange={handleChange} />
  ), [mainFields, value, name]);

  return (
    <FormControl
      className={`${className} form-selector${isOpenedClass} ${errorClass}${multipleValuesClass}`}
      sx={{ ...innerFormSx, ...sx }}
      disabled={disabled}
      fullWidth
    >
      {isLoading && (
        <Box
          width="100%"
          height="100%"
          position="absolute"
          display="flex"
          justifyContent="center"
          alignItems="center"
        >
          <CircularProgress />
        </Box>
      )}
      <TextField
        select
        size="small"
        required={required}
        disabled={isLoading || disabled}
        labelid={label}
        error={!!error}
        helperText={error}
        defaultValue=""
        id={label}
        placeholder={placeholder}
        name={name}
        value={innerValue}
        InputProps={StartIconComponent && {
          startAdornment: (
            <InputAdornment position="start">
              {StartIconComponent}
            </InputAdornment>
          ),
        }}
        SelectProps={{
          multiple,
          open: isOpen,
          onOpen: (e) => {
            if (!['path', 'svg'].includes(e.target.localName)) setIsOpen(true);
          },
          onClose: (e) => {
            if (multiple && e.target.selected === undefined) {
              return setIsOpen(false);
            }

            setIsOpen(false);
          },
          IconComponent,
          renderValue: !multiple ? undefined : getSelectedChip,
        }}
        label={label}
        sx={inputSx}
        onChange={handleChange}
      >
        {mainOptions?.map?.((item) => (
          <MenuItem
            key={item[mainFields.value]}
            className={multiple && value.some((valueOption) => valueOption[mainFields.value] === item[mainFields.value]) ? 'Mui-selected' : ''}
            value={item[mainFields.value] ?? item[mainFields.label]}
            item={item}
          >
            {item[mainFields.label]}
          </MenuItem>
        ))}
      </TextField>
    </FormControl>
  );
}

export default Selector;
