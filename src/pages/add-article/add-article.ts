import { Component } from '@angular/core';
import { NavController, NavParams, LoadingController } from 'ionic-angular';
import { ImageUploader } from '../../providers/image-uploader';
import { FirebaseApp, AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
declare var textboxio: any;

/*
  Generated class for the AddArticle page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-add-article',
  templateUrl: 'add-article.html',
  providers: [ImageUploader]
})
export class AddArticlePage {
  editor: any;
  article = {
    title: ""
  };
  constructor(public navCtrl: NavController, public navParams: NavParams, public firebaseUploader: ImageUploader, public af: AngularFire, public loadingCtrl: LoadingController) {

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad AddArticlePage');
  }
  ngAfterViewInit() {
    this.editor = textboxio.replace("#mytextarea");
  }
  submit() {
    let loader = this.getLoader();
    loader.present();
    let content = this.editor.content.get();
    let contentBlob: Blob = new Blob([content], {
      type: 'text/html; charset=utf-8'
    });
    let articleKey = this.af.database.list(`articles/${this.navParams.data.$key}`).push({
      title: this.article.title
    }).key;
    this.firebaseUploader.uploadBlob("article", articleKey, contentBlob).then(() => {
      loader.dismiss();
      this.navCtrl.pop();
    });
}

  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
}
