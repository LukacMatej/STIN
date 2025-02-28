import {HTTP_INTERCEPTORS, HttpClient, HttpClientModule, provideHttpClient} from '@angular/common/http'
import {NgModule} from '@angular/core'
import {FormsModule} from '@angular/forms'
import {MatButtonModule} from '@angular/material/button'
import {MatCardModule} from '@angular/material/card'
import {MatIconModule} from '@angular/material/icon'
import {BrowserModule} from '@angular/platform-browser'
import {BrowserAnimationsModule, provideAnimations} from '@angular/platform-browser/animations'
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async'
import {RouterModule} from '@angular/router'
import {TranslateLoader, TranslateModule} from '@ngx-translate/core'
import {TranslateHttpLoader} from '@ngx-translate/http-loader'

import {AppComponent} from './app.component'
import {AppRoutingModule} from './app.routing-module'
import {HttpErrorInterceptor} from './shared/http/interceptor/http-error.interceptor'
import {HttpHeaderInterceptor} from './shared/http/interceptor/http-header.interceptor'
import {NavigationComponent} from './shared/navigation/components/navigation.component'

export function httpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json')
}

@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    FormsModule,
    RouterModule,
    BrowserAnimationsModule,
    FormsModule,
    NavigationComponent,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatIconModule,
    HttpClientModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: httpLoaderFactory,
        deps: [HttpClient]
      }
    })
  ],
  providers: [
    provideAnimations(),
    provideHttpClient(),
    provideAnimationsAsync(),
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpHeaderInterceptor,
      multi: true
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: HttpErrorInterceptor,
      multi: true
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule {
}
