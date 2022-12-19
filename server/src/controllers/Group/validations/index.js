const Joi = require('joi');
const { objectId } = require('../../../validations/custom.validation');

const getGroupById = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

const createGroup = {
  body: Joi.object().keys({
    groupName: Joi.string(),
    groupLimit: Joi.number(),
  }),
};
const joinGroup = {
  body: Joi.object().keys({
    id: Joi.string().custom(objectId),
  }),
};

const closeGroup = {
  params: Joi.object().keys({
    groupId: Joi.string().custom(objectId),
  }),
};

module.exports = {
  getGroupById,
  closeGroup,
  createGroup,
  joinGroup,
};
