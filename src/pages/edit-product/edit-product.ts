import { Component, Inject } from '@angular/core';
import { NavController, NavParams, LoadingController, ToastController } from 'ionic-angular';
import { FirebaseApp, AngularFire, FirebaseObjectObservable } from 'angularfire2';
import { ImageUploader } from '../../providers/image-uploader';
@Component({
  selector: 'page-edit-product',
  templateUrl: 'edit-product.html',
  providers: [ImageUploader]
})
export class EditProductPage {
  product: any;
  imgs: Array<{ name?: String, dataUrl: String }> = [];
  productFB: FirebaseObjectObservable<any>;
  constructor(
    public navCtrl: NavController,
    public navParams: NavParams,
    public af: AngularFire,
    public imageUploader: ImageUploader,
    public toastCtrl: ToastController,
    public loadingCtrl: LoadingController) {
    this.productFB = af.database.object(`products/${this.navParams.data.$key}/${this.navParams.data.productKey}`);
    this.productFB.take(1).subscribe(productSnap => {
      this.product = productSnap;
      this.imgs;
      if (productSnap.images !== undefined) {
        for (let imgUrl of productSnap.images) {
          this.imgs.push({ dataUrl: imgUrl });
        }
      }

    });
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditProductPage');
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
      let editedData = this.product;
      editedData.images = urls;
      return this.productFB.update(editedData);
    }).then(() => {
      loader.dismiss();
      this.presentToast(`${this.product.name} was edited successfully`);
      this.navCtrl.pop();
      //this.navCtrl.setRoot(PlacesPage, this.navParams.data);
    });
  }
  createLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  presentToast(text) {
    let toast = this.toastCtrl.create({
      message: text,
      duration: 5000
    });
    toast.present();
  }
}
