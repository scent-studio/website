const Settings = require('../models/Settings');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');

const getSettings = asyncHandler(async (req: any, res: any) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({ storeName: 'Scent Studio' });
  }

  res.status(200).json(ApiResponse.success(settings));
});

const updateSettings = asyncHandler(async (req: any, res: any) => {
  let settings = await Settings.findOne();

  if (!settings) {
    settings = await Settings.create({ storeName: 'Scent Studio' });
  }

  const updatedSettings = await Settings.findByIdAndUpdate(settings._id, req.body, {
    new: true,
    runValidators: true,
    upsert: true,
  });

  res.status(200).json(ApiResponse.updated(updatedSettings));
});

module.exports = {
  getSettings,
  updateSettings,
};

export {};
