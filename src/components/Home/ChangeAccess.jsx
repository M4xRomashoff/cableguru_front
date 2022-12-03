import React, { useState } from 'react';
import './Home.css';
import ModalChangeAccess from '../Modal/ModalChangeAccess';
import PropTypes from 'prop-types';

const ChangeAccess = ({ options }) => {
  const [userId, setUserId] = useState(null);

  const [value, setValue] = React.useState();
  const [isOpen, setIsOpen] = useState(false);

  const handleChange = (event) => {
    setValue(event.target.value);
    const selectElem = document.getElementById('sel1');
    const index = selectElem.selectedIndex;
    setUserId(event.target.options[index].id);
  };

  const openModal = () => setIsOpen(true)
  const closeModal = () => setIsOpen(false)

  return (
    <div>
      <Dropdown
        label="Select User to change access"
        options={options}
        value={value}
        onChange={handleChange}
      />
      <p className="label">{value}</p>
      <button className="button" onClick={openModal}>Change access for this User</button>
      {isOpen && <ModalChangeAccess onClose={closeModal} isOpen={isOpen} userId={userId} />}
    </div>
  );
};

const Dropdown = ({ label, value, options, onChange }) => {
  return (
    <label>
      {label}
      <select className="select" value={value} onChange={onChange} id="sel1">
        {options.map((option) => (
          <option value={option.value} key={option.value} label={option.label} id={option.id}></option>
        ))}
      </select>
    </label>
  );
};

ChangeAccess.propTypes = {
  options: PropTypes.array.isRequired,
};

export default ChangeAccess;