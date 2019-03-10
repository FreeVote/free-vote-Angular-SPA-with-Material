import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


import { PointSelectionTypes } from '../../models/enums';
import { Point } from '../../models/point.model';

import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-points-menu',
  templateUrl: './my-points-menu.component.html',
  styleUrls: ['./my-points-menu.component.css']
})
export class MyPointsMenuComponent implements OnInit {

  PointSelectionTypes = PointSelectionTypes;

  point = new Point();

  constructor(private router: Router, private appDataService: AppDataService) { }

  ngOnInit() {

  }

  newTopic($event) {
    const slashTag = this.appDataService.TopicToSlashTag($event.onTopic);
    console.log('POINTS MENU - newSlashTag:', slashTag);
    this.router.navigateByUrl(slashTag);
  }

}
