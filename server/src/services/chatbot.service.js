/* eslint-disable no-async-promise-executor */
/* eslint-disable no-unused-vars */
/* eslint-disable no-console */
const { NlpManager } = require('node-nlp');

const manager = new NlpManager({ languages: ['en'] });

// 1 - Train the IA
async function trainChatBotIA() {
  return new Promise(async (resolve, reject) => {
    // Adds the utterances and intents for the NLP
    // // Train also the NLG
    // Adds the utterances and intents for the NLP
    manager.addDocument('en', 'goodbye for now', 'greetings.bye');
    manager.addDocument('en', 'bye bye take care', 'greetings.bye');
    manager.addDocument('en', 'okay see you later', 'greetings.bye');
    manager.addDocument('en', 'bye for now', 'greetings.bye');
    manager.addDocument('en', 'i must go', 'greetings.bye');
    manager.addDocument('en', 'hello', 'greetings.hello');
    manager.addDocument('en', 'hi', 'greetings.hello');
    manager.addDocument('en', 'howdy', 'greetings.hello');

    // Train also the NLG
    manager.addAnswer('en', 'greetings.bye', 'Till next time');
    manager.addAnswer('en', 'greetings.bye', 'see you soon!');
    manager.addAnswer('en', 'greetings.hello', 'Hey there!');
    manager.addAnswer('en', 'greetings.hello', 'Greetings!');

    await manager.train();
    manager.save();
    console.log('AI has been trainded');
    resolve(true);
  });
}

async function generateResponseAI(qsm) {
  // Train and save the mode
  return new Promise(async (resolve, reject) => {
    const response = await manager.process('en', qsm);
    resolve(response);
  });
}

module.exports = {
  trainChatBotIA,
  generateResponseAI,
};
