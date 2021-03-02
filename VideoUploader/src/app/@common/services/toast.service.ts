import { Injectable } from '@angular/core';
import { NbComponentStatus, NbGlobalPhysicalPosition, NbGlobalPosition, NbToastrService } from '@nebular/theme';
import { ToastStatus } from '../enum';

@Injectable({
  providedIn: 'root'
})
export class ToastService {
  position: NbGlobalPosition = NbGlobalPhysicalPosition.BOTTOM_RIGHT;
  status: NbComponentStatus = ToastStatus.Success;

  constructor(private toastService: NbToastrService) {}

  showToast(status: NbComponentStatus, title: string, body: string) {
    this.toastService.show(body, title, { status });
  }

  showNotification(msg, title) {
    this.toastService.show(msg, title, {
      destroyByClick: true,
      duration: 100000,
      status: ToastStatus.Info,
      preventDuplicates: true
    });
  }
}
