const mongoose = require('mongoose');
const { toJSON, paginate } = require('./plugins');

const roomRequestSchema = mongoose.Schema(
  {
    sender: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: true,
    },
    receiver: {
      type: mongoose.SchemaTypes.ObjectId,
      ref: 'User',
      required: false,
    },
    senderLastSeenMessage: {
      type: String,
    },
    receiverLastSeenMessage: {
      type: String,
    },
    roomDeletedBySender: {
      type: Boolean,
      default: false,
    },
    roomDeletedByReceiver: {
      type: Boolean,
      default: false,
    },
    // for groups
    groupName: {
      type: String,
    },
    members: [
      {
        type: mongoose.SchemaTypes.ObjectId,
        ref: 'User',
        required: true,
      },
    ],
    lastSendMessage: {
      type: String,
    },
  },
  {
    timestamps: true,
  }
);

// add plugin that converts mongoose to json
roomRequestSchema.plugin(toJSON);
roomRequestSchema.plugin(paginate);

/**
 * @typedef Room
 */
const Room = mongoose.model('room', roomRequestSchema);

module.exports = Room;
