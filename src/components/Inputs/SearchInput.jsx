import { Box, IconButton } from '@mui/material';
import React from 'react';
import CustomInput from './index';
import { Search } from '@mui/icons-material';

const iconSx = { position: 'absolute', left: '14px' };

const innerInputSx = {
  width: '100%',
  input: { paddingLeft: '50px' },
  fieldset: { border: 'none' },
  '.MuiInputLabel-root': {
    paddingLeft: '50px',
  },
};

const innerContainerSx = {
  backgroundColor: '#F5F7FA',
};

function SearchInput({
  onChange,
  sx,
  onKeyEnter,
  type,
  value,
  label,
  placeholder = 'Поиск',
}) {
  return (
    <Box sx={{ ...innerContainerSx, ...sx }} display="flex" borderRadius="8px" alignItems="center" position="relative">
      <CustomInput
        placeholder={placeholder}
        label={label}
        sx={innerInputSx}
        value={value}
        type={type}
        onChange={onChange}
        onKeyEnter={onKeyEnter}
      />
      <IconButton sx={iconSx} onClick={(e) => onKeyEnter(e, value)}>
        <Search />
      </IconButton>
    </Box>
  );
}

export default SearchInput;
