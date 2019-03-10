import { Component, OnInit } from '@angular/core';

// Models
import { SignInStatuses } from '../../models/enums';

// Services
import { LocalDataService } from '../../services/local-data.service';
import { SignInService } from '../../services/sign-in.service';

@Component({
  selector: 'app-password',
  templateUrl: './password.component.html',
  styleUrls: ['./password.component.css'],
  preserveWhitespaces: true
})
export class PasswordComponent implements OnInit {

  password: string;
  newPassword: string;
  submitted = false;
  success = false;
  passwordView = 'password';
  passwordVisibility = 'visibility';
  passwordViewText = 'view';
  message = '';
  signedInWithTicket = false;

  constructor(
    private localStore: LocalDataService,
    private signInService: SignInService
  ) { }

  ngOnInit() {
    this.signedInWithTicket = this.localStore.signInResult === SignInStatuses.SignInSuccessTicket;
  }

  onSubmit() {

    this.submitted = true;

    if (this.signedInWithTicket) {
      console.log('yeah signed in with ticket: ', this.localStore.authenticationGUID);
      this.signInService.SetPassword(this.localStore.authenticationGUID, this.newPassword)
        .then(store => {
          console.log('SET not CHANGED!!!', store.signInResult);
          this.success = store.signInResult === SignInStatuses.PasswordChanged;
          this.message = store.message;
          if (this.success) { this.PasswordUpdated(); }
        });
    } else {
      this.signInService.ChangePassword(this.password, this.newPassword)
        .then(store => {
          console.log('CHANGED not SET!!!');
          this.success = store.signInResult === SignInStatuses.PasswordChanged;
          this.message = store.message;
          if (this.success) { this.PasswordUpdated(); }
        });
    }
  }

  PasswordUpdated() {
    this.signedInWithTicket = false;
    this.localStore.PasswordUpdated();
  }

  viewPassword() {
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

  clearPasswords() {
    this.password = '';
    this.newPassword = '';
  }

}
