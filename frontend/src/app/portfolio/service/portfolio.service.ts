import {inject, Injectable} from '@angular/core'
import {Observable} from 'rxjs'

import {BASE_API_URL} from '../../../config'
import {OptionViewModel} from '../../shared/filter/model/option-view.model'
import {PageResponseModel} from '../../shared/filter/model/page-response.model'
import {HttpService} from '../../shared/http/service/http.service'

@Injectable({providedIn: 'root'})
export class PortfolioService {
  private httpService: HttpService = inject(HttpService)

}
