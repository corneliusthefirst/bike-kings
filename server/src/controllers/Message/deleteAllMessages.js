const httpStatus = require('http-status');

const messageService = require('../../services/message.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const { roomId } = req.params;
  const deleted = await messageService.deleteAllMessages(roomId);
  res.status(httpStatus.OK).send(deleted);
});
