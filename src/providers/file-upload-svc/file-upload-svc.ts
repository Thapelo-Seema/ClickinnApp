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
                path: image.path,
                loaded: false
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

  uploadFile(fileUpload: FileUpload): Promise<FileUpload>{
    console.log('Uploading file... ', fileUpload);
    let tempFile = fileUpload;
    const storageRef = this.afstorage.ref(`${fileUpload.path}/${fileUpload.name}`);
    let uploadTask = this.afstorage.upload(`${fileUpload.path}/${fileUpload.name}`, fileUpload.file)
    return new Promise<FileUpload>((resolve, reject) =>{
      uploadTask.snapshotChanges().subscribe(
        (snapshot) =>{
        uploadTask.percentageChanges().subscribe(progress =>{
          tempFile.progress = progress;
          console.log('Uploading in progress...', progress);
        })
      },
      (err) =>{
          console.log(err)
      }, 
      () =>{
        let tempUrl = '';
          //on success of the upload, update the url property of the upload object
          storageRef.getDownloadURL().subscribe(down_url =>{
            tempUrl = down_url;
            }, 
            err =>{
               console.log(err)
            },
            () =>{
              let fileout: FileUpload = {
                url: tempUrl,
                name: tempFile.name,
                progress: tempFile.progress,
                path: tempFile.path,
                file: tempFile.file
              }
              resolve(fileout)
            }
          )  
      })
    })
  }


}
