import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { AngularFire, FirebaseObjectObservable } from 'angularfire2';
import 'rxjs/add/operator/take';
@Component({
  selector: 'page-trip-info',
  templateUrl: 'trip-info.html'
})
export class TripInfoPage {
  tripObs: FirebaseObjectObservable<any>;
  trip: any;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire,
    public loadingCtrl: LoadingController, public toastCtrl: ToastController) {
    this.trip = navParams.data;
    this.tripObs = af.database.object(`/trips/${navParams.data.$key}`);
    this.tripObs.subscribe(data => {
      this.trip = data;
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripInfoPage');
  }
  formSubmit() {
    let loader = this.getLoader();
    loader.present();
    this.tripObs.update(this.trip).then(_ =>{
      loader.dismiss();
      this.presentToast(`${this.navParams.get("name")} has been successfully edited.`);
    });
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
}
