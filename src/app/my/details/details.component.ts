import { AppDataService } from './../../services/app-data.service';
import { Component, OnInit } from '@angular/core';

// Models
import { Kvp } from '../../models/kvp.model';
import { Profile } from '../../models/profile.model';

// Services
import { SignInService } from './../../services/sign-in.service';

@Component({
  selector: 'app-details',
  templateUrl: './details.component.html',
  styleUrls: ['./details.component.css'],
  preserveWhitespaces: true // for space between buttons - https://github.com/angular/material2/issues/11397
})
export class DetailsComponent implements OnInit {

  countries: Array<Kvp>;
  cities: Array<Kvp>;

  // Save old values when begin edit
  oldProfile: Profile;
  profile: Profile;

  editing = false;
  editNewCountry = false;
  editNewCity = false;
  success = '';

  constructor(
    private signInService: SignInService,
    private appDataService: AppDataService) { }

  ngOnInit() {
    console.log('DETAILS INIT');

    this.signInService.Profile().then
      (profile => {
        // this.profile.email = profile.email;
        // this.profile.country = profile.country;
        // this.profile.city = profile.city;
        // this.profile.countryID = profile.countryID;
        // this.profile.cityID = profile.cityID;

        console.log(profile);

        // Use empty object to clone
        this.profile = Object.assign({}, profile);
        this.oldProfile = Object.assign({}, profile);

        this.onCountrySelect(this.profile.countryID);
      });
  }


  async edit() {

    this.editing = true;
    this.success = '';

    // this.oldProfile.countryID = this.profile.countryID;
    // this.oldProfile.cityID = this.profile.cityID;
    // this.oldProfile.country = this.profile.country;
    // this.oldProfile.city = this.profile.city;

    console.log('EDIT', this.oldProfile.cityID, this.oldProfile.cityID);
    this.countries = await this.appDataService.GetCountries();
  }

  async save() {

    this.success = 'saving';

    if (this.editNewCountry) {
      // Save new text & get ID
      this.editNewCountry = false;
      this.editNewCity = true;
    } else if (this.editNewCity) {
      // Save new text & get ID
      this.editNewCity = false;
    } else {
      // Save selected ID
      const result = await this.signInService.SaveProfile(this.profile);
      if (result) {
        this.success = 'saved';
        this.oldProfile = Object.assign({}, this.profile);
      } else {
        this.success = 'error';
        this.profile = Object.assign({}, this.oldProfile);
        console.log(this.profile);
      }
    }
    this.editing = false;
    this.editNewCountry = false;
    this.editNewCity = false;
    this.endEdit();
  }

  cancel() {
    // this.countryID = this.oldCountryID;
    // this.cityID = this.oldCityID;
    // this.country = this.oldCountry;
    // this.city = this.oldCity;

    console.log('CANCEL:OLD ', this.oldProfile);
    this.profile = Object.assign({}, this.oldProfile);
    console.log('CANCEL:profile', this.profile);

    this.editing = false;
    this.editNewCountry = false;
    this.editNewCity = false;
    this.endEdit();
  }

  newCountry() {
    this.editNewCountry = true;
    this.profile.country = '';
    this.profile.city = '';
  }

  newCity() {
    this.editNewCity = true;
    this.profile.city = '';
  }

  async onCountrySelect(countryID) {
    this.profile.countryID = countryID;
    this.cities = await this.appDataService.GetCities(countryID);
    this.editNewCity = false;
  }

  onCitySelect(cityID) {
    this.profile.cityID = cityID;
    console.log('CITY Selected', this.oldProfile.cityID, this.profile.cityID);
  }

  endEdit() {
    console.log(this.oldProfile.countryID, this.oldProfile.cityID, this.profile.countryID, this.profile.cityID);

    this.profile.country = this.appDataService.GetArrayValue(this.countries, this.profile.countryID);
    this.profile.city = this.appDataService.GetArrayValue(this.cities, this.profile.cityID);
  }
}
