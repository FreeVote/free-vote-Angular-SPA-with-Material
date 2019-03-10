import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Material
import { MatTabChangeEvent } from '@angular/material';

import { AppDataService } from '../../services/app-data.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {

  public tabIndex = 0;
  private tabSelected: string;

  constructor(private activatedRoute: ActivatedRoute,
    private appDataService: AppDataService) {

  }

  ngOnInit() {

    this.tabSelected = this.activatedRoute.snapshot.params['tab'];

    console.log('TAB Selected', this.tabSelected);

    if (!this.tabSelected) {
      this.tabSelected = '';
    }

    if (this.tabSelected === 'groups') {
      this.tabIndex = 1;
    } else if (this.tabSelected === 'password') {
      this.tabIndex = 2;
    } else {
      this.tabIndex = 0;
    }

  }

  tabChanged(event: MatTabChangeEvent) {
    switch (event.index) {
      case 0:
        this.appDataService.PageTitle = '/my/details';
        break;
      case 1:
        this.appDataService.PageTitle = '/my/groups';
        break;
      case 2:
        this.appDataService.PageTitle = '/my/password';
        break;
    }
  }

}
