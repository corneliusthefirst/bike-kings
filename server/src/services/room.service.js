/* eslint-disable no-console */
const httpStatus = require('http-status');
const { FriendRequest, Room } = require('../models');
const { FRIEND_STATUS } = require('../config/constants/modelsConstants');
const ApiError = require('../utils/ApiError');
const { createFriendRequest, acceptPendingRequest } = require('./friend.service');
const { userService } = require('.');

/**
 * Create a direct room between a user and a friend
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const getOrCreateRoom = async (user, body) => {
  const { id } = body;
  console.log('user._id', id, user._id);
  if (id.toString() === user._id.toString()) {
    const room = await Room.findOne({
      sender: user._id,
      receiver: user._id,
      isChatbot: true,
    });

    if (room) return room;

    const newRoom = await Room.create({
      sender: user._id,
      receiver: user._id,
      isChatbot: true,
    });

    return newRoom;
  }
  const friendShip = await FriendRequest.findOne({
    $or: [
      {
        from: user._id,
        to: id,
      },
      {
        from: id,
        to: user._id,
      },
    ],
    status: FRIEND_STATUS.FRIEND,
  });

  const opponent = await userService.getUserById(id);

  if (!friendShip && opponent) {
    const friendRequest = await createFriendRequest(user, opponent);
    await acceptPendingRequest(opponent, friendRequest._id);
    const newfriendShip = await FriendRequest.findOne({
      $or: [
        {
          from: user._id,
          to: id,
        },
        {
          from: id,
          to: user._id,
        },
      ],
      status: FRIEND_STATUS.FRIEND,
    });
    if (newfriendShip._id.toString() === user._id.toString()) {
      throw new ApiError(httpStatus.NOT_ACCEPTABLE, `You cannot send dm to yourself!`);
    }
  }

  const alreadyRoom = await Room.findOne({
    $or: [
      {
        $and: [
          {
            sender: user._id,
          },
          {
            receiver: id,
          },
        ],
      },
      {
        $and: [
          {
            sender: id,
          },
          {
            receiver: user._id,
          },
        ],
      },
    ],
  });

  if (alreadyRoom) {
    if (alreadyRoom.sender.toString() === user._id.toString()) {
      alreadyRoom.roomDeletedBySender = false;
      alreadyRoom.save();
    } else {
      alreadyRoom.roomDeletedByReceiver = false;
      alreadyRoom.save();
    }

    return alreadyRoom;
  }

  const createdRoom = await Room.create({ sender: user._id, receiver: id });

  return createdRoom;
};

/**
 * all open rooms between a user and friends
 * @param {Object} user
 * @returns {Promise<User>}
 */
const getOpenRooms = async (user) => {
  const rooms = await Room.find({
    $or: [
      {
        sender: user._id,
        roomDeletedBySender: false,
      },
      {
        receiver: user._id,
        roomDeletedByReceiver: false,
      },
    ],
  })
    .populate({ path: 'sender' })
    .populate({ path: 'receiver' });

  return rooms;
};

/**
 * close a room by sender or receiver
 * @param {Object} user
 * @param {string} roomId
 * @returns {Promise<User>}
 */
const closeRoom = async (user, roomId) => {
  const room = await Room.findById(roomId);

  if (!room) {
    throw new ApiError(httpStatus.NOT_FOUND, `room not existed!`);
  }

  if (user._id.toString() !== room.sender.toString() && user._id.toString() !== room.receiver.toString()) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `you are not allowed to do this!`);
  }

  if (user._id.toString() === room.sender.toString()) {
    room.roomDeletedBySender = true;
  } else if (user._id.toString() === room.receiver.toString()) {
    room.roomDeletedByReceiver = true;
  }

  await room.save();

  return room;
};

/**
 * Create a new group
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const createGroup = async (user, body) => {
  const { groupName, groupLimit = 3 } = body;

  if (user.role !== 'admin') {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `only admins are allowed to create groups!`);
  }

  const groupExist = await Room.findOne({ groupName });

  if (!groupExist) {
    await Room.create({
      groupName,
      groupLimit,
      sender: user._id,
      members: [user._id],
    });
    const group = await Room.findOne({
      groupName,
    })
      .populate({ path: 'sender' })
      .populate({ path: 'members' });
    return group;
  }

  throw new ApiError(httpStatus.NOT_ACCEPTABLE, `group name already exist!`);
};

/**
 * Get group by id
 * @param {string} groupId
 * @returns {Promise<User>}
 */
const getGroupById = async (groupId) => {
  const groupExist = await Room.findOne({ _id: groupId }).populate({ path: 'sender' }).populate({ path: 'members' });

  if (groupExist) {
    return groupExist;
  }

  throw new ApiError(httpStatus.NOT_ACCEPTABLE, `group do not exist!`);
};

/**
 * all groups between joined by user
 * @param {Object} user
 * @returns {Promise<User>}
 */
const getOpenGroups = async (user) => {
  const groups = Room.find()
    .populate({ path: 'sender' })
    .populate({ path: 'members' })
    .exec(function (err, data) {
      return data.filter(function (group) {
        return (
          group.members.filter((member) => member._id.toString() === user._id.toString()).length > 0 &&
          !group.roomDeletedBySender
        );
      });
    });
  return groups;
};

/**
 * close a room by sender or receiver
 * @param {Object} user
 * @param {string} groupId
 * @returns {Promise<User>}
 */
const closeGroup = async (user, groupId) => {
  const group = await Room.findById(groupId).populate({ path: 'sender' }).populate({ path: 'members' });

  if (!group) {
    throw new ApiError(httpStatus.NOT_FOUND, `group not existed!`);
  }

  const member = group.members.find((element) => element._id.toString() === user._id.toString());

  if (member.role !== 'admin') {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `you are not allowed to do this!`);
  }

  if (member.role === 'admin') {
    group.roomDeletedBySender = true;
  }
  await group.save();

  return group;
};

/**
 * Join group
 * @param {Object} user
 * @param {Object} body
 * @returns {Promise<User>}
 */
const joinGroup = async (user, body) => {
  const { id } = body;

  const groupExist = await Room.findOne({ _id: id });

  if (!groupExist) {
    throw new ApiError(httpStatus.NOT_ACCEPTABLE, `group do not exist!`);
  }
  await Room.updateOne(
    {
      _id: id,
    },
    {
      $push: {
        members: user._id,
      },
    }
  );
  const group = await Room.findOne({
    _id: id,
  })
    .populate({ path: 'sender' })
    .populate({ path: 'members' });

  return group;
};

/**
 * all groups between joined by user
 * @returns {Promise<User>}
 */
const getAllGroups = async () => {
  const groups = await Room.find().populate({ path: 'sender' }).populate({ path: 'members' });
  return groups;
};

module.exports = {
  getOrCreateRoom,
  getOpenRooms,
  closeRoom,
  // groups
  createGroup,
  getGroupById,
  getOpenGroups,
  joinGroup,
  closeGroup,
  getAllGroups,
};
