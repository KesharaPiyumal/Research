import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { NbMenuService } from '@nebular/theme';
import { filter, map } from 'rxjs/operators';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import { ProfileModalPageComponent } from './profile-modal-page/profile-modal-page.component';
import { FilterModalPageComponent } from './filter-modal-page/filter-modal-page.component';
import { ViewTutorProfileComponent } from './view-tutor-profile/view-tutor-profile.component';
import * as _ from 'lodash';
import { PopoverMenuComponent } from './popover-menu/popover-menu.component';
import { PopMenuType } from '../@common/enum';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  currentUser: any;
  public selectedIndex = 0;
  public appPages = [];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  items = [
    { title: 'Profile', icon: 'person-outline', data: 1 },
    { title: 'Log out', icon: 'log-out-outline', data: 2 },
  ];
  tutorList = [];
  tutorLoading = false;
  isNotFound = false;
  constructor(
    private menu: MenuController,
    private http: HttpClient,
    public homeService: HomeService,
    public router: Router,
    public modalController: ModalController,
    public popoverController: PopoverController
  ) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  ngOnInit() {
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }
    this.getAllTutors();
  }

  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: PopoverMenuComponent,
      event: event,
      translucent: true,
      animated: true,
      showBackdrop: true,
    });
    await popover.present();
    const popData = await popover.onWillDismiss();
    if (popData.data) {
      if (popData.data['popMenuItemType'] === PopMenuType.Profile) {
        this.openProfileModal().then((r) => {});
      } else {
        if (popData.data['popMenuItemType'] === PopMenuType.LogOut) {
          if (localStorage.getItem('currentUser')) {
            localStorage.clear();
          }
          this.router.navigate(['']).then((r) => {});
        }
      }
    }
  }

  async openMenu() {
    await this.menu.open();
  }

  getDataFromAPI(tutor) {
    this.http
      .get('https://maps.googleapis.com/maps/api/geocode/json?latlng=' + tutor.latitude + ',' + tutor.longitude + '&key=')
      .pipe()
      .subscribe(
        (data) => {
          Object.assign(tutor, {
            geoCordAddress:
              data['results'][0].address_components[1]['short_name'] + ' ' + data['results'][0].address_components[2]['short_name'],
          });
        },
        (err) => {}
      );
  }

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileModalPageComponent,
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
  }

  async openFilterModal() {
    const modal = await this.modalController.create({
      component: FilterModalPageComponent,
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
    if (modalData.data !== null) {
      this.getAllTutors(
        modalData.data['examId'],
        modalData.data['mediumId'],
        modalData.data['subjectIds'],
        modalData.data['distanceRange'] === 0 ? null : +modalData.data['distanceRange']
      );
    }
  }

  async goToTutorProfile(tutorData: any) {
    const modal = await this.modalController.create({
      component: ViewTutorProfileComponent,
      componentProps: { tutor: tutorData },
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
    if (modalData.data && modalData.data['isRated']) {
      this.getAllTutors();
    }
  }

  getAllTutorsWithoutFiltering() {
    this.isNotFound = false;
    let user;
    if (localStorage.getItem('currentUser')) {
      user = JSON.parse(localStorage.getItem('currentUser'));
    }
    this.tutorLoading = true;
    this.homeService.geAllTutors({ lat: user['latitude'], lng: user['longitude'] }).subscribe(
      (response) => {
        this.tutorLoading = false;
        this.tutorList = response.data;
        if (this.tutorList.length === 0) {
          this.isNotFound = true;
        }
        // this.tutorList.forEach((tutor) => {
        //   // this.getDataFromAPI(tutor);
        // });
        this.tutorList.forEach((tutor) => {
          this.setRating(tutor);
          this.checkRatingStatus(tutor);
          this.subjectsSetForTutor(tutor);
        });
        this.tutorList = _.orderBy(response.data, ['distanceRange', 'rating'], ['asc', 'desc']);
      },
      (error) => {
        this.tutorLoading = false;
      }
    );
  }

  getAllTutors(examId?, mediumId?, subjectIds?, distanceRange?) {
    this.isNotFound = false;
    let user;
    if (localStorage.getItem('currentUser')) {
      user = JSON.parse(localStorage.getItem('currentUser'));
    }
    this.tutorLoading = true;
    this.homeService
      .geAllFilteredTutors({ lat: user['latitude'], lng: user['longitude'], distanceRange, examId, mediumId, subjectIds })
      .subscribe(
        (response) => {
          this.tutorLoading = false;
          this.tutorList = response.data;
          if (this.tutorList.length === 0) {
            this.isNotFound = true;
          }
          // this.tutorList.forEach((tutor) => {
          //   // this.getDataFromAPI(tutor);
          // });
          this.tutorList.forEach((tutor) => {
            this.setRating(tutor);
            this.checkRatingStatus(tutor);
            this.subjectsSetForTutor(tutor);
          });
          this.tutorList = _.orderBy(response.data, ['distanceRange', 'rating'], ['asc', 'desc']);
        },
        (error) => {
          this.tutorLoading = false;
        }
      );
  }

  checkRatingStatus(tutor) {
    if (tutor['rating'] > 0 && tutor['rating'] <= 2) {
      tutor['ratingStatus'] = 'danger';
    } else if (tutor['rating'] > 2 && tutor['rating'] <= 3) {
      tutor['ratingStatus'] = 'warning';
    } else if (tutor['rating'] > 3 && tutor['rating'] <= 5) {
      tutor['ratingStatus'] = 'success';
    } else {
      tutor['ratingStatus'] = 'basic';
    }
  }

  setRating(tutor) {
    let ratedCount = 0;
    let fullRating = 0;
    if (tutor['studenttutorrates']['length'] > 0) {
      tutor['studenttutorrates'].forEach((stTutorRate) => {
        ratedCount++;
        fullRating = fullRating + stTutorRate['rateId'];
      });
      tutor['rating'] = (fullRating / ratedCount).toFixed(1);
      tutor['ratingCount'] = ratedCount;
    } else {
      tutor['rating'] = 0;
      tutor['ratingCount'] = ratedCount;
    }
  }

  subjectsSetForTutor(tutor) {
    const subjectLength = tutor['subjectTutors'].length;
    const lastSubject = tutor['subjectTutors'][subjectLength - 1];
    tutor['allSubjects'] = '';
    if (subjectLength > 0) {
      let subjects = '';
      tutor['subjectTutors'].forEach((item) => {
        subjects = subjects + item['subject']['name'];
        if (lastSubject.id !== item.id) {
          subjects = subjects + ' / ';
        }
      });
      tutor['allSubjects'] = subjects;
    } else {
      tutor['allSubjects'] = lastSubject['subject']['name'];
    }
  }
}
