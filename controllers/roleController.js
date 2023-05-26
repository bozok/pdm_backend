const Role = require("../models/roleModel");

const addRole = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Lütfen rol adı alanını doldurunuz" });
    }
    const roleExist = await Role.findOne({ name });
    if (roleExist) {
      return res.status(400).json({ message: "Bu rol zaten kayıtlı" });
    }
    const role = await Role.create({
      name,
      status: true,
    });
    if (role) {
      return res.status(201).json({ message: "Yeni rol kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz rol bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRole = async (req, res) => {
  const roleId = req.params.id;
  const role = await Role.findById(roleId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!role) {
    return res.status(404).json({ message: "Rol bulunamadı" });
  } else {
    return res.status(200).json({ data: role });
  }
};

const getRoles = async (req, res) => {
  const user = req.user;
  let roles = null;
  if (user.role == "sysgod" || user.role == "Admin") {
    roles = await Role.find({ name: { $ne: "sysgod" } })
      .select("-createdAt")
      .select("-updatedAt")
      .select("-status");
  } else {
    roles = await Role.find({
      name: { $nin: ["sysgod", "Admin"] },
    })
      .select("-createdAt")
      .select("-updatedAt")
      .select("-status");
  }
  if (!roles) {
    return res.status(404).json({ message: "Kayıtlı rol bulunmuyor" });
  } else {
    return res.status(200).json({ data: roles });
  }
};

const updateRole = async (req, res) => {
  const roleId = req.params.id;
  const { name, status } = req.body;
  const oldInfo = await Role.findById({ _id: roleId });
  const roleExist = await Role.findOne({ name });
  if (roleExist && oldInfo.name !== roleExist.name) {
    return res.status(400).json({ message: "Bu rol zaten kayıtlı" });
  }
  const role = await Role.findByIdAndUpdate(
    roleId,
    {
      name,
      status,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!role) {
    return res.status(404).json({ message: "Rol bulunamadı" });
  } else {
    return res
      .status(200)
      .json({ message: "Rol güncellemesi başarılı", data: role });
  }
};

module.exports = {
  addRole,
  getRole,
  getRoles,
  updateRole,
};
