import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeRoutingModule } from './home-routing.module';
import { HomeComponent } from './home.component';
import { IonicModule } from '@ionic/angular';
import {
  NbBadgeModule,
  NbButtonModule,
  NbCardModule,
  NbContextMenuModule, NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbPopoverModule,
  NbProgressBarModule,
  NbSelectModule,
  NbSpinnerModule
} from '@nebular/theme';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { HttpClientModule } from '@angular/common/http';
import { FilterModalPageComponent } from './filter-modal-page/filter-modal-page.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ViewTutorProfileComponent } from './view-tutor-profile/view-tutor-profile.component';
import { CallNumber } from '@ionic-native/call-number/ngx';
import { PopoverMenuComponent } from './popover-menu/popover-menu.component';
import { CommonSharedModule } from '../@common/common-shared/common-shared.module';
import { MoreAboutTutorComponent } from './more-about-tutor/more-about-tutor.component';

@NgModule({
  declarations: [
    HomeComponent,
    FilterModalPageComponent,
    ViewTutorProfileComponent,
    PopoverMenuComponent,
    MoreAboutTutorComponent
  ],
  imports: [
    CommonModule,
    HomeRoutingModule,
    IonicModule,
    NbContextMenuModule,
    NbCardModule,
    NbIconModule,
    FontAwesomeModule,
    HttpClientModule,
    NbButtonModule,
    NbSelectModule,
    ReactiveFormsModule,
    NbInputModule,
    NbBadgeModule,
    NbSpinnerModule,
    NbProgressBarModule,
    CommonSharedModule,
    FormsModule,
    NbPopoverModule,
    NbFormFieldModule
  ],
  exports: [FilterModalPageComponent, ViewTutorProfileComponent, PopoverMenuComponent, MoreAboutTutorComponent],
  providers: [CallNumber]
})
export class HomeModule {
}
