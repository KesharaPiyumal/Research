import { AfterViewInit, Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Student, Tutor, User } from '../user';
import { FormValidationHelperService } from '../../@common/helpers/form-validation-helper.service';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { Diagnostic } from '@ionic-native/diagnostic/ngx';
import { StatusCodes, ToastStatus, UserType } from '../../@common/enum';
import { ToastService } from '../../@common/services/toast.service';
import { EssentialDataService } from '../essential-data.service';
import { ModalController } from '@ionic/angular';
import { ModalLocationPageComponent } from './modal-location-page/modal-location-page.component';
import { NbPopoverDirective } from '@nebular/theme';
import { Router } from '@angular/router';

@Component({
  selector: 'app-register-page',
  templateUrl: './register-page.component.html',
  styleUrls: ['./register-page.component.scss'],
})
export class RegisterPageComponent implements OnInit, AfterViewInit {
  @ViewChildren(NbPopoverDirective) popovers: QueryList<NbPopoverDirective>;
  user = {} as User;
  registerFormCommon: FormGroup;
  registerFormAdv: FormGroup;
  examList = [];
  examsDropdown = [];
  mediumDropdown = [
    { label: 'Sinhala', value: 1 },
    { label: 'English', value: 2 },
    { label: 'No Medium', value: 3 },
  ];
  subjectsDropdown = [];
  examsLoading = false;
  subjectsLoading = false;
  userLoading = false;
  UserType: typeof UserType = UserType;
  selectedExamId: any;
  selectedMediumId: any;
  private lat: any;
  private lon: any;

  constructor(
    public formBuilder: FormBuilder,
    private formValidationHelperService: FormValidationHelperService,
    private geolocation: Geolocation,
    private toastService: ToastService,
    private essentialDataService: EssentialDataService,
    private diagnostic: Diagnostic,
    public modalController: ModalController,
    public router: Router
  ) {}

  ngOnInit() {
    this.getAllExams();
    this.registerFormCommon = this.formBuilder.group({
      type: [1],
      email: ['', Validators.required],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required, Validators.minLength(6)]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNumber: ['', Validators.required],
    });
    this.registerFormAdv = this.formBuilder.group({
      address: ['', Validators.required],
      location: ['', Validators.required],
      age: [],
      gender: [1],
      examId: [],
      mediumId: [],
      subjectIds: [[]],
    });
  }

  ngAfterViewInit(): void {}

  get firstName() {
    return this.registerFormCommon.get('firstName');
  }
  get lastName() {
    return this.registerFormCommon.get('lastName');
  }
  get email() {
    return this.registerFormCommon.get('email');
  }
  get type() {
    return this.registerFormCommon.get('type');
  }
  get password() {
    return this.registerFormCommon.get('password');
  }
  get confirmPassword() {
    return this.registerFormCommon.get('confirmPassword');
  }
  get phoneNumber() {
    return this.registerFormCommon.get('phoneNumber');
  }
  get address() {
    return this.registerFormAdv.get('address');
  }
  get age() {
    return this.registerFormAdv.get('age');
  }
  get gender() {
    return this.registerFormAdv.get('gender');
  }
  get examId() {
    return this.registerFormAdv.get('examId');
  }
  get mediumId() {
    return this.registerFormAdv.get('mediumId');
  }
  get subjectIds() {
    return this.registerFormAdv.get('subjectIds');
  }
  get location() {
    return this.registerFormAdv.get('location');
  }

  validateForm1() {
    if (this.registerFormCommon.invalid) {
      this.formValidationHelperService.validateAllFormFields(this.registerFormCommon);
      return;
    }
    const popover = this.popovers.filter((p) => p.context === 'locationPopover')[0];
    popover.show();
    setTimeout(() => {
      popover.hide();
    }, 5000);
  }

  getAllExams() {
    this.examsLoading = true;
    this.essentialDataService.getAllExams().subscribe(
      (response) => {
        this.examsLoading = false;
        if (response.statusCode === StatusCodes.Success) {
          this.examList = response.data;
          this.examsDropdown = [];
          this.examList.forEach((item) => {
            this.examsDropdown.push({ label: item['name'], value: item['id'] });
          });
        }
      },
      (error) => {
        this.examsLoading = false;
      }
    );
  }

  getAllSubjects() {
    this.subjectsLoading = true;
    const reqData = { examId: this.selectedExamId, mediumId: this.selectedMediumId };
    this.essentialDataService.getAllSubjectsForExamAndMedium(reqData).subscribe(
      (response) => {
        this.subjectsLoading = false;
        if (response.statusCode === StatusCodes.Success) {
          this.subjectsDropdown = [];
          this.registerFormAdv.patchValue({
            subjectIds: [[]],
          });
          response.data.forEach((item) => {
            this.subjectsDropdown.push({ label: item['name'], value: item['id'] });
          });
        }
      },
      (error) => {
        this.subjectsLoading = false;
      }
    );
  }

  setControlsForType(event: any) {
    const ageC = this.age;
    const genderC = this.gender;
    const mediumIdC = this.mediumId;
    const subjectIdsC = this.subjectIds;
    const examIdC = this.examId;
    ageC.reset();
    genderC.reset();
    mediumIdC.reset();
    examIdC.reset();
    subjectIdsC.reset();
    if (event === UserType.Tutor) {
      ageC.setValidators(Validators.required);
      genderC.setValidators(Validators.required);
      mediumIdC.setValidators(Validators.required);
      examIdC.setValidators(Validators.required);
      subjectIdsC.setValidators(Validators.required);
    } else {
      ageC.clearValidators();
      mediumIdC.clearValidators();
      examIdC.clearValidators();
      subjectIdsC.clearValidators();
    }
    ageC.updateValueAndValidity();
    genderC.updateValueAndValidity();
    mediumIdC.updateValueAndValidity();
    examIdC.updateValueAndValidity();
    subjectIdsC.updateValueAndValidity();
  }

  async getCurrentLocation() {
    const modal = await this.modalController.create({
      component: ModalLocationPageComponent,
      cssClass: 'my-custom-class',
    });
    await modal.present();
    const modalData = await modal.onWillDismiss();
    if (modalData.data.lat && modalData.data.lon) {
      this.lat = modalData.data.lat;
      this.lon = modalData.data.lon;
      this.registerFormAdv.patchValue({
        location: modalData.data.lat + ', ' + modalData.data.lon,
      });
    }
    // this.diagnostic.switchToLocationSettings();
    // this.geolocation
    //     .getCurrentPosition()
    //     .then((resp) => {
    //       this.user.lat = resp.coords.latitude;
    //       this.user.long = resp.coords.longitude;
    //     })
    //     .catch((error) => {
    //       console.log('Error getting location', error);
    //     });
  }

  examinationOrGradeChange(event: any) {
    this.selectedExamId = event;
    if (this.selectedExamId && this.selectedMediumId) {
      this.getAllSubjects();
    }
  }

  mediumChange(event: any) {
    this.selectedMediumId = event;
    if (this.selectedExamId && this.selectedMediumId) {
      this.getAllSubjects();
    }
  }

  registerUser() {
    if (this.registerFormAdv.invalid) {
      this.formValidationHelperService.validateAllFormFields(this.registerFormAdv);
      return;
    }
    this.userLoading = true;
    if (this.type.value === UserType.Tutor) {
      const tutor: Tutor = {
        address: this.address.value,
        age: this.age.value,
        gender: this.gender.value,
        email: this.email.value,
        examId: this.examId.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        lat: this.lat.toString(),
        lon: this.lon.toString(),
        mediumId: this.mediumId.value,
        mobileNumber: this.phoneNumber.value.toString(),
        password: this.password.value,
        subjectIds: this.subjectIds.value,
      };
      this.essentialDataService.registerTutor(tutor).subscribe(
        (response) => {
          this.userLoading = false;
          if (response.statusCode === StatusCodes.Success) {
            this.toastService.showToast(ToastStatus.Success, 'Success!', response.message);
            this.router.navigate(['auth/login']).then((r) => {});
          }
        },
        (error) => {
          this.userLoading = false;
        }
      );
    } else {
      const student: Student = {
        address: this.address.value,
        email: this.email.value,
        firstName: this.firstName.value,
        lastName: this.lastName.value,
        lat: this.lat.toString(),
        lon: this.lon.toString(),
        mobileNumber: this.phoneNumber.value.toString(),
        password: this.password.value,
      };
      this.essentialDataService.registerStudent(student).subscribe(
        (response) => {
          this.userLoading = false;
          if (response.statusCode === StatusCodes.Success) {
            this.toastService.showToast(ToastStatus.Success, 'Success!', response.message);
            this.router.navigate(['auth/login']).then((r) => {});
          }
        },
        (error) => {
          this.userLoading = false;
        }
      );
    }
  }
}
