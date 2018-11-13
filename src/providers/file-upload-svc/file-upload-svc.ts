import { AngularFireStorage } from 'angularfire2/storage';
import { Injectable } from '@angular/core';
import { Image } from '../../models/image.interface';
import { FileUpload } from '../../models/file-upload.interface';
import { ErrorHandlerProvider } from '../error-handler/error-handler';
/*
  Generated class for the FileUploadSvcProvider provider.

  See https://angular.io/guide/dependency-injection for more info on providers
  and Angular DI.
*/
@Injectable()
export class FileUploadSvcProvider {
  loading: boolean = false;
  constructor(
  	private afstorage: AngularFireStorage,
  	private errHandler: ErrorHandlerProvider
  	) {
    console.log('Hello FileUploadSvcProvider Provider');
  }

  uploadPic(image: FileUpload): Promise<Image>{
    const storageRef =   this.afstorage.ref(`${image.path}/${image.name}`);
     const uploadTask = storageRef.putString(image.file, 'data_url');
     return new Promise<Image>((resolve, reject) => {
      uploadTask.snapshotChanges().subscribe(
        (snapshot) =>{
          //update the progress property of the upload object
          uploadTask.percentageChanges().subscribe(progress =>{
            image.progress = progress;
            console.log('progress... ', image.progress);
          })
        },
        (err) =>{
          //if there's an error log it in the console
          this.errHandler.handleError(err);
          this.loading = false;
        },
        () =>{
          let tempUrl = '';
          //on success of the upload, update the url property of the upload object
          storageRef.getDownloadURL().subscribe(down_url =>{
            tempUrl = down_url;
            }, 
            err =>{
              this.errHandler.handleError(err);
              this.loading = false;
            },
            () =>{
              let image_out: Image = {
                url: tempUrl,
                name: image.name,
                progress: image.progress,
                path: image.path
              }
              resolve(image_out)
            }
          ) 
        }
      )
    })
  }

  uploadPics(pics: FileUpload[]): Promise<Image[]>{
    let images: Image[] = [];
    return new Promise<Image[]>((resolve, reject) =>{
      if(pics){
          pics.forEach(pic =>{
          this.uploadPic(pic).then(image => images.push(image)).catch(err =>{
            this.errHandler.handleError(err);
            this.loading = false;
          });
          if(images.length == pics.length){
            resolve(images);
          }
        })
      }else{
        reject('No images selected');
      }
    })
  }

}
