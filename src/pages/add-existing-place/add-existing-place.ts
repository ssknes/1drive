import { Component } from '@angular/core';
import { NavController, NavParams, ToastController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';

@Component({
  selector: 'page-add-existing-place',
  templateUrl: 'add-existing-place.html'
})
export class AddExistingPlacePage {
places: FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams,public af: AngularFire,public toastCtrl: ToastController) {
    this.places = af.database.list('/places');
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddExistingPlacePage');
  }
  addToTrip(place){
    this.af.database.object(`trips/${this.navParams.data.$key}/places/${place.$key}`).set(true).then(_ =>{
      this.presentToast(`${place.name} is added to ${this.navParams.data.name}`);
    });
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
}
