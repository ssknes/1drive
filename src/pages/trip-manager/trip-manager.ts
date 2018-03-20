import { Component, ViewChild } from '@angular/core';
import { NavController, NavParams, Nav } from 'ionic-angular';
import { TripInfoPage } from '../trip-info/trip-info';
import { PlacesPage } from '../places/places';
import { ProductsPage } from '../products/products';
import { PhotoPage } from '../photo/photo';
import { VideoPage } from '../video/video';
import { ArticlePage } from '../article/article'
/*
  Generated class for the TripManager page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-trip-manager',
  templateUrl: 'trip-manager.html'
})
export class TripManagerPage {
  @ViewChild('content') nav: NavController;
  rootPage: any;
  trip: any;
  pages: Array<{ title: string, page: any }>
  constructor(public navCtrl: NavController, public navParams: NavParams) {
    this.pages = [
      { title: "Trip", page: TripInfoPage },
      { title: "Attaction and Activity", page: PlacesPage},
      { title: "Rest and Eat", page: ProductsPage},
      { title: "Gallery", page: PhotoPage},
      { title: "Video", page: VideoPage},
      { title: "Article", page: ArticlePage}
    ]; 
    this.trip = navParams.data;
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad TripManagerPage');
    this.openPage(TripInfoPage);
  }

  openPage(page) {
    this.nav.setRoot(page, this.trip);
  }
}
