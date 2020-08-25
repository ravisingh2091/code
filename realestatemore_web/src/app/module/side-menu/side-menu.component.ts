import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { environment } from 'src/environments/environment';
import { HeaderProvider } from 'src/app/services/header.provider';

@Component({
  selector: 'app-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.css']
})
export class SideMenuComponent implements OnInit {
  userId = localStorage.getItem("user_id")
  constructor(
    private apiService:ApiService,
    private headerProvider:HeaderProvider,
    private router:Router, 
  ) { }

  ngOnInit() {
  }
  logout(){
    let url = `${environment.api_url}mobile/logout`
    
    this.apiService.postData(url,{userId:this.userId}).subscribe(res=>{
        if(res.status =="true"){
          this.headerProvider.current.user_id = ""
          localStorage.clear()
          this.router.navigate(['/user/sign-in'])
        }
    })
  }
}
