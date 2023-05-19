const User = require("../models/userModel");
const { addLog } = require("../controllers/logController");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
// const { v4 } = require("uuid");
// const {
//   DynamoDBClient,
//   PutItemCommand,
//   GetItemCommand,
// } = require("@aws-sdk/client-dynamodb");
// const { fromIni } = require("@aws-sdk/credential-provider-ini");

// const ddbClient = new DynamoDBClient({
//   region: process.env.AWS_DEFAULT_REGION,
//   credentials: fromIni({ profile: "default" }),
// });

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1d" });
};

const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

const addUser_DynamoDB = async (req, res) => {
  const {
    identityNo,
    firstName,
    lastName,
    email,
    password,
    photo,
    office,
    region,
    mobileNumber,
    role,
  } = req.body;
  const params = {
    TableName: "users",
    Item: {
      _id: { S: v4() },
      identityNo: { S: identityNo },
      firstName: { S: firstName },
      lastName: { S: lastName },
      email: { S: email },
      password: { S: await hashPassword(password) },
      photo: {
        S: "https://res.cloudinary.com/fatihindesign/image/upload/v1680868862/pdm/profile/defaulProfileImage_vzcpkf_pgjscr_tij9wy.png",
      },
      office: { S: office },
      region: { S: region },
      mobileNumber: { S: mobileNumber },
      role: { S: role },
      status: { BOOL: true },
      createdAt: { S: new Date().toISOString() },
    },
  };
  const response = await ddbClient.send(new PutItemCommand(params));
  res.status(200).json(response.$metadata.httpStatusCode);
};

const getUser_DynamoDB = async (req, res) => {
  const userId = req.params.id;
  const param = {
    TableName: "users",
    Key: {
      _id: { S: userId },
    },
    ProjectionExpression: "email",
  };
  const response = await ddbClient.send(new GetItemCommand(param));
  if (response.$metadata.httpStatusCode !== 200) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  } else {
    return res.status(200).json({ data: response });
  }
};

const newUser = async (req, res) => {
  try {
    // validation phase
    const {
      identityNo,
      firstName,
      lastName,
      email,
      password,
      photo,
      office,
      region,
      mobileNumber,
      role,
    } = req.body;
    if (
      !identityNo ||
      !firstName ||
      !lastName ||
      !email ||
      !password ||
      !photo ||
      !office ||
      !mobileNumber ||
      !region ||
      !role
    ) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm gerekli alanları doldurun" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ message: "Şifreniz en az 8 karakterden oluşmalı" });
    }
    const userExist = await User.findOne({ email });
    if (userExist) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresi sistemde kayıtlı" });
    }
    const identityNoExist = await User.findOne({ identityNo });
    if (identityNoExist) {
      return res
        .status(400)
        .json({ message: "Bu kimlik numarası sistemde kayıtlı" });
    }
    const user = await User.create({
      identityNo,
      firstName,
      lastName,
      email,
      password,
      photo,
      office,
      region,
      mobileNumber,
      role,
    });
    if (user) {
      addLog(
        "Yeni Kullanıcı Kaydı",
        "-",
        "Kullanıcı: " + user.firstName + " " + user.lastName,
        req.user
      );
      return res.status(201).json({ message: "Yeni kullanıcı kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz kullanıcı bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getUser = async (req, res) => {
  const userId = req.params.id;
  const user = await User.findById(userId)
    .select("-password")
    .select("-createdAt")
    .select("-updatedAt");
  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  } else {
    return res.status(200).json({ data: user });
  }
};

const getUsers = async (req, res) => {
  const users = await User.find({
    role: { $ne: "sysgod" },
  })
    .select("-password")
    .select("-createdAt")
    .select("-updatedAt");
  if (!users) {
    return res
      .status(404)
      .json({ message: "Sistemde kayıtlı kullanıcı bulunamadı" });
  } else {
    return res.status(200).json({ data: users });
  }
};

const getUsersByRole = async (req, res) => {
  const role = req.params.id;
  const users = await User.find({
    status: { $ne: false },
    role,
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status")
    .select("-password")
    .select("-settings");
  if (!users) {
    return res.status(404).json({ message: "Kayıtlı kullanıcı bulunmuyor" });
  } else {
    return res.status(200).json({ data: users });
  }
};

const getUsersByOffice = async (req, res) => {
  const office = req.params.id;
  console.log("office");
  const users = await User.find({
    status: { $ne: false },
    office,
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status")
    .select("-password")
    .select("-settings");
  if (!users) {
    return res.status(404).json({ message: "Kayıtlı kullanıcı bulunmuyor" });
  } else {
    return res.status(200).json({ data: users });
  }
};

const updateUser = async (req, res) => {
  const userId = req.params.id;
  const {
    identityNo,
    firstName,
    lastName,
    photo,
    office,
    region,
    email,
    mobileNumber,
    role,
  } = req.body;
  const oldInfo = await User.findById({ _id: userId });
  const userExist = await User.findOne({ email });
  if (userExist && oldInfo.email !== userExist.email) {
    return res
      .status(400)
      .json({ message: "Bu e-posta adresi sistemde kayıtlı" });
  }
  const identityNoExist = await User.findOne({ identityNo });
  if (identityNoExist && oldInfo.identityNo !== identityNoExist.identityNo) {
    return res
      .status(400)
      .json({ message: "Bu kimlik numarası sistemde kayıtlı" });
  }
  if (oldInfo.role === "sysgod") {
    return res
      .status(401)
      .json({ message: "Bu işlem için yetkiniz bulunmuyor!" });
  }
  const user = await User.findByIdAndUpdate(
    userId,
    {
      identityNo,
      firstName,
      lastName,
      photo,
      office,
      region,
      email,
      mobileNumber,
      role,
    },
    { new: true }
  )
    .select("-password")
    .select("-createdAt")
    .select("-updatedAt");
  if (!user) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  } else {
    addLog(
      "Kullanıcı Bilgisi Güncelleme",
      "-",
      "Kullanıcı: " + user.firstName + " " + user.lastName,
      req.user
    );
    return res
      .status(200)
      .json({ message: "Kullanıcı güncellemesi başarılı", data: user });
  }
};

const changeUserStatus = async (req, res) => {
  const userId = req.params.id;
  const userTmp = await User.findById(userId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!userTmp) {
    return res.status(404).json({ message: "Kullanıcı bulunamadı" });
  } else {
    if (userTmp.role === "sysgod") {
      return res
        .status(401)
        .json({ message: "Bu işlem için yetkiniz bulunmuyor!" });
    }
    const user = await User.findByIdAndUpdate(
      userId,
      {
        status: !userTmp.status,
      },
      { new: true }
    )
      .select("-password")
      .select("-createdAt")
      .select("-updatedAt");
    if (!user) {
      return res.status(404).json({ message: "Kullanıcı bulunamadı" });
    } else {
      addLog(
        "Kullanıcı Durum Değişikliği",
        "-",
        "Kullanıcı: " +
          user.firstName +
          " " +
          user.lastName +
          " - Yeni durum: " +
          (!userTmp.status ? "Aktif" : "Pasif"),
        req.user
      );
      return res
        .status(200)
        .json({ message: "Kullanıcı durumu güncellendi", data: user });
    }
  }
};

const loginUser = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ message: "Lütfen e-posta adresi ve şifre alanlarını doldurun" });
  }
  const user = await User.findOne({ email });
  if (!user || user.status === false) {
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }
  const isPassCorrect = await bcrypt.compare(password, user.password);
  if (user && isPassCorrect) {
    const token = generateToken(user._id);
    res.cookie("token", token, {
      path: "/",
      httpOnly: true,
      expires: new Date(Date.now() + 1000 * 60 * 60 * 3), // 3 hours
      //1 day = 1000msn = 1sn * 60 = 1min * 60 = 1 hour * 24 = 1 day
      sameSite: "none",
      secure: true,
    });
    // expires: new Date(Date.now() + 1000 * 60 * 1 * 1), 1 minute
    // expires: new Date(Date.now() + 1000 * 60 * 60 * 1), 1 hour
    // expires: new Date(Date.now() + 1000 * 60 * 60 * 24), 1 day
    addLog("Oturum Açma", "-", "-", user);
    const {
      _id,
      firstName,
      lastName,
      email,
      photo,
      office,
      region,
      role,
      mobileNumber,
    } = user;
    return res.status(200).json({
      _id,
      firstName,
      lastName,
      email,
      photo,
      office,
      region,
      role,
      mobileNumber,
      //token,
    });
  } else {
    addLog("Oturum Açma", "-", "Geçersiz e-posta yada şifre", user);
    return res.status(400).json({ message: "Geçersiz e-posta yada şifre" });
  }
};

const logoutUser = async (req, res) => {
  res.cookie("token", "", {
    path: "/",
    httpOnly: true,
    expires: new Date(0),
    sameSite: "none",
    secure: true,
  });
  console.log(req.user);
  addLog("Oturum Kapatma", "Başarılı", "-", req.user);
  return res.status(200).json({ message: "Oturum kapatma başarılı" });
};

const loginStatus = async (req, res) => {
  const token = req.cookies.token;
  if (!token) {
    return res.status(401).json({ message: "Oturum açılmadı1", status: false });
  } else {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    if (verified) {
      return res.status(200).json({ message: "Oturum açık", status: true });
    }
    return res.status(401).json({ message: "Oturum açılmadı2", status: false });
  }
};

const changePassword = async (req, res) => {
  const user = await User.findById(req.user._id);
  const { password, newPassword } = req.body;
  if (!user) {
    return res.status(400).json({ message: "Kullanıcı bulunamadı" });
  }
  if (!password || !newPassword) {
    return res
      .status(400)
      .json({ message: "Şifre ve yeni şifre alanı boş olamaz" });
  }
  const passwordIsCorrect = await bcrypt.compare(password, user.password);
  if (user && passwordIsCorrect) {
    user.password = newPassword;
    await user.save();
    addLog("Şifre değiştirme", "-", "-", user);
    return res.status(200).json({ message: "Şifre değişimi başarılı" });
  } else {
    return res.status(400).json({ message: "Mevcut şifreniz yanlış" });
  }
};

module.exports = {
  newUser,
  getUser,
  getUsers,
  getUsersByRole,
  getUsersByOffice,
  updateUser,
  changeUserStatus,
  loginUser,
  logoutUser,
  loginStatus,
  changePassword,
};
