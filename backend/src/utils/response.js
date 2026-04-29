
const ok = (res, data, msg = 'Success', status = 200) =>
  res.status(status).json({ success: true, message: msg, data });
const err = (res, msg = 'Error', status = 400, errors = null) =>
  res.status(status).json({ success: false, message: msg, ...(errors && { errors }) });
module.exports = { ok, err };
