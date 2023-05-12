const CurrencyType = require("../models/currencyTypeModel");

const addCurrencyType = async (req, res) => {
  try {
    const { name, shortCode, symbol } = req.body;
    if (!name || !shortCode || !symbol) {
      return res.status(400).json({ message: "Lütfen tüm alanları doldurun" });
    }
    const currencyTypeExist = await CurrencyType.findOne({ name });
    if (currencyTypeExist) {
      return res.status(400).json({ message: "Bu para birimi kayıtlı" });
    }
    const currencyType = await CurrencyType.create({
      name,
      shortCode,
      symbol,
    });
    if (currencyType) {
      return res
        .status(201)
        .json({ message: "Yeni para birimi kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz para birimi bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCurrencyType = async (req, res) => {
  const currencyTypeId = req.params.id;
  const currencyType = await CurrencyType.findById(currencyTypeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!currencyType) {
    return res.status(404).json({ message: "Para birimi bulunamadı" });
  } else {
    return res.status(200).json({ data: currencyType });
  }
};

const getCurrencyTypes = async (req, res) => {
  const currencyTypes = await CurrencyType.find({
    status: { $ne: false },
  })
    .select("-createdAt")
    .select("-updatedAt")
    .select("-status");
  if (!currencyTypes) {
    return res.status(404).json({ message: "Kayıtlı para birimi bulunmuyor" });
  } else {
    return res.status(200).json({ data: currencyTypes });
  }
};

const updateCurrencyType = async (req, res) => {
  const currencyTypeId = req.params.id;
  const { name, shortCode, symbol } = req.body;
  const oldInfo = await CurrencyType.findById({ _id: currencyTypeId });
  const currencyTypeExist = await CurrencyType.findOne({ name });
  if (currencyTypeExist && oldInfo.name !== currencyTypeExist.name) {
    return res.status(400).json({ message: "Bu spara birimi kayıtlı" });
  }
  const currencyType = await CurrencyType.findByIdAndUpdate(
    currencyTypeId,
    {
      name,
      shortCode,
      symbol,
    },
    { new: true }
  )
    .select("-createdAt")
    .select("-updatedAt");
  if (!currencyType) {
    return res.status(404).json({ message: "Para birimi bulunamadı" });
  } else {
    return res.status(200).json({
      message: "Para birimi güncellemesi başarılı",
      data: currencyType,
    });
  }
};

const changeCurrencyTypeStatus = async (req, res) => {
  const currencyTypeId = req.params.id;
  const currencyTypeTmp = await CurrencyType.findById(currencyTypeId)
    .select("-createdAt")
    .select("-updatedAt");
  if (!currencyTypeTmp) {
    return res.status(404).json({ message: "Para birimi bulunamadı" });
  } else {
    const currencyType = await CurrencyType.findByIdAndUpdate(
      currencyTypeId,
      {
        status: !currencyTypeTmp.status,
      },
      { new: true }
    )
      .select("-createdAt")
      .select("-updatedAt");
    if (!currencyType) {
      return res.status(404).json({ message: "Para birimi bulunamadı" });
    } else {
      return res.status(200).json({
        message: "Para birimi durumu güncellendi",
        data: currencyType,
      });
    }
  }
};

module.exports = {
  addCurrencyType,
  getCurrencyType,
  getCurrencyTypes,
  updateCurrencyType,
  changeCurrencyTypeStatus,
};
