/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const moment = require('moment');
const { NlpManager } = require('node-nlp');
const { createMessage } = require('./message.service');

const manager = new NlpManager({ languages: ['fr'] });

// 1 - Train the IA
async function trainChatBotIA() {
  return new Promise(async (resolve, reject) => {
    // Adds the utterances and intents for the NLP
    manager.addDocument('fr', '1T', 'help.1T');
    manager.addDocument('fr', '2T', 'help.2T');
    manager.addDocument('fr', '3T', 'help.3T');
    manager.addDocument('fr', '1t', 'help.1T');
    manager.addDocument('fr', '2t', 'help.2T');
    manager.addDocument('fr', '3t', 'help.3T');

    manager.addDocument('fr', '1B', 'help.1B');
    manager.addDocument('fr', '2B', 'help.2B');
    manager.addDocument('fr', '1b', 'help.1B');
    manager.addDocument('fr', '2b', 'help.2B');
    manager.addDocument('fr', 'exit', 'help.exit');
    manager.addDocument('fr', 'stop', 'help.exit');
    manager.addDocument('fr', 'EXIT', 'help.exit');
    manager.addDocument('fr', 'STOP', 'help.exit');
    manager.addDocument('fr', 'quitter', 'help.exit');
    manager.addDocument('fr', 'QUITTER', 'help.exit');
    manager.addDocument('fr', 'non', 'help.exit');
    manager.addDocument('fr', 'NON', 'help.exit');
    manager.addDocument('fr', 'N', 'help.exit');

    manager.addDocument('fr', '1U', 'help.1U');
    manager.addDocument('fr', '2U', 'help.2U');
    manager.addDocument('fr', '3U', 'help.3U');
    manager.addDocument('fr', '1u', 'help.1U');
    manager.addDocument('fr', '2u', 'help.2U');
    manager.addDocument('fr', '3u', 'help.3U');

    manager.addDocument('fr', 'OUI', 'help.choisir.rendevous');
    manager.addDocument('fr', 'oui', 'help.choisir.rendevous');
    manager.addDocument('fr', 'Y', 'help.choisir.rendevous');

    // Train also the NLG
    manager.addAnswer(
      'fr',
      'help.1T',
      "Quel est l'année de creation de votre moto, choisissez une année entre 1980 - 2022?"
    );
    manager.addAnswer(
      'fr',
      'help.2T',
      'Quel est le type d’usage de votre moto? Repondez un entre 1U...3U ?\n1U-ROUTIER\n2U-TOUT TERRAIN\n3U-SPORTIF'
    );
    manager.addAnswer(
      'fr',
      'help.3T',
      'Quel type de contact souhaitez vous. Repondez un entre 1B et 2B?\n1B-Par mail\n2B-Par telephone'
    );
    manager.addAnswer('fr', 'help.1B', "l'email de contact est bikekings@gmail.com");
    manager.addAnswer('fr', 'help.2B', 'le numero mobile est 06 06 06 06 06');
    manager.addAnswer('fr', 'help.exit', 'Merci pour votre visite, à bientôt !');
    manager.addAnswer(
      'fr',
      'help.1U',
      'Nous vous proposons un essaie routier.\nVeuillez Choisir une date pour un essaie routier ?'
    );
    manager.addAnswer(
      'fr',
      'help.2U',
      'Nous vous proposons un essaie tout terrain.\nVeuillez Choisir une date  pour un essaie tout terrain ?'
    );
    manager.addAnswer(
      'fr',
      'help.3U',
      'Nous vous proposons un essai sur piste.\nVeuillez Choisir une date pour un essai sur piste ?'
    );
    manager.addAnswer('fr', 'help.choisir.rendevous', 'Veuillez Choisir une date pour le rendez-vous ?');

    await manager.train();
    manager.save();
    console.log('AI has been trainded');
    resolve(true);
  });
}

async function generateResponseAI(qsm) {
  // Train and save the mode
  return new Promise(async (resolve, reject) => {
    const response = await manager.process('fr', qsm);
    resolve(response);
  });
}

async function handleChatbotResponse({ msg, socket, roomId, userObject: usrObj }) {
  const isAnnee = parseInt(msg.message, 10) >= 1980 && parseInt(msg.message, 10) <= 2022;
  const isDate = msg.message.split('-')[0].split('/').length === 3;
  const isDateDenierEntretien = msg.suffix && msg.suffix === 'DE';
  const isDateRendezvous = msg.suffix && msg.suffix === 'RDV';
  const dateLessThanCurrentDateByAYearOrMore =
    parseInt(moment(msg.message, 'DD/MM/YYYY').year(), 10) >= parseInt(moment().year(), 10) - 1;
  const isKilometers = msg.message.slice(-2) === 'km';

  if (isKilometers) {
    const nbKilometers = parseInt(msg.message, 10);
    if (nbKilometers >= 10000) {
      const botMessage = await createMessage(
        { ...usrObj, _id: usrObj.id },
        {
          text: 'Veuillez Choisir une date pour le rendez-vous ?',
          roomId,
          isBotMessage: true,
          isChatbot: true,
        }
      );
      socket.emit('roomNewMessage', botMessage);
      return;
    }
    const botMessage = await createMessage(
      { ...usrObj, _id: usrObj.id },
      {
        text: 'Souhaitez vous faire reviser votre moto? \nY - Oui\nN - Non',
        roomId,
        isBotMessage: true,
        isChatbot: true,
      }
    );
    socket.emit('roomNewMessage', botMessage);
    return;
  }

  if (isDate && isDateDenierEntretien) {
    console.log('passed here0', dateLessThanCurrentDateByAYearOrMore, isDateDenierEntretien);
    if (!dateLessThanCurrentDateByAYearOrMore) {
      const botMessage = await createMessage(
        { ...usrObj, _id: usrObj.id },
        {
          text: 'Veuillez Choisir une date pour le rendez-vous ?',
          roomId,
          isBotMessage: true,
          isChatbot: true,
        }
      );
      socket.emit('roomNewMessage', botMessage);
      return;
    }
    // ask number of kilometers
    const botMessage = await createMessage(
      { ...usrObj, _id: usrObj.id },
      {
        text: 'Quel est le nombre de kilomètres parcourus depuis le dernier entretien (en km) ?',
        roomId,
        isBotMessage: true,
        isChatbot: true,
      }
    );
    socket.emit('roomNewMessage', botMessage);
    return;
  }

  if (isDate && isDateRendezvous) {
    console.log('passed here1', dateLessThanCurrentDateByAYearOrMore, isDateDenierEntretien);
    const botMessage = await createMessage(
      { ...usrObj, _id: usrObj.id },
      {
        text: 'Rendevez-Vous Enregistré !',
        roomId,
        isBotMessage: true,
        isChatbot: true,
      }
    );
    socket.emit('roomNewMessage', botMessage);

    setTimeout(async () => {
      // delete all chatbot message and start back the workflow
      const restartMessage = await createMessage(
        { ...usrObj, _id: usrObj.id },
        {
          text: "Bonjour, je suis le chatbot de BikeKings, comment puis-je vous aider ? choisissez l'un des 1T,2T..STOP.\n\n1T - Entretien de la moto\n2T - Informations sur la moto\n3T - Nous Contacter\nSTOP - Stopper la conversation",
          roomId,
          isBotMessage: true,
          isChatbot: true,
        }
      );
      socket.emit('roomNewMessage', restartMessage);
    }, 2000);
    return;
  }

  if (isAnnee) {
    const botMessage = await createMessage(
      { ...usrObj, _id: usrObj.id },
      {
        text: "Quel est la deniere date d'entretien de la moto ?",
        roomId,
        isBotMessage: true,
        isChatbot: true,
      }
    );
    socket.emit('roomNewMessage', botMessage);
    return;
  }

  console.log('passed here2', dateLessThanCurrentDateByAYearOrMore, isDateDenierEntretien, isDateRendezvous);
  const response = await generateResponseAI(msg.message);
  const botMessage = await createMessage(
    { ...usrObj, _id: usrObj.id },
    {
      text: response.answer,
      roomId,
      isBotMessage: true,
      isChatbot: true,
    }
  );
  socket.emit('roomNewMessage', botMessage);
}

module.exports = {
  trainChatBotIA,
  generateResponseAI,
  handleChatbotResponse,
};
