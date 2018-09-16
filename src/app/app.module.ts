import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ErrorHandler, NgModule } from '@angular/core';
import { IonicApp, IonicErrorHandler, IonicModule } from 'ionic-angular';
import { HttpClientModule } from '@angular/common/http';
import { Calendar } from '@ionic-native/calendar';
import { DatePicker } from '@ionic-native/date-picker';
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
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
import { DocumentViewer } from '@ionic-native/document-viewer';
import { File } from '@ionic-native/file';
import { FileTransfer } from '@ionic-native/file-transfer';
import { Firebase } from '@ionic-native/firebase';


//import custom pages

import { AlertPageModule } from '../pages/alert/alert.module';
import { ApartmentDetailsPageModule } from '../pages/apartment-details/apartment-details.module'
import { AppointmentPageModule } from '../pages/appointment/appointment.module';
import { BookingsPageModule } from '../pages/bookings/bookings.module';
import { ConfirmationPageModule } from '../pages/confirmation/confirmation.module';
import { EditProfilePageModule } from '../pages/edit-profile/edit-profile.module';
import { FavouritesPageModule } from '../pages/favourites/favourites.module';
import { HomePageModule } from '../pages/home/home.module';
import { InfoPageModule } from '../pages/info/info.module';
import { LeasePageModule } from '../pages/lease/lease.module';
import { LoginPageModule } from '../pages/login/login.module';
import { PaymentDetailsPageModule } from '../pages/payment-details/payment-details.module';
import { PrefferencesPageModule } from '../pages/prefferences/prefferences.module';
import { ProfilePageModule } from '../pages/profile/profile.module';
import { SecurePageModule } from '../pages/secure/secure.module';
import { SeekingPageModule } from '../pages/seeking/seeking.module';
import { SignupPageModule } from '../pages/signup/signup.module';
import { UploadAndEarnPageModule } from '../pages/upload-and-earn/upload-and-earn.module';
import { VirtualViewingPageModule } from '../pages/virtual-viewing/virtual-viewing.module';
import { WelcomePageModule } from '../pages/welcome/welcome.module';
import { AgentDashboardPageModule } from '../pages/agent-dashboard/agent-dashboard.module';
import { BursaryPlacementsPageModule } from '../pages/bursary-placements/bursary-placements.module';
import { LandlordDashboardPageModule } from '../pages/landlord-dashboard/landlord-dashboard.module';
import { CaretakerManagerDashboardPageModule } from '../pages/caretaker-manager-dashboard/caretaker-manager-dashboard.module';
import { SearchfeedPageModule } from '../pages/searchfeed/searchfeed.module';
import { ChatsPageModule } from '../pages/chats/chats.module';
import { ManageBuildingsPageModule } from '../pages/manage-buildings/manage-buildings.module';
import { ComponentsModule } from '../components/components.module';
import { SearchfeedProvider } from '../providers/searchfeed/searchfeed';
import { ObjectInitProvider } from '../providers/object-init/object-init';
import { AppointmentsProvider } from '../providers/appointments/appointments';
import { FcmProvider } from '../providers/fcm/fcm';
import { ChatServiceProvider } from '../providers/chat-service/chat-service';
import { ChatThreadPageModule } from '../pages/chat-thread/chat-thread.module';
import { MessageInputPopupPageModule } from '../pages/message-input-popup/message-input-popup.module';
import { UserSvcProvider } from '../providers/user-svc/user-svc';
import { ToastSvcProvider } from '../providers/toast-svc/toast-svc';


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
    AngularFireDatabaseModule,
    AngularFireAuthModule, 
    AngularFirestoreModule.enablePersistence(),
    AngularFireStorageModule, 
    HttpClientModule,
    IonicStorageModule.forRoot(), 
    IonicImageViewerModule,
    IonicStepperModule,
    BrowserAnimationsModule,
    WelcomePageModule,
    AlertPageModule, AppointmentPageModule, BookingsPageModule, ConfirmationPageModule, EditProfilePageModule,
    FavouritesPageModule, HomePageModule, InfoPageModule, LeasePageModule, LoginPageModule, PaymentDetailsPageModule, 
    PrefferencesPageModule,
    ProfilePageModule, SecurePageModule, SeekingPageModule, SignupPageModule, UploadAndEarnPageModule, VirtualViewingPageModule, 
    ComponentsModule, AgentDashboardPageModule, BursaryPlacementsPageModule, LandlordDashboardPageModule,
    CaretakerManagerDashboardPageModule, SearchfeedPageModule, ChatsPageModule, ManageBuildingsPageModule,
    ApartmentDetailsPageModule, ChatThreadPageModule, MessageInputPopupPageModule
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    MyApp 
  ],
  providers: [
   Calendar, DatePicker, Camera, DocumentViewer, File, FileTransfer, 
    {provide: ErrorHandler, useClass: IonicErrorHandler},
    MapsProvider, 
    AccommodationsProvider,
    LocalDataProvider,
    ErrorHandlerProvider,
    SearchfeedProvider,
    ObjectInitProvider,
    AppointmentsProvider,
    Firebase,
    FcmProvider,
    ChatServiceProvider,
    UserSvcProvider,
    ToastSvcProvider
  ]
})
export class AppModule {}
