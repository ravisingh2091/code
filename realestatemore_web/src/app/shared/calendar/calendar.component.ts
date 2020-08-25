import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'rps-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  daysData = []
  nowDate = moment()

  @Input() eventData: any
  @Output() availableClick = new EventEmitter<{}>()
  selectedDateArray = [];

  constructor() { }

  ngOnInit() {
    this.getDaysInMonth(this.nowDate.month(), this.nowDate.year())
    // console.log(this.eventData);
  }

  ngOnChanges() {
    this.getDaysInMonth(this.nowDate.month(), this.nowDate.year())
  }

  getDaysInMonth(month, year) {
    var date = new Date(Date.UTC(year, month, 1));
    var days = [];
    var temp = []
    while (date.getMonth() === month) {
      // `${new Date(date).getDate()}-${new Date(date).getMonth()}-${new Date(date).getFullYear()}`

      // date format to YYYY/MM/DD"
      let dateData = moment(date).format("YYYY/MM/DD")

      // check if event has
      let singleEvent = this.eventData.filter(value => moment(value.date).format("YYYY/MM/DD") === dateData)[0]

      // make week wise date array 
      temp[new Date(date).getDay()] = {
        dates: dateData,
        event: singleEvent
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

  availlableClick(event, date) {
    if (date) {
      let hasClass = []
      if (event.target.getAttribute("class")) {
        hasClass = event.target.getAttribute("class").split(" ");
      }

      if (hasClass.includes('Selected')) {
        event.target.classList.remove("Selected");
        this.selectedDateArray = this.selectedDateArray.filter(value => value != date)
      } else {
        event.target.classList.add("Selected");
        this.selectedDateArray = [...this.selectedDateArray, date]
      }
      this.availableClick.emit(this.selectedDateArray)
    }
  }


}
