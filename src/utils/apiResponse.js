const success = (message, data = null) => {
  const res = { success: true, message };
  if (data !== null) res.data = data;
  return res;
};

const error = (message, errors = null) => {
  const res = { success: false, message };
  if (errors !== null) res.errors = errors;
  return res;
};

module.exports = { success, error };
