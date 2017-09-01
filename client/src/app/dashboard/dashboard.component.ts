import { Component, OnInit } from '@angular/core';

import { Router } from '@angular/router';

import { DashboardCtxService } from './shared/dashboard-ctx.service'

declare var moment:any

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent implements OnInit {

  private titleSubject
  private title
  private lastUpdated = ''

  constructor(private router: Router, private dashboardCtxService: DashboardCtxService) { }

  ngOnInit() {
    this.titleSubject = this.dashboardCtxService.titleChanged$.subscribe((title) => this.title = title)
  }

  ngAfterViewInit() {
    this.lastUpdated = moment().format('MM Do, YYYY')
  }

  routeToTab(tab) {

    console.log('routeToTab: ', tab)
    switch (tab) {
      case 'summary':
        this.title = 'Summary'
        //this.router.navigate(['home/dashboard/all-channels'])
        break
      case 'classifications':
        this.title = 'Smart Email Classifications'
        //this.router.navigate(['home/dashboard/audio-calls'])
        break
      case 'entities':
        this.title = 'Smart Email Entities'
        //this.router.navigate(['home/dashboard/audio-calls'])
        break
      case 'test':
        this.title = 'Smart Email Test'
        //this.router.navigate(['home/dashboard/chats'])
        break
      case 'viewer':
        this.title = 'Smart Email Viewer'
        //this.router.navigate(['home/dashboard/chats'])
        break
    }
  }

  ngOnDestroy() {
    this.titleSubject.unsubscribe()
  }
}
