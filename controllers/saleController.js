const mongoose = require("mongoose");
const { DeleteObjectCommand, GetObjectCommand } = require("@aws-sdk/client-s3");
const { getSignedUrl } = require("@aws-sdk/s3-request-presigner");
const s3 = require("../utils/s3");

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
    const initializeHistory = {
      historyText: "Proje kaydı yapıldı",
      userId: user._id,
      userName: user.firstName + " " + user.lastName,
      createdAt: Date.now(),
    };
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
      notes: note.length > 0 ? [newNote] : [],
      history: initializeHistory,
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
      $set: {
        notes: {
          $sortArray: {
            input: "$notes",
            sortBy: { createdAt: -1 },
          },
        },
      },
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
        history: 1,
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
    return res.status(200).json({ data: sale[0] });
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

const updateSaleIG = async (req, res) => {
  const saleId = req.params.id;
  const {
    detailId,
    isEducationTaken,
    educationTakenDate,
    isWorkplaceOpen,
    workplaceOpenDate,
    isPartnered,
    hasTraderRecord,
    hasPttRecord,
    declarationSent,
    declarationApproved,
    kosgebFormFiled,
    machineInfoFilled,
    projectFileReady,
    isProjectUploaded,
    kosgebStatus,
    submittedDate,
    revisionDate,
    revisionReason,
    denyDate,
    denyReason,
    denyCounter,
    status,
  } = req.body;
  const saleDetailIG = await SaleIG.findByIdAndUpdate(
    detailId,
    {
      isEducationTaken,
      educationTakenDate,
      isWorkplaceOpen,
      workplaceOpenDate,
      isPartnered,
      hasTraderRecord,
      hasPttRecord,
      declarationSent,
      declarationApproved,
      kosgebFormFiled,
      machineInfoFilled,
      projectFileReady,
      isProjectUploaded,
      kosgebStatus,
      submittedDate,
      revisionDate,
      revisionReason,
      denyDate,
      denyReason,
      denyCounter,
      status,
    },
    { new: true }
  );
  const saleIG = await Sale.findByIdAndUpdate(
    saleId,
    {
      status,
    },
    { new: true }
  );

  if (!saleDetailIG || !saleIG) {
    return res.status(404).json({ message: "Satış detay bilgisi bulunamadı" });
  } else {
    return res.status(200).json({
      message: "Satış detay bilgileri güncellendi",
    });
  }
};

const uploadFileSaleIG = async (req, res) => {
  try {
    const { detailId } = req.body;
    const saleIg = await SaleIG.findById(detailId);
    for (let i = 0; i < req.files.length; i++) {
      const newDocument = {
        url: req.files[i].location,
        key: req.files[i].key,
        bucket: req.files[i].bucket,
      };
      await saleIg.updateOne({ $push: { documents: newDocument } });
    }
    return res.status(200).json({
      message: "Döküman(lar) sisteme yüklendi.",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const deleteFileSaleIG = async (req, res) => {
  try {
    const detailId = req.params.id;
    const { docId, docKey } = req.body;
    const command = new DeleteObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: docKey,
    });

    const response = await s3.send(command);
    if (response.$metadata.httpStatusCode == 204) {
      const saleIg = await SaleIG.findById(detailId);
      if (saleIg) {
        await saleIg.updateOne({ $pull: { documents: { _id: docId } } });
        return res.status(200).json({
          message: "Döküman silme başarılı.",
        });
      } else {
        return res.status(400).json({
          message: "Satış detayı bulunamadı.",
        });
      }
    } else {
      return res.status(400).json({
        message: "Döküman silmede hata.",
      });
    }
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const getFileSaleIG = async (req, res) => {
  try {
    const { docId, docKey } = req.body;
    const command = new GetObjectCommand({
      Bucket: process.env.AWS_BUCKET,
      Key: docKey,
    });
    const file = await getSignedUrl(s3, command, { expiresIn: 60 * 1 });
    return res.status(200).json({
      message: "Döküman cekme başarılı.",
      fileUrl: file,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

const changeAssigneeSale = async (req, res) => {
  const saleId = req.params.id;
  const { newAssigneeId } = req.body;
  const sale = await Sale.findByIdAndUpdate(
    saleId,
    {
      assignedId: newAssigneeId,
    },
    { new: true }
  );
  return res
    .status(200)
    .json({ message: "Atanan çalışan bilgisi güncellendi.", data: true });
};

const approveSale = async (req, res) => {
  const saleId = req.params.id;
  const saleIG = await Sale.findByIdAndUpdate(
    saleId,
    {
      status: "Proje Yüklenecek",
    },
    { new: true }
  );
  if (saleIG) {
    return res.status(200).json({ message: "Proje onaylandı.", data: true });
  } else {
    return res
      .status(400)
      .json({ message: "Proje onayında hata.", data: false });
  }
};

module.exports = {
  addSale,
  getSale,
  getSaleIG,
  getSales,
  updateSale,
  newNoteSaleIG,
  updateSaleIG,
  uploadFileSaleIG,
  deleteFileSaleIG,
  getFileSaleIG,
  changeAssigneeSale,
  approveSale,
};
