import { Component } from '@angular/core';

import { AlertController, App, NavController, ToastController, Refresher } from 'ionic-angular';
import { UserData } from '../../providers/user-data';

import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';
import { ActionSheetController } from 'ionic-angular';
import { AddBillPage } from '../add-bill/add-bill';

@Component({
  selector: 'page-bills',
  templateUrl: 'bills.html'
})
export class BillsPage {
  segment = 'all';
  bills: any = [];
  repeatingBills: any = [];
  userDetails : any;
  debug:any;
  months:any = moment.months();
  selectedMonth:any = moment().format('MMMM');
  selectedYear:any = moment().format('YYYY');
  searchMonth:any = this.selectedMonth + '-' + this.selectedYear;
  
  constructor(
    public alertCtrl: AlertController,
    public app: App,
    public navCtrl: NavController,
    public toastCtrl: ToastController,
    public user: UserData,
    public db: AngularFireDatabase,
    public actionSheetCtrl: ActionSheetController
  ) {}

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged((user:any) => {
      if (user) {
        this.userDetails = user;
        this.presentToast(user.email);
        this.getBills();
      } else {
        
      }
    });
  }

  getBills() {
    if(this.segment == 'all'){
      this.searchMonth = moment().format('MMMM') + '-' + moment().format('YYYY');
    }else{
      this.searchMonth = this.selectedMonth + '-' + this.selectedYear;  
    }
    return this.db.object('/'+this.userDetails.uid+'/'+this.searchMonth).subscribe((data)=>{
      let bills = [];
      for(var item in data){
          // this condition is required to prevent moving forward to prototype chain
          if(data.hasOwnProperty(item)){
              if(data[item] && (data[item] && data[item]['archived'] != 1)){
                data[item]['id'] = item;
                bills.unshift(data[item]);
              }
          } 
      }
      this.bills = bills;
      this.getRepeatingBills()
    });
  }

  getRepeatingBills(){
    return this.db.object('/'+this.userDetails.uid+'/repeating-bills').subscribe((data)=>{
      let bills = [];
      for(let item in data){
          // this condition is required to prevent moving forward to prototype chain
          if(data.hasOwnProperty(item)){
            if(data[item] && moment(new Date(data[item]['startdate'])).isSameOrBefore(new Date(this.searchMonth),'month')){
              if(data[item]['enddate']){
                if(moment(new Date(data[item]['enddate'])).isAfter(new Date(this.searchMonth),'month')){
                  data[item]['id'] = item;
                  bills.unshift(data[item]);
                }
              }else{
                data[item]['id'] = item;
                bills.unshift(data[item]);
              }
            }
          }
      }
      this.repeatingBills = bills;
    });
  }
  filterRecords(){
    this.searchMonth = this.selectedMonth + '-' + this.selectedYear;
    this.getBills();
  }

  presentToast(username:string) {
    let toast = this.toastCtrl.create({
      message: 'Welcome '+ username,
      duration: 3000
    });
    toast.present();
  }
  archiveBill(billid: String) {
    firebase.database().ref(this.userDetails.uid + '/'+this.searchMonth+'/' + billid).update({
      archived:1
    });
  }
  archiveFixedBill(billid: String) {
    firebase.database().ref(this.userDetails.uid + '/repeating-bills/' + billid).update({
      enddate:new Date().toString()
    });
  }
  actionSheetForSimpleBills(billid: String) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your Bill',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.archiveBill(billid);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

  actionSheetForFixedBills(billid: String) {
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify Your Repeating Bill',
      buttons: [
        {
          text: 'Delete',
          handler: () => {
            this.archiveFixedBill(billid);
          }
        },{
          text: 'Cancel',
          role: 'cancel',
          handler: () => {
            
          }
        }
      ]
    });
    actionSheet.present();
  }

  routeToAddBill(){
    this.navCtrl.push(AddBillPage);
  }

  doRefresh(refresher: Refresher) {
    this.getBills();
    refresher.complete();
  }
}
