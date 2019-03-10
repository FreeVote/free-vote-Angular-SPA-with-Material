import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { LocalDataService } from './local-data.service';




@Injectable({ providedIn: 'root' })
export class RemoteDataService {

  private website: string;
  private serviceUrl: string;
  private keepingAlive = false;

  public SignInDataDelete() {
    this.localData.SignedOut();
  }

  constructor(private httpClient: HttpClient, private localData: LocalDataService) {

    // check if running locally to determine service url
    const spaDomain = window.location.origin.split('//')[1].split(':')[0].replace('api.', '');

    if (spaDomain === 'localhost') {
      // Visual Studio debugging, or VS Code/Angular ng serve
      this.website = 'free.vote';
      this.serviceUrl = 'http://localhost:54357/';
      // must match the value in Visual Studio launchsettings.json (SSL enabled in Project Properties Debug)
      // As CORS is configured, we could also use local IIS http://freevotetest.com or live https://free.vote
    } else if (spaDomain === 'freevotetest.com') {
      // IIS local testing - service url is same, but we could set to live and redeploy SPA to local IIS
      // So it's unlikely the CORS configration for freevotetest.com will actually be used
      this.website = 'free.vote';
      this.serviceUrl = 'http://freevotetest.com/';
    } else {
      // Live deployment - service url is same
      this.website = spaDomain;
      // this.website = 'free.vote';
      this.serviceUrl = 'https://free.vote/';
    }

    console.log('Website:', this.website, 'ServiceUrl:', this.serviceUrl);
  }

  SessionKeepAlive() {

    // need to prevent recursion get calls SessionKeepAlive and vice versa
    // Any API requests renew anonymous sessionID whether signed in or not

    // What happens when a SessionID expires AND IS removed from databsae - it won't be re-allocated?
    // It's all public data, so it won't matter?

    if (!this.keepingAlive
      && (this.localData.sessionID === '0' || !this.localData.jwt)) {

      this.keepingAlive = true;

      console.log('SessionKeepAlive locaStore value: ', this.localData.sessionID);
      this.get('authentication/sessionidrenew/' + this.localData.sessionID)
        .then(response => {
          console.log('SessionKeepAlive return value: ', response.sessionID);
          this.localData.sessionID = response.sessionID;
          this.localData.SaveValues();
          this.keepingAlive = false;
        });
    }
  }

  OnInit() {

    // console.log('renew SessionID in constructor');
    this.SessionKeepAlive(); // conditional
  }

  RequestHeaders() {

    // https://stackoverflow.com/questions/45286764/angular-4-3-httpclient-doesnt-send-header/45286959#45286959
    // The instances of the new HttpHeader class are immutable objects.
    // state cannot be changed after creation

    // but you can create a new variable by append
    // https://stackoverflow.com/questions/45286764/angular-httpclient-doesnt-send-header/45286959#45286959
    // Do not set an empty string to a header - it becomes undefined and the post fails

    let headers = new HttpHeaders()
      .set('Content-Type', 'application/json; charset=utf-8');

    if (this.website) { headers = headers.append('SPAWebsite', this.website); }
    if (this.localData.sessionID) { headers = headers.append('SessionID', this.localData.sessionID.toString()); }
    if (this.localData.jwt) { headers = headers.append('JWT', this.localData.jwt); }

    // console.log('HEADERS ', headers);

    return { headers: headers };
  }


  get(url): Promise<any> {

    this.SessionKeepAlive(); // conditional

    return this.httpClient
      .get(this.serviceUrl + url, this.RequestHeaders()).toPromise();
  }


  post(url, data): Promise<any> {

    // console.log('httpclientservice post SessionKeepAlive 1');

    this.SessionKeepAlive(); // conditional

    // console.log('httpclientservice post SessionKeepAlive 2', this.serviceUrl, url, data, this.RequestHeaders());

    // console.log('trying');
    return this.httpClient
      .post(this.serviceUrl + url,
        JSON.stringify(data),
        this.RequestHeaders())
      .toPromise();
  }

}
