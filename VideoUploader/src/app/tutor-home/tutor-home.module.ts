import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TutorHomeComponent } from './tutor-home.component';
import { TutorHomeRoutingModule } from './tutor-home-routing.module';
import { IonicModule } from '@ionic/angular';
import { FontAwesomeModule } from '@fortawesome/angular-fontawesome';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonSharedModule } from '../@common/common-shared/common-shared.module';
import { NbCardModule, NbProgressBarModule, NbSpinnerModule } from '@nebular/theme';
import { LoopReversePipe } from './loopReversePipe';
import { SafeHtmlPipe } from './safeHtmlPipe';

@NgModule({
  declarations: [TutorHomeComponent, LoopReversePipe, SafeHtmlPipe],
  imports: [
    CommonModule,
    TutorHomeRoutingModule,
    IonicModule,
    FontAwesomeModule,
    ReactiveFormsModule,
    CommonSharedModule,
    NbCardModule,
    NbProgressBarModule,
    NbSpinnerModule,
  ],
  providers: [LoopReversePipe, SafeHtmlPipe],
})
export class TutorHomeModule {}
