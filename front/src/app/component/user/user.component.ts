import { Component, OnInit } from '@angular/core';
import { UserService } from 'src/app/services/user.service';

@Component({
  selector: 'app-user',
  templateUrl: './UserComponentl',
  styleUrls: ['./']
})
export class UserComponent implements OnInit {

  notFound = false;
  user = null;
  constructor( private userService : UserService) { }

  ngOnInit(): void {
  }

  getUser(){
    this.notFound = false;
    this.user = null;

    this.userService.getUser().subscribe();
  }

}
