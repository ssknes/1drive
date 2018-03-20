import { Injectable, Inject } from '@angular/core';
import { Http } from '@angular/http';
import 'rxjs/add/operator/map';
import { FirebaseApp } from 'angularfire2';
/*
  Generated class for the ImageUploader provider.

  See https://angular.io/docs/ts/latest/guide/dependency-injection.html
  for more info on providers and Angular 2 DI.
*/
@Injectable()
export class ImageUploader {

  constructor(public http: Http, @Inject(FirebaseApp) public firebaseApp: any) {
    console.log('Hello ImageUploader Provider');
  }
  uploadBlobs(blobs: Array<{ name: String, blob: File | Blob }>) {
    return new Promise((resolve) => {
      let downloadUrls: Array<any> = [];
      blobs.forEach(blob => {
        downloadUrls.push(this.uploadToFbs(blob.name, blob.blob));
      });
      Promise.all(downloadUrls).then((urls) => {
        resolve(urls);
      });
    });
  }
  multiUploadToFbs(imgList: Array<{ name?: String, dataUrl: String }>) {
    return new Promise((resolve) => {
      let urlsPromise = [];
      for (let img of imgList) {
        if (img.name === undefined) {
          urlsPromise.push(img.dataUrl);
        } else {
          urlsPromise.push(this.uploadToFbs(img.name, this.dataURItoBlob(img.dataUrl)));
        }
      }
      Promise.all(urlsPromise).then(urls => {
        resolve(urls);
      })
    });
  }
  uploadToFbs(name, blob) {
    return new Promise((resolve, reject) => {
      let storageRef = this.firebaseApp.storage().ref();
      let uploadTask = storageRef.child('images/' + Date.now() + "_" + name).put(blob);
      uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
      }, (error) => {
        reject(error);
      }, () => {
        let downloadURL: String = uploadTask.snapshot.downloadURL;
        //console.log(downloadURL);
        resolve(downloadURL);
      });
      
    });
  }
  uploadBlob(folderName, name, blob) {
    return new Promise((resolve, reject) => {
      let storageRef = this.firebaseApp.storage().ref();
      let metadata = {
        contentType: 'text/html; charset=utf-8'
      };
      let uploadTask = storageRef.child(`${folderName}/${name}`).put(blob,metadata);
      uploadTask.on('state_changed', (snapshot) => {
        var progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        //console.log('Upload is ' + progress + '% done');
      }, (error) => {
        reject(error);
      }, () => {
        let downloadURL: String = uploadTask.snapshot.downloadURL;
        //console.log(downloadURL);
        resolve(downloadURL);
      });
    });
  }
  private dataURItoBlob(dataURI) {
    let byteString = atob(dataURI.split(',')[1]);
    let mimeString = dataURI.split(',')[0].split(':')[1].split(';')[0]
    let ab = new ArrayBuffer(byteString.length);
    let ia = new Uint8Array(ab);
    for (var i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    let blob = new Blob([ab], { type: mimeString });
    return blob;
  }
}
