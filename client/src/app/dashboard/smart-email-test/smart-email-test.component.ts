import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { routerTransition } from '../../shared/utils/router-animations';

@Component({
  selector: 'app-email-test',
  templateUrl: './smart-email-test.component.html'
})
export class SmartEmailTestComponent implements OnInit {

  public emailToViz:any
  public loading:boolean = false

  constructor(private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/test')
    this.dashboardCtxService.setTitle('Smart Email Test')
  }

  // Set email to viz...
  visualizeEmail(status) {
    console.log('visualizeEmail! ', status)
    if (status.status === 'started') {
      this.loading = true
    }
    if (status.status === 'finished') {
       this.loading = false;
       if (status.result) {
         this.emailToViz = status.result
       }
    }
    if (status.status === 'failed') {
       this.loading = false;
       if (status.result) {
         console.log(status.result.statusText)
       }
    }
  }
}
