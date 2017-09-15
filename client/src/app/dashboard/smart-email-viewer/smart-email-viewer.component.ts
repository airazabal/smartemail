import { Component, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/operator/map';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'
import { EmailVizComponent } from '../../shared/wsl-email/email-viz/email-viz.component'
import { SmartEmailGraphComponent } from "./smart-email-graph/smart-email-graph.component"
import { fade, sideWipe } from '../../shared/utils/animations';

@Component({
  selector: 'app-email-viewer',
  templateUrl: './smart-email-viewer.component.html',
  animations: [fade(), sideWipe()],
  styleUrls: ['./smart-email-viewer.component.scss']
})

export class SmartEmailViewerComponent implements OnInit {
  @ViewChild('searchInput') searchInput;

  public formControl: FormControl = new FormControl();
  public filteredEmailsInput: Observable<any[]>;
  public emails: any[] = [];
  public emailIds = [];
  public toggleEmail: boolean = true;
  public filteredEmailIds = [];
  public searchEmailVal = '';
  selectedEmailId;
  selectedEmail;
  constructor(
    private fromComponentService: FromComponentService,
    private dashboardCtxService: DashboardCtxService,
    private smartEmailService: SmartEmailService) {
    this.filteredEmailsInput = this.formControl.valueChanges
      .startWith(null)
      .map(emailVal => emailVal ? this.search(emailVal) : this.emails.slice());
  }

  updateSelected(evt) {
    if (evt.option) {
      console.log("old selected email: " + this.selectedEmailId)
      this.selectedEmailId = evt.option.value
      this.selectedEmail = this.emails.filter((e) => e.id === this.selectedEmailId)[0]
      console.log("new selected email: " + this.selectedEmailId, evt, this.selectedEmail)
      setTimeout(() => {
        this.searchEmailVal = ''; // clear search box
        this.searchInput.nativeElement.blur();
        this.searchInput.nativeElement.value = '';
      }, 100);
      
    }
  }

  search(searchTerm): any[] {
    this.filteredEmailIds = this.emailIds.filter((id) => id.includes(searchTerm))
    const d = this.emails.filter((e) => {
      if (e.id.includes(searchTerm)) {
        return true
      } else if (e.source_email && e.source_email.subject) {
        return e.source_email.subject.includes(searchTerm);
      } else {
        return false
      }
    });
    return d;
  }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/viewer')
    this.dashboardCtxService.setTitle('Smart Email Viewer')
    console.log("ngOnInit for smart-email-viewer")
    this.smartEmailService.getAllDocs()
      .subscribe((response) => {
        this.emails = response;
        this.filteredEmailsInput = this.formControl.valueChanges
          .startWith(null)
          .map(emailVal => emailVal ? this.search(emailVal) : this.emails.slice());
        this.emailIds = this.emails.map((email) => email.id)
        this.filteredEmailIds = this.emailIds
        console.log(this.emails, this.filteredEmailIds)
      })
  }

}
