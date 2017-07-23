import { Component } from '@angular/core';
import { PopoverController } from 'ionic-angular';

import { RepeatingBillsPopoverPage } from '../repeating-bills-popover/repeating-bills-popover';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';

@Component({
  selector: 'page-repeating-bills',
  templateUrl: 'repeating-bills.html'
})
export class RepeatingBillsPage {
  public repeatingBills: any;
  public userDetails: any;
  constructor(
    public popoverCtrl: PopoverController,
    public db: AngularFireDatabase
    ) { }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged((user:any) => {
      if (user) {
        this.userDetails = user;
        this.updateSchedule();
      } else {
        
      }
    });
  }

  updateSchedule() {
    return this.db.object('/'+this.userDetails.uid+'/repeating-bills').subscribe((data)=>{
      var array = [];
      for(var item in data){
          // this condition is required to prevent moving forward to prototype chain
          if(data.hasOwnProperty(item)){
              if(data[item]){
                if(data[item]['enddate']){
                  if(moment(new Date(data[item]['enddate'])).isAfter(new Date(),'month')){
                    data[item]['id'] = item;
                    array.unshift(data[item]);
                  }
                }else{
                  data[item]['id'] = item;
                  array.unshift(data[item]);
                }
              }
          } 
      }
      this.repeatingBills = array;
    });
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(RepeatingBillsPopoverPage);
    popover.present({ ev: event });
  }
}
