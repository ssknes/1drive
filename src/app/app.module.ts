import { NgModule, ErrorHandler } from '@angular/core';
import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';
import { MyApp } from './app.component';
import { HomePage } from '../pages/home/home';

import { StatusBar } from '@ionic-native/status-bar';
import { SplashScreen } from '@ionic-native/splash-screen';
import { AngularFireModule } from 'angularfire2';

import { TripListPage } from '../pages/trip-list/trip-list';
import { TripManagerPage } from '../pages/trip-manager/trip-manager';
import { TripInfoPage } from '../pages/trip-info/trip-info';
import { AddNewPlacePage } from '../pages/add-new-place/add-new-place'
import { PlacesPage } from '../pages/places/places';
import { EditPlacePage } from '../pages/edit-place/edit-place';
import { ProductsPage } from '../pages/products/products';
import { AddProductPage } from '../pages/add-product/add-product';
import { AddExistingPlacePage } from '../pages/add-existing-place/add-existing-place';
import { EditProductPage } from '../pages/edit-product/edit-product';
import { PhotoPage } from '../pages/photo/photo';
import { VideoPage } from '../pages/video/video';
import { ArticlePage } from '../pages/article/article'
import { AddArticlePage } from '../pages/add-article/add-article';
import { EditArticlePage} from '../pages/edit-article/edit-article';
import { LoginPage } from '../pages/login/login';

import { AgmCoreModule } from 'angular2-google-maps/core';
export const firebaseConfig = {
  apiKey: "AIzaSyAHD35eOtZyBhpufJHiQrUi8THBD0lC1Rc",
  authDomain: "tripbackend.firebaseapp.com",
  databaseURL: "https://tripbackend.firebaseio.com",
  projectId: "tripbackend",
  storageBucket: "tripbackend.appspot.com",
  messagingSenderId: "63459148262"
};

@NgModule({
  declarations: [
    MyApp,
    HomePage,
    TripListPage,
    TripManagerPage,
    TripInfoPage,
    AddNewPlacePage,
    PlacesPage,
    EditPlacePage,
    AddExistingPlacePage,
    ProductsPage,
    AddProductPage,
    EditProductPage,
    PhotoPage,
    VideoPage,
    ArticlePage,
    AddArticlePage,
    EditArticlePage,
    LoginPage
  ],
  imports: [
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AgmCoreModule.forRoot({
      apiKey: 'AIzaSyAY2k2hgOi6x1JO5IU1NAJG-k1saVYHpRo'
    })
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp,
    HomePage,
    TripListPage,
    TripManagerPage,
    TripInfoPage,
    AddNewPlacePage,
    PlacesPage,
    EditPlacePage,
    AddExistingPlacePage,
    ProductsPage,
    AddProductPage,
    EditProductPage,
    PhotoPage,
    VideoPage,
    ArticlePage,
    AddArticlePage,
    EditArticlePage,
    LoginPage
  ],
  providers: [
    StatusBar,
    SplashScreen,
    { provide: ErrorHandler, useClass: IonicErrorHandler }
  ]
})
export class AppModule { }
