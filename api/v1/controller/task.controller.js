const Task = require("../models/tasks.model");

const panigationHelper = require("../../../helpers/pagination");
const searchHelper = require("../../../helpers/search");

// [GET] /api/v1/tasks
module.exports.index = async (req, res) => {
  const status = req.query.status;
  const find = {
    deleted: false,
    $or: [
      {createdBy: req.user.id},
      {listUser: req.user.id}
    ],
  }
  if (status) {
    find.status = status;
  }

  // phân trang 
  let initPagination = {
    currentPage: 1,
    limitItems: 5
  };
  const countTasks = await Task.countDocuments(find);
  const objetPagination = panigationHelper(
    initPagination,
    req.query,
    countTasks
  )
  // end phân trang

  // Tìm kiếm
  let objectSearch = searchHelper(req.query);
  if (req.query.keyword) {
    find.title = objectSearch.regex;
  }
  // end Tìm kiếm

  // sort
  const sortKey = req.query.sortKey;
  const sortType = req.query.sortType;
  const sort = {}
  if (sortKey && sortType) {
    sort[sortKey] = sortType // [] dùng để truyền linh động, còn sort.sortKey là truyền cứng
  }
  // end sort

  const tasks = await Task.find(find)
    .sort(sort)
    .limit(objetPagination.limitItems)
    .skip(objetPagination.skip);
  res.json(tasks);
}

// [GET] /api/v1/tasks/detail/:id
module.exports.detail = async (req, res) => {
  try {
    const id = req.params.id;
    const tasks = await Task.findOne({
      _id: id,
      deleted: false
    });
    res.json(tasks);
  } catch (error) {
    res.json("Không tìm thấy!!");
  }
}

// [GET] /api/v1/change-status/:id
module.exports.changeStatus = async (req, res) => {
  try {
    const id = req.params.id;
    const status = req.body.status;

    await Task.updateOne({
      _id: id
    }, {
      status: status
    })

    res.json({
      code: 200,
      message: "Cập nhập trạng thái thành công"
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}

// [GET] /api/v1/tasks/change-multi
module.exports.changeMulti = async (req, res) => {
  try {
    const {ids, key, value} = req.body;
    switch (key) {
      case "status":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          status: value
        });
        res.json({
          code: 200,
          message: "Cập nhập trạng thái thành công"
        });
        break;
      default:
        res.json({
          code: 404,
          message: "Không tồn tại"
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}

// [POST] /api/v1/tasks/create-task
module.exports.createTask = async (req, res) => {
  try {
    req.body.createdBy = req.user.id;
    const task = new Task(req.body);
    const data = await task.save();
    res.json({
      code: 200,
      message: "Tạo thành công",
      data: data
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Lỗi"
    });
  }
}

// [GET] /api/v1/tasks/edit-task/:id
module.exports.editTask = async (req, res) => {
  try {
    const id = req.params.id;
    const dataEdit = req.body;

    await Task.updateOne({
      _id: id
    }, dataEdit);

    res.json({
      code: 200,
      message: "Chỉnh sửa thành công"
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}

// [GET] /api/v1/tasks/delete-task/:id
module.exports.deleteTask = async (req, res) => {
  try {
    const id = req.params.id;

    await Task.updateOne({
      _id: id
    }, {
      deleted: true,
      deteledAt: new Date()
    });

    res.json({
      code: 200,
      message: "Xóa thành công"
    });
  } catch (error) {
    res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}

// [GET] /api/v1/tasks/deletemulti-task
module.exports.deleteMultiTask = async (req, res) => {
  try {
    const {ids, key} = req.body;
    switch (key) {
      case "delete":
        await Task.updateMany({
          _id: { $in: ids }
        }, {
          deleted: true,
          deletedAt: new Date()
        });
        res.json({
          code: 200,
          message: "Xóa thành công"
        });
        break;
      default:
        res.json({
          code: 404,
          message: "Không tồn tại"
        });
        break;
    }
  } catch (error) {
    res.json({
      code: 404,
      message: "Không tồn tại"
    });
  }
}