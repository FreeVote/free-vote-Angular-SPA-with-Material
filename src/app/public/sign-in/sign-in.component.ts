import { Component, ViewChild } from '@angular/core';
import { formatDate } from '@angular/common';
import { OnInit, OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ActivatedRoute, Router } from '@angular/router';

import { Subscription } from 'rxjs';
// import 'rxjs/add/operator/map'; //removed (angular 6)
// https://stackoverflow.com/questions/34515173/angular-2-http-get-with-typescript-error-http-get-map-is-not-a-function-in

import { SignInStatuses } from '../../models/enums';
import { AppDataService } from '../../services/app-data.service';
import { LocalDataService } from '../../services/local-data.service';
import { SignInService } from '../../services/sign-in.service';

@Component({
  selector: 'app-sign-in',
  templateUrl: './sign-in.component.html',
  styleUrls: ['./sign-in.component.css']
})
export class SignInComponent implements OnInit, OnDestroy {

  @ViewChild('tvPassword') cvPassword;

  // For use in the template
  public SignInStatuses = SignInStatuses;

  // Subscriptions
  signInStatusChange$: Subscription;

  email: string;
  password: string;
  passwordView = 'password';
  passwordVisibility = 'visibility';
  passwordViewText = 'view';

  requestPending = false;
  registrationSuccess = false;

  signInMessage = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    public router: Router,
    private signInService: SignInService,
    private localStore: LocalDataService) {

    console.log('SIGN-IN constructed:');
  }

  ngOnInit() {

    // Subscribe to the SignInStatus change OnInit - only one subscription, not on each button click
    // SignInStatusChange is a BehaviourSubject - you will always get an initial value

    this.Clear();

    if (!this.signInStatusChange$) {
      this.signInStatusChange$ = this.signInService.SignInStatusChange$.subscribe(
        response => {

          this.requestPending = false;

          this.localStore.AssignServerValues(response);

          this.localStore.SaveValues(); // signInData.Save is not a function

          console.log('SignInComponent BEHAVIOURSUBJECT Initial or Changed Status:', this.localStore.signInResult);

          this.signInMessage = this.localStore.message;

          switch (this.localStore.signInResult) {
            case SignInStatuses.SignInSuccess:
              console.log('SignIn Success');
              this.router.navigateByUrl('following');
              break;
            case SignInStatuses.SignInSuccessTicket:
              console.log('SignIn Success with Ticket');
              this.router.navigateByUrl('my/password');
              break;
            case SignInStatuses.RegistrationSuccess:
              this.registrationSuccess = true;
              break;
            case SignInStatuses.IPAddressBlocked:
              console.log('IP Address is blocked: ');
              break;
            default:
              console.log('SIGN IN ERROR: ', this.localStore.signInResult);
          }

        },
        error => { this.signInMessage = error; }
      );
    }

    if (this.router.url.includes('set-new-password')) {
      this.email = this.activatedRoute.snapshot.paramMap.get('email');
      const guid = this.activatedRoute.snapshot.paramMap.get('guid');

      // already subscribed to sign in status change
      this.signInService.SignInWithTicket(this.email, guid);
    }

    // if (!this.routeChange$) {
    //   console.log ('SIGN_IN set up rc sub');
    //   this.routeChange$ = this.router.events.pipe(
    //     filter(event => event instanceof NavigationEnd))
    //     .subscribe(() => {
    //       // ensure we don't retain previous error
    //       this.signInError = '';
    //       console.log('SIGN-IN ROUTE CHNAGE');
    //     });
    // }

  }

  Clear() {
    this.localStore.SignedOut();
    this.signInMessage = '';
    this.registrationSuccess = false;
  }

  onSubmit() {

    this.Clear();
    this.requestPending = true;

    // SignIn - we'll be notified of result in Subscription
    this.signInService.SignIn('free.vote', this.email, this.password);
  }

  resetPassword() {
    this.signInService.SignInTicketRequest(this.email);
  }

  view() {
    if (this.passwordView === 'password') {
      this.passwordView = 'text';
      this.passwordViewText = 'hide';
      this.passwordVisibility = 'visibility_off';
    } else {
      this.passwordView = 'password';
      this.passwordViewText = 'view';
      this.passwordVisibility = 'visibility';
    }
    console.log(this.passwordView);
  }

  ngOnDestroy() {

    // might leave page and destroy without calling onSubmit
    if (this.signInStatusChange$ !== undefined) {
      this.signInStatusChange$.unsubscribe();
    }

    // if (this.routeChange$) {
    //   this.routeChange$.unsubscribe();
    // }

  }


}


// https://blog.angular-university.io/how-to-build-angular2-apps-using-rxjs-observable-data-services-pitfalls-to-avoid/
