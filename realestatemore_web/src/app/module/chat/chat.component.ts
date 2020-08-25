import { Component, OnInit, ElementRef, ViewChild, AfterViewChecked } from '@angular/core';
declare var $;
import * as moment from "moment";
import { CommonService } from 'src/app/services/common.service';
import { ChatService } from "./chat.service";
@Component({
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css'],
  providers: [ChatService]
})
export class ChatComponent implements OnInit, AfterViewChecked {
  userId = localStorage.getItem('user_id')
  userName = localStorage.getItem('name')
  userImage = localStorage.getItem('image')
  @ViewChild('scrollMe', { static: true }) scrollMe: ElementRef;
  chatBackupUserList = []
  chatUserList = []
  chatLists = []
  roomId: string
  receiverId: any;
  receiverName: any;
  receiverImage: any;
  propertyId: any;
  propetyOwner: any;
  propertyDetail: any;
  price = '';
  endTime = '';
  startTime = '';
  selectedDate = []
  vanueError = '';
  sucErrMessage = '';
  constructor(
    private commonService: CommonService,
    private chatService: ChatService
  ) { }

  ngOnInit() {

    this.userList();

    this.chatService.getRoomJoin().subscribe((message) => {
      // console.log(message)
    });

    this.chatService.getMessages().subscribe(message => {
      if (message.status == true) {
        // console.log("Message Listen", message)
        this.chatLists = [...this.chatLists, message]
      }

    })

    this.chatService.getSideBar().subscribe(message => {
      // console.log("Brodcast Message", message)
      if (message.receiver_id == this.userId) {
        this.chatService.getUserList({ userId: this.userId }).subscribe(result => {
          // console.log("Brodcast Api", result)
          if (result.status == "true") {
            this.chatUserList = result.data
            this.chatBackupUserList = result.data
            var x: any = document.getElementById("myAudio");
            x.play()
          }
        }, error => {
          console.log(error)
        })
      }
    })

  }

  userList() {
    this.commonService.showLoader = true
    this.chatService.getUserList({ userId: this.userId }).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.chatUserList = result.data
        this.chatBackupUserList = result.data
        if (result.data.length > 0) {
          this.roomId = result.data[0].room_id
          this.receiverId = result.data[0].receiver_id
          this.receiverName = result.data[0].fullName
          this.receiverImage = result.data[0].profileImage
          this.propertyId = result.data[0].propertyId
          this.propetyOwner = result.data[0].propetyOwner
        }
        this.chatHistory()
      }
    }, error => {
      this.commonService.showLoader = false
      console.log(error)
    })
  }

  chatHistory() {
    this.commonService.showLoader = true
    this.chatService.chatHistory({ room_id: this.roomId, userId: this.userId }).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.chatLists = result.data
        this.chatService.roomJoin({ room_id: this.roomId })
      }
    }, error => {
      this.commonService.showLoader = false
      console.log(error)
    })
  }

  dataFormate(date) {
    return moment(date).fromNow()
  }

  userListClick(roomData) {
    this.roomId = roomData.room_id
    this.receiverId = roomData.receiver_id
    this.receiverName = roomData.fullName
    this.receiverImage = roomData.profileImage
    this.propertyId = roomData.propertyId
    this.propetyOwner = roomData.propetyOwner
    this.chatHistory()
  }
  sendMessage(data) {
    this.chatService.sendMessage({
      sender_id: this.userId,
      receiver_id: this.receiverId,
      message: data.value,
      room_id: this.roomId,
      attachment_type: 'TEXT'
    })
    data.value = ''
  }
  private scrollToBottom(): void {
    try {
      this.scrollMe.nativeElement.scrollTop = this.scrollMe.nativeElement.scrollHeight;
    } catch (err) {
    }
  }

  ngAfterViewChecked() {
    this.scrollToBottom();
  }

  blockUser() {
    this.commonService.showLoader = true
    let data = {
      block_from: this.userId,
      block_to: this.receiverId
    }
    this.chatService.blockUser(data).subscribe(result => {
      this.commonService.showLoader = false
    }, error => {
      this.commonService.showLoader = false
      console.log(error)
    })
  }
  deleteUser() {
    this.commonService.showLoader = true
    let data = {
      userId: this.userId,
      room_id: this.roomId
    }
    this.chatService.deleteUser(data).subscribe(result => {
      this.commonService.showLoader = false
      this.userList()
    }, error => {
      this.commonService.showLoader = false
      console.log(error)
    })
  }


  markBooked() {
    this.commonService.showLoader = true
    this.chatService.getPropertyDetail(this.propertyId).subscribe(result => {
      this.commonService.showLoader = false
      if (result.status == "true") {
        this.propertyDetail = result.data
        $("#DateModal").modal("show")
      }
    }, error => {
      this.commonService.showLoader = false
      console.error(error);
    })
  }
  selectBookDate(date) {
    let checkDate = this.selectedDate.findIndex(value => value == date)
    if (checkDate == -1) {
      this.selectedDate.push(date);
    }
  }
  removeDate(date) {
    this.selectedDate = this.selectedDate.filter(value => value != date)
  }

  bookeVanue() {
    if (this.selectedDate.length == 0 || this.price == '' || this.startTime == '' || this.endTime == '' || this.receiverId == '' || this.propertyId == '') {
      this.vanueError = 'Please fill all value';
    }
    this.commonService.showLoader = true
    let data = {
      propertyId: this.propertyId,
      receiverId: this.receiverId,
      selectDate: this.selectedDate,
      startTime: this.startTime,
      endTime: this.endTime
    }
    this.chatService.bookVane(data).subscribe(result => {
      this.commonService.showLoader = false
      $("#DateModal").modal("hide")
      $("sucErrModal").modal("show")
      this.sucErrMessage = result.message

    }, error => {
      this.commonService.showLoader = false
      console.error(error)
    })
  }
  filterUser(userName) {
    this.chatUserList = this.chatBackupUserList.filter(value => {
      var re = new RegExp(userName.toLowerCase(), 'g');
      if (value.fullName.toLowerCase().match(re)) {
        return value
      }
    })
  }
}
