import { BrowserModule } from '@angular/platform-browser';
import { HttpModule } from '@angular/http';
import { NgModule, ErrorHandler } from '@angular/core';

import { IonicApp, IonicModule, IonicErrorHandler } from 'ionic-angular';

import { InAppBrowser } from '@ionic-native/in-app-browser';
import { SplashScreen } from '@ionic-native/splash-screen';

import { IonicStorageModule } from '@ionic/storage';

import { ConferenceApp } from './app.component';

import { RepeatingBillsPage } from '../pages/repeating-bills/repeating-bills';
import { RepeatingBillsPopoverPage } from '../pages/repeating-bills-popover/repeating-bills-popover';
import { AccountPage } from '../pages/account/account';
import { LoginPage } from '../pages/login/login';
import { StatsPage } from '../pages/stats/stats';
import { BillsPage } from '../pages/bills/bills';
import { SignupPage } from '../pages/signup/signup';
import { AddBillPage } from '../pages/add-bill/add-bill';
import { TabsPage } from '../pages/tabs/tabs';
import { TutorialPage } from '../pages/tutorial/tutorial';
import { SupportPage } from '../pages/support/support';
import { DebtsPage } from '../pages/debts/debts';
import { AddDebtPage } from '../pages/add-debt/add-debt';
import { DebtsListPage } from '../pages/debts-list/debts-list';

import { ConferenceData } from '../providers/conference-data';
import { UserData } from '../providers/user-data';

// Import the AF2 Module
import { AngularFireModule } from 'angularfire2';
import { AngularFireDatabaseModule } from 'angularfire2/database';
import { AngularFireAuthModule } from 'angularfire2/auth';

import { firebaseConfig } from './app.config';

@NgModule({
  declarations: [
    ConferenceApp,
    RepeatingBillsPage,
    AccountPage,
    LoginPage,
    StatsPage,
    RepeatingBillsPopoverPage,
    AddBillPage,
    SignupPage,
    BillsPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    DebtsPage,
    AddDebtPage,
    DebtsListPage
  ],
  imports: [
    BrowserModule,
    HttpModule,
    AngularFireModule.initializeApp(firebaseConfig),
    AngularFireDatabaseModule,
    AngularFireAuthModule,
    IonicModule.forRoot(ConferenceApp, {}, {
      links: [
        { component: TabsPage, name: 'TabsPage', segment: 'tabs' },
        { component: BillsPage, name: 'Schedule', segment: 'schedule' },
        { component: AddBillPage, name: 'SpeakerList', segment: 'speakerList' },
        { component: StatsPage, name: 'Stats', segment: 'stats' },
        { component: RepeatingBillsPage, name: 'RepeatingBillsPage', segment: 'repeating-bills' },
        { component: TutorialPage, name: 'Tutorial', segment: 'tutorial' },
        { component: SupportPage, name: 'SupportPage', segment: 'support' },
        { component: LoginPage, name: 'LoginPage', segment: 'login' },
        { component: AccountPage, name: 'AccountPage', segment: 'account' },
        { component: SignupPage, name: 'SignupPage', segment: 'signup' },
        { component: DebtsPage, name: 'DebtsPage', segment: 'debts' },
        { component: AddDebtPage, name: 'AddDebtPage', segment: 'add-debt' },
        { component: DebtsListPage, name: 'DebtsListPage', segment: 'debt-list' }
      ]
    }),
    IonicStorageModule.forRoot()
  ],
  bootstrap: [IonicApp],
  entryComponents: [
    ConferenceApp,
    RepeatingBillsPage,
    AccountPage,
    LoginPage,
    StatsPage,
    RepeatingBillsPopoverPage,
    AddBillPage,
    SignupPage,
    BillsPage,
    TabsPage,
    TutorialPage,
    SupportPage,
    DebtsPage,
    AddDebtPage,
    DebtsListPage
  ],
  providers: [
    { provide: ErrorHandler, useClass: IonicErrorHandler },
    ConferenceData,
    UserData,
    InAppBrowser,
    SplashScreen
  ]
})
export class AppModule { }
