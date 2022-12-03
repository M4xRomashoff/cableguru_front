import React from 'react';

const Input_item = ({ disabled, width, label, item, setItem, setIsSaved }) => {
  return (
    <label>
      {label} <br />
      <input
        disabled={disabled}
        value={item}
        onChange={(e) => {
          setItem(e.target.value);
          setIsSaved(false);
        }}
      />
    </label>
  );
};
export default Input_item;

// export function input_item_disabled(width, label, item) {
//   return <CustomInput variant="standard" size="small" InputProps={{ style: { fontSize: '1rem', height: 25 } }} disabled={true} sx={{ width: { width } }} value={item} label={label} />;
// }
