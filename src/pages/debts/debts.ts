import { Component } from '@angular/core';
import { IonicPage, NavController, NavParams, AlertController, ToastController } from 'ionic-angular';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

import { AddDebtPage } from '../add-debt/add-debt';
import { DebtsListPage } from '../debts-list/debts-list';
import * as moment from 'moment';

/**
 * Generated class for the DebtsPage page.
 *
 * See http://ionicframework.com/docs/components/#navigation for more info
 * on Ionic pages and navigation.
 */
@IonicPage()
@Component({
  selector: 'page-debts',
  templateUrl: 'debts.html',
})
export class DebtsPage {
  userDetails:any;
  cashDebt:any = 0;
  cardDebt:any = 0;
  constructor(public navCtrl: NavController, 
  public navParams: NavParams, 
  public db: AngularFireDatabase, 
  public alertCtrl: AlertController,
  public toastCtrl: ToastController,
  ) {
    firebase.auth().onAuthStateChanged((user:any) => {

      if (user) {
        this.userDetails = user;
        this.getDebts();
      } else {
        
      }
    });
  }

  getDebts() {
    this.db.object('/'+this.userDetails.uid+'/debts').subscribe((data:any)=>{
      this.cashDebt = 0;
      this.cardDebt = 0;
      for(let item in data){
        if(data[item] && !data[item]['clear'] && data[item]['cash']){
          this.cashDebt += parseFloat(data[item]['amount']);
        }
        if(data[item] && !data[item]['clear'] && data[item]['cc']){
          if(data[item]['negative']){
            this.cardDebt -= parseFloat(data[item]['amount']);
          }else{
            this.cardDebt += parseFloat(data[item]['amount']);
          }
        }
      }
    });
  }

  routeToViewDebts(type:string){
    this.navCtrl.push(DebtsListPage,{debtType:type});
  }

  routeToAddDebt(){
    this.navCtrl.push(AddDebtPage)
  }

  promptDebtPay(){
    this.showPrompt();
  }

  showPrompt() {
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
            this.updateDebt(data);
          }
        }
      ]
    });
    prompt.present();
  }

  updateDebt(data:any){
    let user = firebase.auth().currentUser;
    let currentMonth = moment().format("MMMM-YYYY");
    let clearDebtObj = {
        amount:data.amount,
        cash: true,
        negative: true,
        cc:true,
        timestamp:new Date().toString() 
      };

    firebase.database()
      .ref('/'+user.uid+'/debts')
      .push(clearDebtObj,(error:any)=>{
        if(!error){
          this.presentToast(); 
        }
    });
    let updateUrl = '/'+user.uid+'/'+ currentMonth;
    let debtObj = {
        title:'Cash Paid', 
        amount:data.amount,
        cc:true,
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
}
