import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImageUploader } from '../../providers/image-uploader';
import { FirebaseApp, AngularFire, FirebaseListObservable } from 'angularfire2';
@Component({
  selector: 'page-photo',
  templateUrl: 'photo.html',
  providers: [ImageUploader]
})
export class PhotoPage {
  photos: FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public imageUploader: ImageUploader, public af: AngularFire, public loadingCtrl: LoadingController) {
    this.photos = this.af.database.list(`photos/${navParams.data.$key}`)
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad PhotoPage');
  }
  addImage(event: any) {
    if (event.target.files) {
      let loader = this.createLoader();
      loader.present();
      let uploadAndPushJobs = [];
      for (let file of event.target.files) {
        uploadAndPushJobs.push(this.uploadAndPush(file));
      }
      Promise.all(uploadAndPushJobs).then(_ => {
        loader.dismiss();
      });
    }
  }
  uploadAndPush(file: File) {
    return new Promise((resolve) => {
      this.imageUploader.uploadToFbs(file.name, file).then(url => {
        resolve(this.photos.push({ url: url }));
      })
    });
  }
  createLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  remove(key){
    this.af.database.object(`photos/${this.navParams.data.$key}/${key}`).remove();
  }
}
