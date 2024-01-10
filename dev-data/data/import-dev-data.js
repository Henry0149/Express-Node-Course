const dotenv = require('dotenv');
const mongoose = require('mongoose');
const fs = require('fs');
const Tour = require('./../../models/tour_models');
dotenv.config({ path: './config.env' });

const DB = process.env.DATABASE.replace('<PASSWORD>', process.env.MONGO_PASS);

mongoose
  .connect(DB)
  .then(() => {
    console.log('DB Connection Successfull');
  })
  .catch((err) => console.error('DB Connection Error:', err));

const tours = JSON.parse(fs.readFileSync(`${__dirname}/tours.json`, 'utf-8'));

const importData = async () => {
  try {
    await Tour.create(tours);
    console.log('Data Successfully imported');
  } catch (e) {
    console.log(e);
  }
};

const deleteAllData = async () => {
  try {
    await Tour.deleteMany();
    console.log('Data Deleted');
  } catch (e) {
    console.log(e);
  }
};

if (process.argv[2] === '--import') {
  importData();
} else if (process.argv[2] === '--delete') {
  deleteAllData();
}

console.log(process.argv);
