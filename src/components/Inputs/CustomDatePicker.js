import * as React from 'react';
import TextField from '@mui/material/TextField';
import ruLocale from 'date-fns/locale/ru';
import { DatePicker, DateTimePicker, LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { memo, useMemo } from 'react';

const inputSx = {
  '.MuiInputBase-root.MuiInputBase-formControl': {
    borderRadius: '8px',
  },
  '&.error': {
    fieldset: {
      border: ({ palette }) => `1px solid ${palette.error.main}`,
    },
  },
  fieldset: {
    border: 'none',
  },
};

function CustomDatePicker({
  required,
  disabled,
  className,
  value,
  onChange,
  name,
  label,
  placeholder = 'ДД.ММ.ГГГГ',
  minDate,
  maxDate,
  error,
  isDateTime = false,
  sx,
}) {
  const Component = useMemo(() => (isDateTime ? DateTimePicker : DatePicker), [isDateTime]);
  const errorClass = (!disabled && error) ? 'error' : '';

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} locale={ruLocale}>
      <Component
        label={label}
        minDate={minDate}
        maxDate={maxDate}
        disabled={disabled}
        value={value}
        onChange={(newValue) => onChange({ target: { name } }, (newValue?.toString() && newValue?.toString() === 'Invalid Date') ? '' : newValue)}
        renderInput={(params) => {
          if (placeholder) params.inputProps.placeholder = placeholder;

          return (
            <TextField
              className={`${className} ${errorClass}`}
              {...params}
              required={required}
              name={name}
              error={!!error}
              helperText={error}
              sx={{ ...inputSx, ...sx }}
            />
          );
        }}
      />
    </LocalizationProvider>
  );
}

export default memo(CustomDatePicker);
