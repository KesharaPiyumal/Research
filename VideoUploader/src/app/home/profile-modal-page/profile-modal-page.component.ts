import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup } from '@angular/forms';
import { HomeService } from '../home.service';
import { TutorHomeService } from '../../tutor-home/tutor-home.service';
import { StatusCodes, ToastStatus, UserType } from '../../@common/enum';
import { ModalLocationPageComponent } from '../../auth/register-page/modal-location-page/modal-location-page.component';

@Component({
  selector: 'app-profile-modal-page',
  templateUrl: './profile-modal-page.component.html',
  styleUrls: ['./profile-modal-page.component.scss'],
})
export class ProfileModalPageComponent implements OnInit {
  user: any;
  tutor: any;
  student: any;
  profileForm: FormGroup;
  tutorLoading = false;
  latitudeUpdated: any;
  longitudeUpdated: any;
  UserType: typeof UserType = UserType;
  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public tutorHomeService: TutorHomeService,
    public homeService: HomeService
  ) {
    if (localStorage.getItem('currentUser')) {
      this.user = JSON.parse(localStorage.getItem('currentUser'));
      if (this.user['type'] === UserType.Tutor) {
        this.tutor = this.user;
      } else {
        this.student = this.user;
      }
    }
  }

  ngOnInit() {
    this.profileForm = this.formBuilder.group({
      about: [''],
      location: [''],
      highestEducationQualification: [''],
      higherStudiedAt: [''],
      secondaryStudiedAt: [''],
      primaryStudiedAt: [''],
      phone: [''],
    });
    if (this.tutor) {
      this.getTutor();
    }
  }

  dismissModal(bool?) {
    if (bool) {
      this.modalController.dismiss({}, 'set').then((r) => {});
    } else {
      this.modalController.dismiss({}, 'cancel').then((r) => {});
    }
  }

  uploadFile(event: Event) {}

  updateData() {
    if (this.tutor) {
      this.tutorLoading = true;
      const updateTutorData = {
        about: this.profileForm.get('about').value,
        tutorId: this.tutor['userId'],
        longitude: this.longitudeUpdated ? this.longitudeUpdated : this.tutor['longitude'],
        latitude: this.latitudeUpdated ? this.latitudeUpdated : this.tutor['latitude'],
        highestEducationQualification: this.profileForm.get('highestEducationQualification').value
          ? this.profileForm.get('highestEducationQualification').value
          : '',
        higherStudiedAt: this.profileForm.get('higherStudiedAt').value ? this.profileForm.get('higherStudiedAt').value : '',
        secondaryStudiedAt: this.profileForm.get('secondaryStudiedAt').value ? this.profileForm.get('secondaryStudiedAt').value : '',
        primaryStudiedAt: this.profileForm.get('primaryStudiedAt').value ? this.profileForm.get('primaryStudiedAt').value : '',
        mobileNumber: this.profileForm.get('phone').value ? this.profileForm.get('phone').value : '',
      };
      this.tutorHomeService.updateTutorData(updateTutorData).subscribe(
        (response) => {
          this.tutorLoading = false;
          if (response.statusCode === StatusCodes.Success) {
            this.getTutor();
          }
        },
        (error) => {
          this.tutorLoading = false;
        }
      );
    }
  }

  getTutor() {
    this.tutorLoading = true;
    this.tutorHomeService.getTutor(this.tutor['userId']).subscribe(
      (response) => {
        this.tutorLoading = false;
        if (response.statusCode === StatusCodes.Success) {
          this.profileForm.patchValue({
            about: response.data['about'],
            location: response.data['geoAddress'],
            highestEducationQualification: response.data['highestEducationQualification'],
            higherStudiedAt: response.data['higherStudiedAt'],
            secondaryStudiedAt: response.data['secondaryStudiedAt'],
            primaryStudiedAt: response.data['primaryStudiedAt'],
            phone: response.data['mobileNumber'],
          });
        }
      },
      (error) => {
        this.tutorLoading = false;
      }
    );
  }

  async updateLocation() {
    const modal = await this.modalController.create({
      component: ModalLocationPageComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
    if (modalData.data.lat && modalData.data.lon) {
      this.latitudeUpdated = modalData.data.lat;
      this.longitudeUpdated = modalData.data.lon;
      this.profileForm.patchValue({
        location: modalData.data.lat + ', ' + modalData.data.lon,
      });
    }
  }
}
