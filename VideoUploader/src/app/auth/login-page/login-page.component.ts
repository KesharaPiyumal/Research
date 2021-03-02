import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { User } from '../user';
import { FormValidationHelperService } from '../../@common/helpers/form-validation-helper.service';
import { ToastService } from '../../@common/services/toast.service';
import { EssentialDataService } from '../essential-data.service';
import { StatusCodes, ToastStatus, UserType } from '../../@common/enum';
import * as jwt_decode from 'jwt-decode';
import { Settings } from '../../@common/settings';

@Component({
  selector: 'app-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  user = {} as User;
  loginForm: FormGroup;
  loading = false;
  constructor(
    public formBuilder: FormBuilder,
    public router: Router,
    private formValidationHelperService: FormValidationHelperService,
    private toastService: ToastService,
    private essentialDataService: EssentialDataService
  ) {
  }

  ngOnInit() {
    this.loginForm = this.formBuilder.group({
      email: ['', Validators.required],
      password: ['', Validators.required],
    });
  }

  get email() {
    return this.loginForm.get('email');
  }
  get password() {
    return this.loginForm.get('password');
  }

  userLogin(user: User) {
    if (this.loginForm.invalid) {
      this.formValidationHelperService.validateAllFormFields(this.loginForm);
    } else {
      try {
        user.email = this.email.value;
        user.password = this.password.value;
        this.loading = true;
        this.essentialDataService.userLogin({ email: user.email, password: user.password }).subscribe(
          (response) => {
            this.loading = false;
            if (response.statusCode === StatusCodes.Success) {
              const decodeToken = this.getDecodedAccessToken(response.data.token);
              decodeToken.token = response.data.token;
              Settings.token = response.data.token;
              Settings.userId = decodeToken.userId;
              Settings.email = decodeToken.email;
              Settings.displayName = decodeToken.displayName;
              Object.assign(decodeToken, {
                type: response.data.type,
              });
              localStorage.setItem('currentUser', JSON.stringify(decodeToken));
              // this.toastService.showToast(ToastStatus.Success, 'Success!', response.message);
              if (decodeToken['type'] === UserType.Student) {
                this.router.navigate(['home-student/']).then((r) => {});
              } else {
                this.router.navigate(['home-tutor/']).then((r) => {});
              }
            } else if (response.statusCode === StatusCodes.Unauthorized && response.data['active'] === 'false') {
              this.toastService.showToast(ToastStatus.Warning, 'Warning!', response.message);
              this.router.navigate(['auth/verify']).then((r) => {});
            }
          },
          (error) => {
            this.loading = false;
          }
        );
      } catch (e) {
        this.loading = false;
      }
    }
  }

  goToRegisterPage() {
    this.router.navigate(['auth/register']).then((r) => {});
  }

  getDecodedAccessToken(token: string): any {
    try {
      return jwt_decode(token);
    } catch (Error) {
      return null;
    }
  }
}
