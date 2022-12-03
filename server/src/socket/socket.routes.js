const { getConnection } = require('../lib/redisConnection');
const { generateResponseAI } = require('../services/chatbot.service');

const redis = getConnection();
const userService = require('../services/user.service');

const SOCKET_ID_IN_ROOM = 'socketIdInRoom-';
const SOCKET_ID_IN_CHATBOT = 'socketIdInChatBot-';
const USER = 'user-';
const ONLINE_USER = 'online-user-';
const USERS_IN_ROOM = 'usersInRoom-';

module.exports = [
  {
    name: 'online',
    controller: async (socket, { userId }) => {
      await redis.set(`${ONLINE_USER}${socket.id}`, userId);
      socket.join(userId);
    },
  },
  {
    name: 'joinRoom',
    controller: async (socket, { roomId, userId }) => {
      const userObject = await userService.getUserById(userId);

      await Promise.all([
        redis.set(`${SOCKET_ID_IN_ROOM}${socket.id}`, roomId),
        redis.set(`${USER}${socket.id}`, JSON.stringify(userObject)),
        redis.hSet(`${USERS_IN_ROOM}${roomId}`, userId, socket.id),
      ]);

      socket.join(roomId);
    },
  },
  {
    name: 'joinChatBot',
    controller: async (socket, { userId }) => {
      const userObject = await userService.getUserById(userId);

      await Promise.all([
        redis.set(`${SOCKET_ID_IN_CHATBOT}${socket.id}`, userId),
        redis.set(`${USER}${socket.id}`, JSON.stringify(userObject)),
      ]);
      socket.join(userId);
    },
  },
  {
    name: 'newChatbotMsg',
    controller: async (socket, { msg }) => {
      const [roomId] = await Promise.all([
        redis.get(`${SOCKET_ID_IN_CHATBOT}${socket.id}`),
        redis.get(`${USER}${socket.id}`),
      ]);
      const response = await generateResponseAI(msg);
      if (roomId) {
        socket
          .to(roomId)
          .emit(
            'sendMsgResponse',
            response.answer !== undefined
              ? { user: response.answer.author, text: response.answer.data.text }
              : "I am sorry, I don't understand :( "
          );
      }
    },
  },
  {
    name: 'roomSendMessage',
    controller: async (socket, { msg, receiverId }) => {
      const [roomId, userObject] = await Promise.all([
        redis.get(`${SOCKET_ID_IN_ROOM}${socket.id}`),
        redis.get(`${USER}${socket.id}`),
      ]);

      const newMessage = msg;
      newMessage.senderId = JSON.parse(userObject);

      if (roomId) socket.to(roomId).emit('roomNewMessage', newMessage);

      const totalUsers = await redis.hGetAll(`${USERS_IN_ROOM}${roomId}`);

      if (Object.keys(totalUsers).length === 1) {
        socket.to(receiverId).emit('roomOpened');
      }
    },
  },
  {
    name: 'sendFriendRequest',
    controller: async (socket, { receiverId }) => {
      if (receiverId) {
        socket.to(receiverId).emit('friendRequest');
      }
    },
  },
  {
    name: 'sendFriendAcceptRequest',
    controller: async (socket, { receiverId }) => {
      if (receiverId) {
        socket.to(receiverId).emit('friendAcceptRequest');
      }
    },
  },
  {
    name: 'sendRoomDeleteMessage',
    controller: async (socket, { roomId, messageId }) => {
      if (roomId) {
        socket.to(roomId).emit('roomDeleteMessage', { messageId, roomId });
      }
    },
  },
  {
    name: 'roomSendEditMessage',
    controller: async (socket, message) => {
      if (message) {
        socket.to(message.roomId).emit('roomEditMessage', message);
      }
    },
  },
  {
    name: 'leaveRoom',
    controller: async (socket, roomId) => {
      redis.del(`${SOCKET_ID_IN_ROOM}${socket.id}`);
      socket.leave(roomId);
    },
  },
  {
    name: 'logOut',
    controller: async (socket, userId) => {
      redis.del(`${ONLINE_USER}${socket.id}`);
      redis.del(`${SOCKET_ID_IN_ROOM}${socket.id}`);

      socket.leave(userId);
    },
  },
];
