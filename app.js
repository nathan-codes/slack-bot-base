'use strict';

const { App } = require('@slack/bolt');
require('dotenv').config();
// require the fs module that's built into Node.js
const fs = require('fs');
// get the raw data from the faqsDB.json file
let raw = fs.readFileSync('./faqsDB.json');
// parse the raw bytes from the file as JSON
let faqs = JSON.parse(raw);

const faqModule = require('./src/modules/faqModule');
const updateModule = require('./src/modules/updateModule');
const chatModule = require('./src/modules/chatModule');

// Initializes your app with your bot token and signing secret
const app = new App({
  token: process.env.SLACK_BOT_TOKEN,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  socketMode: true, // enable the following to use socket mode
  appToken: process.env.APP_TOKEN,
});

//!! PROOF OF LIFE MESSAGE
app.command('/hello', async ({ command, ack, say }) => {
  try {
    await ack();
    say('I am alive!!!');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

// testing simple message response
app.message(/hey/, async ({ command, say }) => { //regex to allow any type of string of hey work
  try {
    say('I noticed your hey, hey back.');
  } catch (error) {
    console.log('err');
    console.error(error);
  }
});

//** BRINGING IN MODULES */
// const userConversations = new Map();
//!! faq is working with modularization @ 14:26 on 6/13
faqModule(app, faqs);

//!! update is working with modularization @ 14:26 on 6/13
updateModule(app, faqs);

//!! chat is working with modularization @ 15:41 on 6/13
chatModule(app);


//start up our bot
(async () => {
  const port = process.env.PORT || 3002;
  // Start your app
  await app.start(process.env.PORT || port);
  console.log(`⚡️ Slack Bolt app is running on port ${port}!`);
})();
