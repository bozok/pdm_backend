const MenuItem = require("../models/menuItemModel");
const { addLog } = require("../controllers/logController");

const addMenuItem = async (req, res) => {
  try {
    const {
      title,
      path,
      icon,
      children,
      canView,
      canRead,
      canWrite,
      menuOrder,
    } = req.body;
    if (!title || !path || !icon) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm alanları doldurunuz" });
    }
    const menuItemExist = await MenuItem.findOne({ title });
    if (menuItemExist) {
      return res.status(400).json({ message: "Bu menu sekmesi zaten kayıtlı" });
    }
    const menuItem = await MenuItem.create({
      title,
      path,
      icon,
      children,
      canView,
      canRead,
      canWrite,
      menuOrder,
    });
    if (menuItem) {
      addLog("Yeni Menu Ekleme", "-", "Menu: " + menuItem.title, req.user);
      return res
        .status(201)
        .json({ message: "Yeni menu sekmesi kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz menu sekmesi bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getMenuItem = async (req, res) => {
  const menuItemId = req.params.id;
  const menuItem = await MenuItem.findById(menuItemId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!menuItem) {
    return res.status(404).json({ message: "Menü sekmesi bulunamadı" });
  } else {
    return res.status(200).json({ data: menuItem });
  }
};

const getMenuItems = async (req, res) => {
  const userRole = req.user.role;
  const menuItems = await MenuItem.find({ canView: userRole })
    .select("-createdAt")
    .select("-updatedAt")
    .sort({ menuOrder: 1 });
  if (!menuItems) {
    return res.status(404).json({ message: "Kayıtlı menu sekmesi bulunmuyor" });
  } else {
    return res.status(200).json({ data: menuItems });
  }
};

const updateMenuItem = async (req, res) => {
  const menuItemId = req.params.id;
  const { title, path, icon, status } = req.body;
  const oldInfo = await MenuItem.findById({ _id: menuItemId });
  const menuItemExist = await MenuItem.findOne({ title });
  if (menuItemExist && oldInfo.name !== menuItemExist.name) {
    return res.status(400).json({ message: "Bu menu sekmesi zaten kayıtlı" });
  }
  const menuItem = await MenuItem.findByIdAndUpdate(
    menuItemId,
    {
      title,
      path,
      icon,
      status,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!menuItem) {
    return res.status(404).json({ message: "Menu sekmesi bulunamadı" });
  } else {
    return res
      .status(200)
      .json({ message: "Menu sekmesi güncellemesi başarılı", data: menuItem });
  }
};

module.exports = {
  addMenuItem,
  getMenuItem,
  getMenuItems,
  updateMenuItem,
};
