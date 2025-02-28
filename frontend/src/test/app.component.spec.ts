import {provideHttpClientTesting} from '@angular/common/http/testing'
import {TestBed} from '@angular/core/testing'

import {AppComponent} from '../app/app.component'

describe('AppComponent', () => {
  beforeEach(() => TestBed.configureTestingModule({
    declarations: [AppComponent],
    providers: [provideHttpClientTesting()]
  }))

  it('should create the app', () => {
    const fixture = TestBed.createComponent(AppComponent)
    const app = fixture.componentInstance
    expect(app).toBeTruthy()
  })

})
