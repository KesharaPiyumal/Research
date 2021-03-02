import { Component, OnInit } from '@angular/core';

import { Platform } from '@ionic/angular';
import { SplashScreen } from '@ionic-native/splash-screen/ngx';
import { StatusBar } from '@ionic-native/status-bar/ngx';
import { UserType } from './@common/enum';
import { Router } from '@angular/router';

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  loggedUser: any;
  constructor(private platform: Platform, private splashScreen: SplashScreen, private statusBar: StatusBar, public router: Router) {
    this.initializeApp();
    if (localStorage.getItem('currentUser')) {
      this.loggedUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  initializeApp() {
    this.platform.ready().then(() => {
      this.statusBar.show();
      this.splashScreen.hide();
    });
  }

  ngOnInit() {
    this.loggedCheck();
  }

  loggedCheck() {
    if (this.loggedUser) {
      if (this.loggedUser['type'] === UserType.Tutor) {
        this.router.navigate(['home-tutor/']).then((r) => {});
      } else {
        this.router.navigate(['home-student/']).then((r) => {});
      }
    } else {
      this.router.navigate(['auth/login']).then((r) => {});
    }
  }
}
