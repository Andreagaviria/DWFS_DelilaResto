const express = require("express");
const bodyParser = require("body-parser");
const validarTokenMiddleware = require("./middlewares/validarToken");

const app = express();

const swaggerJsDoc = require("swagger-jsdoc");
const swaggerUi = require("swagger-ui-express");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Delilah Resto Andrea Gaviria",
      description: "Delilah Resto API Proyecto Acamica-Globant",
      contact: {
        name: "Andrea Gaviria",
      },
      servers: ["http://localhost:3000"],
    },
  },
  apis: ["./routes/*.js"],
};

const swaggerDocs = swaggerJsDoc(swaggerOptions);
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productsRouter = require("./routes/products");
const usersRouter = require("./routes/users");
const ordersRouter = require("./routes/orders");

app.use("/orders", validarTokenMiddleware.validarToken, ordersRouter);
app.use("/users", usersRouter);
app.use("/products", validarTokenMiddleware.validarToken, productsRouter);
const database = require("./db");

app.listen(3000, () => {
  console.log("listen to port 3000");
});

// database.authenticate().then(async () => {
//   console.log("database connected");
//   const query = "SELECT * FROM products";
//   database.query(query, { type: database.QueryTypes.SELECT }).then((resultados) => {
//     console.log(resultados);
//   });
// });
