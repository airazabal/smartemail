import { Component, OnInit, Input, Output, OnChanges, SimpleChange, EventEmitter } from '@angular/core';
import * as d3Selection from 'd3-selection';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-transaction-summary',
  templateUrl: './transaction-summary.component.html',
  styleUrls: ['./transaction-summary.component.css']
})
export class TransactionSummaryComponent implements OnInit {

  @Input() summary: any
  @Output() selected = new EventEmitter<any>();
  private columns: any[]
  private donutData: any = []
  private colors = ['#35D6BB', '#00BBA1', '#00A88F', '#008773', '#006456']

  private details: any

  private title: string = 'Transaction Correctness'
  private description: string = 'Transactions analyzed vs. Ground Truth provided'

  constructor() { }

  ngOnInit() {

  }

  setSelected(selected: any) {
    console.log('setSelected fired: ', selected)
  }

  summaryToColumns() {
    if (this.summary) {
      //    console.log('summaryToArray: ', this.summary)
      this.columns = Object.keys(this.summary).map((k) => {
        //     console.log('summary - '+k, this.summary[k])
        return [k, this.summary[k].length]
      })
      this.donutData = Object.keys(this.summary).map((k) => {
        //     console.log('summary - '+k, this.summary[k])
        return {id: k, name: k, quantity: this.summary[k].length}
      })
    }
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    /*
    for (let propName in changes) {
      let chng = changes[propName];
      let cur = JSON.stringify(chng.currentValue);
      let prev = JSON.stringify(chng.previousValue);
      console.log(`${propName}: currentValue = ${cur}, previousValue = ${prev}`);
    }
    */
    this.summaryToColumns()
    this.buildChart()
  }

  buildChart() {

    let colors = {
      wrong: '#dc267f', right: '#008949', missing: '#dddee1'
    }

    let pattern = []
    console.log('columns: ', this.columns)
    let cols = this.columns;
    let total = 0;
    cols.forEach((a) => {
      total = total + a[1]
    })
    // var chart = c3.generate({
    //   bindto: '#transaction-summary-chart',
    //   data: {
    //     columns: cols,
    //     colors: colors,
    //     type: 'donut',
    //     onclick: (d, i) => {
    //       console.log('Selected: ' + d.name)
    //       this.selected.emit(d.name)
    //     },
    //     onmouseover: (d, i) => {
    //       d.total = total
    //       this.details = d;
    //       console.log('chart.onmouseover() emitting d: ', d)
    //       console.log('chart.onmouseover() emitting i: ', i)
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
    //   donut: {
    //     title: 'Correctness',
    //     width: 15,
    //     label: {
    //       show: false
    //     }
    //   },
    //   size: {
    //     height: 200
    //   }
    // });

    const dataset = { data: this.donutData }
    const container = d3Selection.select('#transaction-summary-chart')
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
      legendContainer = d3Selection.select('.js-legend-chart-container'),
      containerWidth = legendContainer.node() ? (<HTMLElement>legendContainer.node()).getBoundingClientRect().width : false;

    if (containerWidth) {
      d3Selection.select('.js-legend-chart-container .britechart-legend').remove();

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
