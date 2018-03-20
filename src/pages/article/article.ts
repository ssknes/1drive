import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ActionSheetController } from 'ionic-angular';
import { AddArticlePage } from '../add-article/add-article';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { EditArticlePage } from '../edit-article/edit-article';

@Component({
  selector: 'page-article',
  templateUrl: 'article.html'
})
export class ArticlePage {
  articles: FirebaseListObservable<any[]>;
  constructor(public navCtrl: NavController, public navParams: NavParams, public af: AngularFire,
    public alertCtrl: AlertController, public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController) {
    this.articles = af.database.list(`articles/${navParams.data.$key}`);
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad ArticlePage');
  }
  openAddArticle() {
    this.navCtrl.push(AddArticlePage, this.navParams.data);
  }
  presentActionSheet(article) {
    let actionSheet = this.actionSheetCtrl.create({
      title: '',
      buttons: [
        {
          text: 'Edit',
          handler: () => {
            this.navParams.data.article = article;
            this.navCtrl.push(EditArticlePage, this.navParams.data);
          }
        }, {
          text: 'Delete',
          role: 'destructive',
          handler: () => {
            this.articles.remove(article.$key);
          }
        }, {
          text: 'Cancel',
          role: 'cancel',
          handler: () => {

          }
        }
      ]
    });
    actionSheet.present();
  }
}
