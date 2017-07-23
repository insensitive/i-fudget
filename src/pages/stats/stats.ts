import { Component } from '@angular/core';

import { ConferenceData } from '../../providers/conference-data';

import { Platform } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
import * as firebase from 'firebase';


@Component({
  selector: 'page-stats',
  templateUrl: 'stats.html'
})
export class StatsPage {
  userDetails:any;
  currentMonthExpense:any = 0;
  fixedExpenses:any = 0;
  constructor(public confData: ConferenceData, public platform: Platform, public db: AngularFireDatabase) {
    firebase.auth().onAuthStateChanged((user:any) => {

      if (user) {
        this.userDetails = user;
        this.getBills();
        this.getRepeatingBills();
      } else {
        
      }
    });
  }

  ionViewDidLoad() {
    
  }

  getBills(searchMonth?: string) {
    if(!searchMonth){
      searchMonth = moment().format("MMMM-YYYY");
    }
    this.db.object('/'+this.userDetails.uid+'/'+searchMonth).subscribe((data:any)=>{
      this.currentMonthExpense = 0;
      for(let item in data){
        if(data[item] && (data[item] && data[item]['archived'] != 1))
          this.currentMonthExpense += parseFloat(data[item]['amount']);
      }
    });
  }

  getRepeatingBills() {
    this.db.object('/'+this.userDetails.uid+'/repeating-bills').subscribe((data)=>{
      this.fixedExpenses = 0;
      for(var item in data){
          // this condition is required to prevent moving forward to prototype chain
          if(data.hasOwnProperty(item)){
              if(data[item]){
                if(data[item]['enddate']){
                  if(moment(new Date(data[item]['enddate'])).isAfter(new Date(),'month')){
                    this.fixedExpenses += parseFloat(data[item]['amount']);
                  }
                }else{
                  this.fixedExpenses += parseFloat(data[item]['amount']);
                }
              }
          } 
      }
    });
  }
}
