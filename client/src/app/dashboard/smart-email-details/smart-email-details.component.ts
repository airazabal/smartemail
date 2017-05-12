import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'


@Component({
  selector: 'app-email-details',
  templateUrl: './smart-email-details.component.html'
})
export class SmartEmailDetailsComponent implements OnInit {

  constructor(private fromComponentService: FromComponentService, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/details')
    this.dashboardCtxService.setTitle('Smart Email Details')
  }

}
