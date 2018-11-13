import { Injectable } from '@angular/core';
import { AlertController, Events } from 'ionic-angular';
import { Network } from '@ionic-native/network';

export enum ConnectionStatusEnum {
    Online,
    Offline
}


@Injectable()
export class ConnectionProvider {
  previousStatus: any;
  constructor(
  	private network: Network,
  	private eventCtrl: Events,
  	private alertCtrl: AlertController
  ) {
    this.previousStatus = ConnectionStatusEnum.Online;
  }


   public initializeNetworkEvents(): void {
        this.network.onDisconnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Online) {
                this.eventCtrl.publish('network:offline');
            }
            this.previousStatus = ConnectionStatusEnum.Offline;
        });
        this.network.onConnect().subscribe(() => {
            if (this.previousStatus === ConnectionStatusEnum.Offline) {
                this.eventCtrl.publish('network:online');
            }
            this.previousStatus = ConnectionStatusEnum.Online;
        });
    }

}
