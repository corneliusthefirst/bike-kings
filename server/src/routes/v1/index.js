const express = require('express');
const authRoute = require('../../controllers/Auth/auth.route');
const userRoute = require('../../controllers/User/user.route');
const friendRoute = require('../../controllers/Friend/friend.route');
const roomRoute = require('../../controllers/Room/room.route');
const messageRoute = require('../../controllers/Message/message.route');
const groupRoute = require('../../controllers/Group/group.route');
const rendezVousRoute = require('../../controllers/RendezVous/rendezvous.route');

const router = express.Router();

router.use('/auth', authRoute);
router.use('/users', userRoute);
router.use('/friends', friendRoute);
router.use('/rooms', roomRoute);
router.use('/messages', messageRoute);
router.use('/groups', groupRoute);
router.use('/rendezvous', rendezVousRoute);

module.exports = router;
