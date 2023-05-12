const mongoose = require("mongoose");
const Sale = require("../models/saleModel");
const SaleIG = require("../models/salesIgModel");
const SaleType = require("../models/saleTypeModel");
const { addLog } = require("../controllers/logController");

const addSale = async (req, res) => {
  try {
    // validation phase
    const {
      saleTypeId,
      saleTypeName,
      customerId,
      customerName,
      price,
      currency,
      note,
      assignedId,
    } = req.body;
    if (
      !saleTypeId ||
      !saleTypeName ||
      !customerId ||
      !price ||
      !currency ||
      !assignedId
    ) {
      return res
        .status(400)
        .json({ message: "Lütfen tüm gerekli alanları doldurun" });
    }
    const user = req.user;
    const newNote = {
      note: note,
      userId: user._id,
      userName: user.firstName + " " + user.lastName,
      createdAt: Date.now(),
    };
    const saleType = await SaleType.findById(saleTypeId);
    const sale = await Sale.create({
      saleTypeId,
      saleTypeName,
      projectCode: saleType.prefix + "-" + saleType.counter,
      customerId,
      price,
      currency,
      notes: note.length > 0 ? newNote : [],
      assignedId,
      registrantId: user._id,
      status: "Yeni",
    });
    if (sale) {
      // incremet sale type counter
      await SaleType.findByIdAndUpdate(
        { _id: saleTypeId },
        {
          $inc: { counter: 1 },
        }
      );
      switch (saleTypeName) {
        case "İleri Girişimcilik":
          createSaleForIG(sale._id);
          break;

        default:
          break;
      }
      // add new sale log
      addLog("Yeni Satış Kaydı", "-", "Müşteri: " + customerName, req.user);
      return res.status(201).json({ message: "Yeni satış kaydı başarılı." });
    } else {
      return res.status(400).json({ message: "Geçersiz satış bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

// generate sold project details
const createSaleForIG = async (saleId) => {
  const saleig = await SaleIG.create({
    saleId: saleId,
  });
};

const getSale = async (req, res) => {
  const saleId = req.params.id;
  const sale = await Sale.findById(saleId).select("-updatedAt");
  if (!customer) {
    return res.status(404).json({ message: "Satış kaydı bulunamadı" });
  } else {
    return res.status(200).json({ data: sale });
  }
};

const getSaleIG = async (req, res) => {
  const saleId = new mongoose.Types.ObjectId(req.params.id);
  const sale = await Sale.aggregate([
    {
      $match: { _id: saleId },
    },
    {
      $lookup: {
        from: "salesigs",
        localField: "_id",
        foreignField: "saleId",
        as: "sale_detail",
      },
    },
    { $unwind: "$sale_detail" },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer_detail",
      },
    },
    { $unwind: "$customer_detail" },
    {
      $lookup: {
        from: "users",
        localField: "assignedId",
        foreignField: "_id",
        as: "assigned_detail",
      },
    },
    { $unwind: "$assigned_detail" },
    {
      $lookup: {
        from: "users",
        localField: "registrantId",
        foreignField: "_id",
        as: "registrant_detail",
      },
    },
    { $unwind: "$registrant_detail" },
    {
      $project: {
        _id: 1,
        saleTypeName: 1,
        projectCode: 1,
        price: 1,
        currency: 1,
        notes: 1,
        assignedName: "$assigned_detail.firstName",
        assignedSurname: "$assigned_detail.lastName",
        assignedOffice: "$assigned_detail.office",
        registrantName: "$registrant_detail.firstName",
        registrantSurname: "$registrant_detail.lastName",
        registrantOffice: "$registrant_detail.office",
        status: 1,
        createdAt: 1,
        customerInfo: "$customer_detail",
        detailInfo: "$sale_detail",
      },
    },
  ]);
  if (!sale) {
    return res.status(404).json({ message: "Satış kaydı bulunamadı" });
  } else {
    return res.status(200).json({ data: sale });
  }
};

const getSales_oldway = async (req, res) => {
  const sales = await Sale.find().select("-updatedAt");
  if (!sales) {
    return res
      .status(404)
      .json({ message: "Sistemde kayıtlı satış kaydı bulunamadı" });
  } else {
    return res.status(200).json({ data: sales });
  }
};

const getSales = async (req, res) => {
  const sales = await Sale.aggregate([
    {
      $lookup: {
        from: "saletypes",
        localField: "saleTypeId",
        foreignField: "_id",
        as: "saletype_info",
      },
    },
    { $unwind: "$saletype_info" },
    {
      $lookup: {
        from: "users",
        localField: "assignedId",
        foreignField: "_id",
        as: "assigned_info",
      },
    },
    { $unwind: "$assigned_info" },
    {
      $lookup: {
        from: "users",
        localField: "registrantId",
        foreignField: "_id",
        as: "registrant_info",
      },
    },
    { $unwind: "$registrant_info" },
    {
      $lookup: {
        from: "customers",
        localField: "customerId",
        foreignField: "_id",
        as: "customer_info",
      },
    },
    { $unwind: "$customer_info" },
    {
      $project: {
        _id: 1,
        price: 1,
        currency: 1,
        createdAt: 1,
        projectCode: 1,
        status: 1,
        saleType: "$saletype_info.name",
        customerInfo: "$customer_info",
        assignedInfo: "$assigned_info",
        registrantInfo: "$registrant_info",
      },
    },
  ]);
  if (!sales) {
    return res
      .status(404)
      .json({ message: "Sistemde kayıtlı satış kaydı bulunamadı" });
  } else {
    return res.status(200).json({ data: sales });
  }
};

const updateSale = async (req, res) => {
  return res
    .status(200)
    .json({ message: "Satış bilgisi güncellendi", data: true });
};

const newNoteSaleIG = async (req, res) => {
  try {
    const saleId = new mongoose.Types.ObjectId(req.params.id);
    const { note } = req.body;
    const saleDetail = await Sale.findById(saleId);
    const newNote = {
      userId: req.user.id,
      userName: req.user.firstName + " " + req.user.lastName,
      note: note,
      createdAt: Date.now(),
    };
    await saleDetail.updateOne({ $push: { notes: newNote } });
    return res
      .status(200)
      .json({ message: "Yeni not kaydı başarılı", data: true });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

module.exports = {
  addSale,
  getSale,
  getSaleIG,
  getSales,
  updateSale,
  newNoteSaleIG,
};
