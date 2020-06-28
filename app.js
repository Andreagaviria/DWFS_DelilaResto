const express = require("express");
const bodyParser = require("body-parser");

const app = express();

// app.use("/orders", ordersRouter);
// app.use("/users", usersRouter);
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const productsRouter = require("./routes/products");
// const usersRouter = require("./routes/users");
// const ordersRouter = require("./routes/orders");
app.use("/products", productsRouter);
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
