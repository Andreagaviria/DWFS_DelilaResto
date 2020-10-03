const sequelize = require("sequelize");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const moment = require("moment");

module.exports = router;

const database = require("../db");

const validarCamposNoVaciosUsuario = (req, res, next) => {
  if (
    !req.body.firstName ||
    !req.body.lastName ||
    !req.body.user ||
    !req.body.email ||
    !req.body.address ||
    !req.body.phone ||
    !req.body.password ||
    !req.body.rol
  ) {
    let log = "";
    if (!req.body.firstName) log += "el first name es obligatorio, ";
    if (!req.body.lastName) log += "el last name es obligatorio, ";
    if (!req.body.user) log += "el user es obligatorio, ";
    if (!req.body.email) log += "el email es obligatorio, ";
    if (!req.body.address) log += "el address es obligatorio, ";
    if (!req.body.phone) log += "el phone number es obligatorio, ";
    if (!req.body.password) log += "el password es obligatorio, ";
    if (!req.body.rol) log += "el rol es obligatorio, ";
    return res.status(404).json({ Error: log });
  } else {
    next();
  }
};

const validarCamposNoVaciosLogueo = (req, res, next) => {
  if (!(req.body.user && req.body.password) && !(req.body.email && req.body.password)) {
    let log = "";
    if (!(req.body.user && req.body.password)) log += "el usuario y el password  se requieren, ";
    if (!(req.body.email && req.body.password)) log += "o el email y el password se requieren";
    return res.status(404).json({ Error: log });
  } else {
    next();
  }
};

//Routes
/**
 * @swagger
 * /users/register:
 *  post:
 *     description: se usa para registrar un nuevo usuario
 *     parameters:
 *        - in: body
 *          name: User
 *          required: false
 *          schema:
 *            $ref: "#/definitions/User"
 *     responses:
 *         '200':
 *            description: Success
 *            schema:
 *                type: string
 *definitions:
 *  User:
 *    properties:
 *        firstName:
 *            type: string
 *            required: true
 *        lastName:
 *            type: string
 *            required: true
 *        user:
 *            type: string
 *            required: true
 *        email:
 *            type: string
 *            required: true
 *        address:
 *            type: string
 *            required: true
 *        phone:
 *            type: string
 *            required: true
 *        password:
 *            type: string
 *            required: true
 *        rol:
 *            type: integer
 *            required: true
 */
router.post("/register", validarCamposNoVaciosUsuario, (req, res) => {
  //res.send("ok");

  database.authenticate().then(async () => {
    let query = `SELECT * FROM users WHERE user='${req.body.user}'`;
    database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
      if (resultados.length === 0) {
      } else {
        return res.status(404).json({ message: "El user ya existe" });
      }
    });

    query = `SELECT * FROM users WHERE email='${req.body.email}'`;
    database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
      if (resultados.length === 0) {
      } else {
        return res.status(404).json({ message: "El email ya existe" });
      }
    });

    req.body.password = bcrypt.hashSync(req.body.password, 5);

    query = `INSERT INTO users (firstName, lastName, user, email, address, phone, password,rol) VALUES (?,?,?,?,?,?,?,?)`;
    const resultados = await database
      .query(query, {
        replacements: [
          req.body.firstName,
          req.body.lastName,
          req.body.user,
          req.body.email,
          req.body.address,
          req.body.phone,
          req.body.password,
          req.body.rol,
        ],
      })
      .then((resultados) => {
        res.send(`usuario creado con id ${resultados[0]}`);
      });
  });
});

//Routes
/**
 * @swagger
 * /users/login:
 *  post:
 *     description: Se usa para generar el token para el usuario
 *     parameters:
 *        - in: body
 *          name: User
 *          schema:
 *            $ref: "#/definitions/UserForLogin"
 *     responses:
 *         '200':
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Message"
 *definitions:
 *  UserForLogin:
 *    properties:
 *        user:
 *            type: string
 *        email:
 *            type: string
 *        password:
 *            type: string
 */
router.post("/login", validarCamposNoVaciosLogueo, (req, res) => {
  //res.send("login");
  const VariableNoVacia = req.body.user ? "user" : "email";
  if (VariableNoVacia === "user") {
    database.authenticate().then(async () => {
      let query = `SELECT * FROM users WHERE user='${req.body.user}'`;
      database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El user no existe" });
        } else {
          console.log(resultados[0].password);
          const PasswordCoinciden = bcrypt.compareSync(req.body.password, resultados[0].password);
          console.log(PasswordCoinciden);
          if (PasswordCoinciden) {
            res.json({ success: crearToken(resultados[0]) });
          } else {
            res.json({ message: "el password no coincide" });
          }
        }
      });
    });
  } else {
    database.authenticate().then(async () => {
      let query = `SELECT * FROM users WHERE email='${req.body.email}'`;
      database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El email no existe" });
        } else {
          console.log(resultados[0].password);
          const PasswordCoinciden = bcrypt.compareSync(req.body.password, resultados[0].password);

          if (PasswordCoinciden) {
            res.json({ success: crearToken(resultados[0]) });
          } else {
            res.json({ message: "el password no coincide" });
          }
        }
      });
    });
  }
});

const crearToken = (usuario) => {
  const payload = {
    usuarioId: usuario.user_id,
    createAt: moment().unix(),
    expiredAt: moment().add(60, "minutes").unix(),
  };

  return jwt.encode(payload, "andreagaviria");
};
