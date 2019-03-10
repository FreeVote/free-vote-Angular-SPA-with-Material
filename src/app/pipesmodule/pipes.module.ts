import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

import { MaterialModule } from '../material.module';

// CKEditor
import { CKEditorModule } from 'ng2-ckeditor';

// Pipes
import { TagDisplayPipe } from './pipes/tag-display.pipe';
import { NbspPipe } from './pipes/nbsp.pipe';
import { SafeURLPipe } from './pipes/safe-url.pipe';

// Components
import { DatepickerComponent } from './datepicker/datepicker.component';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    CKEditorModule,
    MaterialModule
  ],
  exports: [
    DatepickerComponent,
    NbspPipe,
    TagDisplayPipe,
    SafeURLPipe
  ],
  declarations: [
    TagDisplayPipe,
    NbspPipe,
    SafeURLPipe,
    DatepickerComponent
  ],
  providers: []
})
export class PipesModule {

}


