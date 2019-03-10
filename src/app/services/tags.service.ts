import { Injectable } from '@angular/core';
import { RemoteDataService } from './remote-data.service';

import { TagCloudTypes } from '../models/enums';
import { Tag } from '../models/tag.model';
import { ByOn } from '../models/ByOn.model';

@Injectable({ providedIn: 'root' })
export class TagsService {

  constructor(private httpClientService: RemoteDataService) {
  }

  // OnInit() work with Directives and Components.
  // They do not work with other types, like a service


  TagCloud(type: TagCloudTypes): Promise<Tag[]> {

    let WebAPIUrl = '';

    switch (type) {
      case TagCloudTypes.Following:
        WebAPIUrl = 'tags/cloud/following';
        break;
      default:
        WebAPIUrl = 'tags/cloud/trending';
        break;
    }

    // console.log('get trending: ', this.WebAPIUrl);
    return this.httpClientService
      .get(WebAPIUrl)
      .then(data => {
        console.log('Got tag cloud');
        return data as Tag[];
      })
      .catch(error => {
        console.log('Server Error on getting tag cloud');
        return Promise.resolve(null);
      });
  }

  ByAliases(dateFrom: string, dateTo: string): Promise<ByOn[]> {

    const WebAPIUrl = 'tags/byaliases';

    const postData = { 'dateFrom': dateFrom, 'dateTo': dateTo };

    return this.httpClientService
      .post(WebAPIUrl, postData)
      .then(data => {
        return data as ByOn[]; // A "ByOn" cloud
      })
      .catch(error => {
        console.log('Server Error on getting "By" cloud');
        return Promise.resolve(null);
      });
  }

  TopicsByAlias(byAlias: string, dateFrom: string, dateTo: string): Promise<ByOn[]> {

    const WebAPIUrl = 'tags/byalias';

    const postData = { 'byAlias': byAlias, 'dateFrom': dateFrom, 'dateTo': dateTo };

    return this.httpClientService
      .post(WebAPIUrl, postData)
      .then(data => {
        return data as ByOn[]; // A "ByOn" cloud
      })
      .catch(error => {
        console.log('Server Error on getting "ByOn" cloud');
        return Promise.resolve(null);
      });
  }


}
