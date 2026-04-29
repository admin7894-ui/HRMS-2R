
const MOBILE_RE = /^[6-9][0-9]{9}$/;
const EMAIL_RE = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;
const PAN_RE = /^[A-Z]{5}[0-9]{4}[A-Z]{1}$/;
const AADHAR_RE = /^[0-9]{12}$/;
const IFSC_RE = /^[A-Z]{4}0[A-Z0-9]{6}$/;

const validateRequired = (fields, body) => {
  const errors = {};
  fields.forEach(f => {
    if (body[f] === undefined || body[f] === null || body[f] === '')
      errors[f] = `${f.replace(/_/g, ' ')} is required`;
  });
  return errors;
};

module.exports = { MOBILE_RE, EMAIL_RE, PAN_RE, AADHAR_RE, IFSC_RE, validateRequired };
