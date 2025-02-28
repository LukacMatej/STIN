import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {HttpService} from '../../shared/http/service/http.service'
import {PersonInfoModel} from '../model/person-info.model'

@Injectable({providedIn: 'root'})
export class PersonInfoService {

  private httpService: HttpService = inject(HttpService)
  private rootUrl: string = BASE_API_URL + 'person-info'

  /**
   * Get user info
   */
  getUserInfo(): Observable<PersonInfoModel> {
    return this.httpService.get(this.rootUrl)
  }

  /**
   * Create user info
   * @param personInfo
   */
  createUserInfo(personInfo: PersonInfoModel): Observable<boolean> {
    return this.httpService.post(this.rootUrl, personInfo)
  }

  /**
   * Update user info
   * @param personInfo
   */
  updateUserInfo(personInfo: PersonInfoModel): Observable<boolean> {
    return this.httpService.put(this.rootUrl, personInfo)
  }
}
