import { Component, OnInit, ViewChild} from '@angular/core';
import { SettingsService } from '../../core/settings.service'
import { ModalDirective } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit {

  public settings: any

  public currentModelId: string = 'WKS Model ID'
  public currentModelDateTime: string

  @ViewChild('settingsModal') public settingsModal: ModalDirective;

  constructor(private _settingsSvc: SettingsService) { }

  ngOnInit() {

  }
  onModalShow() {
    this._settingsSvc.load()
      .subscribe((s) => {
        if (s) {
          console.log('SettingsComponent.init()', s)
          this.settings = s
          this.currentModelId = this.settings.wksModelId
          this.currentModelDateTime = this.settings.wksModelDateTime
        } else {
          console.log('SettingsComponent -- Settings not found', s)
        }
      })

  }


  updateSettings(wksModel: string) {
    console.log('UpdateSettingsShould set wksModel to: ' + wksModel)
    this._settingsSvc.setWksModel(wksModel)
    this.settingsModal.hide()
  }
}
