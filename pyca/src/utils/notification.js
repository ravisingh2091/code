import admin from 'firebase-admin'


var serviceAccount = require("./petparenting-1136d-firebase-adminsdk-651za-74c7a93d85.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://petparenting-1136d.firebaseio.com"
});

export const pushNotify = ({ data, token }) => {

    let message = {
        data,
        notification: {
            title: data.title,
            body: data.body,
        },
        token
    };
    admin.messaging().send(message)
        .then((response) => {
            console.log('Notification sent :', response);
        })
        .catch((error) => {
            console.log('Error Notification', error);
        });
}

