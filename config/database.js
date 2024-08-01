const mongoose = require('mongoose');

module.exports.connect = async () => {
  try {
    await mongoose.connect('mongodb://127.0.0.1:27017/task-management');
    console.log("Connect susccess");
  } catch (error) {
    console.log("Connect failed");
  }
}

