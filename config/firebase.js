const admin = require('firebase-admin');
const serviceAccount = require('./race-push-notif-dev-firebase-adminsdk-fbsvc-757bb17887.json');
const commandCenterServiceAccount = require('./command-center-b1f7e-firebase-adminsdk-fbsvc-2a27a875aa.json');

// Initialize the main Firebase app
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
  });
}

// Initialize Command Center Firebase app
let commandCenterApp;
try {
  commandCenterApp = admin.initializeApp({
    credential: admin.credential.cert(commandCenterServiceAccount),
  }, 'command-center');
} catch (error) {
  // If app already exists, get it
  if (error.code === 'app/duplicate-app') {
    commandCenterApp = admin.app('command-center');
  } else {
    console.error('Error initializing Command Center Firebase app:', error);
  }
}

// VAPID key configuration
const vapidKey = 'BAXF9QgCCnquBDAttUsdzkbS2QHW1dkQXaLJRSm8Wx0ZYSUx8griQT2nF5BX9hJDkOPF09qee7sPYANs6rk9sjg';

module.exports = {
  admin,
  commandCenterApp,
  vapidKey
};
