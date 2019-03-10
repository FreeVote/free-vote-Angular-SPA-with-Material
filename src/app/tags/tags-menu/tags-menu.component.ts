// Angular
import { Component, OnInit, OnDestroy, ViewChild, ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

// Material
import { MatTabChangeEvent } from '@angular/material';

// Model/Enums
import { TagCloudTypes, PointSelectionTypes } from '../../models/enums';

// Services
import { AppDataService } from '../../services/app-data.service';

// Components
import { PointsComponent } from '../../points/points/points.component';

@Component({
  selector: 'app-tags-menu',
  templateUrl: './tags-menu.component.html',
  styleUrls: ['./tags-menu.component.css']
})
export class TagsMenuComponent implements OnInit, OnDestroy {

  // Subscriptions
  private routeChangeSubscription: any;

  // Public variables for use in template
  public tabIndex = 0;

  public pointSelectionType = PointSelectionTypes.ByAliasOnTopic; // (SlashTags)
  public slashTag: string;
  public byAlias: string;
  public onTopic: string;

  public TagCloudTypes = TagCloudTypes;

  // use TRV in parent template https://stackblitz.com/edit/angular-vjbf4s?file=src%2Fapp%2Fcart-table-modal.component.ts
  // use child component type in parent component https://stackoverflow.com/questions/31013461/call-a-method-of-the-child-component
  @ViewChild(PointsComponent) appPoints: PointsComponent;

  constructor(
    private activatedRoute: ActivatedRoute,
    private appDataService: AppDataService) {
  }

  ngOnInit() {

    // EXTERNAL ROUTECHANGE (not tab change): Need to subscribe to route change to get route params
    // https://angular-2-training-book.rangle.io/handout/routing/routeparams.html

    this.routeChangeSubscription = this.activatedRoute.params.subscribe(params => {

      if (params['by']) {
        this.byAlias = params['by'];
      } else {
        this.byAlias = '';
      }

      if (params['tag']) { // !== undefined
        this.onTopic = params['tag'];
        this.appDataService.LastTopicSelected = this.onTopic;
      } else if (params['on']) {
        this.onTopic = params['on'];
      } else {
        this.onTopic = this.appDataService.LastTopicSelected;
      }

    });


    console.log('WHY ngOnInit?', this.appDataService.Route, '>', this.appDataService.Route.split('/')[1], '<');

    switch (this.appDataService.Route.split('/')[1]) {
      // may have separate tab for following
      case 'slashtags':
      case 'recent':
        this.tabIndex = 0;
        break;
      case 'trending':
        this.tabIndex = 1;
        break;
      case 'by':
        if (this.byAlias) {
          this.tabIndex = 3;
        } else { this.tabIndex = 2; }
        break;
      case 'on':
        this.tabIndex = 3;
        break;
      default:
        console.log('DEFAULTING');
        this.tabIndex = 4;
        break;
    }

  }


  // Topic (SlashTag) - emitted by tags component on tag click - which won't change route - even if routerLink used
  newTopic($event) {
    console.log('NEW Topic', $event.onTopic);
    this.pointSelectionType = PointSelectionTypes.ByAliasOnTopic;
    this.byAlias = '';
    this.SetTopicAndTitle($event.onTopic, 3);

    this.appPoints.SelectPoints();
  }

  // ByAlias
  newByAlias($event) {
    console.log('NEW ByAlias');
    this.pointSelectionType = PointSelectionTypes.ByAliasOnTopic;
    this.byAlias = $event.alias;
    this.SetTopicAndTitle(this.onTopic, 2);
  }

  // OnTopic emitted by the "On" and points components. byAlias remains the same
  newOnTopic($event) {
    console.log('NEW ByAlias OnTopic:', $event.onTopic);
    this.pointSelectionType = PointSelectionTypes.ByAliasOnTopic;
    this.SetTopicAndTitle($event.onTopic, 3);
  }

  tabChanged(event: MatTabChangeEvent) {
    console.log('MatTabChangeEvent:', event.index);
    this.SetTopicAndTitle(this.onTopic, event.index);
  }

  SetTopicAndTitle(onTopic: string, index: number) {

    console.log('SETTING INDEX', index);

    this.appDataService.LastTopicSelected = onTopic; // Don't worry it's sanitised
    this.onTopic = this.appDataService.LastTopicSelected; // sanitised
    this.slashTag = this.appDataService.LastTopicSelected; // sanitised

    this.tabIndex = index;

    switch (index) {

      case 0:
        this.appDataService.PageTitle = '/recent';
        break;

      case 1:
        this.appDataService.PageTitle = '/trending';
        break;

      case 2:
        this.appDataService.PageTitle = '/by';
        break;

      case 3:
        if (this.byAlias) {
          this.appDataService.PageTitle = `/by/${this.byAlias}/on/${this.onTopic}`;
        } else {
          this.appDataService.PageTitle = this.slashTag;
          console.log('SETTING PAGE TITLE', this.slashTag);
        }
        break;
    }
  }

  ngOnDestroy(): void {
    this.routeChangeSubscription.unsubscribe();
  }

}
