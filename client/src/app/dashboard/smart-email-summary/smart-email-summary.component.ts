import { Component, OnInit} from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'
import { ConfusionMatrixService } from '../shared/confusion-matrix/confusion-matrix.service'
import { ConfusionMatrix} from '../shared/confusion-matrix/ConfusionMatrix'

import { fade } from '../../shared/utils/animations'

@Component({
  selector: 'app-smart-email-summary',
  templateUrl: './smart-email-summary.component.html'
})
export class SmartEmailSummaryComponent implements OnInit {

  public transactions: any
  public confusionMatrix: ConfusionMatrix
  public loading:boolean = false

  constructor(
    private fromComponentService: FromComponentService,
    private dashboardCtxService: DashboardCtxService,
    private confusionMatrixService:ConfusionMatrixService,
    private smartEmailService: SmartEmailService
  ) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/summary')
    this.dashboardCtxService.setTitle('Smart Email Summary')
    this.loading = true
    this.smartEmailService.getTransactions()
      .subscribe((response) => {
        //        console.log('Transactions...', response)
        this.transactions = response
        //        this.summary = this.summarize(response)
        this.confusionMatrix = this.confusionMatrixService.generate('classification', this.transactions)
        console.log(`summary: `, this.confusionMatrix)
        this.loading = false
      })
  }
  
  recategorizeAll() {
    console.log('Calling RecategorizeAll! ')
    this.smartEmailService.recategorizeAll()
      .subscribe((response) => {
        console.log('Got a Result!', response)
      }, (error) => {
        console.log(error)
      })
  }

}
