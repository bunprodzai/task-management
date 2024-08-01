// file chứa tất cả các route khi chúng ta gọi đến thì sẽ chạy vào
const taskRoute = require("./task.route");
const userRoute = require("./user.route");
const authMiddleware = require("../middlewares/auth.middleware");

module.exports = (app) => {
  app.use("/api/v1/tasks",authMiddleware.requireAuth , taskRoute);
  app.use("/api/v1/users", userRoute);
}