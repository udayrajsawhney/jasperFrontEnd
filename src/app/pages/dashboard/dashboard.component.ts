import { Component, OnInit } from '@angular/core';
import { Socket, SocketIoModule } from 'ngx-socket-io';
import { NbThemeService } from '@nebular/theme';
import { NbJSThemeOptions } from '@nebular/theme/services/js-themes/theme.options';
import { AnalyticsService } from '../../@core/utils/analytics.service';

@Component({
  selector: 'ngx-dashboard',
  styleUrls: ['./dashboard.component.scss'],
  templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
  theme;
  currTheme = true;
  speed = new Array(50).fill(0);
  total = 0;
  humidity = 0;
  temparature = 0;
  humid = new Array(50).fill(0);
  tempa = new Array(50).fill(0);
  constructor(private socket: Socket, private themeService: NbThemeService, private analyticsService: AnalyticsService) { }
  ngOnInit() {
    this.themeService.getJsTheme()
      .subscribe((theme: NbJSThemeOptions) => this.theme = theme);
    this.socket.on('connect', () => {
      console.log('Connected');
      this.socket.emit('giveme', 'giveme');
      this.socket.on('humidity', (humidity) => {
        this.humidity = +humidity.split('%')[0];
        this.humid.push(this.humidity);
        this.humid.splice(0,1);
      });
      this.socket.on('temperature', (temp) => {
        console.log(+temp.split(' C')[0] +1);
        this.temparature = +temp.split('C')[0] +1 -1;
        this.tempa.push(this.temparature);
        this.tempa.splice(0,1);
      })
    });
    setInterval(() => {
      let count = 0;
      for(let i of this.rooms) {
        // console.log(i);
        if (i.light) count += 10;
        if (i.fan) count += 35;
      }
      this.total += count;
      this.speed.push(count);
      this.speed.splice(0, 1);
      this.toggleTheme(this.currTheme);
    }, 1000);
  }
  state = {
    roomNumber: 2,
    roomName: 'Living Room',
    light: false,
    fan: false,
    lock: false
  }
  currentRoom = 2;
  rooms = [
    {
      roomNumber: 0,
      roomName: 'Kitchen',
      light: false,
      fan: false,
      lock: false
    },
    {
      roomNumber: 1,
      roomName: 'Bedroom',
      light: false,
      fan: false,
      lock: false
    },
    {
      roomNumber: 2,
      roomName: 'Living Room',
      light: false,
      fan: false,
      lock: false
    },
    {
      roomNumber: 3,
      roomName: 'Hallway',
      light: false,
      fan: false,
      lock: false
    }
  ]
  changeRoom(e) {
    this.saveState(this.state);
    this.currentRoom = e.roomNumber;
    this.loadState(e.roomNumber);
  }
  loadState(roomNumber) {
    for (const i of Object.keys(this.rooms[roomNumber])) {
      this.state[i] = this.rooms[roomNumber][i];
    }
  }
  saveState(state) {
    this.rooms[this.currentRoom].light = state.light;
    this.rooms[this.currentRoom].fan = state.fan;
    this.rooms[this.currentRoom].lock = state.lock;
    console.log(this.rooms);
  }
  toggle(id, state) {
    console.log('Lighted');
    this.saveState(this.state);
    if (this.state.roomNumber === 2) {
      this.socket.emit('toggle', { rPi: 0, roomNumber: this.state.roomNumber, device: id, status: state});
      console.log({ rPi: 0, roomNumber: this.state.roomNumber, device: id, status: state});
    } else {
      this.socket.emit('toggle', { rPi: 1, roomNumber: this.state.roomNumber, device: id, status: state });
      console.log({ rPi: 0, roomNumber: this.state.roomNumber, device: id, status: state });
    }
  }
  toggleTheme(theme: boolean) {
    const boolTheme = this.boolToTheme(this.currTheme);
    this.themeService.changeTheme(boolTheme);
    this.analyticsService.trackEvent('switchTheme');
  }
  toggleTh() {
    this.currTheme = !this.currTheme;
    this.toggleTheme(true);
  }
  currentBoolTheme() {
    return this.themeToBool(this.theme);
  }

  private themeToBool(theme: NbJSThemeOptions) {
    return theme.name === 'cosmic';
  }

  private boolToTheme(theme: boolean) {
    return theme ? 'cosmic' : 'default';
  }
}
