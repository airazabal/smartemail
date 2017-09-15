import { Component, Input, OnInit, ViewChild} from '@angular/core';
import { ModalDirective } from 'ngx-bootstrap/modal';


@Component({
  selector: 'app-help',
  templateUrl: './help.component.html',
  styleUrls: ['./help.component.css']
})

export class HelpComponent implements OnInit {

  @Input() helpContent:any = {
    'title': 'Help',
    'content': 'Fill in your help content here.  Use HTML?'
  }

  @Input() modalSize: string = 'sm'; // sm, md, lg

  @ViewChild('helpModal') public helpModal: ModalDirective;

  constructor() { }

  ngOnInit() {

  }

  onModalShow() {
    console.log('helpModal: show... Loading...')

  }
}
