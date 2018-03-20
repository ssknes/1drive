import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController, AlertController } from 'ionic-angular';
import { AngularFire, AuthProviders, AngularFireAuth, FirebaseAuthState, AuthMethods } from 'angularfire2';
import { TripListPage } from '../trip-list/trip-list';
/*
  Generated class for the Login page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-login',
  templateUrl: 'login.html'
})
export class LoginPage {
  user = {
    email: null,
    password: null
  };
  private authState: FirebaseAuthState;
  constructor(public navCtrl: NavController, public af: AngularFire, public navParams: NavParams, public loadingCtrl: LoadingController,public alertCtrl: AlertController) {
    af.auth.subscribe((state: FirebaseAuthState) => {
      this.authState = state;
      console.log(this.navParams.data);
      if(this.navParams.data.isSignedOut){
        return;
      }
      if (this.authState != null){
        this.navCtrl.setRoot(TripListPage);
      }
    });
  }
  get authenticated(): boolean {
    return this.authState !== null;
  }
  signInWithEmail(email, password) {
    return this.af.auth.login(
      { email: email, password: password },
      { provider: AuthProviders.Password, method: AuthMethods.Password }
    )
  }
  signIn() {
    let loader = this.getLoader();
    loader.present();
    this.signInWithEmail(this.user.email, this.user.password)
      .then((data) => {
        loader.dismiss();
        this.navCtrl.setRoot(TripListPage);
      }).catch(() => {
        loader.dismiss();
        this.showAlert();
      });
  }
  signOut() {
    this.af.auth.logout();
  }
  ionViewDidLoad() {
    console.log('ionViewDidLoad LoginPage');
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  showAlert() {
    let alert = this.alertCtrl.create({
      title: 'Error',
      subTitle: 'Incorrect username or password',
      buttons: ['OK']
    });
    alert.present();
  }
}
