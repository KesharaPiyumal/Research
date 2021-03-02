import { Injectable } from '@angular/core';
import { StatusCodes } from '../enum';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../environments/environment';
import { map } from 'rxjs/operators';
import { ToastService } from './toast.service';
import { AuthService } from '../../auth/auth.service';

@Injectable({
  providedIn: 'root',
})
export class CommonHttpService {
  private currentUserSubject;
  public currentUser;
  public token: any;

  constructor(private http: HttpClient, private router: Router, private authService: AuthService, private toastService: ToastService) {
    this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    // this.currentUser = this.currentUserSubject.asObservable();
    this.token = this.currentUserSubject ? (this.currentUserSubject.value ? this.currentUserSubject.value['token'] : '') : '';
  }

  getHttpHeaders() {
    return new HttpHeaders().set('Content-Type', 'application/json').set('Authorization', 'bearer ' + this.token);
  }

  getMultipartHttpHeaders() {
    return new HttpHeaders().set('Authorization', 'bearer ' + this.token);
  }

  getAll(subUrl: string) {
    return this.http
      .get<any>(environment.baseUrl + subUrl, { headers: this.getHttpHeaders() })
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            // this.authService.logout();
            // window.open(environment.authUrl + 'auth/login?returnUrl=' + environment.appUrl, '_self');
            // this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.statusCode === StatusCodes.InvalidToken) {
            // this.authService.logout();
            // window.alert('Token Expired. Please login again');
            // window.open(environment.authUrl + 'auth/login?returnUrl=' + environment.appUrl, '_self');
            // this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', response.message);
            // return response;
          }
        })
      );
  }
  postData(subUrl: string, data: any) {
    return this.http
      .post<any>(environment.baseUrl + subUrl, data, { headers: this.getHttpHeaders() })
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            return response;
          } else if (response && response.statusCode === StatusCodes.InvalidToken) {
            // this.authService.logout();
            // window.alert('Token Expired. Please login again');
            // window.open(environment.authUrl + 'auth/login?returnUrl=' + environment.appUrl, '_self');
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', response.message);
            return response;
          }
        })
      );
  }
}
