import { Injectable, OnDestroy } from '@angular/core';
import { SignInStatuses } from '../models/enums';

@Injectable({ providedIn: 'root' })
export class LocalDataService {

  // we should have a sessionID or a jwt - not both
  // if signed in ALL selections should be by VoterID, not SessionID
  // OR should sessionIDs be renewed opportunistically and returned if updated?
  public sessionID = '0';
  public authenticationGUID = '';
  public jwt = '';

  public signInResult = SignInStatuses.SignedOut;
  public roles: string[]; // for client side use only
  public attemptsRemaining = 0;
  public message = '';

  constructor() {
    this.LoadValues();
  }

  public LoadValues() {
    this.sessionID = localStorage.getItem('sessionID');

    let sir = SignInStatuses.SignedOut; // default
    const result = localStorage.getItem('signInResult'); // get string from storage
    if (result) { sir = <SignInStatuses>+result; } // if value retrieved, convert to number then enum
    this.signInResult = sir;

    this.jwt = localStorage.getItem('jwt');
    this.authenticationGUID = localStorage.getItem('authenticationGUID');

    const roles = localStorage.getItem('roles');
    if (!roles) {
      this.roles = [''];
    } else {
      this.roles = localStorage.getItem('roles').split(',');
    }

    this.attemptsRemaining = +localStorage.getItem('attemptsRemaining');
    this.message = localStorage.getItem('message');
  }

  public SaveValues() {
    let roleString = '';
    if (this.roles) { roleString = this.roles.join(','); }

    if (this.jwt === null || this.jwt === undefined) { this.jwt = ''; }

    console.log('SAVING SessionID', this.sessionID);

    localStorage.setItem('sessionID', this.sessionID);
    localStorage.setItem('signInResult', (+this.signInResult).toString());
    localStorage.setItem('jwt', this.jwt);
    localStorage.setItem('authenticationGUID', this.authenticationGUID);
    localStorage.setItem('roles', roleString);
    localStorage.setItem('attemptsRemaining', this.attemptsRemaining.toString());
    localStorage.setItem('message', this.message);
  }

  // DIY rather than Object.Assign
  public AssignServerValues(values: any) {
    if (values) {
      if (values.signInResult) {
        console.log('ASSIGN Sign In Result: ', values.sir);
        this.signInResult = +values.signInResult;
      }
      if (values.jwt) { } this.jwt = values.jwt;
      if (values.authenticationGUID) { this.authenticationGUID = values.authenticationGUID; }
      if (values.roles) { this.roles = values.roles.toString().split(','); }
      if (values.attemptsRemaining) { this.attemptsRemaining = +values.attemptsRemaining; }
      if (values.message) { this.message = values.message; }
    }
  }

  // If we can use this, do we need a SignInStatusChangeSubscription???
  public IsSignedIn(): boolean {
    return this.signInResult === SignInStatuses.SignInSuccess
      || this.signInResult === SignInStatuses.SignInSuccessTicket;
  }

  public SignedOut() {

    // keep sessionID
    this.message = '';
    this.signInResult = SignInStatuses.SignedOut;
    this.attemptsRemaining = 0;
    this.jwt = '';
    this.roles = [''];

    this.SaveValues();
  }

  public PasswordUpdated() {
    this.signInResult = SignInStatuses.SignInSuccess;
    this.authenticationGUID = '';
    this.SaveValues();
  }

  onDestroy() {
    this.SaveValues();
  }

}
