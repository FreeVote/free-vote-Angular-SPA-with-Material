import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
// import { } from '@angular/router';

import { AppDataService } from '../../services/app-data.service';
import { TagsService } from '../../services/tags.service';

import { Tag } from '../../models/tag.model';

// import { SlideInOutAnimation } from '../../models/animations';
import { TagCloudTypes } from '../../models/enums';


@Component({
  selector: 'app-tags', // is used as both a regular component and a router-outlet
  templateUrl: './tags.component.html',
  styleUrls: ['./tags.component.css'],
  providers: [], //  Need HttpClientService as well as TagsService. NO: do not decorate components with service providers.
  preserveWhitespaces: true
  // animations: [SlideInOutAnimation]
})
export class TagsComponent implements OnInit {

  tagCloudType = TagCloudTypes.Trending;
  tags: Tag[];

  animationState = 'in'; // ie visible
  hideTags = false;
  toggleText = 'hide tags';

  @Output() get state() { return this.animationState; }
  @Output() newOnTopic = new EventEmitter();

  @Input()
  set Type(value: TagCloudTypes) {
    this.tagCloudType = value;
  }

  constructor(private appDataService: AppDataService, private tagsService: TagsService) {
    console.log('constructed');
  }

  ngOnInit() {

    this.tagsService.TagCloud(this.tagCloudType).then(response => {
      this.tags = response;
    });
  }

  FontSize(Weight: number): string {
    return 100 + Weight * 50 + '%'; // perCent
  }

  slideInOut() {
    console.log('toggling');
    if (this.animationState === 'out') {
      this.animationState = 'in';
      this.toggleText = 'hide tags';
    } else {
      this.animationState = 'out';
      this.toggleText = 'show tags';
    }
  }

  hide() {
    console.log('hiding - animationState=out');
    this.hideTags = true; // instantly hide, but slide in as well
    if (this.animationState === 'in') {
      this.animationState = 'out';
      this.toggleText = 'show tags';
    }
  }

  show() {
    console.log('showing - animationState=in');
    this.hideTags = false;
    if (this.animationState === 'out') {
      this.animationState = 'in';
      this.toggleText = 'hide tags';
    }
  }

  clickNewTopic(onTopic: string) {

    // routerLink="{{ tag.slashTag }}"
    // We're not changing the route- just the tab selected - all routes handled by TagsMenuComponent

    console.log('TAGS Component - newTopic', onTopic);
    this.appDataService.LastTopicSelected = onTopic;
    this.newOnTopic.emit({ onTopic: onTopic });

  }

}
