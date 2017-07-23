import { Component } from '@angular/core';
import { PopoverController, NavParams, ActionSheetController, ToastController, AlertController } from 'ionic-angular';

import { RepeatingBillsPopoverPage } from '../repeating-bills-popover/repeating-bills-popover';
import * as firebase from 'firebase';
import { AngularFireDatabase } from 'angularfire2/database';
import * as moment from 'moment';

@Component({
  selector: 'page-debts-list',
  templateUrl: 'debts-list.html'
})
export class DebtsListPage {
  public debts: any = [];
  public userDetails: any;
  constructor(
    public popoverCtrl: PopoverController,
    public db: AngularFireDatabase,
    public navParams: NavParams,
    public actionSheetCtrl: ActionSheetController,
    public toastCtrl: ToastController,
    public alertCtrl: AlertController
    ) { }

  ionViewDidLoad() {
    firebase.auth().onAuthStateChanged((user:any) => {
      if (user) {
        this.userDetails = user;
        this.getDebts();
      } else {
        
      }
    });
  }

  getDebts() {
    return this.db.object('/'+this.userDetails.uid+'/debts').subscribe((data)=>{
      this.debts = [];
      let debtType = this.navParams.get('debtType');
      //var array = [];
      for(var item in data){
          // this condition is required to prevent moving forward to prototype chain
          if(data.hasOwnProperty(item)){
              if(data[item]){
                if(data[item][debtType] && !data[item]['clear']){
                  data[item]['id'] = item;
                  this.debts.unshift(data[item]);
                }
              }
          } 
      }
    });
  }

  modifyDebt(debt:any){
    let actionSheet = this.actionSheetCtrl.create({
      title: 'Modify your Bill',
      buttons: [
        {
          text: 'Pay Debt',
          handler: () => {
            this.clearDebt(debt);
          }
        },{
          text: 'Pay Partial Debt',
          handler: () => {
            this.clearPartialDebt(debt);
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

  clearDebt(debt:any){
    let user = firebase.auth().currentUser;
    let currentMonth = moment().format("MMMM-YYYY");
    firebase.database().ref(this.userDetails.uid + '/debts/' + debt.id).update({
      clear:true
    });
    let updateUrl = '/'+user.uid+'/'+ currentMonth;
    let debtObj = {
        title:debt.title, 
        amount:debt.amount,
        cc:debt.cc?debt.cc:false,
        debtid:debt.id,
        timestamp:new Date().toString() 
      };
    firebase.database()
      .ref(updateUrl)
      .push(debtObj,(error:any)=>{
          if(!error){
            this.presentToast();
            //this.submitted = false;
          }else{
            //this.submitted = false;
          }
      });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your debt is now cleared.',
      duration: 2000
    });
    toast.present();
  }

  clearPartialDebt(debt:any){
    this.showPrompt(debt);
  }

  presentPopover(event: Event) {
    let popover = this.popoverCtrl.create(RepeatingBillsPopoverPage);
    popover.present({ ev: event });
  }

  updateDebt(debt:any, data:any){
    let user = firebase.auth().currentUser;
    let currentMonth = moment().format("MMMM-YYYY");
    firebase.database().ref(this.userDetails.uid + '/debts/' + debt.id).update({
      amount:parseFloat(debt.amount) - parseFloat(data.amount)
    });
    let updateUrl = '/'+user.uid+'/'+ currentMonth;
    let debtObj = {
        title:debt.title, 
        amount:data.amount,
        cc:debt.cc?debt.cc:false,
        debtid:debt.id,
        timestamp:new Date().toString() 
      };
    firebase.database()
      .ref(updateUrl)
      .push(debtObj,(error:any)=>{
          if(!error){
            this.presentToast();
            //this.submitted = false;
          }else{
            //this.submitted = false;
          }
      });
  }

  showPrompt(debt:any) {
    let prompt = this.alertCtrl.create({
      title: 'Enter Amount',
      inputs: [
        {
          name: 'amount',
          placeholder: 'Amount'
        },
      ],
      buttons: [
        {
          text: 'Cancel',
          handler: data => {
            //console.log('Cancel clicked');
          }
        },
        {
          text: 'Save',
          handler: data => {
            this.updateDebt(debt,data);
          }
        }
      ]
    });
    prompt.present();
  }
}
