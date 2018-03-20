import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { FirebaseApp, AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { ImageUploader } from '../../providers/image-uploader';
/*
  Generated class for the AddProduct page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-product',
  templateUrl: 'add-product.html',
  providers: [ImageUploader]
})
export class AddProductPage {
  product: any = {};
  imgs: Array<{ name: String, dataUrl: String }> = [];
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire,
    @Inject(FirebaseApp) public firebaseApp: any, public imageUploader: ImageUploader,
    public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddProductPage');
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  submit() {
    let loader = this.getLoader();
    loader.present();
    this.imageUploader.multiUploadToFbs(this.imgs).then(urlList => {
      this.product.images = urlList;
      return this.af.database.list(`/products/${this.navParams.data.$key}`).push(this.product).key;
    }).then(_ => {
      loader.dismiss();
      //this.navCtrl.setRoot(PlacesPage, this.navParams.data);
      this.navCtrl.pop();
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
