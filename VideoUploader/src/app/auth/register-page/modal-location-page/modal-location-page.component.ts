import { Component, OnInit } from '@angular/core';
import { Location } from '../../../@common/common-shared/entity/Location';
import { AlertController, ModalController } from '@ionic/angular';
const INITIAL_LATITUDE = 6.924541605015639;
const INITIAL_LONGITUDE = 79.86056700311478;

@Component({
  selector: 'app-modal-location-page',
  templateUrl: './modal-location-page.component.html',
  styleUrls: ['./modal-location-page.component.scss'],
})
export class ModalLocationPageComponent implements OnInit {
  searchedLocation: Location = { initialSearch: true, latitude: INITIAL_LATITUDE, longitude: INITIAL_LONGITUDE };
  lat: any;
  lon: any;
  constructor(public modalController: ModalController, public alertController: AlertController) {}
  ngOnInit() {}

  changeMarkerLocation(event: Location) {
    this.updateLocation(event);
  }

  updateLocation(event: Location) {
    this.searchedLocation = {
      initialSearch: false,
      latitude: event.latitude,
      longitude: event.longitude,
    };
  }

  dismissModal(bool?) {
    if (bool) {
      if (this.searchedLocation['latitude'] && this.searchedLocation['longitude']) {
        this.lat = this.searchedLocation.latitude;
        this.lon = this.searchedLocation.longitude;
      }
      this.modalController.dismiss({ lat: this.lat, lon: this.lon }, 'set').then((r) => {});
    } else {
      this.modalController.dismiss({ lat: null, lon: null }, 'cancel').then((r) => {});
    }
  }

  async presentAlertConfirm() {
    const alert = await this.alertController.create({
      cssClass: 'my-custom-class',
      header: 'FindTutor Asks,',
      message: 'Do you want to proceed with picked location?',
      buttons: [
        {
          text: 'No',
          role: 'cancel',
          cssClass: 'secondary',
          handler: () => {
          },
        },
        {
          text: 'Yes',
          handler: () => {
            this.dismissModal(true);
          },
        },
      ],
    });

    await alert.present();
  }
}
