import { Component, OnInit } from '@angular/core';

import {AppDataService} from '../../services/app-data.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {

  constructor(private appDataService: AppDataService) { }

  ngOnInit() {

  }

}
