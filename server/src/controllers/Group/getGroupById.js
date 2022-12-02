const httpStatus = require('http-status');

const roomService = require('../../services/room.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const { groupId } = req.params;
  const group = await roomService.getGroupById(groupId);
  res.status(httpStatus.CREATED).send(group);
});
