const sequelize = require("sequelize");
const router = require("express").Router();
module.exports = router;

const database = require("../db");

const validarCamposNoVaciosProducto = (req, res, next) => {
  if (!req.body.name || !req.body.price || !req.body.photo) {
    return res.status(404).json({ Error: "hay un campo vacio" });
  } else {
    next();
  }
};

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

router.post("/", validarCamposNoVaciosProducto, (req, res) => {
  database.authenticate().then(async () => {
    const query = `INSERT INTO products (name, price, photo) VALUES (?,?,?)`;
    const resultados = await database.query(query, { replacements: [req.body.name, req.body.price, req.body.photo] }).then((resultados) => {
      res.send(`producto creado con id ${resultados[0]}`);
    });
  });
});

router.put("/:id", (req, res) => {
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
      res.json({ Error: `${log}` });
    } else {
      res.json({ Error: "No se actualizo ningun campo" });
    }
  });
});

router.delete("/:id", (req, res) => {
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
