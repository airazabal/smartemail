import { Component, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChange } from '@angular/core';

import * as d3Selection from 'd3-selection';
import * as d3Color from 'd3-color';
import * as d3Scale from 'd3-scale';
import * as lodash from 'lodash';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-mvp-calc',
  templateUrl: './mvp-calc.component.html',
  styleUrls: ['./mvp-calc.component.scss']
})
export class MvpCalcComponent implements OnInit, OnDestroy {

  @Input() transactions: any[]
  @ViewChild('chartdiv') chartDiv

  public colors = [
    { label: 'True Positives', color: '#116639' },
    { label: 'Missed Policy Number', color: '#57d785' },
    { label: 'Missed', color: '#cef3d1' }
  ]

  private actuals: any = {}
  private mvpList: any = {}
  private graphData: any[] = []
  private briteGraphData: any = {}
  private stackedBar: any;
  private resizeEvt: any;
  private chartMargin = {
    left: 80,
    top: 0,
    right: 0,
    bottom: 30
  }

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
      });
      const actualsNum = this.actuals[classification]
      let missed_count = actualsNum - tp_pn_count - missed_pn
      classification = (classification === '') ? 'N/A' : '';
      console.log('******actuals=' + actualsNum + ' tp:' + tp_pn_count + ' missed_pn:' + missed_pn, this.actuals)
      this.briteGraphData.data.push({
        name: classification,
        group: 'True Positives',
        value: isNaN(tp_pn_count) ? 0 : tp_pn_count / actualsNum * 100
      });
      this.briteGraphData.data.push({
        name: classification,
        group: 'Missed Policy Number',
        value: isNaN(missed_pn) ? 0 : missed_pn / actualsNum * 100
      });
      this.briteGraphData.data.push({
        name: classification,
        group: 'Missed',
        value: isNaN(missed_count) ? 0 : missed_count / actualsNum * 100
      });
    });
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes, this.transactions)
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
    console.log('mvp-calc britegraph:', this.briteGraphData);
    let colorsB = this.colors.map((o) => o.color)
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#mvp-calc-chart')
    const chartTooltip = britecharts.tooltip()
    this.stackedBar = britecharts.stackedBar();
    const containerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width
    const containerHeight = ((<HTMLElement>divContainer.node()).getBoundingClientRect().height | 350)
    this.stackedBar
      .tooltipThreshold(300)
      .width(containerWidth)
      .height(containerHeight)
      .isHorizontal(true)
      .grid('vertical')
      .isAnimated(true)
      .margin(this.chartMargin)
      .colorSchema(colorsB)
      .stackLabel('group')
      .nameLabel('name')
      .valueLabel('value')
      .on('customMouseOver', function () {
        chartTooltip.show();
      })
      .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
        chartTooltip.title(dataPoint.key);
        y = Math.max(y, 64);
        const tooltipContainer = container.select('.metadata-group');

        chartTooltip.update(dataPoint, topicColorMap, x, y);
        // Readjust position so that tooltip doesn't go to far up and clipped.
        tooltipContainer.attr('transform', 'translate(' + x + ',' + y + ')')
      })
      .on('customMouseOut', function () {
        chartTooltip.hide();
      });


    container.datum(this.briteGraphData.data).call(this.stackedBar);
    this.stackedBar.margin(lodash.merge(lodash.clone(this.chartMargin), { bottom: 0 })) //set bottom margin to 0 for tooltip to work correctly          

    // Tooltip Setup and start
    chartTooltip
      .topicLabel('values')
      .nameLabel('group')
      .title('')
      .shouldShowDateInTitle(false);

    // Note that if the viewport width is less than the tooltipThreshold value,
    // this container won't exist, and the tooltip won't show up
    const tooltipContainer = container.select('.metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);

    // Window resize event
    let timeoutWait;
    this.resizeEvt = () => {
      if (timeoutWait) {
        clearTimeout(timeoutWait);
      }
      timeoutWait = setTimeout(() => {
        timeoutWait = null;
        this.redrawChart();
      }, 200)
    }
    window.addEventListener('resize', this.resizeEvt);
    container.on('mouseout', this.mouseOutLegend.bind(this))
  }

  redrawChart = () => {
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#mvp-calc-chart');
    const newContainerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width;
    const newContainerHeight = ((<HTMLElement>divContainer.node()).getBoundingClientRect().height || 320) - 15;

    // Setting the new width and height on the chart
    this.stackedBar.width(newContainerWidth);
    //this.stackedBar.height(newContainerHeight);

    // Rendering the chart again
    this.stackedBar.margin(this.chartMargin); // set the original margin again before redrawing
    container.datum(this.briteGraphData.data).call(this.stackedBar);
    this.stackedBar.margin(lodash.merge(lodash.clone(this.chartMargin), { bottom: 0 })) //set bottom margin to 0 for tooltip to work correctly          
  }

  mouseOverLegend(col) {
    const layers = d3Selection.select('#mvp-calc-chart')
      .selectAll('.layer');
    layers.each((d, i, g) => {
      const el = d3Selection.select(g[i]);
      if (el.attr('fill') !== col.color) {
        el.transition().duration(100).style('opacity', 0.2);
      } else {
        el.transition().duration(100).attr('fill', d3Color.color(col.color).darker(0.1).toString());
      }
    });
  }

  mouseOutLegend(c) {
    const layers = d3Selection.select('#mvp-calc-chart')
      .selectAll('.layer')
    layers.each((d: any, i, g) => {
      const el = d3Selection.select(g[i]);
      const col = this.colors.find((o) => o.label === d.key);
      col.color = d3Color.color(col.color).toString();
      el.attr('fill', d3Color.color(col.color).toString()).style('opacity', null);
    })
  }

  ngOnDestroy() {
    if (this.resizeEvt) {
      window.removeEventListener('resize', this.resizeEvt);
    }
  }
}
