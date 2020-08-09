const sequelize = require("sequelize");
const router = require("express").Router();
module.exports = router;

const database = require("../db");

router.get("/", (req, res) => {
  try {
    database.authenticate().then(async () => {
      const query = `SELECT order_id, o.payment_id, o.status_id, o.user_id, total, s.name AS statusName, p.name AS paymentName, firstname, lastname, address, phone, email, user
      FROM orders AS o
      JOIN status AS s 
      ON o.status_id=s.status_id
      JOIN payments AS p 
      ON o.payment_id=p.payment_id
      JOIN users AS u
      ON o.user_id=u.user_id
      `;
      database
        .query(query, { type: database.QueryTypes.SELECT })
        .then(async (resultados) => {
          resultados.forEach((element, index) => {
            const query = `SELECT product_id FROM productOrderRelation WHERE order_id = ${element.order_id}`;
            database
              .query(query, { type: database.QueryTypes.SELECT })
              .then((productos) => {
                element.productList = productos;
                productos.forEach((product, index) => {
                  const query = `SELECT * FROM products WHERE product_id = ${product.product_id}`;
                  database
                    .query(query, { type: database.QueryTypes.SELECT })
                    .then(async (productDetail) => {
                      console.log(productDetail);
                      product.details = await productDetail;
                    });
                });
              });
          });
          setTimeout(() => {
            res.json(resultados);
          }, 1000);
        });
    });
  } catch (e) {
    res.status(404).json(`Hubo un error Obteniendo los pedidos. ${e.message}`);
  }
});

router.put("/:id/status", (req, res) => {
  let log = "";
  database.authenticate().then(async () => {
    const query = `SELECT * FROM orders WHERE order_id=${req.params.id}`;
    database
      .query(query, { type: database.QueryTypes.SELECT })
      .then((resultados) => {
        console.log(resultados);
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El pedido no existe" });
        }
      });

    if (req.body.status_id) {
      try {
        const query = `UPDATE orders SET status_id = '${req.body.status_id}' WHERE order_id=?`;
        const resultados = await database
          .query(query, { replacements: [req.params.id] })
          .then(() => {
            log += `se actualizo el status ${req.body.status_id} del pedido con id ${req.params.id},`;
          });
      } catch (error) {
        log += `el status con id: ${req.body.status_id} no existe`;
      }
    }

    if (log) {
      res.json({ success: `${log}` });
    } else {
      res.json({
        Error: "No se actualizo el status. El status id es obligatorio.",
      });
    }
  });
});

router.delete("/:id", (req, res) => {
  try {
    database.authenticate().then(async () => {
      const query = `SELECT * FROM orders WHERE order_id=${req.params.id}`;
      database
        .query(query, { type: database.QueryTypes.SELECT })
        .then((resultados) => {
          //console.log(resultados);
          if (resultados.length === 0) {
            res.status(404).json({ message: "El pedido no existe" });
          } else {
            const query1 = `DELETE FROM productorderrelation WHERE order_id=${req.params.id}`;
            database.query(query1).then(() => {
              const query = `DELETE FROM orders WHERE order_id=${req.params.id}`;
              database.query(query).then(() => {
                res.json(`El pedido con id ${req.params.id} fue eliminado`);
              });
            });
          }
        });
    });
  } catch (e) {
    res.status(404).json(`Hubo un error eliminando el pedido ${e.message}`);
  }
});

router.post("/", (req, res) => {
  database.authenticate().then(async () => {
    let log = "";
    let query = `SELECT * FROM status WHERE status_id=${req.body.status_id}`;
    database
      .query(query, { type: database.QueryTypes.SELECT })
      .then((resultados) => {
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El status_id no existe" });
        }
      });

    query = `SELECT * FROM payments WHERE payment_id=${req.body.payment_id}`;
    database
      .query(query, { type: database.QueryTypes.SELECT })
      .then((resultados) => {
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El payment_id no existe" });
        }
      });

    query = `SELECT * FROM users WHERE user_id=${req.body.user_id}`;
    database
      .query(query, { type: database.QueryTypes.SELECT })
      .then((resultados) => {
        if (resultados.length === 0) {
          return res.status(404).json({ message: "El user_id no existe" });
        }
      });

    let productos = [];
    query = `INSERT INTO orders (payment_id, status_id, user_id, total) VALUES (?,?,?,?)`;
    const resultados = await database
      .query(query, {
        replacements: [
          req.body.status_id,
          req.body.payment_id,
          req.body.user_id,
          0,
        ],
      })
      .then(async (resultados) => {
        log += `Se creo orden con id ${resultados[0]},`;
        let sumaPrecios = 0;
        req.body.productos.forEach((elementId) => {
          ///////////////////////////////////////////////////////////////
          query = `SELECT * FROM products WHERE product_id=${elementId}`;
          let response;
          database
            .query(query, { type: database.QueryTypes.SELECT })
            .then(async (producto) => {
              if (producto.length === 0) {
                log += `el producto con id ${elementId} no existe,`;
              } else {
                log += `el producto con id ${elementId} se agrego al pedido,`;
                query = `INSERT INTO productOrderRelation (product_id, order_id) VALUES (?,?)`;
                productos.push(elementId);
                response = await database.query(query, {
                  replacements: [elementId, resultados[0]],
                });
                sumaPrecios += Number(producto[0].price);
              }
            });
          //////////////////////////////////////////////////////////////////////////
        });

        setTimeout(async () => {
          query = `UPDATE orders SET total = '${sumaPrecios}' WHERE order_id=?`;
          resultados = await database.query(query, {
            replacements: [resultados[0]],
          });
        }, 3000);

        //////////////////////////////////////////////////////////////////////////
        setTimeout(() => {
          console.log(resultados[0]);
          res.json({ Success: `${log}` });
        }, 500);
      });
  });
});
