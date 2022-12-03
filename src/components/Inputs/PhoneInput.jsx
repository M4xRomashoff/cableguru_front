import { Box, TextField } from '@mui/material';
import InputMask from 'react-input-mask';
import React, { memo } from 'react';

const innerContainerSx = {
  fieldset: {
    border: 'none',
  },
  '&.error': {
    fieldset: {
      border: ({ palette }) => `1px solid ${palette.error.main}`,
    },
    '& .MuiInputLabel-root': {
      color: ({ palette }) => palette.error.main,
    },
    '& .MuiFormHelperText-root': {
      color: ({ palette }) => palette.error.main,
    },
  },
  '.MuiInputBase-root.MuiInputBase-formControl': {
    borderRadius: '8px',
  },
};

function PhoneInput({
  error,
  value,
  disabled,
  containerSx,
  onChange,
  name,
  label = 'Номер телефона',
  ...rest
}) {
  const errorClass = (!disabled && error) ? 'error' : '';

  return (
    <Box className={errorClass} sx={{ ...innerContainerSx, ...containerSx }}>
      <InputMask
        mask="+7(999)-999-99-99"
        maskChar="_"
        onChange={(e) => onChange({ event: e, value: e.target.value, name: e.target.name })}
        value={value}
        disabled={disabled}
      >
        {() => (
          <Box position="relative" width="100%" display="flex" alignItems="center">
            <TextField
              fullWidth
              type="tel"
              name={name}
              disabled={disabled}
              placeholder="+7"
              label={label}
              error={error || false}
              helperText={error || ''}
              {...rest}
            />
          </Box>
        )}
      </InputMask>
    </Box>
  );
}

export default memo(PhoneInput);
