import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

import { SlideInOutAnimation } from '../../models/animations';

// Models & enums
import { Point, PointFeedback } from '../../models/point.model';
import { PointSupportLevels } from '../../models/enums';
import { PointTypesEnum } from '../../models/enums';

// Services
import { AppDataService } from '../../services/app-data.service';
import { PointsService } from '../../services/points.service';
import { LocalDataService } from '../../services/local-data.service';


@Component({
  selector: 'app-point',
  templateUrl: './point.component.html',
  styleUrls: ['./point.component.css'],
  preserveWhitespaces: true,
  animations: [SlideInOutAnimation]
})
export class PointComponent implements OnInit {

  @Input() point: Point;

  @Output() altTopicSelected = new EventEmitter();
  @Output() PointDeleted = new EventEmitter();

  // bind to point slashtags (not topic)
  slashTags: string[];  // = [<Tag>{ SlashTag: '/slash' }, <Tag>{ SlashTag: '/hash' }];

  editing = false;
  recommended = false;
  error: string;

  // https://stackoverflow.com/questions/37277527/how-to-use-enum-in-angular-2-templates
  // https://stackoverflow.com/questions/35923744/pass-enums-in-angular2-view-templates
  public PointTypesEnum = PointTypesEnum;

  constructor(private router: Router,
    private appDataService: AppDataService,
    private pointsService: PointsService,
    // localData used in template
    private localData: LocalDataService) {

  }


  ngOnInit() {
    // Angular Workshop filter is not a function

    // this.tags = this.tags.filter(x => x.SlashTag !== '/hash');

    // this.tags = this.point.Tags;

    // this.tags = this.point.Tags.filter((tag: Tag) => tag.SlashTag !== this.router.url);
    // this.tags = this.point.Tags.filter((tag, index, arr) => tag.SlashTag !== this.router.url);

    // function notThisRoute (element: Tag, index, array) { return element.SlashTag !== this.router.url; }
    // this.tags = this.point.Tags.filter(notThisRoute);

    // this.tags = this.point.Tags.filter(x => true);

    this.AssignTags();

    console.log('PointTypeID', this.point.pointTypeID);

    switch (this.point.pointTypeID) {
      case PointTypesEnum.RecommendedReading:
      case PointTypesEnum.RecommendedListening:
      case PointTypesEnum.RecommendedViewing:
        this.recommended = true;
        break;
      default:
        this.recommended = false;
        break;
    }

  }

  AssignTags() {
    // Filter out current tag
    // LastTagSelected updated as soon as tag clicked
    this.slashTags = this.point.slashTags.filter(tag => tag !== this.appDataService.LastSlashTagSelected);
    console.log('ASSIGN TAGS:', this.point.slashTags, 'ROUTER.URL.ToFilter:',
      this.router.url, 'LastTagSelected:', this.appDataService.LastTopicSelected);
  }

  PointFeedback(pointSupportLevel: PointSupportLevels) {

    if (!this.point.pointFeedback.feedbackIsUpdatable) {
      alert('Feedback is not updatable');
    } else {

      if (this.point.pointFeedback.supportLevelID === pointSupportLevel) {
        // If clicked on the current support level then delete it
        if (confirm('Are you sure you wish to delete your feedback?')) {
          pointSupportLevel = PointSupportLevels.None;
        } else {
          return; // Cancel feedback delete
        }
      }

      this.pointsService.PointFeedback(this.point.pointID, pointSupportLevel, '', false)
        .then(response => {
          console.log('FEEDBACK API RESPONSE', response);
          this.point.pointFeedback = response as PointFeedback;
          console.log('CLIENT DATA UPDATED PointSupportlevel: ', this.point.pointFeedback.supportLevelID);
        })
        .catch(serverError => {
          console.log('PointFeedback Error', serverError);
          this.error = serverError.error.error;
        });

    }
  }

  WoW() {

    console.log('BEGIN WoW');

    // ToDo Angular Workshop: Cannot read property 'name' of undefined
    // point.SupportLevelID was a number. Loosely typed

    // This is the conditional first step, mandatory second step conundrum
    // Now no recursion - allow business layer to handle

    // Allow business layer to handle support if WoWing
    // if (!this.point.PointFeedback.WoWVote && this.point.PointFeedback.SupportLevelID !== PointSupportLevels.Support) {
    //   console.log('10-6: ', this.point.PointFeedback.SupportLevelID);
    //   this.PointFeedback(PointSupportLevels.Support).then(
    //     success => {
    //       console.log(success, 'Success PointSupportlevel: ', this.point.PointFeedback.SupportLevelID);
    //       this.WoW();
    //     },
    //     fail => console.log('fail: ', fail));
    // } else {

    // Update WoW
    console.log('CAN now WoW');
    this.pointsService.PointWoWVote(this.point.pointID, !this.point.pointFeedback.woWVote)
      .then(
        pointFeedback => {
          this.point.pointFeedback = pointFeedback; // Toggle the WoW vote
        });
  }

  Support() {
    this.PointFeedback(PointSupportLevels.Support);
  }

  Neutral() {
    // this.point.pointFeedback.woWVote = false;
    this.PointFeedback(PointSupportLevels.StandAside);
  }

  Oppose() {
    // this.point.pointFeedback.woWVote = false;
    this.PointFeedback(PointSupportLevels.Oppose);
  }

  Report() {
    // this.point.pointFeedback.woWVote = false;
    this.PointFeedback(PointSupportLevels.Report);
  }



  edit() {
    this.editing = true;
  }

  delete() {
    if (confirm('Are you sure you wish to delete this point?')) {
      this.pointsService.PointDelete(this.point.pointID)
        .then(
          // not looking at any result <<<
          result => this.PointDeleted.next(this.point.pointID)
        )
        .catch(serverError => {
          this.error = serverError.error.error;
          console.log(this.error);
        });
    }
  }


  // altTags no longer have routerlink - we will be staying on same TagsMenuComponent - just changing tab
  // use component interaction instead - emit newTopic
  altSlashTagSelect(slashTag: string) {
    console.log('POINT SINGULAR - slashTagSelected:', slashTag);
    this.appDataService.LastSlashTagSelected = slashTag;
    this.altTopicSelected.emit({ onTopic: this.appDataService.LastTopicSelected });
  }

  favourite() { alert('favourite'); }

  onCancelEdit() {
    this.editing = false;
  }

  onCompleteEdit() {
    this.AssignTags();
    this.editing = false;
  }

}
