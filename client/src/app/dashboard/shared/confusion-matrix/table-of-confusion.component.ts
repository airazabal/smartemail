import {
  Component, OnInit, OnDestroy, Input, Output, EventEmitter, ViewChild,
  OnChanges, SimpleChange
} from '@angular/core';
import { ConfusionMatrix } from './ConfusionMatrix'
import * as d3Selection from 'd3-selection';
import * as d3 from 'd3';
import * as lodash from 'lodash';

declare var c3: any
declare var britecharts: any

@Component({
  selector: 'app-table-of-confusion',
  templateUrl: './table-of-confusion.component.html',
  styleUrls: ['./graph.component.scss']
})

export class TableOfConfusionComponent implements OnInit, OnDestroy {

  @ViewChild('chartdiv') chartDiv
  @Input() confusion: ConfusionMatrix
  @Output() selected = new EventEmitter()

  public colors = [
    { label: 'False Negatives', color: '#cef3d1' }, { label: 'False Positives', color: '#57d785' },
    { label: 'True Positives', color: '#116639' }
  ]

  private stats: any[]
  private graphData: any[]
  private briteGraphData: any
  private categories: any[]
  private chartMargin = {
    left: 225,
    top: 0,
    right: 0,
    bottom: 30
  }
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
    'F1': 0,
    'Precision': 0,
    'Recall': 0
  }

  private stackedBar: any;
  private resizeEvt: any;

  constructor() { }

  ngOnInit() {

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
    //console.log('confusion.toc: ', this.confusion.toc)
    //console.log('confusion.matrix: ', this.confusion.matrix)
    //console.log('confusion', this.confusion)
    //console.log('confusion', JSON.stringify(this.confusion))
    // this.confusion.toc is on obj of objects...
    let toc = this.confusion.toc
    let tp: any[] = ['True Positives']
    let fp: any[] = ['False Positives']
    let fn: any[] = ['False Negatives']
    //    let tn:any[]=['True Negatives']
    let categories: any[] = ['x']
    Object.keys(toc).forEach((actual) => {
      tp.push(toc[actual].true_positives)
      fp.push(toc[actual].false_positives)
      fn.push(toc[actual].false_negatives)
      //     tn.push(toc[actual].tn)
      categories.push(actual)
    })
    this.graphData = [categories, tp, fp, fn]
    console.log('table of confusion graphData', this.graphData)

    // Build Britechart stackedBar chart data
    this.briteGraphData = { data: [] };
    Object.keys(toc).forEach((actual) => {
      this.briteGraphData.data.push({
        name: actual,
        stack: 'True Positives',
        value: toc[actual].true_positives
      });
      this.briteGraphData.data.push({
        name: actual,
        stack: 'False Positives',
        value: toc[actual].false_positives
      });
      this.briteGraphData.data.push({
        name: actual,
        stack: 'False Negatives',
        value: toc[actual].false_negatives
      });
    });
    this.briteGraphData.data.reverse();
    console.log('=========>Table of Confusion:', this.briteGraphData);
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
    let colors = {
      'True Positives': '#116639', 'False Positives': '#57d785', 'False Negatives': '#cef3d1'
    }
    // var chart = c3.generate({
    //   bindto: '#table-of-confusion-chart',
    //   data: {
    //     x: 'x',
    //     columns: this.graphData,
    //     type: 'bar',
    //     groups: [
    //       ['True Positives', 'False Positives', 'False Negatives']
    //     ],
    //     colors: colors,
    //     onclick: (d, i) => {
    //       let event = { entity_type: this.graphData[0][d.x + 1], toc_type: d.name };
    //       console.log('chart.onclick() emitting event: ', event)
    //       this.selected.emit(event);
    //     },
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
    //   color: {
    //     pattern: pattern
    //   },
    //   size: {
    //     height: 200
    //   }
    // });

    const colorsB = this.colors.map((o) => o.color)
    const divContainer = d3Selection.select(this.chartDiv.nativeElement)
    const container = d3Selection.select('#table-of-confusion-chart')
    const chartTooltip = britecharts.tooltip()
    this.stackedBar = britecharts.stackedBar();
    const containerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width
    const containerHeight = (<HTMLElement>divContainer.node()).getBoundingClientRect().height || 350

    this.stackedBar.tooltipThreshold(350)
      .width(containerWidth)
      .height(containerHeight)
      .grid('vertical')
      .isHorizontal(true)
      .isAnimated(true)
      .stackLabel('stack')
      .nameLabel('name')
      .valueLabel('value')
      .colorSchema(colorsB)
      .margin(this.chartMargin)
      .on('customMouseOver', () => {
        chartTooltip.show();
      })
      .on('customMouseMove', (dataPoint, topicColorMap, x, y) => {
        chartTooltip.title(dataPoint.key);
        y = Math.max(y, 64);
        const tooltipContainer = container.select('.metadata-group');

        chartTooltip.update(dataPoint, topicColorMap, x, y);
        // Readjust position so that tooltip doesn't go to far up and clipped.
        tooltipContainer.attr('transform', 'translate(' + x + ',' + y + ')')
      })
      .on('customMouseOut', () => {
        chartTooltip.hide();
      });
    container.datum(this.briteGraphData.data).call(this.stackedBar);

    // We need to redo the animation here because Britechart has a bug where the animation
    // only works if there are less than 8 bars.
    const data = this.briteGraphData.data;
    const getName = (data) => data['name']
    const getValue = (data) => data['value']
    const getStack = (data) => data['stack']
    const uniq = (arrArg) => arrArg.filter((elem, pos, arr) => arr.indexOf(elem) == pos);

    const maxBarNumber = 100

    const animationDelayStep = 20
    const animationDelays = d3.range(animationDelayStep, maxBarNumber * animationDelayStep, animationDelayStep);
    const animationDuration = 1000;
    const ease = d3.easeQuadInOut;

    const stacks = uniq(data.map(({ stack }) => stack));
    const transformedData = d3.nest()
      .key(getName)
      .rollup((values): any => {
        let ret = { values: [] };

        values.forEach((entry) => {
          if (entry && entry['stack']) {
            ret[entry['stack']] = getValue(entry);
          }
        });
        ret.values = values; //for tooltip

        return ret;
      })
      .entries(data)
      .map(function (data) {
        return lodash.assign({}, {
          total: d3.sum(d3.permute(<any[]>data.value, stacks)),
          key: data.key
        }, data.value);
      });

    let yMax = d3.max(transformedData.map(function (d) {
      return d.total;
    }));
    let xScale = d3.scaleLinear()
      .domain([0, yMax])
      .rangeRound([0, containerWidth - 1]);
    container.selectAll('.bar').style('opacity', 0.24)
      .transition()
      .delay((_, i) => animationDelays[i])
      .duration(animationDuration)
      .ease(ease)
      .tween('attr.width', function (d) {
        let node = d3Selection.select(this),
          i = d3.interpolateRound(0, xScale(d[1] - d[0])),
          j = d3.interpolateNumber(0, 1);
        return function (t) {
          node.attr('width', i(t));
          node.style('opacity', j(t));
        };
      }).on('end', () => {
        this.stackedBar.margin(lodash.merge(this.chartMargin, { bottom: 0 })) //set bottom margin to 0 for tooltip to work correctly          
      });

    // Tooltip Setup and start
    chartTooltip
      .topicLabel('values')
      .nameLabel('stack')
      .title('')
      .shouldShowDateInTitle(false);

    // Note that if the viewport width is less than the tooltipThreshold value,
    // this container won't exist, and the tooltip won't show up
    const tooltipContainer = container.select('.metadata-group');
    tooltipContainer.datum([]).call(chartTooltip);

    // Add click event
    container.selectAll('rect')
      .on('click', (d: any, i) => {
        const data = d.data.values.find((o) => o.value === (d[1] - d[0]))
        let event = { entity_type: data.name, toc_type: data.stack };
        this.selected.emit(event);
      })

    // Listen to window resize event
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
    const container = d3Selection.select('#table-of-confusion-chart');
    const newContainerWidth = (<HTMLElement>divContainer.node()).getBoundingClientRect().width;
    const newContainerHeight = (<HTMLElement>divContainer.node()).getBoundingClientRect().height || 320;

    // Setting the new width and height on the chart
    this.stackedBar.width(newContainerWidth);
    // this.stackedBar.height(newContainerHeight);

    // Rendering the chart again
    this.stackedBar.margin(this.chartMargin) // set the chart margin again
    container.datum(this.briteGraphData.data).call(this.stackedBar);
    this.stackedBar.margin(lodash.merge(this.chartMargin, { bottom: 0 })) //set bottom margin to 0 for tooltip to work correctly          
  }

  mouseOverLegend(col) {
    const layers = d3Selection.select('#table-of-confusion-chart')
      .selectAll('.layer');
    layers.each((d, i, g) => {
      const el = d3Selection.select(g[i]);

      if (el.attr('fill') !== col.color) {
        el.transition().duration(100).attr('opacity', 0.2);
      } else {
        el.transition().duration(100).attr('fill', d3.color(col.color).darker(0.1).toString());
      }
    });
  }

  mouseOutLegend(c) {
    const layers = d3Selection.select('#table-of-confusion-chart')
      .selectAll('.layer')
    layers.each((d:any, i, g) => {
      const el = d3Selection.select(g[i]);
      const col = this.colors.find((o) => o.label === d.key)
      col.color = d3.color(col.color).toString();
      el.attr('fill', d3.color(col.color).toString()).attr('opacity', 1);
    })
  }

  ngOnDestroy() {
    if (this.resizeEvt) {
      window.removeEventListener('resize', this.resizeEvt);
    }
  }
}
