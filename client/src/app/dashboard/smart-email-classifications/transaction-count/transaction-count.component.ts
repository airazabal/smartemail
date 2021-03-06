import { Component, OnInit, Input, Output, EventEmitter, OnChanges, SimpleChange } from '@angular/core';

import * as d3Selection from 'd3-selection';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-transaction-count',
  templateUrl: './transaction-count.component.html',
  styleUrls: ['./transaction-count.component.css']
})
export class TransactionCountComponent implements OnInit {

  @Input() summary: any
  @Input() show: string

  @Output() transactionSelected = new EventEmitter()

  public details: any

  public dataMap: any = {
    right: {
      title: 'Correct Transactions by Type',
      description: 'Correctly Classified Transactions'
    },
    wrong: {
      title: 'Incorrect Transactions by Type',
      description: 'Incorrectly Classified Transactions'
    },
    missing: {
      title: 'Missing Ground Truth',
      description: 'Transactions without Ground Truth'
    }
  }

  public activeChart: any

  private briteGraphData: any = {}

  constructor() { }

  ngOnInit() {
    this.activeChart = this.dataMap[this.show];
  }

  reformulateData() {
    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }
    if (this.summary) {
      console.log('reformulateDate! ', this.summary)
      Object.keys(this.summary).forEach((key) => {
        //     console.log('summary - '+k, this.summary[k])
        let k = this.dataMap[key]
        this.summary[key].forEach((t) => {
          //    console.log('t:', t)
          // We only use the 'FIRST one for counting... even though there could me more'
          let tt = 'None_Found'
          if (t.transaction_types.length > 0) {
            tt = t.transaction_types[0].transaction_type
          }
          if (k.hasOwnProperty(tt)) {
            k[tt]++
          } else {
            k[tt] = 1
          }
        })
      })
    }
    console.log('datamap', this.dataMap)
  }

  generateColumns(key: string): any[] {
    return Object.keys(this.dataMap[key])
      .filter((k) => {
        return (k !== 'title' && k !== 'description')
      })
      .map((transactionType) => {
        return [transactionType, this.dataMap[key][transactionType]]
      })
  }

  generateDonutData(key: string): any[] {
    return Object.keys(this.dataMap[key])
      .filter((k) => {
        return (k !== 'title' && k !== 'description')
      })
      .map((transactionType) => {
        return { name: transactionType, id: transactionType, quantity: this.dataMap[key][transactionType] }
      })
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes)
    this.reformulateData()
    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }
    this.activeChart = this.dataMap[this.show];
    console.log('this.activeChart: ', this.activeChart)
    this.buildChart(this.show)
  }

  buildChart(name: string) {
    let columns = this.generateColumns(name)
    // We know what it should be...
    let total = 0;
    columns.forEach((a) => {
      total = total + a[1]
    })

    let pattern = []
    console.log('Building Chart for: ' + name)
    console.log('columns: ', columns)
    // var chart = c3.generate({
    //   bindto: '#transaction-count-chart',
    //   data: {
    //     columns: columns,
    //     type: 'donut',
    //     onclick: (d, i) => {
    //       let event = { name: name, transaction_type: d.name };
    //       //        console.log('chart.onclick() emitting event: ', event)
    //       this.transactionSelected.emit(event);
    //     },
    //     onmouseover: (d, i) => {
    //       d.total = total
    //       this.details = d;
    //       //          console.log('chart.onmouseover() emitting d: ', d)
    //       //         console.log('chart.onmouseover() emitting i: ', i)
    //       //          this.transactionSelected.emit(event);
    //     }
    //   },
    //   gauge: {
    //     label: {
    //       show: false
    //     }
    //   },
    //   legend: {
    //     show: true
    //   },
    //   color: {
    //     pattern: pattern
    //   },
    //   donut: {
    //     title: name,
    //     width: 15,
    //     label: {
    //       show: false
    //     }
    //   },
    //   size: {
    //     height: 200
    //   }
    // });

    const dataset = { data: this.generateDonutData(name) }
    const container = d3Selection.select('#transaction-count-chart')
    const legendChart = this.getLegendChart(dataset, null)
    const donutChart = britecharts.donut();
    const containerWidth = container.node() ? (<HTMLElement>container.node()).getBoundingClientRect().width : 300
    donutChart
      .isAnimated(true)
      .highlightSliceById(2)
      .width(containerWidth)
      .height(containerWidth)
      .externalRadius(containerWidth / 2.5)
      .internalRadius(containerWidth / 5)
      .on('customMouseOver', function (data) {
        legendChart.highlight(data.data.id);
      })
      .on('customMouseOut', function () {
        legendChart.clearHighlight();
      });

    container.datum(dataset).call(donutChart);
  }

  getLegendChart(dataset, optionalColorSchema) {
    var legendChart = britecharts.legend(),
      legendContainer = d3Selection.select('.legend-chart-container'),
      containerWidth = legendContainer.node() ? (<HTMLElement>legendContainer.node()).getBoundingClientRect().width : false;

    if (containerWidth) {
      d3Selection.select('.legend-chart-container .britechart-legend').remove();

      legendChart
        .width(containerWidth * 0.8)
        .height(200)
        .numberFormat('s');

      if (optionalColorSchema) {
        legendChart.colorSchema(optionalColorSchema);
      }

      legendContainer.datum(dataset).call(legendChart);

      return legendChart;
    }
  }
}
