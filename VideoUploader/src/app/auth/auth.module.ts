import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthRoutingModule } from './auth-routing.module';
import { RegisterPageComponent } from './register-page/register-page.component';
import { IonicModule } from '@ionic/angular';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginPageComponent } from './login-page/login-page.component';
import {
  NbAlertModule,
  NbButtonModule,
  NbCardModule,
  NbCheckboxModule,
  NbFormFieldModule,
  NbIconModule,
  NbInputModule,
  NbLayoutModule,
  NbPopoverModule,
  NbRadioModule,
  NbSelectModule,
  NbSpinnerModule,
  NbStepperModule,
  NbToastrModule,
} from '@nebular/theme';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { CommonSharedModule } from '../@common/common-shared/common-shared.module';
import { ModalLocationPageComponent } from './register-page/modal-location-page/modal-location-page.component';
import { VerifyPageComponent } from './verify-page/verify-page.component';

@NgModule({
  declarations: [RegisterPageComponent, LoginPageComponent, ModalLocationPageComponent, VerifyPageComponent],
  imports: [
    CommonModule,
    AuthRoutingModule,
    IonicModule,
    ReactiveFormsModule,
    NbButtonModule,
    NbAlertModule,
    NbCardModule,
    NbCheckboxModule,
    NbFormFieldModule,
    NbIconModule,
    NbInputModule,
    NbLayoutModule,
    NbSelectModule,
    NbSpinnerModule,
    NbToastrModule,
    NbSpinnerModule,
    NbToastrModule,
    NbRadioModule,
    NbStepperModule,
    CommonSharedModule,
    NbPopoverModule,
  ],
  exports: [ModalLocationPageComponent],
  providers: [Geolocation, Diagnostic],
})
export class AuthModule {}
