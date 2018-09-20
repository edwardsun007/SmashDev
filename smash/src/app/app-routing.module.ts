import {NgModule} from '@angular/core';
import {Routes, RouterModule} from '@angular/router'; 
import {RegisterComponent} from './register/register.component';   // register user
import {RegisterTeamComponent} from './register-team/register-team.component'    // register team
import { LoginComponent } from './login/login.component';

const routes: Routes = [
  { path:'userlogin',component:LoginComponent },
  { path:'#/createteam',component:RegisterTeamComponent },
  { path:'#/createuser',component:RegisterComponent},
  { path: '', pathMatch: 'full', redirectTo: '/userlogin' } // default

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
