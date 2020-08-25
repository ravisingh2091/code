import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css']
})
export class PaginationComponent implements OnInit {

  @Input() totalCount: number;
  @Input() disableNext: boolean;
  @Input() disablePrevious: boolean;
  @Output('selectedIndex') selectedPage = new EventEmitter<number>()

  constructor() {
  }

  ngOnInit() {
  }
  selectPage(e) {
    this.selectedPage.emit(e)
  }
}
