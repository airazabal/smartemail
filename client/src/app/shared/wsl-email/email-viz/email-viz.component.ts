import { Component, Input, OnInit, OnChanges, SimpleChange } from '@angular/core';
import { SmartEmail } from '../classes/SmartEmail'
import { SmartEmailService} from '../smart-email.service'
import { fade, shrink } from '../../utils/animations';

@Component({
  selector: 'app-email-viz',
  templateUrl: './email-viz.component.html',
  animations: [fade(), shrink()],
  styleUrls: ['./email-viz.component.scss']
})

export class EmailVizComponent implements OnChanges, OnInit {

  // An Email ID to lookup and visualize...
  @Input() emailId: string
  // A document to Visualize...
  @Input() docToViz: string
  public loading: boolean = false
  public visualizationSource: any
  // the entities we found beyond Ground Truth
  public additionalEntities: any
  // Ground Truth defined entities
  public groundTruth: any
  public entities: any
  public transactions: any

  public hasExceptions:boolean = false;
  public isCollapsed:boolean = false;
  public isEntitiesCollapsed:boolean = false;
  public isEmailCollapsed:boolean = true;

  public transactionClass:any = {
    'true_positive': false,
    'false_positive': false,
    'false_negative': false
  }

  constructor(private smartEmailSvc : SmartEmailService) {

  }

  public collapsed(event:any):void {
  //  console.log(event)
  }

  public expanded(event:any):void {
  //  console.log(event)
  }

  ngOnInit() {
  }


  loadInput() {
    // Turn on loading...
    this.loading = true
    // If we have an email id...
    if (this.emailId) {
      // We are looking up an email id
      console.log('this.emailId is: ', this.emailId)
      console.log('this.emailId type: ', typeof this.emailId)
      this.smartEmailSvc.getDoc(this.emailId)
        .subscribe(result => {
          // This is an array.  Wee need JUST THE first one...
          console.log('email-viz components initiated: ', result);
          this.setVisualizationSource(result)
        }, err => {
          console.log(err)
        })
    } else if (this.docToViz) {
      // Should just be a doc to viz...
      console.log('loadInput: ', this.docToViz)
      this.setVisualizationSource(this.docToViz)
    } else {
      console.log('Nothing to do? ')
      this.loading=false;
    }
  }


  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
    //  console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.loadInput()
  }

  setVisualizationSource(source) {
    this.visualizationSource = new SmartEmail(source);

    if (this.visualizationSource.topTransactionPredicted) {
      if (this.visualizationSource.topTransactionPredicted === this.visualizationSource.topTransactionActual) {
        this.transactionClass.true_positive = true
      } else {
        this.transactionClass.false_positive = true
      }
    } else {
      this.transactionClass.false_negative= true
    }

    this.entities = (this.visualizationSource.toc && this.visualizationSource.toc.length > 0) ? this.visualizationSource.toc : this.visualizationSource.entitiesVsGroundTruth()
    this.transactions = this.visualizationSource.transactionsVsGroundTruth()
    if (this.visualizationSource.exception.length > 0) {
      this.hasExceptions = true
    }
    this.loading = false
    console.log('setVisualizationSource - ', this.entities)
    console.log('setVisualizationSource - ', this.transactions)
  }

}
