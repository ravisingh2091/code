import { Injectable } from '@angular/core';
import { Observable, observable } from 'rxjs';
import * as io from 'socket.io-client';

import { environment } from 'src/environments/environment';
import { ApiService } from 'src/app/services/api.service';

@Injectable()
export class ChatService {
    private socket;
    private url = environment.chat_url;
    private apiurl = environment.api_url;

    constructor(private apiService: ApiService, ) {
        this.socket = io(this.url);
    }

    getUserList(data) {
        let url = `${this.apiurl}mobile/chatUserList`
        return this.apiService.postData(url, data)
    }
    chatHistory(data) {
        let url = `${this.apiurl}mobile/chatDetails`
        return this.apiService.postData(url, data)
    }

    blockUser(data) {
        let url = `${this.apiurl}mobile/blockUser`
        return this.apiService.postData(url, data)
    }
    deleteUser(data) {
        let url = `${this.apiurl}mobile/chatDelete`
        return this.apiService.postData(url, data)
    }

    getPropertyDetail(propertyId) {
        let url = `${this.apiurl}mobile/bookedDates/${propertyId}`
        return this.apiService.getData(url)
    }

    public bookVane(data) {
        let url = `${this.apiurl}mobile/venueBooking`
        return this.apiService.postData(url, data);
    }

    public roomJoin(message) {
        this.socket.emit('room_join', message);
    }

    public roomLeave(message) {
        this.socket.emit('room_leave', message);
    }

    public typeIn(message) {
        this.socket.emit('typeIn', message);
    }

    public typeOut(message) {
        this.socket.emit('typeOut', message);
    }



    public readMessage(message) {
        this.socket.emit('message read', message);
    }

    public sendMessage(message) {
        this.socket.emit('message', message);
    }

    public uploadfile(message) {
        this.socket.emit('fileUpload', message);
    }


    public getRoomJoin = () => {
        return Observable.create((observer) => {
            this.socket.on('room_join', (message) => {
                observer.next(message);
            });
        });
    }
    public getMessages = () => {
        return Observable.create((observer) => {
            this.socket.on('message', (message) => {
                observer.next(message);
            });
        });
    }


    public getSideBar = () => {
        return Observable.create((observer) => {
            this.socket.on('broadcast', (message) => {
                // console.log("dsfasdf", message)
                observer.next(message);
            })
        })
    }

    public getTypeIn = () => {
        return Observable.create((observer) => {
            this.socket.on('typeIn', (message) => {
                observer.next(message);
                // console.log(message)
            });
        });
    }

    public messagechecked = () => {
        return Observable.create((observer) => {
            this.socket.on('message checked', (message) => {
                observer.next(message);
                // console.log(message)
            });
        });
    }


    public getTypeOut = () => {
        return Observable.create((observer) => {
            this.socket.on('typeOut', (message) => {
                observer.next(message);
                // console.log(message)
            });
        });
    }

    public getFocoused = () => {
        return Observable.create((observer) => {
            // this.socket.on('typeOut', (message) => {
            //     observer.next(message);
            //    // console.log(message)
            // });
        });
    }
}
