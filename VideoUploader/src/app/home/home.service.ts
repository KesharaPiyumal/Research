import { Injectable } from '@angular/core';
import { CommonHttpService } from '../@common/services/common-http.service';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import { StatusCodes } from '../@common/enum';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class HomeService {
  tutorUrl = 'tutor';
  studentUrl = 'student';

  constructor(public commonHttpService: CommonHttpService, public httpClient: HttpClient) {
  }

  geAllTutors(latLng) {
    return this.commonHttpService.postData(this.tutorUrl + '/all', latLng).pipe(
      map((data) => {
        return data;
      })
    );
  }

  geAllFilteredTutors(latLngWithOtherData) {
    return this.commonHttpService.postData(this.tutorUrl + '/filteredAll', latLngWithOtherData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  rateTutor(rateData) {
    return this.commonHttpService.postData(this.studentUrl + '/rateTutor', rateData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllStudents() {
    return this.commonHttpService.getAll(this.studentUrl + '/all').pipe(
      map((data) => {
        return data;
      })
    );
  }

  getAllStudentTutorRatesForTutorId(tId) {
    return this.commonHttpService.postData(this.studentUrl + '/getTutorRates', tId).pipe(
      map((data) => {
        return data;
      })
    );
  }

  addReview(reqData) {
    return this.commonHttpService.postData(this.studentUrl + '/addReview', reqData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  uploadVideoData(formDta) {
    const customHeader = this.commonHttpService.getMultipartHttpHeaders();
    return this.httpClient
      .post<any>(environment.baseUrl + 'translator/uploadVideo', formDta, { headers: customHeader })
      .pipe(
        map((response: any) => {
          if (response && response.statusCode === StatusCodes.Success) {
            return response;
          } else if (response && response.statusCode === StatusCodes.Unauthorized) {
            // this.toastService.showToast('danger', 'Error', response.message);
          } else {
            // this.toastService.showToast('danger', 'Error', response.message);
            return response;
          }
        })
      );
  }
}
