const Log = require("../models/logModel");

const addLog = async (type, result, text, user) => {
  try {
    // const log = await Log.create({
    //   actionType: type,
    //   actionResult: result,
    //   actionText: text,
    //   doneBy: user.firstName + " " + user.lastName,
    //   doneByRegion: user.region,
    //   doneByOffice: user.office,
    // });
    // if (!log) {
    //   console.log("Geçersiz log bilgisi");
    // }
  } catch (error) {
    console.log(error);
  }
};

const getLog = async (id) => {
  const log = await Log.findById(id).select("-createdAt").select("-updatedAt");
  if (!log) {
    console.log("Log bulunamadı");
  }
};

const getLogs = async (req, res) => {
  const logs = await Log.find({
    status: { $ne: false },
  }).sort({ createdAt: -1 });
  if (!logs) {
    return res.status(404).json({ message: "Kayıtlı log bulunmuyor" });
  } else {
    return res.status(200).json({ data: logs });
  }
};

module.exports = {
  addLog,
  getLog,
  getLogs,
};
