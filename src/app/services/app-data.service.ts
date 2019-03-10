import { Injectable, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute, NavigationEnd } from '@angular/router';

import { Observable, BehaviorSubject } from 'rxjs';
import { filter, flatMap, map } from 'rxjs/operators';

// Models
import { Kvp } from '../models/kvp.model';

// Services
import { RemoteDataService } from './remote-data.service';
import { LocalDataService } from './local-data.service';


@Injectable({ providedIn: 'root' })
export class AppDataService implements OnDestroy {

  // http://jasonwatmore.com/post/2016/12/01/angular-2-communicating-between-components-with-observable-subject
  public Route: string;
  public PageTitle = '';
  private lastTopicSelected = ''; // Convert to SlashTag in GetLastSlashTagSelected

  public TagChange$: BehaviorSubject<string>;

  // Let the service handle the communication and the response data
  // Notify service users via Behavioursubject. (Use Behavioursubject to ensure initial value).
  // Could use Promise for sign-in component, but other components such as menu need to know sign-in status

  // public PointTypes: Array<[number, string]>; // Tuple array
  public PointTypes: Kvp[];

  // Can I make a function available in every controller in angular?
  // https://stackoverflow.com/questions/15025979/can-i-make-a-function-available-in-every-controller-in-angular
  // 0 to 11
  months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  constructor(private remoteDataService: RemoteDataService,
    private localStore: LocalDataService,
    private router: Router) {

    console.log('appDataService Constructor signInResult:', this.localStore.signInResult);

  }

  // Unambiguous Date Format
  public UDF(date: Date): string {
    return date.getDate().toString()
      + ' ' + this.months[date.getMonth()]
      + ' ' + date.getFullYear().toString();
  }

  // App start - get LastTopicSelected from Local Storage or database
  GetLastTopicSelected() {

    if (!this.LastTopicSelected) {

      this.LastTopicSelected = localStorage.getItem('LastTopicSelected');

      if (!this.LastTopicSelected) {

        this.remoteDataService
          .get('tags/tagLatestActivity')
          .then(LastTopicSelected => {
            this.LastTopicSelected = LastTopicSelected;
          })
          .catch(error => {
            console.log('Server Error on getting trending topics', error);
            return Promise.resolve(null);
          });
      }
    }
    console.log('LastTopicSelected:', this.LastTopicSelected);
  }

  public get LastTopicSelected(): string {
    return this.lastTopicSelected;
  }

  public get LastSlashTagSelected(): string {
    return this.TopicToSlashTag(this.lastTopicSelected);
  }

  public set LastTopicSelected(topic: string) {

    if (topic && topic.charAt(0) === '/') {
      // Expecting a topic, but we got a slash: convert
      this.lastTopicSelected = this.SlashTagToTopic(topic);
    } else {
      this.lastTopicSelected = topic;
    }

    localStorage.setItem('LastTopicSelected', this.lastTopicSelected);

    console.log('SAVED LastTopic: ', this.lastTopicSelected);
  }

  public set LastSlashTagSelected(slashTag: string) {

    console.log('this is the slash: ', slashTag);

    if (slashTag && slashTag.charAt(0) !== '/') {
      // Expecting a slash, but we got a topic - no need to convert slashTag to topic - it is a topic
      this.lastTopicSelected = slashTag;
    } else {
      this.lastTopicSelected = this.SlashTagToTopic(slashTag);
    }

    localStorage.setItem('LastTopicSelected', this.lastTopicSelected);

    console.log('SAVED LastTopic (from Slash): ', this.lastTopicSelected);
  }

  // Depending on already being sanitised - straight conversion between values as would be saved in database
  TopicToSlashTag(topic: string): string {
    return '/' + topic.split(' ').join('-');
  }

  // Depending on already being sanitised - straight conversion between values as would be saved in database
  SlashTagToTopic(slashTag: string): string {
    const topic = slashTag.replace('/', '').split('-').join(' ');
    console.log('SlashTagToTopic:', topic);
    return topic;
  }



  public PageTitleToolTip(): string {
    return this.Route === this.LastSlashTagSelected ? 'slash tag ' + this.LastTopicSelected : this.Route;
  }




  // SetTagRoute(tagRoute: string) {

  //   this.SlashTag = tagRoute;
  //   this.PageTitle = this.TagDisplay; /// where do we set TagDisplay?
  //   this.PageTitle = tagRoute;

  //   this.tagDisplaySubject.next(this.TagDisplay);
  //   this.titleSubject.next(this.TagDisplay);

  // }

  // GetTagDisplay(): Observable<string> {
  //   return this.tagDisplaySubject.asObservable();
  // }





  async GetCountries(): Promise<Array<Kvp>> {
    const response = await this.remoteDataService.get('authentication/countries'); // May move to a different controller
    return this.ArrayOfKVP(response);
  }


  async GetCities(countryID: number): Promise<Array<Kvp>> {
    const response = await this.remoteDataService.get('authentication/cities/' + countryID); // May move to a different controller
    return this.ArrayOfKVP(response);
  }

  GetMapValue(obj, key): string {
    if (obj.hasOwnProperty(key)) {
      return obj[key];
    }
    throw new Error('Invalid map key.');
  }


  // DO NOT WORK WITH Map
  // https://stackoverflow.com/questions/48187362/how-to-iterate-using-ngfor-loop-map-containing-key-as-string-and-values-as-map-i
  GetPointTypes() {
    this.remoteDataService
      .get('lookups/point-types')
      .then(response => {
        this.PointTypes = this.ArrayOfKVP(response);
        console.log('GOT EM', this.PointTypes);
      });
  }

  PointType(pointTypeID: number): string {
    return this.PointTypes.filter(pt => pt.Key === pointTypeID)[0].Value;
  }

  // Do Not Use map
  // ArrayFromMap(map: Map<number, string>): any[] {
  //   return Array.from(map.entries()).map(([key, val]) => ({ key, val }));
  // }


  // https://stackoverflow.com/questions/52419658/efficient-way-to-get-route-parameter-in-angular
  onNavigationEndReadParamByKey(route: ActivatedRoute, key: string): Observable<string> {
    return this.router.events.pipe(
      filter(event => event instanceof NavigationEnd),
      flatMap(() => {
        return route.params.pipe(
          filter(params => params[key]),
          map(params => params[key])
        );
      })
    );
  }


  ArrayOfKVP(source: any): Array<Kvp> {
    const output = new Array<Kvp>();
    for (const kvp of source) {
      output.push(<Kvp>({ Key: kvp.key, Value: kvp.value }));
    }
    return output;
  }

  GetArrayValue(source: Array<Kvp>, key: Number): string {
    return source.find(element => element.Key === key).Value;
  }

  ngOnDestroy() {

  }

}
