const Office = require("../models/officeModel");
const { addLog } = require("../controllers/logController");

const newOffice = async (req, res) => {
  try {
    const { name, regionName, mobileNumber } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Lütfen ofis adı alanını doldurunuz" });
    }
    const officeExist = await Office.findOne({ name });
    if (officeExist) {
      return res.status(400).json({ message: "Bu ofis zaten kayıtlı" });
    }
    const office = await Office.create({
      name,
      regionName,
      mobileNumber,
    });
    if (office) {
      addLog("Yeni Ofis Kaydı", "-", "Ofis: " + office.name, req.user);
      return res.status(201).json({ message: "Yeni ofis kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz ofis bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getOffice = async (req, res) => {
  const officeId = req.params.id;
  const office = await Office.findById(officeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!office) {
    return res.status(404).json({ message: "Ofis bulunamadı" });
  } else {
    return res.status(200).json({ data: office });
  }
};

const getOffices = async (req, res) => {
  const offices = await Office.find({
    status: { $ne: false },
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!offices) {
    return res.status(404).json({ message: "Kayıtlı ofis bulunmuyor" });
  } else {
    return res.status(200).json({ data: offices });
  }
};

const getOfficesByRegion = async (req, res) => {
  const regionName = req.params.id;
  const offices = await Office.find({
    status: { $ne: false },
    regionName,
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!offices) {
    return res.status(404).json({ message: "Kayıtlı ofis bulunmuyor" });
  } else {
    return res.status(200).json({ data: offices });
  }
};

const updateOffice = async (req, res) => {
  const officeId = req.params.id;
  const { name, regionName, status } = req.body;
  const oldInfo = await Office.findById({ _id: officeId });
  const officeExist = await Office.findOne({ name });
  if (officeExist && oldInfo.name !== officeExist.name) {
    return res.status(400).json({ message: "Bu ofis zaten kayıtlı" });
  }
  const office = await Office.findByIdAndUpdate(
    officeId,
    {
      name,
      regionName,
      status,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!office) {
    return res.status(404).json({ message: "Ofis bulunamadı" });
  } else {
    addLog("Ofis Bilgisi Güncelleme", "-", "Ofis: " + office.name, req.user);
    return res
      .status(200)
      .json({ message: "Ofis bilgileri güncellendi", data: true });
  }
};

const getOfficesAdmin = async (req, res) => {
  const offices = await Office.find().select("-createdAt").select("-updatedAt");
  if (!offices) {
    return res.status(404).json({ message: "Kayıtlı ofis bulunmuyor" });
  } else {
    return res.status(200).json({ data: offices });
  }
};

const changeOfficeStatus = async (req, res) => {
  const officeId = req.params.id;
  const officeTmp = await Office.findById(officeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!officeTmp) {
    return res.status(404).json({ message: "Ofis bulunamadı" });
  } else {
    const office = await Office.findByIdAndUpdate(
      officeId,
      {
        status: !officeTmp.status,
      },
      { new: true }
    )
      .select("-createdAt")
      .select("-updatedAt");
    if (!office) {
      return res.status(404).json({ message: "Ofis bulunamadı" });
    } else {
      addLog(
        "Ofis Durum Değişikliği",
        "-",
        "Ofis: " +
          office.name +
          " - Yeni durum: " +
          (!officeTmp.status ? "Aktif" : "Pasif"),
        req.user
      );
      return res
        .status(200)
        .json({ message: "Ofis durumu güncellendi", data: office });
    }
  }
};

module.exports = {
  newOffice,
  getOffice,
  getOffices,
  updateOffice,
  getOfficesByRegion,
  getOfficesAdmin,
  changeOfficeStatus,
};
