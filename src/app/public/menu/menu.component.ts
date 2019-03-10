import { LocalDataService } from '../../services/local-data.service';
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';

import { Subscription } from 'rxjs';

import { SignInStatuses } from '../../models/enums';
// import { LoginRouteGuardService } from '../../services/login-route-guard.service'; // currently needed in Routes below
import { SignInService } from '../../services/sign-in.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent implements OnInit, OnDestroy {

  TagURLs: string[] = ['/trending', '/my/following'];
  PointURLs: string[] = ['/my/favourite-points', '/my/points', '/my/new-point', '/point-of-the-week', '/my/point-of-the-week-vote'];
  MyURLs: string[] = ['/my/location', '/my/details', '/my/group-membership', '/my/password'];

  signedIn = false;
  lastTagSelected = '';

  signInStatusChangeSubscription: Subscription;
  slashTagChangeSubscription: Subscription;

  tabLoadTimes: Date[] = [];


  constructor(
    private router: Router,
    private signInService: SignInService,
    private localStore: LocalDataService) {
  }

  ngOnInit() {
    // https://angular-2-training-book.rangle.io/handout/routing/routeparams.html
    // https://stackoverflow.com/questions/37144999/angular2-get-router-params-outside-of-router-outlet

    // this.tagChangeSubscription = this.appDataService.GetTagDisplay()
    //   .subscribe(tagDisplay => {
    //     console.log('MENU SelectedTag Received', tagDisplay);
    //     this.selectedTag = tagDisplay;
    //   });

    // get sign in staus on launch
    this.signedIn = this.localStore.IsSignedIn();

    // Subscribe to SignInStatus change
    this.signInStatusChangeSubscription = this.signInService.SignInStatusChange$
      .subscribe(singInData => {
        this.signedIn = singInData.signInResult === SignInStatuses.SignInSuccess
          || singInData.signInResult === SignInStatuses.SignInSuccessTicket;
      });

    // Subscribe to pageTitle change
    // this.slashTagChangeSubscription = this.appDataService.SlashTagChang
    //   .subscribe(isSlashTag => {
    //     if (isSlashTag) {
    //       this.lastTagSelected = this.appDataService.Route;
    //     }
    //   });

  }


  getTimeLoaded(index: number) {
    if (!this.tabLoadTimes[index]) {
      this.tabLoadTimes[index] = new Date();
    }

    return this.tabLoadTimes[index];
  }


  isActive(link): boolean {
    // console.log(this.SelectedTag + ' ' + this.activatedRoute.url);
    switch (link) {
      case 'tags': {
        return this.TagURLs.indexOf(this.router.url) > -1
          || this.lastTagSelected !== '' && this.lastTagSelected === this.router.url.replace('/', '');
      }
      case 'points': {
        return this.PointURLs.indexOf(this.router.url) > -1;
      }
      case 'profile': {
        return this.MyURLs.indexOf(this.router.url) > -1;
      }
      default: {
        return link === this.router.url;
      }
    }
  }


  signOut() {
    this.signInService.SignOut();

    this.router.navigateByUrl('/sign-in');
    // Nice idea to only redirect if sign in required, but nope - user won't expect to remain on public page even if possible
    // if (this.loginRouteGuardService.requiresLogin(this.router.url)) { }
  }


  ngOnDestroy() {
    this.signInStatusChangeSubscription.unsubscribe();
    this.slashTagChangeSubscription.unsubscribe();
  }

}
