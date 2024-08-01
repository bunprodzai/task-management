const express = require("express");
const router = express.Router();
const controller = require("../controller/task.controller");

router.get("/", controller.index);
router.get("/detail/:id", controller.detail);
router.patch("/change-status/:id", controller.changeStatus);
router.patch("/change-multi", controller.changeMulti);
router.post("/create-task", controller.createTask);
router.patch("/edit-task/:id", controller.editTask);
router.delete("/delete-task/:id", controller.deleteTask);
router.delete("/deletemulti-task", controller.deleteMultiTask);

module.exports = router;