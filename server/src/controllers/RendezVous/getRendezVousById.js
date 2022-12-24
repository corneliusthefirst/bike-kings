const httpStatus = require('http-status');

const rendezVousService = require('../../services/rendezvous.service');
const catchAsync = require('../../utils/catchAsync');

module.exports = catchAsync(async (req, res) => {
  const { rendezVousId } = req.params;
  const rendezvousList = await rendezVousService.getRendezVousById(rendezVousId);
  res.status(httpStatus.CREATED).send(rendezvousList);
});
