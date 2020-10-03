const sequelize = require("sequelize");
const router = require("express").Router();
const validarRolMiddleware = require(".././middlewares/validarRol");
module.exports = router;

const database = require("../db");

const validarCamposNoVaciosProducto = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.photo) {
    return res.status(404).json({ Error: "hay un campo vacio" });
  } else {
    next();
  }
};

//Routes
/**
 * @swagger
 * /products:
 *  get:
 *     description: Aqui obtenemos los productos
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                type: array
 *                items:
 *                     $ref: "#/definitions/Product"
 *definitions:
 *  Product:
 *    properties:
 *        product_id:
 *            type: integer
 *        name:
 *            type: string
 *        price:
 *            type: integer
 *        photo:
 *            type: string
 */

router.get("/", (req, res) => {
  try {
    database.authenticate().then(async () => {
      const query = "SELECT * FROM products";
      database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
        //console.log(resultados);
        res.json(resultados);
      });
    });
  } catch (e) {
    res.status(404).json(`Hubo un error Obteniendo productos ${e.message}`);
  }
});

//Routes
/**
 * @swagger
 * /products/{productId}:
 *  get:
 *     description: Se usa para ver un producto por su Id
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: productId
 *          required: true
 *          description: Numeric id of the producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Product"
 */
router.get("/:id", (req, res) => {
  try {
    database.authenticate().then(async () => {
      const query = `SELECT * FROM products WHERE product_id=${req.params.id}`;
      database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
        //console.log(resultados);
        if (resultados.length === 0) {
          res.status(404).json({ message: "El producto no existe" });
        } else {
          res.json(resultados);
        }
      });
    });
  } catch (e) {
    res.status(404).json(`Hubo un error Obteniendo producto ${e.message}`);
  }
});

//Routes
/**
 * @swagger
 * /products:
 *  post:
 *     description: Se usa para crear un producto nuevo
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *        - in: body
 *          name: Product
 *          required: true
 *          schema:
 *            $ref: "#/definitions/ProductForCreation"
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                type: string
 *definitions:
 *  ProductForCreation:
 *    properties:
 *        name:
 *            type: string
 *        price:
 *            type: integer
 *        photo:
 *            type: string
 */
router.post("/", validarCamposNoVaciosProducto, validarRolMiddleware.validarRol, (req, res) => {
  database.authenticate().then(async () => {
    const query = `INSERT INTO products (name, price, photo) VALUES (?,?,?)`;
    const resultados = await database.query(query, { replacements: [req.body.name, req.body.price, req.body.photo] }).then((resultados) => {
      res.send(`producto creado con id ${resultados[0]}`);
    });
  });
});

//Routes
/**
 * @swagger
 * /products/{product_id}:
 *  put:
 *     description: Se usa para actualizar un producto con id
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: product_id
 *          required: false
 *          description: Numeric id of the product
 *        - in: body
 *          name: product
 *          schema:
 *             $ref: "#/definitions/ProductForCreation"
 *          required: false
 *          description: producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                $ref: "#/definitions/Message"
 */
router.put("/:id", validarRolMiddleware.validarRol, (req, res) => {
  let log = "";
  database.authenticate().then(async () => {
    const query = `SELECT * FROM products WHERE product_id=${req.params.id}`;
    database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
      if (resultados.length === 0) {
        return res.status(404).json({ message: "El producto no existe" });
      }
    });

    if (req.body.name) {
      const query = `UPDATE products SET name = '${req.body.name}' WHERE product_id=?`;
      const resultados = await database.query(query, { replacements: [req.params.id] }).then(() => {
        log += `se actualizo el nombre ${req.body.name} del producto con id ${req.params.id},`;
      });
    }

    if (req.body.price) {
      const query = `UPDATE products SET price = '${req.body.price}' WHERE product_id=?`;
      const resultados = await database.query(query, { replacements: [req.params.id] }).then(() => {
        log += `se actualizo el precio ${req.body.price} del producto con id ${req.params.id},`;
      });
    }

    if (req.body.photo) {
      const query = `UPDATE products SET photo = '${req.body.photo}' WHERE product_id=?`;
      const resultados = await database.query(query, { replacements: [req.params.id] }).then(() => {
        log += `se actualizo la foto ${req.body.photo} del producto con id ${req.params.id},`;
      });
    }

    if (log) {
      res.json({ Success: `${log}` });
    } else {
      res.json({ Success: "No se actualizo ningun campo" });
    }
  });
});

//Routes
/**
 * @swagger
 * /products/{product_id}:
 *  delete:
 *     description: Se usa para eliminar un producto por su Id
 *     parameters:
 *        - in: header
 *          name: token
 *          required: true
 *          schema:
 *            type: string
 *        - in: path
 *          name: product_id
 *          required: true
 *          description: Numeric id of the producto
 *     responses:
 *         "200":
 *            description: Success
 *            schema:
 *                type: string
 */
router.delete("/:id", validarRolMiddleware.validarRol, (req, res) => {
  try {
    database.authenticate().then(async () => {
      const query = `SELECT * FROM products WHERE product_id=${req.params.id}`;
      database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
        //console.log(resultados);
        if (resultados.length === 0) {
          res.status(404).json({ message: "El producto no existe" });
        } else {
          const query = `DELETE FROM products WHERE product_id=${req.params.id}`;
          database.query(query).then(() => {
            res.json(`El producto con id ${req.params.id} fue eliminado`);
          });
        }
      });
    });
  } catch (e) {
    res.status(404).json(`Hubo un error Obteniendo producto ${e.message}`);
  }
});
