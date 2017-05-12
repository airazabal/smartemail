import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-email-summary',
  templateUrl: './email-summary.component.html',
  styleUrls: ['./email-summary.component.css']
})
export class EmailSummaryComponent implements OnInit {
  @Input() email:any
  @Output() emailSelected = new EventEmitter<any>();

  public sourceId:string
  public topThreeTransactions:any[]
  public entities:any[]

  public transactionClass:any = {
  'true_positive': false,
  'false_positive': false,
  'false_negative': false
}


  constructor() { }

  ngOnInit() {
    if (this.email) {
      this.sourceId = this.email.source_id || this.email.id
//      this.topThreeTransactions = this.getTopTransactions(this.email.transaction_types)
    //  console.log('Top 3', this.topThreeTransactions)
      //this.entities = this.email.entities_extracted
      if (this.email.topTransactionPredicted) {
        if (this.email.topTransactionPredicted === this.email.topTransactionActual) {
          this.transactionClass.true_positive = true
        } else {
          this.transactionClass.false_positive = true
        }
      } else {
        this.transactionClass.false_negative= true
      }
    }
  }

  getTopTransactions(transactions:any[]) {
    return transactions.sort((a,b)=> {
      if (a.confidence_level < b.confidence_level) {
        return 1;
      }
      if (a.confidence_level > b.confidence_level) {
        return -1;
      }
      return 0;
    }).slice(0,3)
  }

  selectEmail() {
    this.emailSelected.emit(this.email)
  }
}
