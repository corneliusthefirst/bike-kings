const Joi = require('joi');
const { RENDEZ_VOUS } = require('../../../config/constants/modelsConstants');
const { objectId } = require('../../../validations/custom.validation');

const getRendezVousById = {
  params: Joi.object().keys({
    rendezVousId: Joi.string().custom(objectId),
  }),
};

const createRendezVous = {
  body: Joi.object().keys({
    date: Joi.string(),
    type: Joi.string()
      .required()
      .valid(RENDEZ_VOUS.DEFAULT, RENDEZ_VOUS.SPORTIF, RENDEZ_VOUS.ROUTIER, RENDEZ_VOUS.TOUT_TERRAIN),
  }),
};

const deleteAllRendezVous = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

const getAllRendezVousPerType = {
  params: Joi.object().keys({
    type: Joi.string()
      .required()
      .valid(RENDEZ_VOUS.DEFAULT, RENDEZ_VOUS.SPORTIF, RENDEZ_VOUS.ROUTIER, RENDEZ_VOUS.TOUT_TERRAIN),
  }),
};

module.exports = {
  getRendezVousById,
  createRendezVous,
  deleteAllRendezVous,
  getAllRendezVousPerType,
};
