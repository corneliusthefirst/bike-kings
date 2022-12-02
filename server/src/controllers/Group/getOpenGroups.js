const httpStatus = require('http-status');

const roomService = require('../../services/room.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const groups = await roomService.getOpenGroups(req.user);
  res.status(httpStatus.CREATED).send(groups);
});
