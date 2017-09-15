import { Component, OnInit, OnChanges, SimpleChange, ViewChild } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'
import { ConfusionMatrix } from '../shared/confusion-matrix/ConfusionMatrix'
import { ConfusionMatrixService } from '../shared/confusion-matrix/confusion-matrix.service'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { routerTransition } from '../../shared/utils/router-animations';

@Component({
  selector: 'smart-email-classifications',
  templateUrl: './smart-email-classifications.component.html'
})
export class SmartEmailClassificationsComponent implements OnInit {
  public emails: any[]
  public emailToViz: any
  public emailToVizId: string
  public transactions: any
  public filterMessage: string = 'Select a box in the Confusion Matrix to display items'
  public confusionMatrix: ConfusionMatrix
  public loading: boolean = false
  public selected: string = 'right'
  public summary: any = {
    right: [],
    wrong: [],
    missing: []
  }

  @ViewChild('detailsModal') public detailsModal:ModalDirective;

  constructor(
    private fromComponentService: FromComponentService,
    private dashboardCtxService: DashboardCtxService,
    private smartEmailService: SmartEmailService,
    private confusionMatrixService:ConfusionMatrixService
  ) { }

  ngOnInit() {
    this.fromComponentService.setFrom('/home/dashboard/classifications')
    this.dashboardCtxService.setTitle('Smart Email Classifications')
    this.loading = true

    this.smartEmailService.getTransactions()
      .subscribe((response) => {
        //        console.log('Transactions...', response)
        this.transactions = response
//        this.summary = this.summarize(response)
        this.confusionMatrix = this.confusionMatrixService.generate('classification', this.transactions)
        this.loading = false
      })
    /*
    this.smartEmailService.getAllDocs()
      .subscribe((results) => {
        this.emails = results.sort((a,b) => {
          if (a.source_id > b.source_id) {
            return -1
          }
          if (a.source_id < b.source_id) {
            return 1
          }
          return 0
         });
        this.loading=false
      }, (err) => {
        console.log('Discovery Query getAllDocs failed...', err)
      })
  }
  */
  }

  filterTransactions(selector: any) {
    // Filtering transactions...
    console.log('SmartEmailSummary.filterTransactions', selector)
    this.emails = this.transactions.filter((email) => {
//      console.log(`Searching ${email.topTransactionActual} & ${email.topTransactionPredicted}`)
      return (
         email.topTransactionActual === selector.actual &&
         email.topTransactionPredicted === (selector.predicted === 'not_found' ? null: selector.predicted))
    })
    this.filterMessage = `Filtered by: [Actual -> ${selector.actual} Predicted -> ${selector.predicted}]`
    console.log('filterTransactions found :', this.emails.length)
    console.log('filterTransactions found :', this.emails)
  }

  setSelectedTransaction(selected: any) {
    console.log('SmartEmailSummary.setSelectedTransaction', selected)
    this.selected = selected
  }

  gtTrue(transactions: any[]): boolean {
    let returnValue = true;
    transactions.forEach((t) => {
      returnValue = returnValue && t.ground_truth
    })
    return returnValue
  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('smartEmailSummary ngOnChanges --', changes)
  }
  showDetails(doc, content) {
    console.log('showDetails:', doc)
    this.emailToViz = doc
    this.emailToVizId = doc.id
    this.detailsModal.show()
  }
}
