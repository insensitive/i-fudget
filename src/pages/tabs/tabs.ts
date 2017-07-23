import { Component } from '@angular/core';

import { NavParams } from 'ionic-angular';

import { RepeatingBillsPage } from '../repeating-bills/repeating-bills';
import {StatsPage } from '../stats/stats';
import { BillsPage } from '../bills/bills';
import { DebtsPage } from '../debts/debts';

@Component({
  templateUrl: 'tabs.html'
})
export class TabsPage {
  // set the root pages for each tab
  tab1Root: any = BillsPage;
  tab2Root: any = DebtsPage;
  tab3Root: any = StatsPage;
  tab4Root: any = RepeatingBillsPage;
  mySelectedIndex: number;

  constructor(navParams: NavParams) {
    this.mySelectedIndex = navParams.data.tabIndex || 0;
  }

}
