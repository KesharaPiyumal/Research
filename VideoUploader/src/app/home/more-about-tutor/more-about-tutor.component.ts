import { Component, OnInit } from '@angular/core';
import { ModalController, NavParams } from '@ionic/angular';

@Component({
  selector: 'app-more-about-tutor',
  templateUrl: './more-about-tutor.component.html',
  styleUrls: ['./more-about-tutor.component.scss'],
})
export class MoreAboutTutorComponent implements OnInit {
  tutorData: any;
  constructor(public modalController: ModalController, public params: NavParams) {
    this.tutorData = this.params.data['tutor'];
  }

  ngOnInit() {}

  dismissModal() {
    this.modalController.dismiss({}, 'cancel').then((r) => {});
  }
}
