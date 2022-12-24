const httpStatus = require('http-status');
const { RendezVous } = require('../models');
const ApiError = require('../utils/ApiError');

/**
 * all rendez-vous
 * @returns {Promise<User>}
 */
const getAllRendezVous = async () => {
  const allRendezVous = await RendezVous.find().populate({ path: 'userId' });
  return allRendezVous || [];
};

/**
 * all rendez-vous per type
 * @returns {Promise<User>}
 */
const getAllRendezVousPerType = async (type) => {
  const allRendezVous = await RendezVous.find({
    type,
  }).populate({ path: 'userId' });
  return allRendezVous || [];
};

/**
 * Create a rendez-vous
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const createRendezVous = async (user, body) => {
  const { date, type } = body;
  const rendezVousMatch = await RendezVous.findOne({
    date,
  });

  if (rendezVousMatch) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `there is already a rendez-vous at this date!`);
  }

  const rendezvous = await RendezVous.create({
    userId: user._id,
    date,
    type,
  });

  return rendezvous;
};

/**
 * Get group by id
 * @param {string} rendezVousId
 * @returns {Promise<User>}
 */
const getRendezVousById = async (rendezVousId) => {
  const rendezVousExist = await RendezVous.findOne({ _id: rendezVousId }).populate({ path: 'userId' });

  if (rendezVousExist) {
    return rendezVousExist;
  }

  throw new ApiError(httpStatus.NOT_ACCEPTABLE, `rendez-vous do not exist!`);
};

/**
 * delete all user rendez-vous
 * @param {ObjectId} userId
 * @returns {Promise<RendezVous.RendezVous>}
 */
const deleteAllRendezVous = async (userId) => {
  await RendezVous.deleteMany({ userId });
};

/**
 * get last rendez-vous
 * @returns {Promise<RendezVous>}
 */
const getLastRendeVous = async () => {
  const lastRendezVous = await RendezVous.find().sort({ createdAt: -1 }).limit(1).populate({ path: 'userId' });
  return lastRendezVous[0];
};

module.exports = {
  getAllRendezVous,
  createRendezVous,
  getRendezVousById,
  deleteAllRendezVous,
  getAllRendezVousPerType,
  getLastRendeVous,
};
