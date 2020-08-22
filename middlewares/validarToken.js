const jwt = require("jwt-simple");
const moment = require("moment");

const validarToken = (req, res, next) => {
  console.log(req.headers["token"]);
  if (!req.headers["token"]) {
    return res.json({ Error: "Favor incluir token" });
  }
  const token = req.headers["token"];
  let payload;
  try {
    payload = jwt.decode(token, "andreagaviria");
  } catch (e) {
    return res.json({ Error: "el token es incorrecto" });
  }
  if (payload.expiredAt < moment().unix()) {
    return res.json({ Error: "el token ha expirado" });
  }

  req.user_id = payload.usuarioId;
  req.body.user_id = req.user_id;
  next();
};
module.exports = {
  validarToken: validarToken,
};
