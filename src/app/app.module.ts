import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Calendar } from '@ionic-native/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { SplashScreen } from '@ionic-native/splash-screen';
import { StatusBar } from '@ionic-native/status-bar';
import { AngularFireModule } from 'angularfire2';
import { AngularFireAuthModule } from 'angularfire2/auth';
import { AngularFirestoreModule } from 'angularfire2/firestore';
import { AngularFireStorageModule } from 'angularfire2/storage'
import { MyApp } from './app.component';
import { MapsProvider } from '../providers/maps/maps';
import { AccommodationsProvider } from '../providers/accommodations/accommodations';
import { IonicStorageModule } from '@ionic/storage'
import { LocalDataProvider } from '../providers/local-data/local-data';
import { IonicImageViewerModule } from 'ionic-img-viewer';
import { ErrorHandlerProvider } from '../providers/error-handler/error-handler';
import { Camera } from '@ionic-native/camera';
import { IonicStepperModule } from 'ionic-stepper';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Push } from '@ionic-native/push';
import { ProgressBarModule } from "angular-progress-bar";
import { CallNumber } from '@ionic-native/call-number';
import { SocialSharing } from '@ionic-native/social-sharing';



//import custom pages
import { ComponentsModule } from '../components/components.module';

//Providers
import { SearchfeedProvider } from '../providers/searchfeed/searchfeed';
import { ObjectInitProvider } from '../providers/object-init/object-init';
import { AppointmentsProvider } from '../providers/appointments/appointments';
import { FcmProvider } from '../providers/fcm/fcm';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { UserSvcProvider } from '../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../providers/toast-svc/toast-svc';
import { FileUploadSvcProvider } from '../providers/file-upload-svc/file-upload-svc';
import { DepositProvider } from '../providers/deposit/deposit';
import { PaginationProvider } from '../providers/pagination/pagination';
import { UsagePatternProvider } from '../providers/usage-pattern/usage-pattern';
import { AgentsProvider } from '../providers/agents/agents';


export const firebaseConfig = {
    apiKey: "AIzaSyDT6HDi-pzKJDKGIUmBqz75ti-SMVzt0tY",
    authDomain: "clickinn-996f0.firebaseapp.com",
    databaseURL: "https://clickinn-996f0.firebaseio.com",
    projectId: "clickinn-996f0",
    storageBucket: "clickinn-996f0.appspot.com",
    messagingSenderId: "882290923419"
}

@NgModule({
  declarations: [
    MyApp,
  ],
  imports: [
    BrowserModule,
    IonicModule.forRoot(MyApp),
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireAuthModule, 
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule, 
    HttpClientModule,
    IonicStorageModule.forRoot(), 
    IonicImageViewerModule,
    IonicStepperModule,
    BrowserAnimationsModule, 
    ComponentsModule,
    ProgressBarModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp 
  ],
  providers: [
   StatusBar, SplashScreen, SocialSharing,
   Calendar, DatePicker, Camera, File, FileTransfer, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MapsProvider, 
    AccommodationsProvider,
    LocalDataProvider,
    ErrorHandlerProvider,
    SearchfeedProvider,
    ObjectInitProvider,
    AppointmentsProvider,
    FcmProvider,
    ChatServiceProvider,
    UserSvcProvider,
    ToastSvcProvider,
    FileUploadSvcProvider,
    Push,
    DepositProvider,
    PaginationProvider,
    CallNumber,
    UsagePatternProvider,
    AgentsProvider 
  ]
})
export class AppModule {}
