// validation data
const isEmpty = strValue => {
  if (!strValue) return true;
  return strValue.trim() === '' ? true : false;
};

const isEmail = email => {
  if (!email) return false;
  const regEx = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  return email.match(regEx) ? true : false;
};

const validateSignupData = data => {
  const errors = {};
  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  else if (!isEmail(data.email)) errors.email = 'Must be a valid email address';
  if (isEmpty(data.handle)) errors.handle = 'Must not be empty';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';
  if (data.password !== data.confirmPassword)
    errors.confirmPassword = 'Passwords must match';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

const validateLoginData = data => {
  const errors = {};
  if (isEmpty(data.email)) errors.email = 'Must not be empty';
  else if (!isEmail(data.email)) errors.email = 'Must be a valid email address';
  if (isEmpty(data.password)) errors.password = 'Must not be empty';

  return {
    errors,
    valid: Object.keys(errors).length === 0
  };
};

const reduceUserDetails = data => {
  const userDetails = {};

  if (!isEmpty(data.bio.trim())) userDetails.bio = data.bio;
  if (!isEmpty(data.website.trim())) {
    if (data.website.trim().substring(0, 4) !== 'http') {
      userDetails.website = `http://${data.website.trim()}`;
    } else {
      userDetails.website = data.website;
    }
  }
  if (!isEmpty(data.location.trim())) userDetails.location = data.location;

  return userDetails;
};

module.exports = { validateSignupData, validateLoginData, reduceUserDetails };
