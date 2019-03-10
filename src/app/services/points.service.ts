import { Injectable } from '@angular/core';
import { RemoteDataService } from './remote-data.service';
import { ActivatedRoute } from '@angular/router';

import { AppDataService } from './app-data.service';
import { PointSelectionTypes } from '../models/enums';
import { PointSupportLevels } from '../models/enums';
import { PointSelectionResult, Point, PointEdit, PointFeedback, PointFeedbackFormData, PointWoWFormData } from '../models/point.model';

@Injectable({ providedIn: 'root' })
export class PointsService {

  // public PointsSelected = new Subject<any>();
  // public PointsSelectionError = new Subject<any>();

  public PointSelectionType: PointSelectionTypes;

  // Pages retrieved from server
  pages: number[];

  // Only get the WoWWeekInfo when voting for the first time - update after vote
  // Never trust the client to cache API values
  // public WoWWeekInfoVote: WoWWeekInfoVote;

  public Anon: boolean;

  constructor(
    private httpClientService: RemoteDataService,
    private appDataService: AppDataService) {

    // console.log('POINTS SERVICE CONSTRUCTOR');
    // this.GetWoWWeekInfoVote();
  }

  // Service Returns Full PointFeedback for just the WoWWeekID and WoWWeekEndingDate to be saved in WoWWeekInfoVote
  // GetWoWWeekInfoVote(): Promise<WoWWeekInfoVote> {
  //   if (this.WoWWeekInfoVote) {
  //     console.log('WoWWeekInfoVoteClient:', this.WoWWeekInfoVote);
  //     return Promise.resolve(this.WoWWeekInfoVote);
  //   } else {
  //     return this.httpClientService
  //       .get('points/WoWWeekInfoVote')
  //       .then(result => {
  //         console.log('GetWoWWeekInfoVote:', result);
  //         this.WoWWeekInfoVote = result as WoWWeekInfoVote;
  //         console.log('WoWWeekInfoVoteService:', this.WoWWeekInfoVote);
  //         return this.WoWWeekInfoVote;
  //       });
  //   }
  // }


  SelectPoints(pointSelectionType: PointSelectionTypes, byAlias: string, onTopic: string,
    defaultDates: boolean, from: Date, to: Date, containingText: string): Promise<PointSelectionResult> {

    const fromDate = this.appDataService.UDF(from);
    const toDate = this.appDataService.UDF(to);

    let apiUrl = '';
    const postData = {
      'byAlias': byAlias, 'onTopic': onTopic,
      'defaultDates': defaultDates, 'fromDate': fromDate, 'toDate': toDate,
      'containingText': containingText, 'pageSize': 10
    };
    // let success = false;

    switch (pointSelectionType) {
      case PointSelectionTypes.MyPoints:
        apiUrl = 'points/select/my/points';
        break;
      case PointSelectionTypes.FavouritePoints:
        apiUrl = 'points/select/my/favourites';
        break;
      case PointSelectionTypes.Popular:
        apiUrl = 'points/select/popular';
        break;
      case PointSelectionTypes.ByAliasOnTopic:
        // if (!byAlias) byAlias = 'Q2Do';
        apiUrl = 'points/select';
        break;
    }

    console.log('POINTS SERVICE - SELECT POINTS - pointSelectionType:', pointSelectionType,
      'apiUrl:', apiUrl, 'POST DATA - ByAlias', byAlias, 'OnTopic', onTopic, postData.pageSize);

    return this.httpClientService
      .post(apiUrl, postData)
      .then(returnData => {
        return returnData as PointSelectionResult;
      });

  }

  PointUpdate(point: Point): Promise<Point> {

    // Input parameter is Point not PointEdit
    // construct a new PointEdit (all that's needed)

    const postData = <PointEdit>{
      'pointID': point.pointID,
      'pointHTML': point.pointHTML,
      'pointTypeID': point.pointTypeID,
      'source': point.source,
      'url': point.url,
      'youTubeID': point.youTubeID,
      'slashTags': point.slashTags,
      'draft': point.draft
    };

    return this.httpClientService
      .post('points/pointupdate', postData)
      .then(result => result as Point);
  }

  PointDelete(pointID: number): Promise<string> {

    return this.httpClientService
      .get('points/pointdelete/' + pointID)
      .then(result => result as string);
  }

  PointFeedback(pointID: number, pointSupportLevel: PointSupportLevels, comment: string, feedbackAnon: boolean): Promise<PointFeedback> {

    const postData: PointFeedbackFormData = {
      'pointID': pointID,
      'pointSupportLevel': pointSupportLevel,
      'comment': comment,
      'feedbackAnon': feedbackAnon,
    };

    return this.httpClientService
      .post('points/PointFeedback', postData)
      .then(result => {
        console.log('PointFeedback result:', result);
        const pointFeedback = result as PointFeedback;
        // this.WoWWeekInfoVote.WoWWeekID = pointFeedback.WoWWeekID; // always update regardless
        // this.WoWWeekInfoVote.WoWWeekEndingDate = pointFeedback.WoWWeekEndingDate; // always update regardless
        return pointFeedback;
      });
  }


  PointWoWVote(pointID: number, wow: boolean): Promise<PointFeedback> {

    // standard construction of post data
    const postData: PointWoWFormData = {
      // 'WeekID': this.WoWWeekInfoVote.WoWWeekID, 'WeekEndingDate': this.WoWWeekInfoVote.WoWWeekEndingDate,
      'pointID': pointID, 'woW': wow, 'feedbackAnon': this.Anon
    };

    console.log('PointWoWVote postData:', postData);

    // return PointFeedback as confirmed by API
    return this.httpClientService
      .post('points/PointWoWVote', postData)
      .then(result => {
        const pointFeedback = result as PointFeedback;
        // this.WoWWeekInfoVote.WoWWeekID = pointFeedback.WoWWeekID; // always update regardless
        // this.WoWWeekInfoVote.WoWWeekEndingDate = pointFeedback.WoWWeekEndingDate; // always update regardless
        return pointFeedback;
      });

  }


}
