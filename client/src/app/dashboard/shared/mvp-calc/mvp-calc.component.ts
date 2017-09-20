import { Component, OnInit, Input, ViewChild, OnDestroy, OnChanges, SimpleChange } from '@angular/core';

import * as d3Selection from 'd3-selection';
import * as d3Color from 'd3-color';
import * as d3Scale from 'd3-scale';

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
    {label: 'True Positives', color: '#116639'}, 
    {label: 'Missed Policy Number', color: '#57d785'}, 
    {label: 'Missed', color: '#cef3d1'}
  ]

  private actuals: any = {}
  private mvpList: any = {}
  private graphData: any[] = []
  private briteGraphData: any = {}
  private groupedBar: any;
  private resizeEvt: any;

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
    console.log('mvp-calc britegraph:', this.briteGraphData);
    let colorsB = this.colors.map((o) => o.color)
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#mvp-calc-chart')
    const chartTooltip = britecharts.tooltip()
    this.groupedBar = britecharts.groupedBar();
    const containerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width
    const containerHeight = ((<HTMLElement>divContainer.node()).getBoundingClientRect().height | 350)
    this.groupedBar
      .tooltipThreshold(300)
      .width(containerWidth)
      .height(containerHeight)
      .grid('horizontal')
      .isAnimated(true)
      .colorSchema(colorsB)
      .margin({
        left: 40,
        top: 0,
        right: 20,
        bottom: 40
      })
      .groupLabel('group')
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


    container.datum(this.briteGraphData.data).call(this.groupedBar);

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

  wrap(text, width) {
    text.nodes().forEach((t) => {
      let text = d3Selection.select(t),
          words = text.text().match(/.{1,3}/g).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr('y'),
          dy = parseFloat(text.attr('dy')),
          tspan = text.text(null).append('tspan').attr('x', 0).attr('y', y).attr('dy', dy + 'em');
          
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(''));
        if ((<SVGTextElement> tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(''));
          line = [word];
          tspan = text.append('tspan').attr('x', 0).attr('y', y).attr('dy', ++lineNumber * lineHeight + dy + 'em').text(word);
        }
      }
    });
  }

  redrawChart = () => {
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#mvp-calc-chart');
    const newContainerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width;
    const newContainerHeight = ((<HTMLElement>divContainer.node()).getBoundingClientRect().height || 320) - 15;

    // Setting the new width and height on the chart
    this.groupedBar.width(newContainerWidth);
    //this.groupedBar.height(newContainerHeight);

    // Rendering the chart again
    container.datum(this.briteGraphData.data).call(this.groupedBar);

    let xScale = d3Scale.scaleBand()
    .domain(this.briteGraphData.data.map((o) => o.name))
    .rangeRound([0, <number>newContainerWidth])
    .paddingInner(0);
    setTimeout(() => {
      container.select('.x.axis').selectAll('.tick text').call(this.wrap, xScale.bandwidth());
    }, 1000);
  }

  mouseOverLegend(col) {
    const bars = d3Selection.select('#mvp-calc-chart')
      .selectAll('.bar');
    bars.each((d, i, g) => {
      const el = d3Selection.select(g[i]);
      if (el.attr('fill') !== col.color) {
        el.transition().duration(100).style('opacity', 0.2);
      } else {
        el.transition().duration(100).attr('fill', d3Color.color(col.color).darker(0.1).toString());
      }
    });
  }

  mouseOutLegend(c) {
    const bars = d3Selection.select('#mvp-calc-chart')
      .selectAll('.bar')
    bars.each((d:any, i, g) => {
      const el = d3Selection.select(g[i]);
      const col = this.colors.find((o) => o.label === d.group)
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
