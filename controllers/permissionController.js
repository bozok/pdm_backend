const MenuItem = require("../models/menuItemModel");
const Role = require("../models/roleModel");
const { addLog } = require("../controllers/logController");

const getRoles = async (req, res) => {
  const roles = await Role.find({
    name: { $ne: "sysgod" },
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!roles) {
    return res.status(404).json({ message: "Kayıtlı rol bulunmuyor" });
  } else {
    return res.status(200).json({ data: roles });
  }
};

const getPermissions = async (req, res) => {
  let menuTemp = [];
  const menuItems = await MenuItem.find()
    .select("-createdAt")
    .select("-updatedAt")
    .select("-children")
    .sort({ menuOrder: 1 });
  //  const roleItems = await Role.find({ name: { $ne: "sysgod" } })
  const roleItems = await Role.find()
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  let resultRoleItems = roleItems.map((a) => a.name);
  menuItems.forEach((row) => {
    let item = row.toObject();
    let differenceView = resultRoleItems.filter(
      (x) => !row.canView.includes(x)
    );
    let differenceRead = resultRoleItems.filter(
      (x) => !row.canRead.includes(x)
    );
    let differenceWrite = resultRoleItems.filter(
      (x) => !row.canWrite.includes(x)
    );
    item.canViewNot = differenceView;
    item.canReadNot = differenceRead;
    item.canWriteNot = differenceWrite;
    menuTemp.push(item);
  });
  if (!menuItems) {
    return res.status(404).json({ message: "Kayıtlı menu sekmesi bulunmuyor" });
  } else {
    return res.status(200).json({ data: menuTemp });
  }
};

const addPermission = async (req, res) => {
  const { menu, role, type } = req.body;
  switch (type) {
    case "view":
      await MenuItem.findOneAndUpdate(
        {
          title: menu,
        },
        { $push: { canView: role } },
        { new: true }
      );
      break;
    case "read":
      await MenuItem.findOneAndUpdate(
        {
          title: menu,
        },
        { $push: { canRead: role } },
        { new: true }
      );
      break;
    case "write":
      await MenuItem.findOneAndUpdate(
        {
          title: menu,
        },
        { $push: { canWrite: role } },
        { new: true }
      );
      break;
    default:
  }
  addLog(
    "Rol Yetkisi Ekleme",
    "-",
    "Menu: " + menu + ", Rol: " + role + ", Yetki: " + type,
    req.user
  );
  return res.status(200).json({ data: true });
};

const removePermission = async (req, res) => {
  const { menu, role, type } = req.body;
  if (role == "sysgod" || role == "Admin") {
    return res.status(403).json({ message: "Yetkisiz işlem!" });
  } else {
    switch (type) {
      case "view":
        await MenuItem.findOneAndUpdate(
          {
            title: menu,
          },
          { $pull: { canView: role } },
          { new: true }
        );
        break;
      case "read":
        await MenuItem.findOneAndUpdate(
          {
            title: menu,
          },
          { $pull: { canRead: role } },
          { new: true }
        );
        break;
      case "write":
        await MenuItem.findOneAndUpdate(
          {
            title: menu,
          },
          { $pull: { canWrite: role } },
          { new: true }
        );
        break;
      default:
    }
    addLog(
      "Rol Yetkisi Çıkarma",
      "-",
      "Menu: " + menu + ", Rol: " + role + ", Yetki: " + type,
      req.user
    );
    return res.status(200).json({ data: true });
  }
};

module.exports = {
  getPermissions,
  addPermission,
  removePermission,
};
