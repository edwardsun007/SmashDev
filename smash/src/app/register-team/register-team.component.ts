import { Component, OnInit } from '@angular/core';
import { MainService } from '../main.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-register-team',
  templateUrl: './register-team.component.html',
  styleUrls: ['./register-team.component.css']
})
export class RegisterTeamComponent implements OnInit {

  errorMsg:String[];
  newTeam:any;

  constructor(
    private _mainService: MainService,
    private _route: ActivatedRoute,
    private _router: Router
  ) { }

  ngOnInit() {
    this.newTeam={
      name:"",
      url:"",
      purpose:""
    }
  }
  
  onCreate():void{
    console.log('register-team->onCreate():');
    console.log('newTeam.name=',this.newTeam.name);
    console.log('newTeam.url=',this.newTeam.url);
    console.log('newTeam.purpose=',this.newTeam.purpose);

    this.errorMsg=[]; // reset it before next query call

    let obs = this._mainService.createNewTeam(this.newTeam);
    obs.subscribe(
      data=>{
        if(data['error']&&data['error']['errors']['name']!=undefined){
          this.errorMsg.push(data['error']['errors']['name']['message']);
        }
        else if(data['error']&&data['error']['errors']['url']!=undefined){
          this.errorMsg.push(data['error']['errors']['url']['message']);
        }
        else if(data['error']&&data['error']['errors']['purpose']!=undefined){
          this.errorMsg.push(data['error']['errors']['url']['message']);
        }
        else{
          console.log('Got data back from mainService:',data);
          
        }
      }
    )
  }

}
