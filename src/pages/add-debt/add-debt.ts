import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToastController } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NgForm } from '@angular/forms';
import { UserData } from '../../providers/user-data';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';

@Component({
  selector: 'page-add-debt',
  templateUrl: 'add-debt.html'
})
export class AddDebtPage {
  disabled: boolean = false;
  debt: {title?: string, amount?: Number, cash?:boolean} = {};
  username: string;
  speakers: any[] = [];
  submitted = false;

  constructor(
    public confData: ConferenceData,
    public inAppBrowser: InAppBrowser,
    public userData: UserData,
    public db: AngularFireDatabase,
    public toastCtrl: ToastController
  ) { }

  addDebt(form: NgForm){
    this.submitted = true;
    if(form.valid){
      var user = firebase.auth().currentUser;
      let debtObj: any = {};
      if(!this.debt.title || !this.debt.amount){
        alert('Please fill in the required fields.');
        this.submitted = false;
        return;
      }
      debtObj = {
        title:this.debt.title, 
        amount:this.debt.amount,
        cash: true,
        timestamp:new Date().toString() 
      };

      firebase.database()
        .ref('/'+user.uid+'/debts')
        .push(debtObj,(error:any)=>{
            if(!error){
              this.presentToast();
              this.debt.title = '';
              this.debt.amount = null;
              this.submitted = false;
            }else{
              this.submitted = false;
            }
        });
    }
  }

  ionViewDidLoad() {
    
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your cash debt was added.',
      duration: 2000
    });
    toast.present();
  }
}
