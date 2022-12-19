const mongoose = require('mongoose');
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
