require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const productsRouter = require('./routes/products');
const usersRouter = require('./routes/users');
const cartRouter = require('./routes/cart');
const ordersRouter = require('./routes/orders');

const app = express();
const port = 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/products', productsRouter);
app.use('/users', usersRouter);
app.use('/cart', cartRouter);
app.use('/orders', ordersRouter);

app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});