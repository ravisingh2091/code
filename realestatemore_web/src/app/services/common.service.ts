import { Injectable, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';


@Injectable({
  providedIn: 'root'
})
export class CommonService {
  language
  constructor(
    private toastr: ToastrService
  ) {
  }

  _showLoader: EventEmitter<boolean> = new EventEmitter<boolean>(true);
  _lang: EventEmitter<any> = new EventEmitter<any>();

  set showLoader(val: boolean) {
    this._showLoader.emit(val);
  }

  set lang(val: any) {
    this._lang.emit(val);
  }




  succ(msg) {
    this.toastr.success(msg);
  }
  err(msg) {
    this.toastr.error(msg);
  }

}