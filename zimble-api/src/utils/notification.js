import admin from 'firebase-admin'
import { User } from '../models';


var serviceAccount = require("./zimble-b9f1c-firebase-adminsdk-62qb0-d08e3a7e57.json");

admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://zimble-b9f1c.firebaseio.com"
});

export const pushNotify = ({ data, token }) => {

    let userNoti = User.findOne({ deviceToken: token }, { notification: 1 })
    if (userNoti.notification) {
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

}

