export class User {
  firstName: string;
  lastName: string;
  mobileNumber: string;
  email: string;
  password: string;
  address: string;
  lat: number;
  lon: number;
}

export class Tutor implements User {
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  lat: number;
  lon: number;
  mobileNumber: string;
  password: string;
  examId: number;
  mediumId: number;
  subjectIds: number[];
  age: number;
  gender: string;
}

export class Student implements User {
  address: string;
  email: string;
  firstName: string;
  lastName: string;
  lat: number;
  lon: number;
  mobileNumber: string;
  password: string;
}
