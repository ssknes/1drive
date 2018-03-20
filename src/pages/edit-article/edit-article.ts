import { Component } from '@angular/core';
import { NavController, NavParams, ActionSheetController, LoadingController } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Http } from '@angular/http';
import { ImageUploader } from '../../providers/image-uploader';

declare var textboxio: any;
@Component({
  selector: 'page-edit-article',
  templateUrl: 'edit-article.html',
   providers: [ImageUploader]
})
export class EditArticlePage {
  article: any;
  editor;
  articleHTML;
  constructor(public navCtrl: NavController, public navParams: NavParams, public actionSheetCtrl: ActionSheetController,
    public af: AngularFire, public http: Http, public loadingCtrl: LoadingController, public firebaseUploader: ImageUploader) {
    console.log(`articles/${navParams.data.$key}/${navParams.data.article.$key}`);
    af.database.object(`articles/${navParams.data.$key}/${navParams.data.article.$key}`).subscribe(data => {
      this.article = data;
    });

  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad EditArticlePage');
  }

  ngAfterViewInit() {
    let loader = this.getLoader();
    loader.present();
    this.editor = textboxio.replace("#mytextarea");
    this.http.get(`https://firebasestorage.googleapis.com/v0/b/tripbackend.appspot.com/o/article%2F${this.navParams.data.article.$key}?alt=media`)
      .map(res => res.text())
      .subscribe(content => {
        this.editor.content.set(content);
        loader.dismiss();
      });
  }
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  submit() {
    let loader = this.getLoader();
    loader.present();

    this.af.database.object(`articles/${this.navParams.data.$key}/${this.navParams.data.article.$key}/title`).set(this.article.title);

    let content = this.editor.content.get();
    let contentBlob: Blob = new Blob([content], {
      type: 'text/html; charset=utf-8'
    });
    this.firebaseUploader.uploadBlob("article", this.navParams.data.article.$key, contentBlob).then(() => {
      loader.dismiss();
      this.navCtrl.pop();
    });
  }
}
