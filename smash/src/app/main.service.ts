import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})

export class MainService {

  constructor(private _http:HttpClient) { }

  //createTeam
  createNewTeam(team){
    console.log('Running main service createNewTeam...');
    return this._http.post('/api/teams/create',team);
    
  }


}



