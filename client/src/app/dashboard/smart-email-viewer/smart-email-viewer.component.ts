import { Component, OnInit } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'
import { EmailVizComponent } from '../../shared/wsl-email/email-viz/email-viz.component'
import { SmartEmailGraphComponent } from "./smart-email-graph/smart-email-graph.component"

@Component({
  selector: 'app-email-viewer',
  templateUrl: './smart-email-viewer.component.html',
  styleUrls: ['./smart-email-viewer.component.css']
})

export class SmartEmailViewerComponent implements OnInit {
  public emails = [];
  public emailIds = [];
  public filteredEmailIds = [];
  selectedEmailId;
  selectedEmail;
  constructor(
    private fromComponentService: FromComponentService,
    private dashboardCtxService: DashboardCtxService,
    private smartEmailService: SmartEmailService) { }

  updateSelected(emailId) {
    console.log("old selected email: " + this.selectedEmailId)
    this.selectedEmailId = emailId
    this.selectedEmail = this.emails.filter((email) => email.id === this.selectedEmailId)[0]
    console.log("new selected email: " + this.selectedEmailId)
  }

  search(searchTerm) {
    this.filteredEmailIds = this.emailIds.filter((id) => id.includes(searchTerm))
    console.log(searchTerm)
  }
  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/viewer')
    this.dashboardCtxService.setTitle('Smart Email Viewer')
    console.log("ngOnInit for smart-email-viewer")
    this.smartEmailService.getAllDocs()
      .subscribe((response) => {
        //this.emails = JSON.parse(response);
        this.emails = response;
        this.emailIds = this.emails.map((email) => email.id)
        this.filteredEmailIds = this.emailIds
        console.log(this.filteredEmailIds)
      })
    }

}
