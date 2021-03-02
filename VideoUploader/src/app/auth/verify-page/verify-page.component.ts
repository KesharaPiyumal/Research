import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { EssentialDataService } from '../essential-data.service';
import { ToastService } from '../../@common/services/toast.service';
import { StatusCodes, ToastStatus } from '../../@common/enum';
import { Router } from '@angular/router';
import { FormValidationHelperService } from '../../@common/helpers/form-validation-helper.service';

@Component({
  selector: 'app-verify-page',
  templateUrl: './verify-page.component.html',
  styleUrls: ['./verify-page.component.scss'],
})
export class VerifyPageComponent implements OnInit {
  loading = false;
  verifyForm: FormGroup;

  constructor(
    public formBuilder: FormBuilder,
    public essentialDataService: EssentialDataService,
    public toastService: ToastService,
    public router: Router,
    public formValidationHelperService: FormValidationHelperService
  ) {}

  ngOnInit() {
    this.verifyForm = this.formBuilder.group({
      token: ['', Validators.required],
    });
  }

  get token() {
    return this.verifyForm.get('token');
  }

  verify() {
    if (this.verifyForm.invalid) {
      this.formValidationHelperService.validateAllFormFields(this.verifyForm);
      return;
    }
    this.loading = true;
    this.essentialDataService.userVerify({ secretToken: this.token.value }).subscribe(
      (response) => {
        this.loading = false;
        if (response.statusCode === StatusCodes.Success) {
          this.toastService.showToast(ToastStatus.Success, 'Success!', response.message);
          this.router.navigate(['home/']).then((r) => {});
        }
      },
      (error) => {
        this.loading = false;
      }
    );
  }
}
