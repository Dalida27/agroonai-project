require("dotenv").config();
const cors = require("cors");
const express = require("express");
const passport = require("passport");
const connectDB = require("./db.js");
const authRouter = require("./routes/auth");
const productRouter = require('./routes/product');
const clientRouter = require('./routes/client');
const transactionRouter = require('./routes/transaction');
const scrapeAndUpload = require('./utils/scrapeAndUpload.js');
const getRagChain = require("./utils/ragChain.js");

const app = express();

connectDB();

app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    console.log(`${req.method} ${req.baseUrl} ${res.statusCode} - ${duration}ms`);
  });
  next();
});

app.use(cors());
app.use(express.json());


app.use(passport.initialize());


require('./config/passport')(passport);

app.use('/api/v1/users', authRouter);
app.use('/api/v1/products', productRouter);
app.use('/api/v1/clients', clientRouter);
app.use('/api/v1/transactions', transactionRouter);

const PORT = process.env.PORT || 8080;


(async () => {
  await scrapeAndUpload();
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
})();
