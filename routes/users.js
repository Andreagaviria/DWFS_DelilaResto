const sequelize = require("sequelize");
const router = require("express").Router();
const bcrypt = require("bcryptjs");
const jwt = require("jwt-simple");
const moment = require("moment");
const validarTokenMiddleware = require(".././middlewares/validarToken");
module.exports = router;
const rolAdmin = 1;

const database = require("../db");
const { or } = require("sequelize");

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

const VerificarUsuarioEsAdminOPropio = async (req, res, next) => {
  const query = `SELECT * FROM users WHERE user_id = ${req.user_id}`;
  database.query(query, { type: database.QueryTypes.SELECT }).then(async (usuario) => {
    if (usuario[0].rol === rolAdmin || req.user_id == req.params.id) {
      next();
    } else {
      return res.json({
        error: "Usted solo puede acceder a su informacion",
      });
    }
  });
};

//Routes
/**
 * @swagger
 * /users/{user_id}/orders:
 *  get:
 *     description: para obtener los pedidos asociados al usuarios con  id user_id
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: user_id
 *          required: true
 *          description: id de la orden
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/UsuarioConOrden"
 *definitions:
 *  UsuarioConOrden:
 *    properties:
 *        user_id:
 *            type: integer
 *        firstName:
 *            type: string
 *        lastName:
 *            type: string
 *        user:
 *            type: string
 *        email:
 *            type: string
 *        address:
 *            type: string
 *        phone:
 *            type: string
 *        password:
 *            type: string
 *        rol:
 *            type: integer
 *        listOfOrders:
 *            schema: array
 *            items:
 *               type: object
 *               properties:
 *                    order_id:
 *                          type: integer
 *                    payment_id:
 *                          type: integer
 *                    status_id:
 *                          type: string
 *                    user_id:
 *                          type: integer
 *                    total:
 *                          type: string
 */
router.get("/:id/orders", validarTokenMiddleware.validarToken, VerificarUsuarioEsAdminOPropio, (req, res) => {
  database.authenticate().then(async () => {
    let query = `SELECT * FROM users WHERE user_id='${req.params.id}'`;
    database.query(query, { type: database.QueryTypes.SELECT }).then((usuario) => {
      if (usuario.length === 0) {
        return res.status(404).json({ message: "el user no existe" });
      } else {
        const query = `SELECT * FROM orders WHERE user_id = ${usuario[0].user_id}`;
        database.query(query, { type: database.QueryTypes.SELECT }).then(async (orders) => {
          usuario[0].listOfOrders = orders;
          res.json(usuario[0]);
        });
      }
    });
  });
});

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
          const PasswordCoinciden = bcrypt.compareSync(req.body.password, resultados[0].password);
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
