import { Injectable } from '@angular/core';
// // import { AngularFireDatabase } from 'angularfire2/database';
// import { AngularFireAuth } from 'angularfire2/auth';
// import * as firebase from 'firebase';

import 'rxjs/add/operator/take';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';

@Injectable()
export class MessagingService {
    // messaging = firebase.messaging();
    currentMessage = new BehaviorSubject(null);

    constructor(
        // private db: AngularFireDatabase, 
        // private afAuth: AngularFireAuth
    ) { }



    // getPermission() {
    //     this.messaging
    //         .requestPermission()
    //         .then(() => {
    //             // console.log('Notification permission granted.');
    //             return this.messaging.getToken();
    //         })
    //         .then(token => {
    //             // console.log(token);
    //             localStorage.setItem("nt", token)
    //             // this.updateToken(token);
    //         })
    //         .catch(err => {
    //             console.log('Unable to get permission to notify.', err);
    //         });
    // }

    // receiveMessage() {
    //     this.messaging.onMessage(payload => {
    //         console.log('Message received. ', payload);
    //         this.currentMessage.next(payload);
    //     });
    // }
}



// curl -X POST \
//   https://fcm.googleapis.com/fcm/send \
//   -H 'Authorization: key=AIzaSyB8waf8ZfHWsX5R3xZZptvaYzsCWaUa3KY' \
//   -H 'Content-Type: application/json' \
//   -d '{ 
//  "notification": {
//   "title": "Hello World", 
//   "body": "This is Message from Admin",
//   "image":"https://mobulous.app/real/assets/img/Real-Estate-logo.png"
//  },
//  "to" : "ew1Y4MCYkggndsKDMK3h5Y:APA91bGrZUwzWT1F2WmrdxUn7sTJ3pvcZlcHHwfCSOPcvmTcCSm0vCEEUjnCvRQQnKaWJSh6Pt8LqVkkE_t4RHGZU4d3Ore_ZDa4RAExu5zMGUfP2Mew8annbtrKWN9jTZijeQb8LWOW"
// }'

