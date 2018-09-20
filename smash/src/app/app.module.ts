import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms'; 
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainService } from './main.service';

import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { RegisterTeamComponent } from './register-team/register-team.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent,
    RegisterComponent,
    RegisterTeamComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule,
    FormsModule
  ],

  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
