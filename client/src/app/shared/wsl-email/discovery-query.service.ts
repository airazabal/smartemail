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
export class DiscoveryQueryService {

  constructor(private backend: BackendService ) { }

  public getDocumentBySourceId(id: string): Observable<any> {
    let url =`/api/Discovery/source_id/${id}`
    console.log('getDocumentBySourceId calling: '+ url)
    return this.backend.get(url)
       .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.trace('getBySourceId: -------- Backend Response -------')
        console.trace('result:', res.json());
        return res.json()
        //return this.mergeRelations(res.json())
 //       return this.rawEntityResults
      })
  }

  public addTemporaryDocument(message): Observable<any> {
    let url =`/api/Discovery/add`
    console.log('getDocumentBySourceId calling: '+ url)
    return this.backend.post(url, {body: message})
       .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.trace('addTemporaryDocument: -------- Backend Response -------')
        console.trace('result:', res.json());
        return res.json()
        //return this.mergeRelations(res.json())
 //       return this.rawEntityResults
      })
  }

  public getAllDocs(): Observable<any> {
    let url =`/api/Discovery/documents`
    console.log('getAllDocs() calling: '+ url)
    return this.backend.get(url)
       .map((res: Response) => {
        // res is an Observable response...
        // Add Res to the rawEntityResults
        console.log('getAllDocs(): -------- Backend Response -------')
        console.log('getAllDocs(): result:', res.json());
        return res.json()
        //return this.mergeRelations(res.json())
 //       return this.rawEntityResults
      })
  }
}
