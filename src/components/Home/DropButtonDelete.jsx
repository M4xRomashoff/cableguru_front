import React from 'react';
import PropTypes from 'prop-types';
import './Home.css';
import { DeleteUser } from '../../api/userApi';

const DropButtonDelete = ({ options }) => {
  const [value, setValue] = React.useState();

  function OnDeleteClick() {
    DeleteUser(value);
  }

  const handleChange = (event) => {
    setValue(event.target.value);
  };

  return (
    <div>
      <Dropdown label="Select User to Delete  " options={options} value={value} onChange={handleChange} />

      <p className="label">{value}</p>
      <button className="button" onClick={OnDeleteClick}>
        {' '}
        Delete User{' '}
      </button>
    </div>
  );
};

const Dropdown = ({ label, value, options, onChange }) => {
  return (
    <label>
      {label}
      <select className="select" value={value} onChange={onChange}>
        {options.map((option) => (
          <option value={option.value} key={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
};

DropButtonDelete.propTypes = {
  options: PropTypes.array.isRequired,
};

export default DropButtonDelete;
