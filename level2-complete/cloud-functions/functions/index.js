const functions = require("firebase-functions");

const { dialogflow, Permission, Suggestions } = require("actions-on-google");

const app = dialogflow({ debug: true });

app.intent("Default Welcome Intent", conv => {
  conv.ask(
    new Permission({
      context: "to know you better",
      permissions: "NAME"
    })
  );
});

app.intent("actions_intent_PERMISSION", (conv, params, granted) => {
  if (!granted) {
    conv.ask("No worries, What is your favorite color?");
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  } else {
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  }
});

app.intent("favorite color", (conv, params) => {
  const color = params.color;
  if (conv.data.userName) {
    conv.close(`${conv.data.userName}, your favorite color is ${color}.`);
  } else {
    conv.close(`Your favorite color is ${color}.`);
  }
});

exports.dialogflowWebhook = functions.https.onRequest(app);
