import { Component } from '@angular/core';
import { NavController, NavParams } from 'ionic-angular';
import { AddProductPage } from '../add-product/add-product';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { EditProductPage } from '../edit-product/edit-product';
/*
  Generated class for the Products page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-products',
  templateUrl: 'products.html'
})
export class ProductsPage {
  products: FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire) {
    this.products = af.database.list(`products/${navParams.data.$key}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ProductsPage');
  }
  openAddProduct() {
    this.navCtrl.push(AddProductPage, this.navParams.data);
  }
  remove(key) {
    this.af.database.object(`products/${this.navParams.data.$key}/${key}`).remove();
  }
  openEditor(productKey) {
    this.navParams.data.productKey = productKey;
    this.navCtrl.push(EditProductPage, this.navParams.data);
  }
}
