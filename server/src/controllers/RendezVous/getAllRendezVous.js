const httpStatus = require('http-status');

const rendezVousService = require('../../services/rendezvous.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const rendezvous = await rendezVousService.getAllRendezVous();
  res.status(httpStatus.CREATED).send(rendezvous);
});
