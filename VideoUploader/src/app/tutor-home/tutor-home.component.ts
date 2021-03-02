import { AfterViewInit, Component, OnInit } from '@angular/core';
import { ModalController, PopoverController } from '@ionic/angular';
import { PopoverMenuComponent } from '../home/popover-menu/popover-menu.component';
import { PopMenuType, StatusCodes, UserType } from '../@common/enum';
import { ProfileModalPageComponent } from '../home/profile-modal-page/profile-modal-page.component';
import { Router } from '@angular/router';
import { TutorHomeService } from './tutor-home.service';
import { HomeService } from '../home/home.service';

@Component({
  selector: 'app-tutor-home',
  templateUrl: './tutor-home.component.html',
  styleUrls: ['./tutor-home.component.scss'],
})
export class TutorHomeComponent implements OnInit, AfterViewInit {
  menuItems = [
    { name: 'Dashboard', data: 1, icon: 'stats-chart', path: 'dashboard' },
    { name: 'Other', data: 2, icon: 'bookmark', path: 'other' },
  ];
  selectedItem: any;
  tutorLoading = false;
  loggedTutor: any;
  tutorRatings = [
    { id: 1, count: 0, percentage: 0, status: 'danger' },
    { id: 2, count: 0, percentage: 0, status: 'danger' },
    { id: 3, count: 0, percentage: 0, status: 'warning' },
    { id: 4, count: 0, percentage: 0, status: 'success' },
    { id: 5, count: 0, percentage: 0, status: 'success' },
  ];
  loadedTutor: any;
  tutorRateList = [];
  tutorRateLoading = false;
  x = '&#x1F601;&#x1F601;';

  constructor(
    public popoverController: PopoverController,
    public modalController: ModalController,
    public router: Router,
    public tutorHomeService: TutorHomeService,
    public homeService: HomeService
  ) {
    if (localStorage.getItem('currentUser')) {
      const user = JSON.parse(localStorage.getItem('currentUser'));
      if (user['type'] === UserType.Tutor) {
        this.loggedTutor = user;
      }
    }
  }

  ngOnInit() {
    this.getTutor();
  }

  ngAfterViewInit(): void {
    if (this.loadedTutor) {
      document.querySelector(`.stars-inner`)['style'].width = (+this.loadedTutor['rating'] / 5) * 63.13 + 'px';
    }
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

  async openProfileModal() {
    const modal = await this.modalController.create({
      component: ProfileModalPageComponent,
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
  }

  selectItem(item) {
    this.selectedItem = item;
    this.router.navigate(['home-tutor/' + item['path']]).then();
  }

  getTutor() {
    if (this.loggedTutor) {
      this.tutorLoading = true;
      this.tutorHomeService.getTutor(this.loggedTutor['userId']).subscribe(
        (response) => {
          this.tutorLoading = false;
          if (response.statusCode === StatusCodes.Success) {
            this.tutorRatings.forEach((item) => {
              item.count = this.getPeopleCountForRateTd(item.id, response.data['studenttutorrates']);
              item['percentage'] = (item.count / this.tutorRatings['length']) * 100;
            });
            this.loadedTutor = response.data;
            this.setRating(this.loadedTutor);
            this.ngAfterViewInit();
            this.getTutorRates();
          }
        },
        (error) => {
          this.tutorLoading = false;
        }
      );
    }
  }

  getPeopleCountForRateTd(rateId, data) {
    let count = 0;
    data.forEach((item) => {
      if (item.rateId === rateId) {
        count++;
      }
    });
    return count;
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
    } else {
      tutor['rating'] = 0;
    }
    tutor['ratingCount'] = ratedCount;
  }

  getTutorRates() {
    this.tutorRateLoading = true;
    if (this.loggedTutor) {
      this.homeService.getAllStudentTutorRatesForTutorId({ tutorId: this.loggedTutor['userId'] }).subscribe(
        (response) => {
          this.tutorRateLoading = false;
          this.tutorRateList = response.data;
          this.tutorRateList.forEach((item) => {
            item['width'] = (+item['rateId'] / 5) * 47.35 + 'px';
            item['border'] = true;
          });
          this.tutorRateList[this.tutorRateList.length - 1]['border'] = false;
        },
        (error) => {
          this.tutorRateLoading = false;
        }
      );
    }
  }
}
