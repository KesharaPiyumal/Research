import { Injectable } from '@angular/core';
import { CommonHttpService } from '../@common/services/common-http.service';
import { map } from 'rxjs/operators';

@Injectable({
  providedIn: 'root',
})
export class TutorHomeService {
  tutorUrl = 'tutor';
  constructor(public commonHttpService: CommonHttpService) {}

  updateTutorData(updateData) {
    return this.commonHttpService.postData(this.tutorUrl + '/update', updateData).pipe(
      map((data) => {
        return data;
      })
    );
  }

  getTutor(tId) {
    return this.commonHttpService.postData(this.tutorUrl + '/one', { tutorId: tId }).pipe(
      map((data) => {
        return data;
      })
    );
  }
}
