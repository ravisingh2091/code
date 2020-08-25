import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
@Component({
  selector: 'app-edit-properties',
  templateUrl: './edit-properties.component.html',
  styleUrls: ['./edit-properties.component.css']
})
export class EditPropertiesComponent implements OnInit {


  propertyId: string;
  type: string;
  constructor(

    private route: ActivatedRoute
  ) {
    this.propertyId = this.route.snapshot.paramMap.get('property_id')
    this.type = this.route.snapshot.paramMap.get('type')
  }



  ngOnInit() {

  }

}
