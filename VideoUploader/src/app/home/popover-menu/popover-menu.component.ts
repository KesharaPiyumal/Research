import { Component, OnInit } from '@angular/core';
import { PopMenuType } from '../../@common/enum';
import { PopoverController } from '@ionic/angular';

@Component({
  selector: 'app-popover-menu',
  templateUrl: './popover-menu.component.html',
  styleUrls: ['./popover-menu.component.scss'],
})
export class PopoverMenuComponent implements OnInit {
  PopMenuType: typeof PopMenuType = PopMenuType;
  constructor(public popoverController: PopoverController) {}

  ngOnInit() {}

  goToHome(popMenuItemType) {
    this.popoverController
      .dismiss(
        {
          popMenuItemType,
        },
        'ok'
      )
      .then((r) => {});
  }
}
