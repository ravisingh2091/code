
import { Injectable } from "@angular/core";


@Injectable()
export class HeaderProvider {
    current: Current;

    constructor() {
        this.current = new Current();
    }

}
export class Current {
    user_id: any = localStorage.getItem('user_id');

    constructor() {
    }
}