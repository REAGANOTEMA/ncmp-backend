// Accepts valid Uganda NIN format like CM9801910356YD
const validateNIN = (nin) => {
  if (!nin) return false;
  const regex = /^[A-Z]{2}[0-9]{10}[A-Z]{2}$/i;
  return regex.test(nin);
};

module.exports = validateNIN;