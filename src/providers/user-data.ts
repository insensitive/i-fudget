import { Injectable } from '@angular/core';

import { Events } from 'ionic-angular';
import { Storage } from '@ionic/storage';

import { AngularFireAuth } from 'angularfire2/auth';
import * as moment from 'moment';
import * as firebase from 'firebase/app';

@Injectable()
export class UserData {
  _favorites: string[] = [];
  HAS_LOGGED_IN = 'hasLoggedIn';
  HAS_SEEN_TUTORIAL = 'hasSeenTutorial';

  constructor(
    public events: Events,
    public storage: Storage,
    public afAuth: AngularFireAuth
  ) {}

  hasFavorite(sessionName: string): boolean {
    return (this._favorites.indexOf(sessionName) > -1);
  };

  addFavorite(sessionName: string): void {
    this._favorites.push(sessionName);
  };

  removeFavorite(sessionName: string): void {
    let index = this._favorites.indexOf(sessionName);
    if (index > -1) {
      this._favorites.splice(index, 1);
    }
  };

  login(email: string, password: string): any {
    return firebase.auth().signInWithEmailAndPassword(email, password)
    .then((data)=>{
      this.storage.set('uid',data.uid)
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.setUsername(email);
      this.events.publish('user:login');
      return true
    })
    .catch(function(error) {
      console.log(error);
      return false;
    });
  };

  signup(email: string, password: string): void {
    firebase.auth().createUserWithEmailAndPassword(email, password)
    .then((data) => {
      this.storage.set('uid',data.uid)
      this.storage.set(this.HAS_LOGGED_IN, true);
      this.setUsername(email);
      this.events.publish('user:signup');
    })
    .catch(function(error) {
      console.log(error);
    });
  };

  logout(): void {
    this.storage.remove(this.HAS_LOGGED_IN);
    this.storage.remove('username');
    this.events.publish('user:logout');
  };

  setUsername(username: string): void {
    this.storage.set('username', username);
  };

  getUsername(): Promise<string> {
    return this.storage.get('username').then((value) => {
      return value;
    });
  };

  getUid(): Promise<string> {
    return this.storage.get('uid').then((value) => {
      return value;
    });
  };

  hasLoggedIn(): Promise<boolean> {
    return this.storage.get(this.HAS_LOGGED_IN).then((value) => {
      return value === true;
    });
  };

  checkHasSeenTutorial(): Promise<string> {
    return this.storage.get(this.HAS_SEEN_TUTORIAL).then((value) => {
      return value;
    });
  };

  getlastTenYears(): any {
    let Start = new Date(moment().subtract(10,'years').toString());
    let End = new Date(moment.now());
    let years = moment(End).diff(Start, 'years');
    let yearsBetween = [];
    for(let year = 0; year < years; year++){
      yearsBetween.unshift(Start.getFullYear() + year);
    }
    yearsBetween.unshift(moment().year());
    return yearsBetween;
  }
}