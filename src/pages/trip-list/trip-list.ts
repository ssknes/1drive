import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable } from 'angularfire2';
import { AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { LoginPage } from '../login/login';
import { TripManagerPage } from '../trip-manager/trip-manager';
@Component({
  selector: 'page-trip-list',
  templateUrl: 'trip-list.html'
})
export class TripListPage {
  trips: FirebaseListObservable<any[]>;
  private authState: FirebaseAuthState;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire, public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
    this.trips = af.database.list('/trips');
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad TripListPage');
  }
  signOut() {
    this.af.auth.logout().then(() => {
      this.navCtrl.setRoot(LoginPage, {isSignedOut : true});
    });
  }
  presentActionSheet(trip) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Manage',
          handler: () => {
            this.navCtrl.push(TripManagerPage, trip);
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.trips.remove(trip.$key);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }
  showAddPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Create new trip',
      inputs: [
        {
          name: 'name',
          placeholder: 'Name'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            console.log('Cancel clicked');
          }
        },
        {
          text: 'Create',
          handler: data => {
            let loader = this.getLoader();
            loader.present();
            this.trips.push({ "name": data.name }).then((data) => {
              loader.dismiss();
            });
          }
        }
      ]
    });
    prompt.present();
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
}
