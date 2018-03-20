import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseApp, AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { PlacesPage } from '../places/places';
import { ImageUploader } from '../../providers/image-uploader';
@Component({
  selector: 'page-edit-place',
  templateUrl: 'edit-place.html',
  providers: [ImageUploader]
})
export class EditPlacePage {
  placeFB: FirebaseObjectObservable<any>;
  imgs: Array<{ name?: String, dataUrl: String }> = [];
  lat: Number;
  lng: Number;
  place: any = {};
  firebaseApp: any;
  constructor(public navCtrl: NavController,
    public navParams: NavParams,
    af: AngularFire,
    @Inject(FirebaseApp) firebaseApp: any,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController,public imageUploader: ImageUploader) {
    this.place.geoLocation = {};
    this.placeFB = af.database.object(`/places/${navParams.data.placeKey}`);
    this.firebaseApp = firebaseApp;
    this.placeFB.take(1).subscribe(data => {
      this.place = data;
      this.lat = data.geoLocation.latitude;
      this.lng = data.geoLocation.longitude;
      if (data.images != undefined) {
        for (let imgUrl of data.images) {
          this.imgs.push({ dataUrl: imgUrl });
        }
      }
    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditPlacePage');
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
  removeImg(i) {
    this.imgs.splice(i, 1);
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
  update() {
    let loader = this.createLoader();
    loader.present();
    this.imageUploader.multiUploadToFbs(this.imgs).then(urls => {
      let editedData = this.place;
      editedData.images = urls;
      return this.placeFB.update(editedData);
    }).then(() => {
      loader.dismiss();
      this.presentToast(`${this.place.name} was edited successfully`);
      //this.navCtrl.pop();
      this.navCtrl.setRoot(PlacesPage, this.navParams.data);
    });
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
  createLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
}
