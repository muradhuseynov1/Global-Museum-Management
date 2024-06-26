/**
 * Import function triggers from their respective submodules:
 *
 * const {onCall} = require("firebase-functions/v2/https");
 * const {onDocumentWritten} = require("firebase-functions/v2/firestore");
 *
 * See a full list of supported triggers at https://firebase.google.com/docs/functions
 */

const {onRequest} = require("firebase-functions/v2/https");
const logger = require("firebase-functions/logger");

const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

async function deleteUserWithRetry(userId, retries = 3) {
  try {
    await admin.auth().deleteUser(userId);
    console.log(`Successfully deleted user with ID: ${userId}`);
    return { success: true };
  } catch (error) {
    console.error(`Error deleting user with ID: ${userId}`, error);
    if (retries > 0 && error.code === 'auth/retry-later') {
      console.log(`Retrying... ${retries} attempts left`);
      await new Promise(resolve => setTimeout(resolve, 1000 * (4 - retries)));
      return deleteUserWithRetry(userId, retries - 1);
    }
    return { success: false, error: error.message };
  }
}

exports.deleteUserAccount = functions.https.onCall(async (data, context) => {
  const { userId } = data;
  return deleteUserWithRetry(userId);
});



// Create and deploy your first functions
// https://firebase.google.com/docs/functions/get-started

// exports.helloWorld = onRequest((request, response) => {
//   logger.info("Hello logs!", {structuredData: true});
//   response.send("Hello from Firebase!");
// });
