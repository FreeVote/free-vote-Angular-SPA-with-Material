import { Component, OnInit, Output, EventEmitter } from '@angular/core';

// Model
import { ByOn } from '../../models/ByOn.model';

// Service
import { TagsService } from '../../services/tags.service';

@Component({
  selector: 'app-by',
  templateUrl: './by.component.html',
  styleUrls: ['./by.component.scss'],
  preserveWhitespaces: true
})
export class ByComponent implements OnInit {

  @Output() newByAlias = new EventEmitter();
  @Output() newOnTopic = new EventEmitter();

  byAliases: ByOn[];
  onTopics: ByOn[];
  byAlias: string;

  // https://stackoverflow.com/questions/37891752/angular2-add-class-to-item-on-click/37891984
  hightlightStatus: Array<boolean> = [];

  constructor(private tagsService: TagsService) { }

  ngOnInit() {

    console.log('INIT ByOn');

    this.tagsService.ByAliases('1 jan 2000', '31 dec 2020').then(response => {
      this.byAliases = response;
      console.log('By', this.byAliases);
    });
  }

  FontSize(Weight: number): string {
    return 100 + Weight * 50 + '%'; // perCent
  }

  clickByAlias(byAlias: string, index: number) {

    this.byAlias = byAlias;
    this.newByAlias.emit({ alias: byAlias });
    this.ListTopicsByAlias(byAlias);

    this.hightlightStatus[index] = !this.hightlightStatus[index];
    for (let i = 0; i < this.hightlightStatus.length; i++) {
      if (i !== index) { this.hightlightStatus[i] = false; }
    }
  }


  ListTopicsByAlias(byAlias: string) {

    this.tagsService.TopicsByAlias(byAlias, '1 jan 2000', '31 dec 2020').then(response => {
      this.onTopics = response;
      console.log('ByOn', this.onTopics);
    });
  }


  clickOnTopic(onTopic: string) {
    console.log('THIS IS THE TOPIC SELECTED:', onTopic);
    this.newOnTopic.emit({ onTopic: onTopic });
  }

}
