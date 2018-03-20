import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseApp, AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { PlacesPage } from '../places/places';
import { ImageUploader } from '../../providers/image-uploader';
@Component({
  selector: 'page-add-new-place',
  templateUrl: 'add-new-place.html',
  providers: [ImageUploader]
})
export class AddNewPlacePage {
  imgs: Array<{ name: String, dataUrl: String }> = [];
  lat = 20.0454495;
  lng = 99.8907853;
  placesFB: FirebaseListObservable<any[]>;
  //tripFB: FirebaseObjectObservable<any>;
  //firebaseApp: any;
  place: any = {
    geoLocation: {
      latitude: this.lat,
      longitude: this.lng
    }
  };
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFire,
    public imageUploader : ImageUploader,
    //@Inject(FirebaseApp) firebaseApp: any,
    public loadingCtrl: LoadingController) {
    //this.firebaseApp = firebaseApp;
    this.placesFB = af.database.list(`/places/`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddNewPlacePage');
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  mapClicked($event) {
    this.place.geoLocation.latitude = $event.coords.lat;
    this.place.geoLocation.longitude = $event.coords.lng;
  }
  go() {
    this.lat = this.place.geoLocation.latitude * 1;
    this.lng = this.place.geoLocation.longitude * 1;
    this.place.geoLocation.latitude = this.lat;
    this.place.geoLocation.longitude = this.lng;
  }
  submit() {
    let loader = this.getLoader();
    loader.present();
    this.imageUploader.multiUploadToFbs(this.imgs).then(urlList => {
      this.place.images = urlList;
      return this.placesFB.push(this.place).key;
    }).then((newPlaceKey)=>{
      return this.af.database.object(`trips/${this.navParams.data.$key}/places/${newPlaceKey}`).set(true);
    }).then((data) =>{
      console.log(data);
      loader.dismiss();
      this.navCtrl.setRoot(PlacesPage, this.navParams.data);
      //this.navCtrl.pop();
    });
  }
  addImage(event: any) {
    if (event.target.files) {
      for (let file of event.target.files) {
        let reader = new FileReader();
        reader.onload = (e: any) => {
          this.imgs.push({ "name": file.name, "dataUrl": e.target.result });
        }
        reader.readAsDataURL(file);
      }
    }
  }
  removeImg(i) {
    this.imgs.splice(i, 1);
  }
}
