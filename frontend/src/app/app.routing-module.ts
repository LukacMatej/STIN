import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

import {SignInComponent} from './auth/sign-in/components/sign-in.component'
import {SignUpComponent} from './auth/sing-up/components/sign-up.component'
import {PersonInfoComponent} from './person-info/components/person-info.component'

const routes: Routes = [
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'person-info', component: PersonInfoComponent},
  {path: '**', redirectTo: ''}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
