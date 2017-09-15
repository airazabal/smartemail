import { Component, OnInit, Input, OnChanges, SimpleChange } from '@angular/core';

import * as d3Selection from 'd3-selection';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-mvp-calc',
  templateUrl: './mvp-calc.component.html',
  styleUrls: ['./mvp-calc.component.scss']
})
export class MvpCalcComponent implements OnInit {

  @Input() transactions: any[]

  private actuals: any = {}
  private mvpList: any = {}
  private graphData: any[] = []
  private briteGraphData: any = {}

  constructor() { }

  ngOnInit() {
    //    this.reformulateData()
    //   this.buildChart()
  }

  reformulateData() {

    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }
    if (!this.mvpList) {
      return
    }
    // Create a list of data:
    // [ transaction_type, correct Policy_number, remainder/total]

    let categories: any[] = ['x']
    let tp: any[] = ['True Positives']
    let m_pn: any[] = ['Missed Policy Number']
    let missed: any[] = ['Missed']
    Object.keys(this.mvpList).forEach((classification) => {
      console.log('Working on classification: ', classification)
      categories.push(classification)
      let tp_pn_count = 0;
      let missed_pn = 0;
      this.mvpList[classification].forEach((email) => {
        if (email.toc) {
          let tp_pn = email.toc.filter((entity) => {
            return (entity.type === 'Policy_Number' && entity.toc_type === 'true_positive')
          })
          if (tp_pn.length > 0) {
            tp_pn_count++
          } else {
            missed_pn++
          }
        } else {
          missed_pn++
        }
      })
      // Convert to percentage. (out of 100%)
      console.log(`${classification} - ${tp_pn_count} - ${missed_pn} - ${this.actuals[classification]} `)
      let missed_count = this.actuals[classification] - tp_pn_count - missed_pn
      tp.push(tp_pn_count / this.actuals[classification] * 100)
      m_pn.push(missed_pn / this.actuals[classification] * 100)
      missed.push(missed_count / this.actuals[classification] * 100)
    })
    this.graphData.push(categories, tp, m_pn, missed)
    console.log('graphData', this.graphData)

    // Build Britechart groupedBar chart data
    this.briteGraphData = { data: [] };
    Object.keys(this.mvpList).forEach((classification) => {
      let tp_pn_count = 0;
      let missed_pn = 0;
      this.mvpList[classification].forEach((email) => {
        this.mvpList[classification].forEach((email) => {
          if (email.toc) {
            let tp_pn = email.toc.filter((entity) => {
              return (entity.type === 'Policy_Number' && entity.toc_type === 'true_positive')
            })
            if (tp_pn.length > 0) {
              tp_pn_count++
            } else {
              missed_pn++
            }
          } else {
            missed_pn++
          }
        })
      });
      this.briteGraphData.data.push({
        name: 'tp',
        group: 'True Positives',
        value: tp_pn_count
      });
      this.briteGraphData.data.push({
        name: 'm_pn',
        group: 'Missed Policy Number',
        value: m_pn
      });
      this.briteGraphData.data.push({
        name: 'missed',
        group: 'Missed',
        value: missed
      });
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes)
    if (this.transactions) {
      this.actuals = {}
      // Reset actuals...
      this.transactions.forEach((email) => {
        // We want to go find all emails that have a GOOD Policy Number
        // and a GOOD Transaction Type... and create a list.
        if (!this.actuals.hasOwnProperty(email.topTransactionActual)) {
          this.actuals[email.topTransactionActual] = 0
        }
        this.actuals[email.topTransactionActual]++
        if (email.topTransactionPredicted === email.topTransactionActual) {
          // true positive policy numbers..
          if (!this.mvpList.hasOwnProperty(email.topTransactionActual)) {
            this.mvpList[email.topTransactionActual] = []
          }
          this.mvpList[email.topTransactionActual].push(email)
        }
      })
      console.log(this.mvpList)
      this.reformulateData()
      this.buildChart()
    }
  }
  buildChart() {
    let colors = {
      'True Positives': '#116639', 'Missed Policy Number': '#57d785', 'Missed': '#cef3d1'
    }
    // var chart = c3.generate({
    //   bindto: '#mvp-calc-chart',
    //   data: {
    //     x: 'x',
    //     columns: this.graphData,
    //     type: 'bar',
    //     groups: [
    //       ['True Positives', 'Missed Policy Number', 'Missed']
    //     ],
    //     colors: colors
    //   },
    //   bar: {
    //     width: {
    //       ratio: 0.5
    //     }
    //   },
    //   axis: {
    //     x: {
    //       type: 'category'
    //     },
    //     rotated: true
    //   },
    //   legend: {
    //     show: true
    //   },
    //   size: {
    //     height: 200
    //   }
    // });

    const container = d3Selection.select('#mvp-calc-chart')
    const chartTooltip = britecharts.tooltip()
    const groupedBar = britecharts.groupedBar();
    const containerWidth = (<HTMLElement>container.node()).getBoundingClientRect().width
    const containerHeight = (<HTMLElement>container.node()).getBoundingClientRect().height | 320
    groupedBar
      .tooltipThreshold(600)
      .width(containerWidth)
      .height(containerHeight)
      .grid('horizontal')
      .isAnimated(true)
      .groupLabel('group')
      .nameLabel('name')
      .valueLabel('value')
      .on('customMouseOver', function () {
        chartTooltip.show();
      })
      .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
        chartTooltip.update(dataPoint, topicColorMap, x, y);
      })
      .on('customMouseOut', function () {
        chartTooltip.hide();
      });


    container.datum(this.briteGraphData.data).call(groupedBar);

    // Tooltip Setup and start
    chartTooltip
      .topicLabel('values')
      .dateLabel('key')
      .nameLabel('stack')
      .title('');

    // Note that if the viewport width is less than the tooltipThreshold value,
    // this container won't exist, and the tooltip won't show up
    const tooltipContainer = d3Selection.select('.js-grouped-bar-chart-tooltip-container .metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);
  }
}
