import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { TutorHomeComponent } from './tutor-home.component';

const routes: Routes = [
  {
    path: '',
    component: TutorHomeComponent,
  },
  {
    path: 'dashboard',
    component: TutorHomeComponent,
  },
  {
    path: 'other',
    component: TutorHomeComponent,
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TutorHomeRoutingModule {}
