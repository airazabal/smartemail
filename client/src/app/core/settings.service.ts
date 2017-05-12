import { Injectable } from '@angular/core';
import { BackendService } from './backend.service'
import { Response } from '@angular/http'

// Import RxJs required methods
import { Observable } from 'rxjs/Rx';
import { BehaviorSubject } from 'rxjs/Rx';

import 'rxjs/add/operator/map'
import 'rxjs/add/operator/catch'

@Injectable()
export class SettingsService {

  public _settings:any

  // We only use ONE object -- the mastersettings_1 id...
  private settingsId:string = 'MasterSettings'
  private url:string = '/api/Settings'

  constructor(private _backend:BackendService ) {

  }

  get settings():any {
    return this._settings
  }

  load():Observable<any> {
    return this._backend.get(this.url + '/load')
      .map((res:Response) => {
        // Save the settings
        console.log('SettingService.load() ', res.json())
        this._settings = res.json()
        return res.json()
      })
  }

  setWksModel(wksModelId:string):void {
    // Insert the default ID into it...
    let s = { wksModelId: wksModelId,
               id: this.settingsId }
    this._backend.put(this.url + '/save', {body: s})
      .map((res:Response) => {
        // Save the settings
        console.log('Saved settings...', res.json());
        this._settings = res.json()
        return res.json()
      }).subscribe(r=> {
        console.log(r)
      }, err => {
        console.log('error? ', err)
      })
  }
}
