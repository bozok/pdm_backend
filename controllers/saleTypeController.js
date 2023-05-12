const SaleType = require("../models/saleTypeModel");

const addSaleType = async (req, res) => {
  try {
    const { name, prefix, counter } = req.body;
    if (!name || !prefix || !counter) {
      return res
        .status(400)
        .json({ message: "Lütfen satış türü bilgilerini doldurun" });
    }
    const saleTypeExist = await SaleType.findOne({ name });
    if (saleTypeExist) {
      return res.status(400).json({ message: "Bu satış türü kayıtlı" });
    }
    const saleType = await SaleType.create({
      name,
      prefix,
      counter,
    });
    if (saleType) {
      return res
        .status(201)
        .json({ message: "Yeni satış türü kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz satış türü bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getSaleType = async (req, res) => {
  const saleTypeId = req.params.id;
  const saleType = await SaleType.findById(saleTypeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!saleType) {
    return res.status(404).json({ message: "Satış türü bulunamadı" });
  } else {
    return res.status(200).json({ data: saleType });
  }
};

const getSaleTypes = async (req, res) => {
  const saleTypes = await SaleType.find({
    status: { $ne: false },
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!saleTypes) {
    return res.status(404).json({ message: "Kayıtlı satış türü bulunmuyor" });
  } else {
    return res.status(200).json({ data: saleTypes });
  }
};

const updateSaleType = async (req, res) => {
  const saleTypeId = req.params.id;
  const { name } = req.body;
  const oldInfo = await SaleType.findById({ _id: saleTypeId });
  const saleTypeExist = await SaleType.findOne({ name });
  if (saleTypeExist && oldInfo.name !== saleTypeExist.name) {
    return res.status(400).json({ message: "Bu satış türü zaten kayıtlı" });
  }
  const saleType = await SaleType.findByIdAndUpdate(
    saleTypeId,
    {
      name,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!saleType) {
    return res.status(404).json({ message: "Satış türü bulunamadı" });
  } else {
    return res
      .status(200)
      .json({ message: "Satış türü güncellemesi başarılı", data: saleType });
  }
};

const changeSaleTypeStatus = async (req, res) => {
  const saleTypeId = req.params.id;
  const saleTypeTmp = await SaleType.findById(saleTypeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!saleTypeTmp) {
    return res.status(404).json({ message: "Satış türü bulunamadı" });
  } else {
    const saleType = await SaleType.findByIdAndUpdate(
      saleTypeId,
      {
        status: !saleTypeTmp.status,
      },
      { new: true }
    )
      .select("-createdAt")
      .select("-updatedAt");
    if (!saleType) {
      return res.status(404).json({ message: "Satış türü bulunamadı" });
    } else {
      return res
        .status(200)
        .json({ message: "Satış türü durumu güncellendi", data: saleType });
    }
  }
};

module.exports = {
  addSaleType,
  getSaleType,
  getSaleTypes,
  updateSaleType,
  changeSaleTypeStatus,
};
