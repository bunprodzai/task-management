const express = require("express");
require('dotenv').config();
const app = express();
const port = process.env.PORT;
const bodyParser = require("body-parser"); // lấy dữ liệu từ body gửi lên
const cors = require("cors");
const database = require("./config/database");
const cookieParser = require("cookie-parser");


// hàm hết nối database 
database.connect();

const Task = require("./api/v1/models/tasks.model");

// nhúng file tĩnh
// app.use(express.static('public'));

// cài pug
// app.set("views", "./views");
// app.set("view engine", "pug");

app.use(bodyParser.json()); // dùng để patch json lên 

app.use(cors());

app.use(cookieParser());

const route = require("./api/v1/routes/index.route");
route(app);

// app.get("/tasks", async (req, res) => {
//   const tasks = await Task.find({
//     deleted: false
//   });
//   res.json(tasks);
// })

// app.get("/tasks/detail/:id", async (req, res) => {
//   const id = req.params.id;
//   const tasks = await Task.findOne({
//     _id: id,
//     deleted: false
//   });
//   res.json(tasks);
// })

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
});