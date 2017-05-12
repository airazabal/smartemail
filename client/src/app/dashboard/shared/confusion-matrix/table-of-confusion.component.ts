import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import {ConfusionMatrix} from './ConfusionMatrix'

declare var c3: any

@Component({
  selector: 'app-table-of-confusion',
  templateUrl: './table-of-confusion.component.html'
})

export class TableOfConfusionComponent implements OnInit {

  @Input() confusion: ConfusionMatrix
  @Output() selected = new EventEmitter()

  private stats:any[]
  private graphData: any[]
  private categories: any[]
  public helpContent: any = {
  'title': 'Table of Confusion',
  'content': 'This table of confusion graph shows the True Positives, False Positives and False Negatives. \
      <br> \
   <strong>True Positives</strong> - The Entity Type & Text Actual matches what was predicted by Watson. <em>Note:  \
   The Text comparison is done on Trimmed & Lowercased text.</em>\
   <strong>False Positives</strong> - The Entity Types Match but the Actual Text is different from the Predicted Text. This \
   could also occur if the Types do not match but the Text does.<em>Note:  \
   The Text comparison is done on Trimmed & Lowercased text.</em>\
   <strong>False Negatives</strong> - An Actual Type is defined but a Predicted type was not found. \
   <br> \
  <br>\
  You can read more about this at: <a target="_blank" href="https://en.wikipedia.org/wiki/Confusion_matrix">Confusion Matrix</a>'
  }

  /// Should summarize to an average..... but who knows.
  private summary: any = {
    'F1':0,
    'Precision': 0,
    'Recall':0
  }

  constructor() { }

  ngOnInit() {

  }

  averageNonZero(a:any[]):number {
    let filtered = a.filter((i)=> { return i>0})
    let sum = filtered.reduce((sum,cur) => {
      return sum+=cur
    },0)
    return sum/filtered.length
  }

  reformulateData() {
    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }

    if (!this.confusion) {
      return
    }
    //console.log('confusion.toc: ', this.confusion.toc)
    //console.log('confusion.matrix: ', this.confusion.matrix)
    //console.log('confusion', this.confusion)
    //console.log('confusion', JSON.stringify(this.confusion))
    // this.confusion.toc is on obj of objects...
    let toc = this.confusion.toc
    let tp:any[]=['True Positives']
    let fp:any[]=['False Positives']
    let fn:any[]=['False Negatives']
//    let tn:any[]=['True Negatives']
    let categories:any[] = ['x']
    Object.keys(toc).forEach((actual)=> {
      tp.push(toc[actual].true_positives)
      fp.push(toc[actual].false_positives)
      fn.push(toc[actual].false_negatives)
 //     tn.push(toc[actual].tn)
      categories.push(actual)
    })
    this.graphData = [categories, tp, fp, fn]
    //console.log('graphData', this.graphData)
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes)
    if (this.confusion){
      this.reformulateData()
      this.buildChart()
    }
  }

  buildChart() {
    let pattern = []
    let colors = {
      'True Positives': '#116639', 'False Positives': '#57d785', 'False Negatives': '#cef3d1'
    }
    var chart = c3.generate({
      bindto: '#table-of-confusion-chart',
      data: {
        x: 'x',
        columns: this.graphData,
        type: 'bar',
        groups:[
          ['True Positives','False Positives','False Negatives']
        ],
        colors: colors,
        onclick: (d, i) => {
          let event = {entity_type:this.graphData[0][d.x+1],toc_type: d.name };
          console.log('chart.onclick() emitting event: ', event)
          this.selected.emit(event);
        },
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        x: {
          type: 'category'
        },
        rotated: true
      },
      legend: {
        show: true
      },
      color: {
        pattern: pattern
      },
      size: {
        height: 200
      }
    });
  }
}
