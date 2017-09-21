import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { SmartEmailService } from '../smart-email.service'
import { emailResults } from '../test/email-discovery-1-data'

@Component({
  selector: 'app-email-input',
  templateUrl: './email-input.component.html',
  styleUrls: ['./email-input.component.scss']
})
export class EmailInputComponent implements OnInit {

  public inputText: string ='';

  // This is a big json object from Discovery...
  @Output() analyzeStatus = new EventEmitter<any>();

  constructor(private smartEmail:SmartEmailService) { }

  ngOnInit() {

  }

  analyze() {
//    this.inputText
    console.log('Emitting EmailResults')
    this.analyzeStatus.emit({'status': 'started'})
    console.log('inputText: ', this.inputText)
    this.smartEmail.categorize(this._convertToProperFormat(this.inputText))
      .subscribe(result => {
        // This is an array.  Wee need JUST THE first one...
        console.log('email-input received...: ', result);
        this.analyzeStatus.emit({'status': 'finished', 'result':result})
      }, (err) => {
        console.error('email-input error: ', err);
        this.analyzeStatus.emit({'status': 'failed', 'result':err})
      })
  }
  _convertToProperFormat(doc:string):any {
    return {
      id: 'temporary_999',
      source_email: {
        body: doc,
        cleansed: doc,
        trimmed: doc,
        subject: "No Subject: <temporary email>"
//    body: JSON.stringify(doc),
      }
    }
  }
}
