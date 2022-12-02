const httpStatus = require('http-status');

const roomService = require('../../services/room.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const group = await roomService.createGroup(req.user, req.body);
  res.status(httpStatus.CREATED).send(group);
});
