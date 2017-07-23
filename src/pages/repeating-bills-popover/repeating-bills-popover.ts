import { Component } from '@angular/core';

import { App, NavController, ModalController, ViewController, ToastController} from 'ionic-angular';

import { NgForm } from '@angular/forms';
import * as firebase from 'firebase';

@Component({
  template: `
    <ion-content>
      <form #addRepeatingBillsForm="ngForm" novalidate>
        <ion-list no-lines>
          <ion-item>
            <ion-label stacked color="primary">Amount</ion-label>
            <ion-input [(ngModel)]="repeatingBill.amount" name="amount" type="number" #amount="ngModel" spellcheck="false" autocapitalize="off"
              >
            </ion-input>
          </ion-item>
          <p ion-text [hidden]="amount.valid || submitted == false" color="danger" padding-left>
            Please enter the repeating bill amount
          </p>

          <ion-item>
            <ion-label stacked color="primary">Title</ion-label>
            <ion-input [(ngModel)]="repeatingBill.title" name="title" type="text" #title="ngModel">
            </ion-input>
          </ion-item>
          <p ion-text [hidden]="title.valid || submitted == false" color="danger" padding-left>
            Repeating Bill title is required
          </p>
        </ion-list>

        <ion-row responsive-sm>
          <ion-col>
            <button ion-button (click)="addRepeatingBills(addRepeatingBillsForm)" type="submit" block [(disabled)]=submitted>Add Repeating Bill</button>
          </ion-col>
        </ion-row>
      </form>
    </ion-content>
  `
})
export class RepeatingBillsPopoverPage {

  constructor(
    public viewCtrl: ViewController,
    public navCtrl: NavController,
    public app: App,
    public modalCtrl: ModalController,
    public toastCtrl: ToastController
  ) { }
  
  public repeatingBill: any = {};
  public submitted:boolean = false;

  addRepeatingBills(form: NgForm){
    this.submitted = true;
    if(form.valid){
      var user = firebase.auth().currentUser;
      let billObj: any = {};
      if(!this.repeatingBill.title || !this.repeatingBill.amount){
        alert('Please fill in the required fields.');
        this.submitted = false;
        return;
      }
      billObj = {
        title:this.repeatingBill.title, 
        amount:this.repeatingBill.amount, 
        startdate:new Date().toString() 
      };

      firebase.database()
        .ref('/'+user.uid+'/repeating-bills')
        .push(billObj,(error:any)=>{
            if(!error){
              this.presentToast();
              this.repeatingBill.title = '';
              this.repeatingBill.amount = null;
              this.submitted = false;
              this.close();
            }else{
              this.submitted = false;
            }
        });
    }
  }
  close() {
    this.viewCtrl.dismiss();
  }
  presentToast() {
    let toast = this.toastCtrl.create({
      message: 'Your repeating bill was added.',
      duration: 3000
    });
    toast.present();
  }
}