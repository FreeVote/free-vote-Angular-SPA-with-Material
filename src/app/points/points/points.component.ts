import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { ActivatedRoute } from '@angular/router';

import { SlideInOutAnimation } from '../../models/animations';

import { PointSelectionTypes } from '../../models/enums';
import { Point } from '../../models/point.model';
import { AppDataService } from '../../services/app-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { PointsService } from '../../services/points.service';

@Component({
  selector: 'app-points', // is router-outlet
  templateUrl: './points.component.html',
  styleUrls: ['./points.component.css'],
  animations: [SlideInOutAnimation],
  preserveWhitespaces: true // [DOESN'T WORK see component css - doesn't work in styles.css???]
  // for space between buttons - https://github.com/angular/material2/issues/11397
})
export class PointsComponent implements OnInit, OnDestroy {

  // Point Selection parameters - type, byAlias, onTopic
  @Input() pointSelectionType = PointSelectionTypes.MyPoints;
  @Input() byAlias: string;
  @Input() onTopic: string;

  @Output() newTopic = new EventEmitter(); // slashTags in TagsMenuComponent

  @Input() reselect: boolean;

  // Subscriptions
  private routeChangeSubscription: any;

  // Hidden functionality
  searchCriteria = 'out';
  toggleText = 'show search criteria';

  newPoint = false;

  // Typescript can help, but javascript still rules ???
  // Important that a new date object is created ???
  dateFrom = new Date(Date.now()); // Will be updated on selection
  dateTo = new Date(Date.now());
  defaultDates = true;
  containingText = '';

  // Public for use in template
  public points: Point[];
  public error: string;

  constructor(
    private activatedRoute: ActivatedRoute,
    public appDataService: AppDataService,
    private pointsService: PointsService,
    public localData: LocalDataService) {
  }

  ngOnInit() {

    this.routeChangeSubscription = this.activatedRoute.params.subscribe(params => {

      this.defaultDates = true;
      this.SelectPoints();

    });

  }

  toggleSearchCriteria() {

    this.searchCriteria = this.searchCriteria === 'out' ? 'in' : 'out';

    if (this.searchCriteria === 'in') {
      this.toggleText = 'hide search criteria';
    } else {
      this.toggleText = 'show search criteria';
    }
  }

  toggleNewPoint() {
    this.newPoint = !this.newPoint;
  }

  onSubmit() {
    // ToDo Change the URL
    this.SelectPoints();
  }


  SelectPoints() {

    // pointSelectionType is a bound Input value

    if (this.pointSelectionType === PointSelectionTypes.MyPoints) {
      this.onTopic = '';
      console.log('NOW select My Points');
    } else if (this.pointSelectionType === PointSelectionTypes.FavouritePoints) {
      this.onTopic = '';
      console.log('NOW select My Favourite');
    } else {
      console.log(`NOW select "${this.onTopic}" from ${this.dateFrom}`);
      this.onTopic = this.appDataService.SlashTagToTopic(this.onTopic);
    }

    this.pointsService.SelectPoints(
      this.pointSelectionType, this.byAlias, this.onTopic,
      this.defaultDates, this.dateFrom, this.dateTo, this.containingText)
      .then(
        response => {
          console.log('POINTS RETURNED', response);
          this.dateFrom = new Date(response.fromDate);
          this.dateTo = new Date(response.toDate);
          this.defaultDates = false;
          this.points = response.points;
        });
  }



  // New Point
  CancelNew() {
    this.newPoint = false;
  }

  CompleteEdit() {
    this.newPoint = false;
    this.SelectPoints();
  }

  onPointDeleted(id: number) {
    // this.SelectPoints(); No need to reselect.
    // Already deleted from server, now remove from the array
    // https://love2dev.com/blog/javascript-remove-from-array/
    this.points = this.points.filter(value => {
      return value.pointID !== id;
    });
  }

  altTopicSelected($event) {

    console.log('POINTS PLURAL - onTopic: ', $event.onTopic);
    this.onTopic = $event.onTopic;

    // The raised event will be handled differently depending on context
    // in the case of tags menu component - parent might cause child to reselect
    this.newTopic.emit({ onTopic: this.onTopic });
  }

  ngOnDestroy() {
    this.routeChangeSubscription.unsubscribe();
  }

}
