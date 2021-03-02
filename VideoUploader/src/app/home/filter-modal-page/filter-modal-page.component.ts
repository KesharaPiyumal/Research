import { Component, OnInit } from '@angular/core';
import { ModalController } from '@ionic/angular';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { StatusCodes } from '../../@common/enum';
import { EssentialDataService } from '../../auth/essential-data.service';

@Component({
  selector: 'app-filter-modal-page',
  templateUrl: './filter-modal-page.component.html',
  styleUrls: ['./filter-modal-page.component.scss'],
})
export class FilterModalPageComponent implements OnInit {
  filterForm: FormGroup;
  examsDropdown = [];
  mediumDropdown = [
    { label: 'Sinhala', value: 1 },
    { label: 'English', value: 2 },
    { label: 'No Medium', value: 3 },
  ];
  subjectsDropdown = [];
  examsLoading = false;
  subjectsLoading = false;
  examList = [];
  selectedExamId: any;
  selectedMediumId: any;

  constructor(
    public modalController: ModalController,
    public formBuilder: FormBuilder,
    public essentialDataService: EssentialDataService
  ) {}

  ngOnInit() {
    this.filterForm = this.formBuilder.group({
      examId: [null],
      mediumId: [null, Validators.required],
      subjectIds: [[]],
      distanceRange: [0],
    });
    this.filterForm.patchValue({
      mediumId: this.mediumDropdown[2]['value'],
    });
    this.selectedMediumId = this.mediumDropdown[2]['value'];
    this.getAllExams();
  }

  get examId() {
    return this.filterForm.get('examId');
  }

  get subjectIds() {
    return this.filterForm.get('subjectIds');
  }
  get mediumId() {
    return this.filterForm.get('mediumId');
  }
  get distanceRange() {
    return this.filterForm.get('distanceRange');
  }

  dismissModal(bool?) {
    if (bool) {
      let sIds = [];
      if (this.subjectIds.value[0]) {
        if (this.subjectIds.value[0]['length'] === 0) {
          sIds = [];
        } else {
          this.subjectIds.value.forEach((item) => {
            sIds.push(item);
          });
        }
      } else {
        sIds = [];
      }
      this.modalController
        .dismiss(
          {
            examId: this.examId.value,
            subjectIds: sIds,
            mediumId: this.mediumId.value,
            distanceRange: this.distanceRange.value,
          },
          'set'
        )
        .then((r) => {});
    } else {
      this.modalController.dismiss(null, 'cancel').then((r) => {});
    }
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
          this.filterForm.patchValue({
            examId: this.examsDropdown[0].value,
          });
        }
      },
      (error) => {
        this.examsLoading = false;
      }
    );
  }

  getAllSubjects() {
    if (this.selectedExamId && this.selectedMediumId) {
      this.subjectsLoading = true;
      const reqData = { examId: this.selectedExamId, mediumId: this.selectedMediumId };
      this.essentialDataService.getAllSubjectsForExamAndMedium(reqData).subscribe(
        (response) => {
          this.subjectsLoading = false;
          if (response.statusCode === StatusCodes.Success) {
            this.subjectsDropdown = [];
            this.filterForm.patchValue({
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
}
