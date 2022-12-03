/* eslint-disable */
import React, { memo, useEffect, useMemo, useState } from 'react';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import { useDebouncedCallback } from 'use-debounce';

const inputSx = {
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
    borderRadius: '3px',
    background: 'rgb(222, 222, 222)',
    // border: ({ palette }) => `1px solid ${palette.primary.main}`,
  },
};

function CustomInput({ className, variant = 'filled', sx, value, onChange, error, disabled, label, onKeyEnter, min, max, maxLength, placeholder, required, type = 'text', multiline, ...props }) {
  const [innerValue, setInnerValue] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const errorClass = !disabled && error ? 'error' : '';
  const errorText = error;

  const keyEnterProps = useMemo(() => {
    if (onKeyEnter) {
      return { onKeyPress: (e) => e.key === 'Enter' && onKeyEnter(e, e?.target?.value) };
    }
    return {};
  }, [onKeyEnter]);

  const minMaxProps = min || max ? { min, max } : {};

  const debounceChangeValue = useDebouncedCallback((e) => {
    onChange?.({ event: e, value: e.target.value, name: e.target.name });
  }, 150);

  const changeInputValue = (e) => {
    debounceChangeValue(e);
    setInnerValue(e.target.value);
  };

  useEffect(() => {
    if (value !== innerValue) setInnerValue(value);
  }, [value]);

  const PasswordComponent = type === 'password' && (
    <InputAdornment position="end">
      <IconButton aria-label="toggle password visibility" onClick={() => setShowPassword(!showPassword)} edge="end" sx={{ backgroundColor: showPassword ? '#e3e3e3' : '' }}>
        {showPassword ? <Visibility /> : <VisibilityOff />}
      </IconButton>
    </InputAdornment>
  );

  return (
    <TextField
      placeholder={placeholder}
      type={showPassword ? 'text' : type}
      label={label}
      helperText={errorText}
      size="small"
      error={!!errorText}
      {...keyEnterProps}
      inputProps={{ maxLength, ...minMaxProps }}
      InputProps={{ endAdornment: PasswordComponent }}
      onChange={changeInputValue}
      disabled={disabled}
      sx={{ ...inputSx, ...sx }}
      className={`${className} ${errorClass}`}
      value={innerValue || ''}
      multiline={multiline}
      {...props}
      variant={variant}
      required={required}
    />
  );
}

export default memo(CustomInput);
