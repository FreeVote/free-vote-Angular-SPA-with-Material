import { Injectable } from '@angular/core';

import { Observable, BehaviorSubject } from 'rxjs';

// Models
import { Profile } from '../models/profile.model';

// Services
import { RemoteDataService } from './remote-data.service';
import { LocalDataService } from './local-data.service';

@Injectable({
  providedIn: 'root'
})
export class SignInService {

  public SignInStatusChange$: BehaviorSubject<LocalDataService>; // No need to pass value - all components have acess to singleton store

  constructor(private remoteDataService: RemoteDataService,
    private localStore: LocalDataService) {

    this.SignInStatusChange$ = new BehaviorSubject<LocalDataService>(this.localStore);

  }

  // Consolidated Authentication Service and Core Data Service
  // Authentication Servce was just SignIn, SignOut and SignInStatus change detection
  // SignInStatus (SignedIn) needs to be part of CoreData Service

  SignIn(website: string, email: string, password: string): void {

    const data = { 'website': website, 'email': email, 'password': password };

    // console.log('CDS SignIn', data);

    this.remoteDataService
      .post('authentication/signin/', data)
      // .map(response => response.json()); //assumed - not needed
      .then(response => {


        this.localStore.AssignServerValues(response); /// but new sessionid is not returned so can't be assigned (that's OK)
        this.localStore.SaveValues();

        console.log('SignIn/Register SERVER RESPONSE: ', this.localStore);

        // http://stackoverflow.com/questions/32896407/redirect-within-component-angular-2
        // Save SignInData with JWT as cookie, not in local storage <<< REVERSE THAT
        // if (signInData.signInResult === SignInStatuses.SignInSuccess) {
        //   localStorage.setItem('SignInData', JSON.stringify(signInData));
        // }

        // Notify all observers
        this.SignInStatusChange$.next(this.localStore);

        // console.log('observers notified');
      },
        error => {
          console.log('Sign-In Error: ', error.error);
        });
  }

  SignOut() {
    this.localStore.SignedOut();
    this.SignInStatusChange$.next(this.localStore); // No Need
    this.remoteDataService.SessionKeepAlive(); // KeepAlive on SignOut
  }

  SignInTicketRequest(email: string): void {

    // console.log('CDS SignIn', data);
    this.SignOut(); // necessary? Should already be signed out

    this.remoteDataService
      .get('authentication/signinticketrequest/' + email)
      .then(response => {

        this.localStore.AssignServerValues(response);

        console.log('SignInTicketRequest SERVER RESPONSE: ', this.localStore);

        // http://stackoverflow.com/questions/32896407/redirect-within-component-angular-2
        // Save SignInData with JWT as cookie, not in local storage
        // This won't have a full JWT - this is just a ticket REQUEST to be emailed
        this.localStore.SaveValues();

        // Notify all observers
        this.SignInStatusChange$.next(this.localStore);

      },
        error => {
          console.log('Sign-In Error: ', error.error);
        });
  }

  SignInWithTicket(email: string, guid: string): void {

    this.SignOut(); // necessary? Should already be signed out

    this.remoteDataService
      .get('authentication/signinwithticket/' + email + '/' + guid)
      .then(response => {

        console.log('SignInWithTicket SERVER RESPONSE: ', response);

        // Assign server response values to localStore
        this.localStore.AssignServerValues(response);

        console.log('SignInWithTicket AssignServerValues: ', this.localStore);

        // http://stackoverflow.com/questions/32896407/redirect-within-component-angular-2
        // Save SignInData with JWT as cookie, not in local storage <<< REVERSED
        this.localStore.SaveValues();

        // Notify all observers
        this.SignInStatusChange$.next(this.localStore);

      },
        error => {
          console.log('Sign-In Error: ', error.error);
        });
  }

  SetPassword(ticket: string, password: string): Promise<LocalDataService> {

    // VoteriD not being poassed in headers

    const data = { 'ticket': ticket, 'password': password };

    return this.remoteDataService
      .post('authentication/passwordset', data)
      .then(
        response => {

          this.localStore.AssignServerValues(response);

          // Never: Object.assign(store, response); /// but new sessionid is not returned so can't be assigned (that's OK)

          console.log('Password Set Success:', response);

          return this.localStore;

        }
      );
  }

  ChangePassword(password: string, newpassword: string): Promise<LocalDataService> {

    // VoteriD not being passed in headers

    const data = { 'password': password, 'newpassword': newpassword };

    return this.remoteDataService
      .post('authentication/passwordchange', data)
      .then(response => {
        this.localStore.AssignServerValues(response);
        return this.localStore;
      });
  }

  Profile(): Promise<Profile> {

    return this.remoteDataService
      .get('authentication/profile')
      .then(response => response as Profile);

  }

  async SaveProfile(profile: Profile) {
    const response = await this.remoteDataService.post('authentication/profilesave', profile);
    return response;
  }

}
