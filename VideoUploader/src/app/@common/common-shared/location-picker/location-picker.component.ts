import { Component, ElementRef, EventEmitter, Input, NgZone, OnInit, Output, ViewChild } from '@angular/core';
import { MapsAPILoader } from '@agm/core';
import { Location } from '../entity/Location';
import { Geolocation } from '@ionic-native/geolocation/ngx';
import { HttpClient } from '@angular/common/http';

declare var google;
const INITIAL_LATITUDE = 6.924541605015639;
const INITIAL_LONGITUDE = 79.86056700311478;

@Component({
  selector: 'app-location-picker',
  templateUrl: './location-picker.component.html',
  styleUrls: ['./location-picker.component.scss'],
})
export class LocationPickerComponent implements OnInit {
  @Output() positionChanged = new EventEmitter<Location>();
  @ViewChild('searchKey', { static: false }) public searchElementRef: ElementRef;
  latitude: number;
  longitude: number;
  initialSearch = true;
  zoom: number;
  @Output() markerChanged = new EventEmitter<Location>();
  @Input()
  public set searchedLocation(searchedLocation: Location) {
    this.latitude = searchedLocation.latitude;
    this.longitude = searchedLocation.longitude;
    this.zoom = 12;
    this.initialSearch = searchedLocation.initialSearch;
  }

  constructor(private mapsAPILoader: MapsAPILoader, private ngZone: NgZone, private geolocation: Geolocation, private http: HttpClient) {}

  ngOnInit() {
    this.mapsAPILoader.load().then(() => {
      const autocomplete = new google.maps.places.Autocomplete(this.searchElementRef.nativeElement, {
        types: ['address'],
      });
      autocomplete.addListener('place_changed', () => {
        this.ngZone.run(() => {
          // @ts-ignore
          const place: google.maps.places.PlaceResult = autocomplete.getPlace();
          if (place.geometry === undefined || place.geometry === null) {
            return;
          }
          const location: Location = {
            initialSearch: false,
            latitude: place.geometry.location.lat(),
            longitude: place.geometry.location.lng(),
          };
          this.positionChanged.emit(location);
        });
      });
    });
    if (this.initialSearch) {
      this.getCurrentLocation(true);
    }
  }

  placeMarker(event) {
    const location: Location = {
      initialSearch: false,
      latitude: event.coords.lat,
      longitude: event.coords.lng,
    };
    this.markerChanged.emit(location);
  }

  dragMarker(event: any) {
    this.placeMarker(event);
  }

  getCurrentLocation(bool) {
    if (bool) {
      this.searchedLocation = {
        initialSearch: bool,
        latitude: INITIAL_LATITUDE,
        longitude: INITIAL_LONGITUDE,
      };
    } else {
      this.http
        .post('https://www.googleapis.com/geolocation/v1/geolocate?key=', {}, {})
        .pipe()
        .subscribe(
          (response) => {
            this.searchedLocation = {
              initialSearch: bool,
              latitude: response['location'].lat,
              longitude: response['location'].lng,
            };
          },
          (err) => {}
        );
    }
    // if (navigator.geolocation) {
    //   navigator.geolocation.watchPosition((position) => {
    //     this.searchedLocation = {
    //       initialSearch: bool,
    //       latitude: position.coords.latitude,
    //       longitude: position.coords.longitude,
    //     };
    //   });
    // }
  }

  clearSearch() {
    this.searchElementRef.nativeElement.value = '';
  }
}
