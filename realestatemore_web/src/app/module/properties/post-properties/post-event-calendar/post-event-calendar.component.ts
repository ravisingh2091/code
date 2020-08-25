import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'rps-post-event-calendar',
  templateUrl: './post-event-calendar.component.html',
  styleUrls: ['./post-event-calendar.component.css']
})
export class PostEventCalendarComponent implements OnInit {
  daysData = []
  nowDate = moment()
  @Input() selectedDate = []
  @Output() afterClick = new EventEmitter<{}>()
  selectedDateArray = []
  constructor() { }

  ngOnInit() {
    this.getDaysInMonth(this.nowDate.month(), this.nowDate.year())
    this.selectedDateArray = this.selectedDate
  }

  getDaysInMonth(month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    var temp = []
    while (date.getMonth() === month) {
      // `${new Date(date).getDate()}-${new Date(date).getMonth()}-${new Date(date).getFullYear()}`

      // date format to dd-mm-yyyy
      let dateData = moment(date).format("YYYY/MM/DD")

      // make week wise date array 
      temp[new Date(date).getDay()] = {
        dates: dateData,
      }

      // if temp array length is equel to 7 
      if (temp.length == 7) {
        days.push(temp)
        temp = []
      }
      date.setDate(date.getDate() + 1);
    }

    // if the last array is not equel to 7 then push the data in to array. It will run mostly the last week because in last week temp array is not equel to 7

    if (temp.length > 0) {
      for (let i = temp.length; i < 7; i++) {
        temp[i] = {
          dates: ''
        }
      }
      days.push(temp)
    }
    this.daysData = days

    // console.log(days)
  }
  prevMonth() {
    this.nowDate = this.nowDate.subtract(1, "month")
    this.getDaysInMonth(this.nowDate.month(), this.nowDate.year())
  }

  nextMonth() {
    this.nowDate = this.nowDate.add(1, "month")
    this.getDaysInMonth(this.nowDate.month(), this.nowDate.year())
  }


  dateClick(event, date) {
    if (date) {
      let hasClass = event.target.classList;
      if (hasClass.length) {
        event.target.classList.remove("green");
        this.selectedDateArray = this.selectedDateArray.filter(value => value != date)
      } else {
        event.target.classList.add("green");
        this.selectedDateArray = [...this.selectedDateArray, date]
      }
      this.afterClick.emit(this.selectedDateArray)
    }

  }

}
