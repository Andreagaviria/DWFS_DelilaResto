const database = require(".././db");
const rolAdmin = 1;

const validarRol = async (req, res, next) => {
  console.log(req.user_id);
  database.authenticate().then(async () => {
    let query = `SELECT * FROM users WHERE user_id='${req.user_id}'`;
    database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
      if (resultados[0].rol === rolAdmin) {
        next();
      } else {
        return res.json({ Error: "usuario con rol no valido para esta consulta" });
      }
    });
  });
};

module.exports = { validarRol: validarRol };
