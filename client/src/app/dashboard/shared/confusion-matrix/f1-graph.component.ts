import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import {ConfusionMatrix} from './ConfusionMatrix'

declare var c3: any

@Component({
  selector: 'app-f1-graph',
  templateUrl: './f1-graph.component.html'
})

export class F1GraphComponent implements OnInit {

  @Input() confusion: ConfusionMatrix

  private stats:any[]
  private graphData: any[]
  private categories: any[]

  public helpContent: any = {
    'title': 'F1/Precision/Recall Explanation',
    'content': 'You can read more about this at: <a target="_blank" href="https://en.wikipedia.org/wiki/Confusion_matrix">Confusion Matrix</a>'
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

    this.stats = this.confusion.statistics()

    let f1:any[] = ['f1'];
    let precision:any[] = ['precision'];
    let recall:any[] = ['recall']
    // Used to create X Axis categories
    let categories = ['x']
    this.stats.forEach((classObj) => {
      // each class has obj has f1/p/r
      f1.push(Math.round(classObj.f1*100)/100)
      precision.push(Math.round(classObj.precision*100)/100)
      recall.push(Math.round(classObj.recall*100)/100)
      categories.push(classObj.class)
    })

    this.summary.F1 = this.averageNonZero(f1.slice(1))
    this.summary.Precision = this.averageNonZero(precision.slice(1))
    this.summary.Recall= this.averageNonZero(recall.slice(1))

    this.graphData = [categories,f1,precision,recall]
    console.log('graphData', this.graphData)
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
      f1: '#188291', precision: '#00b6cb', recall: '#a0e3f0'
    }
    var chart = c3.generate({
      bindto: '#f1-graph-chart',
      data: {
        x: 'x',
        columns: this.graphData,
        type: 'bar',
        colors: colors
      },
      bar: {
        width: {
          ratio: 0.5
        }
      },
      axis: {
        x: {
          type: 'category'
        }
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
