const httpStatus = require('http-status');

const roomService = require('../../services/room.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const { user } = req;
  const { groupId } = req.params;

  const groups = await roomService.closeGroup(user, groupId);
  res.status(httpStatus.OK).send(groups);
});
