import { Component } from '@angular/core';
import { InAppBrowser } from '@ionic-native/in-app-browser';
import { ToastController } from 'ionic-angular';
import { ConferenceData } from '../../providers/conference-data';
import { NgForm } from '@angular/forms';
import { UserData } from '../../providers/user-data';
import { AngularFireDatabase } from 'angularfire2/database';
import * as firebase from 'firebase';
import * as moment from 'moment';

@Component({
  selector: 'page-add-bill',
  templateUrl: 'add-bill.html'
})
export class AddBillPage {
  disabled: boolean = false;
  bill: {title?: string, amount?: Number, cc?:boolean} = {};
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

  addBill(form: NgForm){
    this.submitted = true;
    if(form.valid){
      var user = firebase.auth().currentUser;
      let currentMonth = moment().format("MMMM-YYYY");
      let billObj: any = {};
      if(!this.bill.title || !this.bill.amount){
        alert('Please fill in the required fields.');
        this.submitted = false;
        return;
      }
      billObj = {
        title:this.bill.title, 
        amount:this.bill.amount,
        cc:this.bill.cc ? this.bill.cc: false, 
        timestamp:new Date().toString() 
      };
      let updateUrl = '/'+user.uid+'/'+ currentMonth;
      if(billObj.cc){
        updateUrl = '/'+user.uid+'/debts'
      }
      firebase.database()
        .ref(updateUrl)
        .push(billObj,(error:any)=>{
            if(!error){
              this.presentToast();
              this.bill.title = '';
              this.bill.amount = null;
              this.bill.cc = false;
              this.submitted = false;
            }else{
              this.submitted = false;
            }
        });
    }
  }

  ionViewDidLoad() {
    this.confData.getSpeakers().subscribe((speakers: any[]) => {
      this.speakers = speakers;
    });
  }

  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your bill was added.',
      duration: 3000
    });
    toast.present();
  }
}
