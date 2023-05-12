const Customer = require("../models/customerModel");
const { addLog } = require("../controllers/logController");

const addCustomer = async (req, res) => {
  try {
    // validation phase
    const password = "1234qwer";
    const {
      identityNo,
      firstName,
      lastName,
      mobileNumber,
      email,
      taxIdNo,
      companyName,
      financialAdvisor,
      supplierMachinist,
      comment,
    } = req.body;
    if (
      !identityNo ||
      !firstName ||
      !lastName ||
      !email ||
      !mobileNumber ||
      !taxIdNo ||
      !companyName
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
    const customerExist = await Customer.findOne({ email });
    if (customerExist) {
      return res
        .status(400)
        .json({ message: "Bu e-posta adresi sistemde kayıtlı" });
    }
    const identityNoExist = await Customer.findOne({ identityNo });
    if (identityNoExist) {
      return res
        .status(400)
        .json({ message: "Bu kimlik numarası sistemde kayıtlı" });
    }
    const taxIdNoExist = await Customer.findOne({ taxIdNo });
    if (taxIdNoExist) {
      return res
        .status(400)
        .json({ message: "Bu vergi kimlik numarası sistemde kayıtlı" });
    }
    const user = req.user;
    const customer = await Customer.create({
      identityNo,
      firstName,
      lastName,
      mobileNumber,
      email,
      password,
      taxIdNo,
      companyName,
      financialAdvisor,
      supplierMachinist,
      comment,
      registrantName: user.firstName + " " + user.lastName,
      registrantRegion: user.region,
      registrantOffice: user.office,
    });
    if (customer) {
      addLog(
        "Yeni Müşteri Kaydı",
        "-",
        "Müşteri: " + customer.firstName + " " + customer.lastName,
        req.user
      );
      return res.status(201).json({ message: "Yeni müşteri kaydı başarılı" });
    } else {
      return res.status(400).json({ message: "Geçersiz müşteri bilgisi" });
    }
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

const getCustomer = async (req, res) => {
  const customerId = req.params.id;
  const customer = await Customer.findById(customerId)
    .select("-password")
    .select("-updatedAt");
  if (!customer) {
    return res.status(404).json({ message: "Müşteri bulunamadı" });
  } else {
    return res.status(200).json({ data: customer });
  }
};

const getCustomers = async (req, res) => {
  const customers = await Customer.find()
    .select("-password")
    .select("-createdAt")
    .select("-updatedAt");
  if (!customers) {
    return res
      .status(404)
      .json({ message: "Sistemde kayıtlı müşteri bulunamadı" });
  } else {
    return res.status(200).json({ data: customers });
  }
};

const updateCustomer = async (req, res) => {
  const customerId = req.params.id;
  const {
    identityNo,
    firstName,
    lastName,
    mobileNumber,
    email,
    taxIdNo,
    companyName,
    financialAdvisor,
    supplierMachinist,
    comment,
  } = req.body;
  const oldInfo = await Customer.findById({ _id: customerId });
  const customerExist = await Customer.findOne({ email });
  if (customerExist && oldInfo.email !== customerExist.email) {
    return res
      .status(400)
      .json({ message: "Bu e-posta adresi sistemde kayıtlı" });
  }
  const identityNoExist = await Customer.findOne({ identityNo });
  if (identityNoExist && oldInfo.identityNo !== identityNoExist.identityNo) {
    return res
      .status(400)
      .json({ message: "Bu kimlik numarası sistemde kayıtlı" });
  }
  const customer = await Customer.findByIdAndUpdate(
    customerId,
    {
      identityNo,
      firstName,
      lastName,
      mobileNumber,
      email,
      taxIdNo,
      companyName,
      financialAdvisor,
      supplierMachinist,
      comment,
    },
    { new: true }
  )
    .select("-password")
    .select("-createdAt")
    .select("-updatedAt");
  if (!customer) {
    return res.status(404).json({ message: "Müşteri bulunamadı" });
  } else {
    addLog(
      "Müşteri Bilgisi Güncelleme",
      "-",
      "Müşteri: " + customer.firstName + " " + customer.lastName,
      req.user
    );
    return res
      .status(200)
      .json({ message: "Müşteri güncellemesi başarılı", data: customer });
  }
};

module.exports = {
  addCustomer,
  getCustomer,
  getCustomers,
  updateCustomer,
};
