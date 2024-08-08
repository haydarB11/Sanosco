var admin = require("firebase-admin");

var serviceAccount = require("../../sansco-b9f2b-firebase-adminsdk-9zchg-5ced75b282.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount)
});

const sendNotifications = async (token, title, body) => {
    const message = {
        tokens: token,
        notification: {
            title: title,
            body: body
        }
    }
    try {
        const response = await admin.messaging().sendMulticast(message);
        console.log(response);
        return response;
    } catch (error) {
        throw new Error(error.message);
    }
};

module.exports = sendNotifications;