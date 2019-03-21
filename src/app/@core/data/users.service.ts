import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/of';

let counter = 0;

@Injectable()
export class UserService {

  private users = {
    nick: { name: 'Srijan Reddy', picture: 'assets/images/srijan.jpg' },
    eva: { name: 'Rutvik Reddy', picture: 'assets/images/eva.png' },
    jack: { name: 'Jesse JS', picture: 'assets/images/jack.png' },
    lee: { name: 'Prathyush CLC', picture: 'assets/images/lee.png' },
    alan: { name: 'Uday Raj', picture: 'assets/images/alan.png' },
    kate: { name: 'Adamya Gupta', picture: 'assets/images/kate.png' },
  };

  private userArray: any[];

  constructor() {
    // this.userArray = Object.values(this.users);
  }

  getUsers(): Observable<any> {
    return Observable.of(this.users);
  }

  getUserArray(): Observable<any[]> {
    return Observable.of(this.userArray);
  }

  getUser(): Observable<any> {
    counter = (counter + 1) % this.userArray.length;
    return Observable.of(this.userArray[counter]);
  }
}
