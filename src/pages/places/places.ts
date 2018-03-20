import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddNewPlacePage } from '../add-new-place/add-new-place'
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { EditPlacePage } from '../edit-place/edit-place';
import { AddExistingPlacePage } from '../add-existing-place/add-existing-place';
@Component({
  selector: 'page-places',
  templateUrl: 'places.html'
})
export class PlacesPage {
  places: Array<any> = [];
  placeLookupFB: FirebaseObjectObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    console.log(`trips/${navParams.data.$key}/places`);
    af.database.object(`trips/${navParams.data.$key}/places`).subscribe(snap => {
      this.places = [];
      // if have any place
      if (snap.$exists()) {
        
        Object.keys(snap).forEach(placeKey => {
          af.database.object(`places/${placeKey}`).take(1).subscribe(place => {
            if (place.$exists()) {
              this.places.push(place);
            }
          });
        });
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PlacesPage');
  }
  openAddNewPlace() {
    this.navCtrl.push(AddNewPlacePage, this.navParams.data);
  }
  remove(key) {
    this.af.database.object(`trips/${this.navParams.data.$key}/places/${key}`).remove();
  }
  openPlaceEditor(key) {
    this.navParams.data.placeKey = key;
    this.navCtrl.push(EditPlacePage, this.navParams.data);
  }
  openExistingAdder() {
    this.navCtrl.push(AddExistingPlacePage, this.navParams.data);
  }
}
