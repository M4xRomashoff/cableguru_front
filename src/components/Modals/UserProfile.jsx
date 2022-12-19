import React, { useState } from 'react';
import '../Home/Home.css';
import { Box } from '@mui/material';
import ModalWithTitle from '../Modals/ModalWithTitle';
import CustomButton from '../Button';
import { getSessionItem, setSessionItem } from '../../helpers/storage';
import CustomText from '../CustomText';
import CustomInput from '../Inputs';
import { validateCompany, validateName, validatePass, validatePhone, validateEmail } from '../../helpers/validations';
import {updateUserInfo} from '../../api/dataBasesApi';

const blockStyle = { width: '100%', '& button': { ml: 'auto' }}

const UserProfile = ({ l, onClose }) => {

  const [nam,setNam]=useState('');
  const [comp,setComp]=useState('');
  const [pho,setPho]=useState('');
  const [emai,setEmai]=useState('');
  const [pass,setPass]=useState('');
  const [passC,setPassC]=useState('');
  const [passH,setPassH]=useState('');


  const [nameEdit, setNameEdit]=useState(false);
  const [companyEdit,setCompanyEdit]=useState(false);
  const [emailEdit,setEmailEdit]=useState(false);
  const [phoneEdit, setPhoneEdit]=useState(false);
  const [passEdit,setPassEdit]=useState(false);


  const { phone, user_email, user_name, company } = getSessionItem('user');


  function clickName() {
    setNameEdit(true);
    setNam(user_name);
  }

  function clickCompany() {
    setCompanyEdit(true);
    setComp(company);
  }

  function clickEmail() {
    setEmailEdit(true);
    setEmai(user_email);
  }

  function clickPhone() {
    setPhoneEdit(true);
    setPho(phone);
  }

  function clickPassword() {
    setPassEdit(true);
  }

  const saveChanges = (event) => {
    event.preventDefault();
    let good = true;
    let user = getSessionItem('user');

    if (nameEdit){
      if (!validateName(nam)) {alert( l.name_is_not_valid); good = false; }
      else user.user_name=nam;
    }
    if(phoneEdit){
      if(!validatePhone(pho)) {alert(l.phone_is_not_valid); good = false;}
      else user.phone=pho;
    }
    if (companyEdit){
      if (!validateCompany(comp)) {alert(l.company_is_not_valid); good = false;}
      else user.company=comp;
    }
    if (emailEdit){
      if(!validateEmail(emai)) {alert(l.email_is_not_valid); good = false;}
      else user.user_email=emai;
    }
    if (passEdit){
      if(!validatePass(pass)) {alert(l.passwords_is_not_valid);  good = false;}
      if (pass !== passC) {alert(l.passwords_do_not_match); good = false;}
    }
    if (good) {
      setSessionItem('user',user);
      if (passEdit) {
        user['password']=pass;
        user['password_hint']=passH;
      }
      updateUserInfo(user);


      onClose();
    }
  }

  const onChangeName = ({value }) => {
    setNam(value);
  };
  const onChangeCompany = ({value }) => {
    setComp(value);
  };
  const onChangeEmail = ({value }) => {
    setEmai(value);
  };
  const onChangePhone = ({value }) => {
    setPho(value);
  };
  const onChangePass = ({value }) => {
    setPass(value);
  };
  const onChangePassC = ({value }) => {
    setPassC(value);
  };
  const onChangePassH = ({value }) => {
    setPassH(value);
  };




  return (
    <ModalWithTitle title={l.User_Profile} close={onClose} open>
      <Box component='form' display='flex' gap={2} alignItems='flex-start' flexDirection='column'
           onSubmit={saveChanges}>
        <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='row' justify-content='center'>
          {!nameEdit &&<CustomText>{l.Name} </CustomText>}
          {!nameEdit && <CustomText>{user_name}</CustomText>}
          {nameEdit &&  <CustomInput label={l.Name} name="name" onChange={onChangeName} value={nam} />}
            <CustomButton onClick={clickName}>{l.change}</CustomButton>
        </Box>
        <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='row' justify-content='center'>
          {!companyEdit &&<CustomText>{l.Company} </CustomText>}
          {!companyEdit && <CustomText>{company}</CustomText>}
          {companyEdit&&  <CustomInput label={l.Company} name="comp" onChange={onChangeCompany} value={comp} />}
          <CustomButton onClick={clickCompany}>{l.change}</CustomButton>
        </Box>
        <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='row' justify-content='center'>
          {!emailEdit &&<CustomText>{l.E_mail} </CustomText>}
          {!emailEdit && <CustomText>{user_email}</CustomText>}
          {emailEdit &&  <CustomInput label={l.E_mail} name="email" onChange={onChangeEmail} value={emai} />}
          <CustomButton onClick={clickEmail}>{l.change}</CustomButton>
        </Box>
        <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='row' justify-content='center'>
          {!phoneEdit &&<CustomText>{l.Phone} </CustomText>}
          {!phoneEdit &&<CustomText>{phone}</CustomText>}
          {phoneEdit &&  <CustomInput label={l.Phone} name="phone" onChange={onChangePhone} value={pho} />}
          <CustomButton onClick={clickPhone}>{l.change}</CustomButton>
        </Box>
        <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='row' justify-content='center'>
          {!passEdit && <CustomText>{l.password}</CustomText>}
          {passEdit && <Box display='flex' gap={2} sx={blockStyle} alignItems='center' flexDirection='column' justify-content='center'>
          <CustomInput type={'password'} label={l.password} name="phone" onChange={onChangePass} value={pass} />
          <CustomInput type={'password'} label={l.password_confirmation} name="phone" onChange={onChangePassC} value={passC} />
          <CustomInput type={'password'} label={l.password_hint} name="phone" onChange={onChangePassH} value={passH} />
          </Box>}
          <CustomButton onClick={clickPassword}>{l.change}</CustomButton>
        </Box>

        <CustomButton type='submit'>{l.Save_changes}</CustomButton>
      </Box>
    </ModalWithTitle>
  );
};

export default UserProfile;
