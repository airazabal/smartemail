import { Component, OnInit, OnDestroy, Input, Output, ViewChild,
  EventEmitter, OnChanges, SimpleChange } from '@angular/core';
import { ConfusionMatrix } from './ConfusionMatrix'
import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-f1-graph',
  templateUrl: './f1-graph.component.html',
  styleUrls: ['./graph.component.scss']
})

export class F1GraphComponent implements OnInit, OnDestroy {

  @ViewChild('chartdiv') chartDiv
  @Input() confusion: ConfusionMatrix

  public colors = [
    {label: 'f1', color: '#188291'}, {label: 'precision', color: '#00b6cb'}, 
    {label: 'recall', color: '#a0e3f0'}
  ]
  private stats: any[]
  private graphData: any[]
  private briteGraphData: any
  private categories: any[]
  private groupedBar: any;
  private resizeEvt: any;

  public helpContent: any = {
    'title': 'F1/Precision/Recall Explanation',
    'content': 'You can read more about this at: <a target="_blank" href="https://en.wikipedia.org/wiki/Confusion_matrix">Confusion Matrix</a>'
  }
  /// Should summarize to an average..... but who knows.
  private summary: any = {
    'F1': 0,
    'Precision': 0,
    'Recall': 0
  }

  constructor() { }

  ngOnInit() {
    console.log("ngOnInit, getting Input of ConfusionMatrix type");
    console.log(this.confusion);
  }

  averageNonZero(a: any[]): number {
    let filtered = a.filter((i) => { return i > 0 })
    let sum = filtered.reduce((sum, cur) => {
      return sum += cur
    }, 0)
    return sum / filtered.length
  }

  reformulateData() {
    let colors = {
      negative: '#dc267f', positive: '#008949', neutral: '#dddee1'
    }

    if (!this.confusion) {
      return

    }

    this.stats = this.confusion.statistics()
    console.log(this.confusion)
    console.log(this.stats)
    let f1: any[] = ['f1'];
    let precision: any[] = ['precision'];
    let recall: any[] = ['recall']
    // Used to create X Axis categories
    let categories = ['x']
    this.stats.forEach((classObj) => {
      // each class has obj has f1/p/r
      f1.push(Math.round(classObj.f1 * 100) / 100)
      precision.push(Math.round(classObj.precision * 100) / 100)
      recall.push(Math.round(classObj.recall * 100) / 100)
      categories.push(classObj.class)
    })

    this.summary.F1 = this.averageNonZero(f1.slice(1))
    this.summary.Precision = this.averageNonZero(precision.slice(1))
    this.summary.Recall = this.averageNonZero(recall.slice(1))

    this.graphData = [categories, f1, precision, recall]

    // Build Britechart groupedBar chart data
    this.briteGraphData = { data: [] };
    this.stats.forEach((classObj) => {
      this.briteGraphData.data.push({
        name: classObj['class'],
        group: 'f1',
        value: isNaN(classObj.f1) ? 0 : Math.round(classObj.f1 * 100) / 100
      });
      this.briteGraphData.data.push({
        name: classObj['class'],
        group: 'precision',
        value: isNaN(classObj.precision) ? 0 : Math.round(classObj.precision * 100) / 100
      });
      this.briteGraphData.data.push({
        name: classObj['class'],
        group: 'recall',
        value: isNaN(classObj.recall) ? 0 : Math.round(classObj.recall * 100) / 100
      });
    });
    console.log('graphData', this.graphData)
  }

  ngOnChanges(changes: { [propKey: string]: SimpleChange }) {
    console.log('TransactionCount - ngOnChanges --', changes)
    if (this.confusion) {
      this.reformulateData()
      this.buildChart()
    }
  }

  buildChart() {
    let pattern = []
    
    let colorsB = this.colors.map((o) => o.color)

    // var chart = c3.generate({
    //   bindto: '#f1-graph-chart',
    //   data: {
    //     x: 'x',
    //     columns: this.graphData,
    //     type: 'bar',
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
    //     }
    //   },
    //   legend: {
    //     show: true
    //   },
    //   color: {
    //     pattern: pattern
    //   },
    //   size: {
    //     height: 200
    //   }
    // });

    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#f1-graph-chart')
    const chartTooltip = britecharts.tooltip()
    this.groupedBar = britecharts.groupedBar();
    const containerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width 
    const containerHeight = ((<HTMLElement>divContainer.node()).getBoundingClientRect().height | 320) - 15;
    this.groupedBar
      .tooltipThreshold(400)
      .width(containerWidth)
      .height(containerHeight)
      .grid('horizontal')
      .margin({
        left: 40,
        top: 0,
        right: 20,
        bottom: 80
      })
      .isAnimated(true)
      .groupLabel('group')
      .nameLabel('name')
      .valueLabel('value')
      .colorSchema(colorsB)
      .on('customMouseOver', function () {
        chartTooltip.show();
      }) 
      .on('customMouseMove', function (dataPoint, topicColorMap, x, y) {
        chartTooltip.title(dataPoint.key);
        chartTooltip.update(dataPoint, topicColorMap, x, y);
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
    
    let xScale = d3Scale.scaleBand()
    .domain(this.briteGraphData.data.map((o) => o.name))
    .rangeRound([0, <number>containerWidth])
    .paddingInner(0);
    setTimeout(() => {
      container.select('.x.axis').selectAll(".tick text").call(this.wrap, xScale.bandwidth());
    }, 1000);
    
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
  }

  wrap(text, width) {
    text.nodes().forEach((t) => {
      let text = d3Selection.select(t),
          words = text.text().match(/.{1,3}/g).reverse(),
          word,
          line = [],
          lineNumber = 0,
          lineHeight = 1.1, // ems
          y = text.attr("y"),
          dy = parseFloat(text.attr("dy")),
          tspan = text.text(null).append("tspan").attr("x", 0).attr("y", y).attr("dy", dy + "em");
          
      while (word = words.pop()) {
        line.push(word);
        tspan.text(line.join(''));
        if ((<SVGTextElement> tspan.node()).getComputedTextLength() > width) {
          line.pop();
          tspan.text(line.join(''));
          line = [word];
          tspan = text.append("tspan").attr("x", 0).attr("y", y).attr("dy", ++lineNumber * lineHeight + dy + "em").text(word);
        }
      }
    });
  }

  redrawChart = () => {
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#f1-graph-chart');
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
      container.select('.x.axis').selectAll(".tick text").call(this.wrap, xScale.bandwidth());
    }, 1000);
  }

  mouseOverLegend(c) {

  }

  ngOnDestroy() {
    if (this.resizeEvt) {
      window.removeEventListener('resize', this.resizeEvt);
    }
  }
}
