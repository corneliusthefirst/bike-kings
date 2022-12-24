const mongoose = require('mongoose');
const { RENDEZ_VOUS } = require('../config/constants/modelsConstants');
const { toJSON, paginate } = require('./plugins');

const rendezVousSchema = mongoose.Schema(
  {
    userId: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    date: {
      type: String,
    },
    type: {
      type: String,
      required: false,
      enum: RENDEZ_VOUS,
      default: RENDEZ_VOUS.DEFAULT,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
rendezVousSchema.plugin(toJSON);
rendezVousSchema.plugin(paginate);

/**
 * @typedef RendezVous
 */
const RendezVous = mongoose.model('RendezVous', rendezVousSchema);

module.exports = RendezVous;
