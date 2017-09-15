import { Component, OnInit, Input, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { DataSource } from '@angular/cdk/collections';
import { MdSort } from '@angular/material';
import { MdPaginator } from '@angular/material';
import { BehaviorSubject } from 'rxjs/BehaviorSubject';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/operator/startWith';
import 'rxjs/add/observable/merge';
import 'rxjs/add/operator/map';

import { fade } from '../../../shared/utils/animations';

export interface EmailData {
  id: string;
  topTransactionActual: string;
  topTransactionPredicted: string;
  toc: any;
  transactionClass: any;
  rawData: any;
}

@Component({
  selector: 'app-email-summary',
  templateUrl: './email-summary.component.html',
  animations: [fade()],
  styleUrls: ['./email-summary.component.scss']
})
export class EmailSummaryComponent implements OnInit {
  @Input('emails')
  set inputData(emails: any) {
    this.emailDatabase.clearAll();
    if (emails) {
      emails.forEach(element => {
        this.emailDatabase.addEmail(element);
      });
    }
  }
  @Output() emailSelected = new EventEmitter<any>();
  @ViewChild(MdSort) sort: MdSort;
  @ViewChild(MdPaginator) paginator: MdPaginator;
  @ViewChild('filter') filter: ElementRef;

  public sourceId: string
  public topThreeTransactions: any[]
  public entities: any[]
  public dataSource: EmailDataSource | null;
  public emailDatabase = new EmailDatabase();
  public displayedColumns = ['id', 'topTransactionActual', 'topTransactionPredicted', 'toc'];

  public transactionClass: any = {
    'true_positive': false,
    'false_positive': false,
    'false_negative': false
  }


  constructor() { }

  ngOnInit() {
    this.dataSource = new EmailDataSource(this.emailDatabase, this.sort, this.paginator);
    Observable.fromEvent(this.filter.nativeElement, 'keyup')
    .debounceTime(150)
    .distinctUntilChanged()
    .subscribe(() => {
      if (!this.dataSource) { return; }
      this.dataSource.filter = this.filter.nativeElement.value;
    });
  }

  getTopTransactions(transactions: any[]) {
    return transactions.sort((a, b) => {
      if (a.confidence_level < b.confidence_level) {
        return 1;
      }
      if (a.confidence_level > b.confidence_level) {
        return -1;
      }
      return 0;
    }).slice(0, 3)
  }

  selectEmail(email: EmailData) {
    console.log('******Select Email', this.dataSource, email);
    this.emailSelected.emit(email.rawData)
  }
}

export class EmailDatabase {
  /** Stream that emits whenever the data has been modified. */
  dataChange: BehaviorSubject<EmailData[]> = new BehaviorSubject<EmailData[]>([]);
  get data(): EmailData[] { return this.dataChange.value; }

  addEmail(email) {
    let data: EmailData = {
      id: email.source_id || email.id,
      topTransactionActual: email.topTransactionActual || 'N/A',
      topTransactionPredicted: email.topTransactionPredicted || 'N/A',
      toc: email.toc,
      transactionClass: {},
      rawData: email
    }

    if (email.topTransactionPredicted) {
      if (email.topTransactionPredicted === email.topTransactionActual) {
        data.transactionClass.true_positive = true
      } else {
        data.transactionClass.false_positive = true
      }
    } else {
      data.transactionClass.false_negative = true
    }
    const copiedData = this.data.slice();
    copiedData.push(data);
    this.dataChange.next(copiedData);
  }

  clearAll() {
    this.dataChange.next([]);
  }
}

export class EmailDataSource extends DataSource<any> {
  _filterChange = new BehaviorSubject('');
  get filter(): string { return this._filterChange.value; }
  set filter(filter: string) { this._filterChange.next(filter); }

  constructor(private _emailDatabase: EmailDatabase, private _sort: MdSort,
    private _paginator: MdPaginator) {
    super();
    this._sort.active = 'id';
  }

  /** Connect function called by the table to retrieve one stream containing the data to render. */
  connect(): Observable<EmailData[]> {
    const displayDataChanges = [
      this._emailDatabase.dataChange,
      this._sort.mdSortChange,
      this._paginator.page,
      this._filterChange
    ];

    return Observable.merge(...displayDataChanges).map(() => {
      let data = this._emailDatabase.data.slice().filter((item: EmailData) => {
        let searchStr = (item.id + item.topTransactionActual + item.topTransactionPredicted).toLowerCase();
        return searchStr.indexOf(this.filter.toLowerCase()) != -1;
      });
      data = this.getSortedData(data);
      // Grab the page's slice of data.
      const startIndex = this._paginator.pageIndex * this._paginator.pageSize;
      return data.splice(startIndex, this._paginator.pageSize);
    });
  }

  disconnect() { }

  /** Returns a sorted copy of the database data. */
  getSortedData(data: EmailData[]): EmailData[] {
    if (!this._sort.active || this._sort.direction == '') { return data; }

    return data.sort((a, b) => {
      let propertyA: number | string = '';
      let propertyB: number | string = '';

      switch (this._sort.active) {
        case 'id': [propertyA, propertyB] = [a.id, b.id]; break;
        case 'topTransactionActual': [propertyA, propertyB] = [a.topTransactionActual, b.topTransactionActual]; break;
        case 'topTransactionPredicted': [propertyA, propertyB] = [a.topTransactionPredicted, b.topTransactionPredicted]; break;
      }

      let valueA = isNaN(+propertyA) ? propertyA : +propertyA;
      let valueB = isNaN(+propertyB) ? propertyB : +propertyB;

      return (valueA < valueB ? -1 : 1) * (this._sort.direction == 'asc' ? 1 : -1);
    });
  }
}