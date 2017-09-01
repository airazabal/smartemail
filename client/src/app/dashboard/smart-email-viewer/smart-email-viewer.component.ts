import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'



@Component({
  selector: 'app-email-viewer',
  templateUrl: './smart-email-viewer.component.html'
})
export class SmartEmailViewerComponent implements OnInit {
  public emails: any
  constructor(
    private fromComponentService: FromComponentService,
    private dashboardCtxService: DashboardCtxService,
    private smartEmailService: SmartEmailService) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/viewer')
    this.dashboardCtxService.setTitle('Smart Email Viewer')
    this.emails = this.smartEmailService.getAllDocs()
      .subscribe((response) => {
        this.emails = response;
      })
    }

}
