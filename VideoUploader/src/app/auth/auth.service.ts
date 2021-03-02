import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import * as jwt_decode from 'jwt-decode';
import { Settings } from '../@common/settings';
import { ToastService } from '../@common/services/toast.service';
import { environment } from '../../environments/environment';
import { StatusCodes } from '../@common/enum';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private currentUserSubject;
  public currentUser;
  public token: any;
  public userId: any;

  constructor(private http: HttpClient, private toastService: ToastService) {
    if (JSON.parse(localStorage.getItem('currentUser'))) {
      if (JSON.parse(localStorage.getItem('currentUser')).saveDetails === 0) {
        localStorage.removeItem('currentUser');
      }
    }
    this.currentUserSubject = JSON.parse(localStorage.getItem('currentUser'));
    // this.currentUser = this.currentUserSubject.asObservable();
    if (this.currentUserSubject ? this.currentUserSubject.value : false) {
      this.token = this.currentUserSubject.value.token;
      this.userId = this.currentUserSubject.value.userId;
    }
  }

  getHttpHeaders() {
    return new HttpHeaders().set('Content-Type', 'application/json').set('userType', this.userId.toString());
  }

  public get currentUserValue() {
    return this.currentUserSubject.value;
  }

  login(userName: string, passWord: string, saveDetails: string) {
    return this.http
      .post<any>(
        environment.baseUrl + 'users/Login',
        {
          email: userName,
          password: passWord,
        }
        // { headers: this.getHttpHeaders() }
      )
      .pipe(
        map((response) => {
          if (response.statusCode === StatusCodes.Success) {
            const decodeToken = this.getDecodedAccessToken(response.data.token);
            decodeToken.token = response.data.token;
            decodeToken.saveDetails = +saveDetails;
            decodeToken.imageURL = response.data.image;
            Settings.token = response.data.token;
            Settings.userId = decodeToken.userId;
            Settings.email = decodeToken.email;
            Settings.displayName = decodeToken.displayName;
            localStorage.setItem('currentUser', JSON.stringify(decodeToken));
            // this.currentUserSubject.next(response.data);
            // this.authEvent.UserLoggedIn.emit();
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.message && response.message !== '') {
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', 'Error Occurred');
          }
        })
      );
  }

  reset(email: string) {
    return this.http
      .post<any>(
        environment.baseUrl + 'hubUser/reset-password',
        {
          email,
        }
        // { headers: this.getHttpHeaders() }
      )
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.message && response.message !== '') {
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', 'Error Occurred');
          }
        })
      );
  }

  register(hubUser) {
    return this.http
      .post<any>(
        environment.baseUrl + 'users/register',
        hubUser
        // { headers: this.getHttpHeaders() }
      )
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.message && response.message !== '') {
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', 'Error Occurred');
          }
        })
      );
  }

  verify(verificationCode: string) {
    return this.http
      .post<any>(
        environment.baseUrl + 'users/verify',
        {
          secretToken: verificationCode,
        }
        // { headers: this.getHttpHeaders() }
      )
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.message && response.message !== '') {
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', 'Error Occurred');
          }
        })
      );
  }

  verifyForgot(data: any) {
    return this.http
      .post<any>(
        environment.baseUrl + 'users/reset-verify',
        data
        // { headers: this.getHttpHeaders() }
      )
      .pipe(
        map((response) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            this.toastService.showToast('danger', 'Error', response.message);
          } else if (response && response.message && response.message !== '') {
            this.toastService.showToast('danger', 'Error', response.message);
          } else {
            this.toastService.showToast('danger', 'Error', 'Error Occurred');
          }
        })
      );
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }

  logout() {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
  }
}
