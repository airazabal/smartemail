import { Component,
         OnInit,
         Input,
         OnChanges,
         SimpleChange,
         EventEmitter,
         Output } from '@angular/core';

import { ConfusionMatrix } from './ConfusionMatrix'
import { TableData } from './TableData'

@Component({
  selector: 'app-confusion-matrix',
  templateUrl: './confusion-matrix.component.html',
  styleUrls: ['./confusion-matrix.component.css']
})

export class ConfusionMatrixComponent implements OnInit {
  @Input() confusion: ConfusionMatrix
  @Output() selected = new EventEmitter<any>()
  public confusionKeys: string[] = []
  public confusionArray: any[] = []
  public confusionStatistics: any[] = []
  public confusionTable: TableData

  constructor() { }

  ngOnInit() {

  }
  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log(`confusionMatrixComponent ${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    this.calculateConfusionKeys()
  }

  confusionSelected(selection:any):void {
    console.log('confusionSelected', selection)
    this.selected.emit({actual: selection.row, predicted: selection.column})
  }

  getStyle(obj:any):any {
//    console.log('Getting Style!', obj)
    if (obj && obj.value) {
      if (obj.column === obj.row) {
        return 'cfdark'
      } else if (obj.value > 0) {
        return 'cflight'
      }
    }
  }

  pipeToNumber(obj:any):boolean {
    let value = false;
    if (obj) {
       value = (obj.column === 'F1' ||
       obj.column === 'Precision' ||
       obj.column === 'Recall')
    }
    return value
  }

  calculateConfusionKeys() {
    console.log('Calculating Confusion info...')
    this.confusionKeys = this.confusion.keys()
    this.confusionStatistics = this.confusion.statistics()
    this.confusionTable = new TableData(this.confusion.toTableData())

    this.confusionArray = this.confusionTable.array()
    console.log('ConfusionArray ', this.confusionArray)
  }
}
