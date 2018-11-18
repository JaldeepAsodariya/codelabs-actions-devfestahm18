const functions = require("firebase-functions");

// // Create and Deploy Your First Cloud Functions
// // https://firebase.google.com/docs/functions/write-firebase-functions
//
// exports.helloWorld = functions.https.onRequest((request, response) => {
//  response.send("Hello from Firebase!");
// });

const { dialogflow, Permission } = require("actions-on-google");

const app = dialogflow({ debug: true });

app.intent("Default Welcome Intent", conv => {
  conv.ask(
    new Permission({
      context: "to know you better",
      permissions: "NAME"
    })
  );
});

app.intent("PermissionIntent", (conv, params, granted) => {
  if (!granted) {
    conv.user.storage.name = "Google";
    conv.ask("No worries, What is your favorite color?");
  } else {
    conv.user.storage.name = conv.user.name.display;
    conv.ask(`What is your favorite color, ${conv.user.storage.name}?`);
  }
});

app.intent("FavoriteColorIntent", (conv, params) => {
  const color = params.color;
  conv.ask(`${conv.user.storage.name}'s favorite color is ${color}`);
});

exports.dialogflowWebhook = functions.https.onRequest(app);
