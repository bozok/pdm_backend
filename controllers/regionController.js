const Region = require("../models/regionModel");

const addRegion = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res
        .status(400)
        .json({ message: "Lütfen bölge adı alanını doldurunuz" });
    }
    const regionExist = await Region.findOne({ name });
    if (regionExist) {
      return res.status(400).json({ message: "Bu bölge zaten kayıtlı" });
    }
    const region = await Region.create({
      name,
      status: true,
    });
    if (region) {
      return res.status(201).json({ message: "Yeni bölge kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz bölge bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getRegion = async (req, res) => {
  const regionId = req.params.id;
  const region = await Region.findById(regionId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!region) {
    return res.status(404).json({ message: "Bölge bulunamadı" });
  } else {
    return res.status(200).json({ data: region });
  }
};

const getRegions = async (req, res) => {
  const regions = await Region.find({
    status: { $ne: false },
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!regions) {
    return res.status(404).json({ message: "Kayıtlı bölge bulunmuyor" });
  } else {
    return res.status(200).json({ data: regions });
  }
};

const getRegionsAdmin = async (req, res) => {
  const regions = await Region.find().select("-createdAt").select("-updatedAt");
  if (!regions) {
    return res.status(404).json({ message: "Kayıtlı bölge bulunmuyor" });
  } else {
    return res.status(200).json({ data: regions });
  }
};

const updateRegion = async (req, res) => {
  const regionId = req.params.id;
  const { name, status } = req.body;
  const oldInfo = await Region.findById({ _id: regionId });
  const regionExist = await Region.findOne({ name });
  if (regionExist && oldInfo.name !== regionExist.name) {
    return res.status(400).json({ message: "Bu bölge zaten kayıtlı" });
  }
  const region = await Region.findByIdAndUpdate(
    regionId,
    {
      name,
      status,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!region) {
    return res.status(404).json({ message: "Bölge bulunamadı" });
  } else {
    return res
      .status(200)
      .json({ message: "Bölge güncellemesi başarılı", data: region });
  }
};

module.exports = {
  addRegion,
  getRegion,
  getRegions,
  updateRegion,
  getRegionsAdmin,
};
