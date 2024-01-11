const app = require('./app');
const dotenv = require('dotenv');
const mongoose = require('mongoose');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.MONGO_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Connection Successfull');
  })
  .catch((err) => console.error('DB Connection Error:', err));

const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`App running on port ${port}`);
});