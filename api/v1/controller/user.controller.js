const User = require("../models/users.model");
const ForgotPassword = require("../models/forgot-password.model");
const md5 = require("md5")
const generateHelper = require("../../../helpers/generateNumber");
const generateTokenHelper = require("../../../helpers/generateToken");
const sendMailHelper = require("../../../helpers/sendMail");

// [POST] /api/v1/users/register
module.exports.register = async (req, res) => {
  req.body.password = md5(req.body.password)

  const exitEmail = await User.findOne({
    email: req.body.email,
    deleted: false
  });

  if (exitEmail) {
    res.json({
      code: 404,
      message: "Email đã  tồn tại!"
    });
  } else {
    const user = new User({
      fullName: req.body.fullName,
      email: req.body.email,
      password: req.body.password,
      token: generateTokenHelper.generateToken()
    });
    user.save();
    const token = user.token;
    res.cookie("token", token);
    res.json({
      code: 200,
      message: "Tạo thành công",
      token: token
    });
  }
}

// [POST] /api/v1/users/login
module.exports.login = async (req, res) => {
  const email = req.body.email;
  const passowrd = req.body.password;



  const user = await User.findOne({
    email: email,
    deleted: false
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  if (md5(passowrd) !== user.password) {
    res.json({
      code: 400,
      message: "Sai mật khẩu!"
    });
    return;
  }

  const token = user.token;
  res.cookie("token", token);

  res.json({
    code: 200,
    message: "Đăng nhập thành công",
    token: token
  });
}

// [POST] /api/v1/users/forgot
module.exports.forgotPassword = async (req, res) => {
  const email = req.body.email;


  const user = await User.findOne({
    email: email,
    deleted: false
  });
  if (!user) {
    res.json({
      code: 400,
      message: "Email không tồn tại!"
    });
    return;
  }

  const opt = generateHelper.generateNumber(6);
  const timeExpire = 5;

  const objectForgotPassword = {
    email: email,
    opt: opt,
    expireAt: Date.now() + timeExpire * 60 * 1000
  }

  const forgotPassword = new ForgotPassword(objectForgotPassword);
  await forgotPassword.save();

  // gửi opt qua email user
  const subject = "Mã OTP xách minh mật khẩu";
  const html = `
    Mã OTP để lấy lại mật khẩu của bạn là <b>${opt}</b> (sử dụng trong ${timeExpire} phút).
    Vui lòng không chia sẽ mã OTP này với bất kì ai.
  `
  sendMailHelper.sendMail(email, subject, html);

  res.json({
    code: 200,
    message: `Đã gửi mã OTP qua email! ${email}`
  });
}

// [POST] /api/v1/users/password/optPassword
module.exports.optPassword = async (req, res) => {
  const email = req.body.email;
  const otp = req.body.otp;

  const result = await ForgotPassword.findOne({
    email: email,
    otp: otp
  });

  if (!result) {
    res.json({
      code: 400,
      message: "OTP không hợp lệ!"
    });
    return;
  }

  const user = await User.findOne({
    email: email
  });

  const token = user.token;
  res.cookie("token", token); // lưu cookie ở server


  res.json({
    code: 200,
    message: "Xác thực thành công",
    token: token
  });
}

// [POST] /api/v1/users/password/resetPassword
module.exports.resetPassword = async (req, res) => {
  const token = req.cookies.token;
  const password = req.body.password;

  const user = await User.findOne({
    token: token
  }); // check xem có user có token không

  if (md5(password) === user.password) { // check mật khẩu cũ
    res.json({
      code: 400,
      message: "Mật khẩu mới trùng với mật khẩu cũ!!"
    });
    return;
  }

  await User.updateOne({
    token: token
  }, {
    password: md5(password)
  })

  res.json({
    code: 200,
    message: "Đổi mật khẩu thành công"
  });
}

// [GET] /api/v1/users/detail
module.exports.detail = async (req, res) => {
  res.json({
    code: 200,
    message: "Thành công",
    info: req.user
  });
}

// [GET] /api/v1/users/list
module.exports.list = async (req, res) => {

  const list = await User.find().select("fullName email");

  res.json({
    code: 200,
    message: "Thành công",
    listUser: list
  });
}