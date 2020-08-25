import { Component, OnInit } from '@angular/core';
import { CommonService } from "./services/common.service";
import { MessagingService } from "./services/messaging.service";
import { NavigationEnd, Router } from '@angular/router';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'real';
  message
  constructor(
    public commonService: CommonService,
    private router: Router,
    private messagingService: MessagingService
  ) {
    this.router.events.subscribe((evt) => {
      if (!(evt instanceof NavigationEnd)) {
        return;
      }
      window.scrollTo(0, 0)
    });
  }
  ngOnInit() {
    // this.messagingService.getPermission()
    // this.messagingService.receiveMessage()
    // this.message = this.messagingService.currentMessage
  }
}
