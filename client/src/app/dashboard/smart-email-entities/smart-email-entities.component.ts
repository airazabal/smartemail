import { Component, OnInit, OnChanges, SimpleChange, ViewChild } from '@angular/core';

import { FromComponentService } from '../../shared/utils/from-component.service'
import { DashboardCtxService } from '../shared/dashboard-ctx.service'
import { SmartEmailService } from '../../shared/wsl-email/smart-email.service'
import { ConfusionMatrix } from '../shared/confusion-matrix/ConfusionMatrix'
import { ConfusionMatrixService } from '../shared/confusion-matrix/confusion-matrix.service'
import { ModalDirective } from 'ngx-bootstrap/modal'
import { fade } from '../../shared/utils/animations';

@Component({
  selector: 'smart-email-entities',
  styleUrls: ['./smart-email-entities.component.scss'],
  animations: [fade()],
  templateUrl: './smart-email-entities.component.html'
})
export class SmartEmailEntitiesComponent implements OnInit {
  public emails: any[]
  public emailToViz: any
  public emailToVizId: string
  public transactions: any
  public filterMessage: string = 'Select a box in the Confusion Matrix to display items'
  public confusionMatrix: ConfusionMatrix
  public loading: boolean = false
  public selected: string = 'right'
  public currentSelector: any

  // Map to search for matches for entities.
  public entityMap: any = {
    /*
    Location_ClassCode: 'Location_ClassCode',
    Vehicle_GarageZip: 'Vehicle_GarageZip',
    CancelReason: 'CancelReason',
    Effective_Date: 'Effective_Date',
    ChangeType_Modify: 'ChangeType_Modify',
    ChangeType_Add: 'ChangeType_Add',
    COI_Wording_Additional_Insured: 'COI_Wording_Additional_Insured',
    COI_Wording_Additional_Insured_Relationship: 'COI_Wording_Additional_Insured_Relationship',
    COI_Wording_All_Other: 'COI_Wording_All_Other',
    */
    Send_To: 'Send_To',
    'Send To': 'Send_To',
    COI_FormType_COI: 'COI_FormType_COI',
    'Form Type': 'COI_FormType_COI',
    Delivery_Method: 'Delivery_Method',
    'Delivery Method': 'Delivery_Method',
    Cert_Holder_Address: 'Cert_Holder_Address',
    'Cert Holder Address': 'Cert_Holder_Address',
    Cert_Holder_Name: 'Cert_Holder_Name',
    'Cert Holder Name': 'Cert_Holder_Name',
    Policy_Number: 'Policy_Number',
    'Policy Number': 'Policy_Number'
  }

  @ViewChild('detailsModal') public detailsModal: ModalDirective;

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
        this.confusionMatrix = this.confusionMatrixService.generate('entity', this.transactions)
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
    let tocMap:any = {
      'True Positives': 'true_positive',
      'False Positives': 'false_positive',
      'False Negatives': 'false_negative'
    }
    this.currentSelector = selector
    console.log('SmartEmailEntity.filterTransactions', selector)
    // selector.entityType that is 'false_positive'
    const tocType:string = tocMap[selector.toc_type];
    this.currentSelector.tocDisplayName = tocType;

    this.emails = this.transactions.filter((email) => {
      console.log('EMAIL: ', email)
      console.log(`Searching ${email.topTransactionActual} & ${email.topTransactionPredicted}`)
      if (email.toc && email.toc.length > 0) {
//        console.log('filterTransactions:  We have TOC data... ' + email.source_id)
        let found = email.toc.findIndex((entity) => {
 //         console.log(`Checking ${entity.type} for ${selector.entity_type}`)
          if (entity.type === selector.entity_type) {
  //          console.log(`Matched Entity: ${selector.entity_type}`)
            if (entity.toc_type === tocType) {
   //           console.log(`Matched toc: ${tocType}`)
              return true
            }
          }
          return false
        })
        console.log('filterTransactions: Found! '+found)
        return found >= 0
      } else {
        return false
      }
    })

    this.filterMessage = `Filtered by: [ Entity Type -> ${selector.entity_type} toc-> ${tocType}]`
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
  showDetails(doc) {
    console.log('showDetails:', doc)
    this.emailToViz = doc
    this.emailToVizId = doc.id
    this.detailsModal.show()
  }
}
