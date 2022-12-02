const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const validations = require('./validations');
const groupsController = require('./index');

const router = express.Router();

router.post('/get-group/:groupId', auth(), validate(validations.getGroupById), groupsController.getGroupById);
router.post('/create-group', auth(), validate(validations.createGroup), groupsController.createGroup);
router.post('/join-group', auth(), validate(validations.joinGroup), groupsController.joinGroup);
router.put('/close-group/:groupId', auth(), validate(validations.closeGroup), groupsController.closeGroup);
router.get('/open-groups', auth(), groupsController.getOpenGroups);
router.get('/all-groups', auth(), groupsController.getAllGroups);

module.exports = router;
