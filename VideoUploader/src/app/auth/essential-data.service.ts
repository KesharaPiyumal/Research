import { Injectable } from '@angular/core';
import { CommonHttpService } from '../@common/services/common-http.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class EssentialDataService {
  examsUrl = 'exam';
  subjectsUrl = 'subject';
  tutorUrl = 'tutor';
  studentUrl = 'student';
  userUrl = 'user';
  constructor(public commonHttpService: CommonHttpService) {}

  getAllExams() {
    return this.commonHttpService.getAll(this.examsUrl + '/getAll').pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllSubjectsForExamAndMedium(reqData) {
    return this.commonHttpService.postData(this.subjectsUrl + '/getAll', reqData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  registerTutor(tutorData) {
    return this.commonHttpService.postData(this.tutorUrl + '/register', tutorData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  registerStudent(studentData) {
    return this.commonHttpService.postData(this.studentUrl + '/register', studentData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  userLogin(tutorData) {
    return this.commonHttpService.postData(this.userUrl + '/login', tutorData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  userVerify(token) {
    return this.commonHttpService.postData(this.userUrl + '/verify', token).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
