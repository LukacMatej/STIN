import {NgModule} from '@angular/core'
import {RouterModule, Routes} from '@angular/router'

import {SignInComponent} from './auth/sign-in/components/sign-in.component'
import {SignUpComponent} from './auth/sing-up/components/sign-up.component'
import {PortfolioComponent} from './portfolio/components/portfolio.component'

const routes: Routes = [
  {path: 'sign-in', component: SignInComponent},
  {path: 'sign-up', component: SignUpComponent},
  {path: 'portfolio', component: PortfolioComponent},
  {path: '**', redirectTo: ''}

]

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule {
}
