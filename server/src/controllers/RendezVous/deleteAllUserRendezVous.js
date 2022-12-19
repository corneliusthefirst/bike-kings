const httpStatus = require('http-status');

const rendezVousService = require('../../services/rendezvous.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const { userId } = req.params;

  const rendezvous = await rendezVousService.deleteAllRendezVous(userId);
  res.status(httpStatus.OK).send(rendezvous);
});
