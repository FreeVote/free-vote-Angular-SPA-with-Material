import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Routes, RouterModule } from '@angular/router';

import { FormsModule } from '@angular/forms';

// Material
import { MaterialModule } from '../material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

import { PasswordComponent } from './password/password.component';
import { DetailsComponent } from './details/details.component';
import { GroupMembershipComponent } from './group-membership/group-membership.component';
import { ProfileComponent } from './profile/profile.component';
import { PointOfTheWeekVoteComponent } from './point-of-the-week-vote/point-of-the-week-vote.component';

const routes: Routes = [
  { path: '', component: ProfileComponent }
];

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    RouterModule.forChild(routes),
    MaterialModule,
    FlexLayoutModule
  ],
  declarations: [
    PasswordComponent,
    DetailsComponent,
    GroupMembershipComponent,
    ProfileComponent,
    PointOfTheWeekVoteComponent]
})
export class MyModule { }
