// Angular
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

// Material
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// Modules
import { PipesModule } from '../pipesmodule/pipes.module';
import { PointsModule } from '../points/points.module';

// Components
import { ByComponent } from './by/by.component';
import { TagsComponent } from './tags/tags.component';
import { TagsMenuComponent } from './tags-menu/tags-menu.component';

@NgModule({
  declarations: [
    ByComponent,
    TagsComponent,
    TagsMenuComponent],
  imports: [
    CommonModule,
    RouterModule,
    MaterialModule,
    FlexLayoutModule,
    PipesModule,
    PointsModule
  ],
  exports: [
    TagsComponent,
    TagsMenuComponent
  ]
})
export class TagsModule { }
