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
  styleUrls: ['./confusion-matrix.component.scss']
})

export class ConfusionMatrixComponent implements OnInit {
  @Input() confusion: ConfusionMatrix
  @Output() selected = new EventEmitter<any>()
  public confusionKeys: string[] = []
  public confusionArray: any[] = []
  public confusionStatistics: any[] = []
  public confusionTable: TableData
  public confusionDataTable: { keys: string[], rows: any[] } = { keys: [], rows: []}
  public helpContent: any = {
  'title': 'Confusion Matrix Help',
  'content': 'In this Confusion Matrix, the Rows are the <em>Actual/Human</em> \
   classficiation and the Columns are the <em>Predicted/Machine</em> classifications. \
   <br> \
   <br> \
The <em> True Positives</em> are darkly colored and the Column and Row names match. \
<br> \
<br> \
Depending on the location(and thus perspective) of the light blue cells, they are either\
<em>False Positives</em> or <em>False Negatives</em>.  For example, from the perspective of \
the Row, they are <em> False Negatives</em>  but from the perspective of the Column they \
are <em> False Positives</em> \
<br>\
<br>\
You can read more about this at: <a target="_blank" href="https://en.wikipedia.org/wiki/Confusion_matrix">Confusion Matrix</a>'
}


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
    console.log('Calculating Confusion info...', this.confusion, this.confusion.toTableData())
    this.confusionKeys = this.confusion.keys()
    this.confusionStatistics = this.confusion.statistics()
    this.confusionTable = new TableData(this.confusion.toTableData())

    const tableData = this.confusion.toTableData()
    let keys = tableData.map((o) => o.column)
    keys = Array.from(new Set(keys)) // remove duplicates
    keys.unshift('') // add an empty string to create a blank first cell
    let rows = [];
    tableData.forEach((c) => {
      let r = rows.find((r) => r.find((v) => v.row === c.row))
      if (!r) {
        // first column is the row name
        r = [{row: c.row, value: c.row, label: true}]
        rows.push(r)
      }
      r.push(c) 
    })
    this.confusionDataTable = { keys: keys, rows: rows}
  }
}
