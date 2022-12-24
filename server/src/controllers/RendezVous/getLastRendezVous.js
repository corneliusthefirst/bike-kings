/** Set an sse event interval for every to seconds to get the last
 *  inserted rendevouz so as to notify on the fron if the last
 *  inserted rendevouz changes */
const httpStatus = require('http-status');
const rendezVousService = require('../../services/rendezvous.service');
const catchAsync = require('../../utils/catchAsync');

const SEND_INTERVAL = 3000;

const writeEvent = (res, sseId, data) => {
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
  res.end();
};

const writeNewEvent = async (res, sseId) => {
  const data = await rendezVousService.getLastRendeVous(); // get the last inserted rendezvous after x seconds and send it to the front
  res.write(`id: ${sseId}\n`);
  res.write(`data: ${data}\n\n`);
  res.end();
};

const sendEvent = (_req, res, lastrendezvous) => {
  res.writeHead(200, {
    'Cache-Control': 'no-cache',
    Connection: 'keep-alive',
    'Content-Type': 'text/event-stream',
  });

  const sseId = new Date().toDateString();

  setInterval(() => {
    writeNewEvent(res, sseId);
  }, SEND_INTERVAL);
  writeEvent(res, sseId, JSON.stringify(lastrendezvous));
};

module.exports = catchAsync(async (req, res) => {
  const lastrendezvous = await rendezVousService.getLastRendeVous();
  if (req.headers.accept === 'text/event-stream') {
    sendEvent(req, res, lastrendezvous);
  } else {
    res.status(httpStatus.CREATED).send(lastrendezvous);
  }
});
