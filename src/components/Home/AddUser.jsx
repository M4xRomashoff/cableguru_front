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

const AddUser = ({ l, onClose, getUsers }) => {
  const [userInput, setUserInput] = useState({ ...initialUserInput });
  const [errors, setErrors] = useState({ ...initialUserInput });
  const [accessLevelList, setAccessLevelList] = useState({});
  const [accessItem, setAccessItem] = useState({ name: 'Guest', value: 50 });

  const clearUserInput = () => setUserInput({ ...initialUserInput });

  const { email, name, password, password_confirmation, password_hint, phone, company } = userInput;


  const UserInputValues = {
    name: l.name,
    password: l.password,
    password_confirmation: l.password_confirmation,
    password_hint: l.password_hint,
    email: l.email,
    phone: l.phone,
    company: l.company,
  };




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
      { name: l.admin, value: 80 },
      { name: l.Engineer, value: 79 },
      { name: l.Project_Manager, value: 78 },
      { name: l.Construction_Manager, value: 77 },
      { name: l.Splicer, value: 70 },
      { name: l.Construction_Crew, value: 60 },
      { name: l.Guest, value: 50 },
    ]);
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();

    const { hasErrors, validField } = formValidator({
      form: userInput,
      customRules: [
        { name: 'name', text: l.Name_too_short, valid: (item) => validateName(item) },
        { name: 'password' },
        { name: 'password_confirmation' },
        { name: 'email' },
        { name: 'phone', text: l.Invalid_phone, valid: (item) => item.length === 10 },
        { name: 'company', text: l.Company_name_is_wrong, valid: (item) => item.length > 1 },
      ],
      inputRule: {
        name: ['name'],
        password: ['password'],
        password_confirmation: ['password_confirmation'],
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
    <ModalWithTitle title={l.Create_User} containerSx={{ width: 400 }} close={onClose} open>
      <Box component="form" display="flex" gap={2} alignItems="flex-start" flexDirection="column" onSubmit={createUser}>
        {Object.keys(initialUserInput).map((key) => {
          const type = ['password', 'password_confirmation'].includes(key) ? 'password' : 'text';

          return <CustomInput sx={{ width: '100%' }} error={errors[key]} key={key} name={key} type={type} value={userInput[key]} onChange={onChange} label={UserInputValues[key] } />;
        })}
        <Selector sx={{ width: '100px', padding: '2px' }} onChange={changeAccessLevel} value={accessItem} label={l.Access_Level} fields={{ label: 'name', value: 'value' }} options={accessLevelList} />
        <CustomButton type="submit">{l.Create}</CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default AddUser;
