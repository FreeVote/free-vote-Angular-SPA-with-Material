import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';

// Material
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PipesModule } from '../pipesmodule/pipes.module';

import { HomeComponent } from './home/home.component';
import { MenuComponent } from './menu/menu.component';
import { PointOfTheWeekComponent } from './point-of-the-week/point-of-the-week.component';
import { SelectedTagComponent } from './selected-tag/selected-tag.component';
import { SignInComponent } from './sign-in/sign-in.component';

@NgModule({
  declarations: [
    HomeComponent,
    MenuComponent,
    PointOfTheWeekComponent,
    SelectedTagComponent,
    SignInComponent
  ],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    MaterialModule,
    FlexLayoutModule,
    PipesModule
  ],
  exports: [
    MenuComponent
  ]
})
export class PublicModule { }
