// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';

// Material
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// CKEditor
import { CKEditorModule } from 'ng2-ckeditor';

// App Modules
import { PipesModule } from '../pipesmodule/pipes.module';

// Components
import { PointsComponent } from './points/points.component';
import { PointComponent } from './point/point.component';
import { PointEditComponent } from './point-edit/point-edit.component';
import { MyPointsMenuComponent } from './my-points-menu/my-points-menu.component';
import { TopicEditComponent } from './topic-edit/topic-edit.component';


@NgModule({
  declarations: [
    PointComponent,
    PointsComponent,
    PointEditComponent,
    MyPointsMenuComponent,
    TopicEditComponent
  ],
  imports: [
    CommonModule,
    FormsModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    CKEditorModule,
    PipesModule
  ],
  exports: [
    PointsComponent,
    PointComponent,
    PointEditComponent]
})
export class PointsModule { }
