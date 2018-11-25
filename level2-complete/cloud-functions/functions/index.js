const functions = require("firebase-functions");

const { dialogflow, Permission, Suggestions } = require("actions-on-google");

const app = dialogflow({ debug: true }); 

app.intent("Default Welcome Intent", conv => {                   //invokes this default 
  conv.ask(
    new Permission({                                     // asks the permission to know the name of user from google account.
      context: "to know you better",
      permissions: "NAME"
    })
  );
});

app.intent("actions_intent_PERMISSION", (conv, params, granted) => {                //after it asks , it jumps here and in it there is if loop
  if (!granted) {                                                                 //permission not granted
    conv.ask("No worries, What is your favorite color?");
    conv.ask(new Suggestions("Blue", "Red", "Green"));                // directly  asks color 
  } else {                                                                              // granted
    conv.data.userName = conv.user.name.display;
    conv.ask(`Thanks, ${conv.data.userName}. What's your favorite color?`);                 // 1st it will thanks user with name from google account , and ask your favorite color
    conv.ask(new Suggestions("Blue", "Red", "Green"));
  }
});
// after we get favorite color
app.intent("favorite color", (conv, params) => {                 // this intent is matched it invoked firebase call
  const color = params.color;                     // extract color from sentence and store in color
  if (conv.data.userName) {                                       
    conv.close(`${conv.data.userName}, your favorite color is ${color}.`);
  } else {
    conv.close(`Your favorite color is ${color}.`);
  }
});

exports.dialogflowWebhook = functions.https.onRequest(app);
