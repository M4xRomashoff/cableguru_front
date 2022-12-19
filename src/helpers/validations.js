export function validationPassword(pass) {
  return pass?.length >= 6;
}


export function validateEmail(email) {
  var re = /\S+@\S+\.\S+/;
  return re.test(email);
}

export function validatePhone(phone) {
  var re = /^[(]{0,1}[0-9]{3}[)]{0,1}[-\s\.]{0,1}[0-9]{3}[-\s\.]{0,1}[0-9]{4}$/;
  return re.test(phone);
}

export function validateName(name) {
  var re = /^[a-zA-Z0-9]+$/;
  return re.test(name);
}

export function validatePass(pass) {
  if (pass.length <6) return false;
  var re = /^[a-zA-Z0-9]+$/;
  return re.test(pass);
}

export function validatePassHint(passHint) {
  var re = /^[a-zA-Z0-9]+$/;
  return re.test(passHint);
}

export function validateCompany(company) {
  var re = /^[a-zA-Z0-9]+$/;
  return re.test(company);
}