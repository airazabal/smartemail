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
    this.stats = this.confusion.statistics()

    let f1 = ['f1'];
    let precision = ['precision'];
    let recall = ['recall']
    // Used to create X Axis categories
    let categories = ['x']
    this.stats.forEach((classObj) => {
      // each class has obj has f1/p/r
      f1.push(classObj.f1)
      precision.push(classObj.precision)
      recall.push(classObj.recall)
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
    this.reformulateData()
    this.buildChart()
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
