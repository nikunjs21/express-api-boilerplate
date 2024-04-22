import { emailRegex } from "../constants/regex.constants.js";

const objectId = (value: any, helpers: any) => {
  if (!value.match(/^[0-9a-fA-F]{24}$/)) {
    return helpers.message('"{{#label}}" must be a valid mongo id');
  }
  return value;
};

const password = (value: any, helpers: any) => {
  if (value.length < 8) {
    return helpers.message('password must be at least 8 characters');
  }
  if (value.length > 30) {
    return helpers.message('password must have less than 30 characters');
  }
  if (!value.match(emailRegex)) {
    return helpers.message('Password should have minimum 8 and maximum 30 characters length, at least one uppercase letter, one lowercase letter, one number and one special character.');
  }
  // if (!value.match(/\d/) || !value.match(/[a-zA-Z]/)) {
  //   return helpers.message('password must contain at least 1 letter and 1 number');
  // }
  return value;
};

export default {
  objectId,
  password,
};
