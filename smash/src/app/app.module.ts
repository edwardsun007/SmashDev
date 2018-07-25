import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { MainService } from './main.service';
import { LoginComponent } from './login/login.component';



@NgModule({
  declarations: [
    AppComponent,
    LoginComponent
  ],

  imports: [
    BrowserModule,
    AppRoutingModule,
    HttpClientModule
  ],

  providers: [MainService],
  bootstrap: [AppComponent]
})
export class AppModule { }
