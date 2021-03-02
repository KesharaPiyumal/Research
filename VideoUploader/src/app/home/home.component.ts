import { Component, OnInit } from '@angular/core';
import { MenuController, ModalController, PopoverController } from '@ionic/angular';
import { HttpClient } from '@angular/common/http';
import { HomeService } from './home.service';
import { Router } from '@angular/router';
import * as _ from 'lodash';
import { PopoverMenuComponent } from './popover-menu/popover-menu.component';
import { PopMenuType, StatusCodes } from '../@common/enum';
import { FormBuilder } from '@angular/forms';
import { FileChooser } from '@ionic-native/file-chooser/ngx';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  providers: [FileChooser]
})
export class HomeComponent implements OnInit {
  currentUser: any;
  public selectedIndex = 0;
  public appPages = [];
  public labels = ['Family', 'Friends', 'Notes', 'Work', 'Travel', 'Reminders'];
  items = [
    { title: 'Profile', icon: 'person-outline', data: 1 },
    { title: 'Log out', icon: 'log-out-outline', data: 2 }
  ];

  uploadForm: any;
  private videoFile: any;

  constructor(
    private menu: MenuController,
    private http: HttpClient,
    public homeService: HomeService,
    public router: Router,
    public fb: FormBuilder,
    public modalController: ModalController,
    public popoverController: PopoverController,
    private fileChooser: FileChooser
  ) {
    if (localStorage.getItem('currentUser')) {
      this.currentUser = JSON.parse(localStorage.getItem('currentUser'));
    }
  }

  ngOnInit() {
    this.uploadForm = this.fb.group({
      file: [''],
      translatedText: ['']
    });
    const path = window.location.pathname.split('folder/')[1];
    if (path !== undefined) {
      this.selectedIndex = this.appPages.findIndex((page) => page.title.toLowerCase() === path.toLowerCase());
    }
  }

  get file() {
    return this.uploadForm.get('file');
  }

  async presentPopover(event) {
    const popover = await this.popoverController.create({
      component: PopoverMenuComponent,
      event,
      translucent: true,
      animated: true,
      showBackdrop: true
    });
    await popover.present();
    const popData = await popover.onWillDismiss();
    if (popData.data) {
      if (popData.data['popMenuItemType'] === PopMenuType.Profile) {
      } else {
        if (popData.data['popMenuItemType'] === PopMenuType.LogOut) {
          if (localStorage.getItem('currentUser')) {
            localStorage.clear();
          }
          this.router.navigate(['']).then((r) => {
          });
        }
      }
    }
  }

  async openMenu() {
    await this.menu.open();
  }

  openFile() {
    this.fileChooser.open()
      .then(uri => console.log(uri))
      .catch(e => console.log(e));
  }

  chooseFile(event: Event) {
    this.videoFile = event.target['files'][0];
    this.uploadForm.patchValue({
      file: this.videoFile.name
    });
  }

  uploadVideo() {
    const formData: FormData = new FormData();
    formData.append('file', this.videoFile);
    this.homeService.uploadVideoData(formData).subscribe(
      response => {
        // this.imageUploading = false;
        if (response && response.statusCode === StatusCodes.Success) {
          // this.toastService.showToast('success', 'Success', response.message);
          // this.getProfileImage();
        }
      },
      error => {
        // this.imageUploading = false;
      }
    );
  }
}
