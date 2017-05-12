import { Injectable } from '@angular/core';
import { Response } from '@angular/http'

// Import RxJs required methods
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

/* Store my Entity Data here.  We want to store the Input and
the result in the Service */

import { BackendService } from './backend.service'

@Injectable()
export class SmartEmailService {

  private _transactions: any[] = []

  constructor(private backend: BackendService) { }

  public categorize(message): Observable<any> {
    let url = `/api/SmartEmails/categorize`
    console.log('SmartEmail.categorize calling: ' + url)
    console.log(message)
    return this.backend.post(url, { body: message })
      .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.log('categorizeService.add : -------- Backend Response -------')
        console.log('categorizeService.add result:', res.json());
        return res.json()
        //return this.mergeRelations(res.json())
        //       return this.rawEntityResults
      })
  }
  public getAllDocs(): Observable<any> {
    let url = `/api/SmartEmails`
    console.log('getAllDocs() calling: ' + url)
    return this.backend.get(url)
      .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.log('getAllDocs(): -------- Backend Response -------')
        console.log('getAllDocs(): result:', res.json());
        return res.json()
      })
  }
  public getDoc(id: string): Observable<any> {
    let url = `/api/SmartEmails/${id}`
    console.log('getDoc() calling: ' + url)
    return this.backend.get(url)
      .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.log('getDoc(): -------- Backend Response -------')
        //        console.log('getTransactions(): result:', res.json());
        return res.json()
      })
  }

  public getTransactions(): Observable<any> {
    let url = `/api/SmartEmails`
    let filter = {
      'id': true,
      'transaction_types': true,
      'ground_truth': true,
    }
    console.log('getTransactions() calling: ' + url)

    if (this._transactions.length > 0) {
      console.log('getTransactions... Returning existing transactions: ', this._transactions.length)
      return Observable.create(observer => {
        observer.next(this._transactions)
        observer.complete()
      });
    } else {
      console.log('getTransactions... Getting transactions...: ')
      return this.backend.get(url, { filter: JSON.stringify(filter) })
        .map((res: Response) => {
          // res is an Observable response...
          // Add Res to the rawEntityResults
          console.log('getTransactions(): -------- Backend Response -------')
          console.log('getTransactions(): Success, returning ' + res.json().length)
          //        console.log('getTransactions(): result:', res.json());
          this._transactions = res.json()
          return res.json()
        })
    }
  }

  public recategorizeAll() {
    console.log('recategorizeAll (service) called')
    return this.getAllDocs()
     .flatMap((docs) => {
        return Observable.create(observer => {
          docs.forEach((doc)=> {
            console.log('adding doc... ', doc.source_id)
            observer.next(doc)
         })
        })
     })
  }
}
