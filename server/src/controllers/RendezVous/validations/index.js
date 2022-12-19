const Joi = require('joi');
const { objectId } = require('../../../validations/custom.validation');

const getRendezVousById = {
  params: Joi.object().keys({
    rendezVousId: Joi.string().custom(objectId),
  }),
};

const createRendezVous = {
  body: Joi.object().keys({
    date: Joi.string(),
  }),
};

const deleteAllRendezVous = {
  params: Joi.object().keys({
    userId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getRendezVousById,
  createRendezVous,
  deleteAllRendezVous,
};
