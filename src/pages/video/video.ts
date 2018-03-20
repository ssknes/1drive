import { Component } from '@angular/core';
import { NavController, NavParams, AlertController, LoadingController, ActionSheetController, } from 'ionic-angular';
import { AngularFire, FirebaseListObservable, FirebaseObjectObservable } from 'angularfire2';
import { Http } from '@angular/http';
/*
  Generated class for the Video page.

  See http://ionicframework.com/docs/v2/components/#navigation for more info on
  Ionic pages and navigation.
*/
@Component({
  selector: 'page-video',
  templateUrl: 'video.html'
})
export class VideoPage {
  videos: FirebaseListObservable<any[]>;
  mainVideoId: FirebaseObjectObservable<any>;
  constructor(public navCtrl: NavController, public navParams: NavParams,
    public af: AngularFire, public alertCtrl: AlertController,
    public loadingCtrl: LoadingController, public actionSheetCtrl: ActionSheetController, public http: Http) {
    this.videos = af.database.list(`videos/${navParams.data.$key}`);
    this.mainVideoId = af.database.object(`trips/${this.navParams.data.$key}/youtubeId`);
    console.log(this.mainVideoId.$ref.toJSON());
  }

  ionViewDidLoad() {
    console.log('ionViewDidLoad VideoPage');
  }
  openEditor(video) {
    console.log(this.mainVideoId);
    let prompt = this.alertCtrl.create({
      title: 'Edit video',
      inputs: [
        {
          name: 'title',
          value: video.title,
          placeholder: 'Title'
        },
        {
          name: 'url',
          value: `https://www.youtube.com/watch?v=${video.youtubeId}`,
          placeholder: 'Youtube video ID'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: _ => { }
        },
        {
          text: 'Submit',
          handler: data => {
            let loader = this.getLoader();
            loader.present();
            this.http.get(`https://noembed.com/embed?url=${data.url}`).map(res => res.json()).subscribe(youtubeObj => {
              if (youtubeObj.provider_name == "YouTube") {
                this.af.database.object(`videos/${this.navParams.data.$key}/${video.$key}`).set({
                  youtubeId: this.getUrlParameter(data.url),
                  title: data.title
                })
                  .then(_ => {
                    this.mainVideoId.take(1).subscribe(mainVideoId => {
                      //is main video
                      console.log(mainVideoId);
                      if (video.youtubeId == mainVideoId.$value) {
                        console.log("This is main video, so must be update at trip entity too")
                        this.mainVideoId.set(this.getUrlParameter(data.url));
                      }
                      loader.dismiss();
                      prompt.dismiss();
                    });

                  });
              } else {
                loader.dismiss();
                this.showInvalidUrlAlert();
                console.log("Invalid URL");
              }
            });
            return false;
          }
        }
      ]
    });
    prompt.present();
  }
  showAddPrompt() {
    let prompt = this.alertCtrl.create({
      title: 'Add youtube video',
      inputs: [
        {
          name: 'url',
          placeholder: 'Youtube URL'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: _ => { }
        },
        {
          text: 'Submit',
          handler: data => {
            let loader = this.getLoader();
            loader.present();
            this.http.get(`https://noembed.com/embed?url=${data.url}`).map(res => res.json()).subscribe(video => {
              if (video.provider_name == "YouTube") {
                this.videos.push(
                  {
                    youtubeId: this.getUrlParameter(data.url),
                    title: video.title
                  }
                ).then(_ => {
                  loader.dismiss();
                  prompt.dismiss();
                });
              } else {
                loader.dismiss();
                this.showInvalidUrlAlert();
                console.log("Invalid URL");
              }
            });
            return false;
          }
        }
      ]
    });
    prompt.present();
  }
  showInvalidUrlAlert() {
    let alert = this.alertCtrl.create({
      title: 'Invalid Youtube URL',
      subTitle: 'Please enter correct URL',
      buttons: ['OK']
    });
    alert.present();
  }
  remove(key) {
    this.af.database.object(`videos/${this.navParams.data.$key}/${key}`).remove();
  }
  getUrlParameter(url) {
    let param = "v";
    param = param.replace(/[\[]/, '\\[').replace(/[\]]/, '\\]');
    var regex = new RegExp('[\\?&]' + param + '=([^&#]*)');
    var results = regex.exec(url);
    return results === null ? '' : decodeURIComponent(results[1].replace(/\+/g, ' '));
  };
  getLoader() {
    return this.loadingCtrl.create({ content: "Please wait..." });
  }
  setAsMainVideo(video) {
    this.af.database.object(`trips/${this.navParams.data.$key}/youtubeId`).set(video.youtubeId);
  }

}
