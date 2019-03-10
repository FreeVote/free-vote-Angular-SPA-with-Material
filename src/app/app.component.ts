
import { Component, ViewChild, ElementRef } from '@angular/core';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Router, NavigationEnd } from '@angular/router';

import { Subscription } from 'rxjs';
import { filter } from 'rxjs/operators';

import { AppDataService } from './services/app-data.service';
import { LocalDataService } from './services/local-data.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit, OnDestroy {

  // Subscriptions
  private routeChange$: Subscription;

  // Shared values - should be in appDataService??
  appTitle = 'https://free.vote';
  strapline = 'express yourself honestly, disagree without fear, agree without favour';

  @ViewChild('tvSlashTag') tvSlashTag: ElementRef;

  enterSlashTag = false;
  private slashTag: string;

  editSlashTag(typeIt: boolean): void {
    console.log('TypeIt:', typeIt);
    this.enterSlashTag = typeIt;
    if (typeIt) { this.slashTag = '/'; } else { this.slashTag = ''; }
    window.setTimeout(() => this.tvSlashTag.nativeElement.focus(), 250);
  }


  slashTagChanged() {
    let value = this.slashTag;
    while (value.indexOf('  ') !== -1) { value = value.replace('  ', ' '); } // replace all double spaces with single space
    value = value.split(' ').join('-'); // replace all spaces with dashes - could still leave double dashes
    while (value.indexOf('--') !== -1) { value = value.replace('--', '-'); } // replace all double dashes with single dash
    value = value.replace('/-', '/'); // slashTag can't begin with a dash
    while (value.indexOf('/') !== -1) { value = value.replace('/', ''); } // remove all slashes - can't be mid string
    this.slashTag = '/' + value; // but it must start with a slash
  }

  constructor(private router: Router,
    public appDataService: AppDataService,
    private localStore: LocalDataService) { } // inject to ensure constructed and values Loaded



  ngOnInit() {

    // Can the following be supoerceded by new subscription on coredata.service?

    // Angular Workshop https://stackoverflow.com/questions/33520043/how-to-detect-a-route-change-in-angular
    // The app component is the main route change detector. It can then dispense this throughout the app via coredata service
    this.routeChange$ = this.router.events.pipe(
      filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // You only receive NavigationStart events
        const url = this.router.url;
        this.appDataService.Route = url;

        console.log('App.component NavigationEnd:', this.router.url);

        if (url.includes('sign-in-ticket')) {
          this.appDataService.PageTitle = '/sign-in-ticket';
        } else if (url.includes('my/password')) {
          this.appDataService.PageTitle = 'my/password';
        } else if (url.includes('set-new-password')) {
          this.appDataService.PageTitle = 'set-new-password';
        } else {
          this.appDataService.PageTitle = this.router.url;
        } // Always - inc slash

        // A snapshot is not going to work in app component -  initilaised once
        // but we are in a call back ...
        // const slashTag = this.activatedRoute.snapshot.params['tag'];
        // console.log('SlashTag:', slashTag);
        // if (slashTag !== undefined) {
        //   this.pageTitleToolTip = 'slash tag ' + slashTag;
        //   this.lastTagSelected = slashTag; // now it's bound to app-menu component input property
        // }

      });


    // this.activatedRoute.params.subscribe(params => { console.log('Le Tag:', params['tag']); });

    // this.activatedRoute.paramMap.subscribe(params => {
    //   console.log('tag change detected');
    //   // const tag = params['tag'];
    //   // if (tag) { this.menuComponent.LastTagSelected = tag; }
    // });

    // // Combine them both into a single observable
    // const urlParams = Observable.combineLatest(
    //   this.activatedRoute.params,
    //   this.activatedRoute.queryParams,
    //   (params, queryParams) => ({ ...params, ...queryParams })
    // );

    // // Subscribe to the single observable, giving us both
    // urlParams.subscribe(routeParams => {
    //   // routeParams containing both the query and route params
    //   const tag = routeParams.tag;
    //   if (tag) { this.lastTagSelected = tag; }
    // });


    // The app component can't detect route parameter changes handled by another (child) component
    // The app component needs to subscribe to the coreData Service to receive tag changes
    // this.tagChangeSubscription = this.appDataService.SlashTagChange$
    //   .subscribe(isSlashTag => {
    //     console.log(isSlashTag);
    //     this.pageTitleToolTip = (isSlashTag ? 'slash tag ' : '') + this.pageTitle.replace('/', '');
    //   });

    this.appDataService.GetPointTypes();

    this.appDataService.GetLastTopicSelected();
  }

  showTagPoints() {
    // this.appDataService.PageTitle = '/' + this.slashTag;

    // Remove trailing dash after user finished typing
    let value = this.slashTag;
    if (value[value.length - 1] === '-') { value = value.substr(0, value.length - 1); }
    this.slashTag = value;

    this.router.navigateByUrl('/' + this.slashTag);
    this.enterSlashTag = false;
    this.slashTag = '';
  }

  ngOnDestroy() {
    this.routeChange$.unsubscribe();
  }

}
