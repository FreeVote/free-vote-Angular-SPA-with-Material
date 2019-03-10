

// Angular
import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';
import { Routes, RouterModule } from '@angular/router';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

// Material
import { MaterialModule } from './material.module';
import { FlexLayoutModule } from '@angular/flex-layout';

// Facebook
import { FacebookModule } from 'ngx-facebook';
import { FBTestComponent } from './fbtest/fbtest.component';

// Modules
import { PipesModule } from './pipesmodule/pipes.module';
import { TagsModule } from './tags/tags.module';
import { PublicModule } from './public/public.module';
import { PointsModule } from './points/points.module';

// Global Singleton Services imported from Services Module
// https://angular.io/guide/singleton-services
// https://stackoverflow.com/questions/51502757/angular-service-singleton-constructor-called-multiple-times

// Services: if decorated with "providedIn", no need to import and must NOT add to providers
// Only need to import LoginRouteGuardService as it's used in appRoots declaration
import { LoginRouteGuardService } from './services/login-route-guard.service'; // Needed in Routes below
// import { appDataService } from './services/coredata.service';
// import { HttpClientService } from './services/http-client.service';
// import { LocalStoreService } from './services/localstore.service';
// import { PointsService } from './services/points.service';
// import { TagsService } from './services/tags.service';

// App Components
import { AppComponent } from './app.component';
import { HomeComponent } from './public/home/home.component';
import { SignInComponent } from './public/sign-in/sign-in.component';

import { TagsMenuComponent } from './tags/tags-menu/tags-menu.component';
import { MyPointsMenuComponent } from './points/my-points-menu/my-points-menu.component';
import { PointOfTheWeekComponent } from './public/point-of-the-week/point-of-the-week.component';

const appRoutes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'points', component: MyPointsMenuComponent },
  { path: 'point-of-the-week', component: PointOfTheWeekComponent },
  // { path: 'my', loadChildren: './my/my.module#MyModule', canActivate: [LoginRouteGuardService] },
  { path: 'my/:tab', loadChildren: './my/my.module#MyModule', canActivate: [LoginRouteGuardService] },
  { path: 'join', component: SignInComponent },
  { path: 'sign-in', component: SignInComponent },
  { path: 'set-new-password/:email/:guid', component: SignInComponent },

  // slashtags is the "internal" link to TagsMenuComponent from which all TABS are accessible
  { path: 'slashtags', component: TagsMenuComponent }, // TAGS: TagsMenuComponent can handle tags, people or points

  // following are "external" links - need to be tested from url, not tab links
  { path: 'trending', component: TagsMenuComponent }, // TAGS
  { path: 'recent', component: TagsMenuComponent }, // TAGS personal - recent selection - works on anon?

  { path: 'by', component: TagsMenuComponent }, // PEOPLE: list of aliases only

  { path: 'by/:alias', component: TagsMenuComponent }, // TAGS: filtered list of tags

  { path: ':tag', component: TagsMenuComponent }, // POINTS: still like the SlashTag
  { path: 'on/:tag', component: TagsMenuComponent }, // POINTS: but also the "on" topic
  { path: 'by/:alias/on/:tag', component: TagsMenuComponent } // POINTS: filtered list of points (similar to slashtag)
];


@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    MaterialModule,
    FlexLayoutModule,
    FormsModule,
    ReactiveFormsModule, // ToDo Remove
    HttpClientModule,
    RouterModule.forRoot(appRoutes),
    FacebookModule.forRoot(),
    PipesModule,
    TagsModule,
    PublicModule,
    PointsModule
  ],
  declarations: [
    AppComponent,
    FBTestComponent
  ],
  // Singleton Services are provided in AppRoot
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule {

}
