import { Point } from './../../models/point.model';
import { PointTypesEnum } from './../../models/enums';
import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

import { SlideInOutAnimation } from '../../models/animations';

import { AppDataService } from '../../services/app-data.service';
import { PointsService } from './../../services/points.service';

// import { PointEdit } from '../../models/point.model';
import { Kvp } from '../../models/kvp.model';

@Component({
  selector: 'app-point-edit',
  templateUrl: './point-edit.component.html',
  styleUrls: ['./point-edit.component.css'],
  animations: [SlideInOutAnimation],
  preserveWhitespaces: true
})
export class PointEditComponent implements OnInit {

  // This is all that's needed for 2 way binding + the emit
  @Input() point: Point;
  @Output() pointChange = new EventEmitter();

  @Output() CancelEdit = new EventEmitter();
  @Output() CompleteEdit = new EventEmitter();

  selectedPointType: PointTypesEnum;

  error: string;
  userTouched = false;

  // pointTypes: Array<[number, string]>;
  // https://stackoverflow.com/questions/47079366/expression-has-changed-after-it-was-checked-during-iteration-by-map-keys-in-angu/50749898
  pointTypes: Kvp[];
  quoteSourceAnimationState: string;
  videoAnimationState: string;

  // https://stackoverflow.com/questions/47079366/expression-has-changed-after-it-was-checked-during-iteration-by-map-keys-in-angu/50749898
  // pointKeys: IterableIterator<number>;

  config = {
    toolbar:
      [
        ['SpellChecker', 'Bold', 'Italic', 'Underline'], ['TextColor', 'BGColor'],
        ['NumberedList', 'BulletedList'], ['JustifyLeft', 'JustifyCenter', 'JustifyRight', 'JustifyBlock'],
        ['Link', 'Unlink'], ['Image', 'Table', 'HorizontalRule', 'SpecialChar'],
        ['Format', 'Font', 'FontSize']
      ]
  };

  constructor(private appDataService: AppDataService, private pointsService: PointsService) {
    // Must provide default values to bind before ngOnOnit
    // Host can override with Input value
  }

  ngOnInit() {

    if (!this.point) { this.point = new Point(); }

    this.pointTypes = this.appDataService.PointTypes;

    this.autoShowLinkEdit(this.point.pointTypeID);

    this.videoAnimationState = this.point.youTubeID ? 'in' : 'out';

    if (this.point.slashTags.length === 0) {
      this.point.slashTags.push(this.appDataService.LastTopicSelected);
    }

  }

  onCKEBlur() { this.userTouched = true; }

  addVideo() {
    this.videoAnimationState = 'in';
  }

  removeVideo() {
    this.point.youTubeID = '';
    this.videoAnimationState = 'out';
  }

  onSubmit() {

    // if the full url has been pasted get the id after the "="
    // What about tiny urls without the = but with the id?

    this.pointsService.PointUpdate(this.point)
      .then(response => {
        this.point = response;
        console.log('GC', response);
        this.pointChange.emit(this.point);
        this.CompleteEdit.next();
      })
      .catch(serverError => {
        this.error = serverError.error.error;
      });
  }


  Cancel() {
    this.CancelEdit.next();
  }

  autoShowLinkEdit(pointTypeID: PointTypesEnum) {

    // Automatically show link input for certain point types

    switch (pointTypeID) {
      case PointTypesEnum.Quote:
      case PointTypesEnum.Petition:
      case PointTypesEnum.RecommendedReading:
      case PointTypesEnum.RecommendedListening:
      case PointTypesEnum.RecommendedViewing:
        this.showLinkEdit();
        break;
      default:
        this.hideLinkEdit();
        break;
    }
  }

  onPointTypeChange(pointTypeID: PointTypesEnum) {
    this.autoShowLinkEdit(pointTypeID);
  }

  showLinkEdit() {
    this.quoteSourceAnimationState = 'in';
  }

  hideLinkEdit() {
    this.quoteSourceAnimationState = 'out';
    this.point.source = '';
    this.point.url = '';
  }

  clicked() {
    alert('clicked');
  }

}
