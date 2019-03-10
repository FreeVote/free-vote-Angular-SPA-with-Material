import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { MatChipInputEvent } from '@angular/material';
import { COMMA, ENTER } from '@angular/cdk/keycodes';

@Component({
  selector: 'app-topic-edit',
  templateUrl: './topic-edit.component.html',
  styleUrls: ['./topic-edit.component.css']
})
export class TopicEditComponent implements OnInit {

  addOnBlur = true;

  readonly separatorKeysCodes: number[] = [ENTER, COMMA];

  @Input() Topics: string[] = [];

  @Output() TopicsChange = new EventEmitter<string[]>();

  constructor() { }

  ngOnInit() {
  }

  add(event: MatChipInputEvent): void {

    const input = event.input;

    // https://stackoverflow.com/questions/1981349/regex-to-replace-multiple-spaces-with-a-single-space
    let value = (event.value || '').trim().replace(/\s\s+/g, ' ').split(' ').join('-');

    // Add our tag
    // Ensured unique on server
    if (value) {
      if (value.charAt(0) !== '/') {
        value = '/' + value;
      }
      this.Topics.push(value.trim());
      console.log('TOPICS SELECTED', this.Topics);
    }

    // Reset the input value
    if (input) {
      input.value = '';
    }
  }

  remove(topic: string): void {
    const index = this.Topics.indexOf(topic);

    if (index >= 0) {
      this.Topics.splice(index, 1);
    }
  }



}
