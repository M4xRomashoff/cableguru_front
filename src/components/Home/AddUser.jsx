import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { createUserRequest } from '../../api/userApi';
import useApi from '../../hooks/useApi';
import './Home.css';
import CustomInput from '../Inputs';
import { Box } from '@mui/material';
import ModalWithTitle from '../Modals/ModalWithTitle';
import CustomButton from '../Button';
import { formValidator } from '../../helpers';
import { validateCompany, validateName, validatePass, validatePhone } from '../../helpers/validations';
import Selector from '../Inputs/Selector';

const initialUserInput = {
  name: '',
  password: '',
  password_confirmation: '',
  password_hint: '',
  email: '',
  phone: '',
  company: '',
};

const AddUser = ({ onClose, getUsers }) => {
  const [userInput, setUserInput] = useState({ ...initialUserInput });
  const [errors, setErrors] = useState({ ...initialUserInput });
  const [accessLevelList, setAccessLevelList] = useState({});
  const [accessItem, setAccessItem] = useState({ name: 'Guest', value: 50 });

  const clearUserInput = () => setUserInput({ ...initialUserInput });

  const { email, name, password, password_confirmation, password_hint, phone, company } = userInput;

  const onChange = ({ value, name }) => {
    setUserInput((prevState) => ({
      ...prevState,
      [name]: value,
    }));

    setErrors((prevState) => ({
      ...prevState,
      [name]: '',
    }));
  };

  useEffect(() => {
    setAccessLevelList([
      { name: 'admin', value: 80 },
      { name: 'Engineer', value: 79 },
      { name: 'Project Manager', value: 78 },
      { name: 'Construction Manager', value: 77 },
      { name: 'Splicer', value: 70 },
      { name: 'Construction Crew', value: 60 },
      { name: 'Guest', value: 50 },
    ]);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { hasErrors, validField } = formValidator({
      form: userInput,
      customRules: [
        { name: 'name', text: 'Name too low', valid: (item) => validateName(item) },
        { name: 'password' },
        { name: 'password_confirmation' },
        // { name: 'password_hint' },
        { name: 'email' },
        { name: 'phone (088 890 8989)', text: 'Invalid phone', valid: (item) => item.length === 10 },
        { name: 'company', text: 'Company name is wrong', valid: (item) => item.length > 1 },
      ],
      inputRule: {
        name: ['name'],
        password: ['password'],
        password_confirmation: ['password_confirmation'],
        // password_hint: ['password_hint'],
        email: ['email'],
        phone: ['phone'],
        company: ['company'],
      },
    });

    setErrors(validField);
    if (hasErrors) throw { frontendError: 'Has Required Fields' };
    let access = accessItem.value;
    const result = await createUserRequest({ name, password, password_confirmation, password_hint, email, phone, company, access });
    await getUsers();
    clearUserInput();
    onClose();
  };

  const { makeRequest: createUser, isLoading } = useApi({
    request: handleSubmit,
  });

  const changeAccessLevel = ({ value }) => setAccessItem(value);

  return (
    <ModalWithTitle title="Create User" containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={createUser}>
        {Object.keys(initialUserInput).map((key) => {
          const type = ['password', 'password_confirmation'].includes(key) ? 'password' : 'text';

          return <CustomInput sx={{ width: '100%' }} error={errors[key]} key={key} name={key} type={type} value={userInput[key]} onChange={onChange} label={key} />;
        })}
        <Selector sx={{ width: '100px', padding: '2px' }} onChange={changeAccessLevel} value={accessItem} label="Access Level" fields={{ label: 'name', value: 'value' }} options={accessLevelList} />
        <CustomButton type="submit">Create</CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default AddUser;
