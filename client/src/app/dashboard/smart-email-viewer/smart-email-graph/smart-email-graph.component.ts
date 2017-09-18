import { Component, OnInit, OnDestroy, Input, ViewChild } from '@angular/core';
import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/interval';
import 'rxjs/add/operator/takeWhile';

import { fade } from '../../../shared/utils/animations';

import * as d3Selection from 'd3-selection';
import * as d3Scale from 'd3-scale';
import * as d3 from 'd3';

@Component({
  selector: 'smart-email-graph',
  animations: [fade()],
  templateUrl: './smart-email-graph.component.html',
  styleUrls: ['./smart-email-graph.component.scss']
})

export class SmartEmailGraphComponent implements OnInit, OnDestroy {
  private emailToGraph: any;
  private simulation: any;
  private resizeEvent: any;
  public id: string;

  @ViewChild('legendDiv') legendDiv;
  @ViewChild('graphdiv') graphDiv;

  @Input('resizeNow')
  set inputResize(resize) {
    Observable.timer(600)
      .subscribe(() => {
        this.resize();
      });
  }

  @Input('emailToGraph')
  set inputData(email) {
    this.emailToGraph = email;
    if (email) {
      this.id = email.id;
    }
    setTimeout(() => {
      this.createGraph(email);
    }, 500);
  }

  constructor() { }
  ngOnInit() {
    if (this.emailToGraph) {
      console.log("ngOnInit for smart-email-graph")
      console.log("going to graph email id: " + this.emailToGraph.id)
    } else {
      console.log("ngOnInit for smart-email-graph but nothing to graph")
    }
    let obs;
    let stop = false;
    this.resizeEvent = () => {
      if (obs) {
        stop = true;
      }
      obs = Observable.timer(500)
        .takeWhile(() => stop)
        .subscribe(() => {
          obs = null;
          this.resize();
        });

    }
    window.addEventListener('resize', this.resizeEvent);
  }

  resize() {
    if (this.simulation) {
      const containerNode = <HTMLElement>this.graphDiv.nativeElement;
      let width = containerNode.getBoundingClientRect().width;
      let height = containerNode.getBoundingClientRect().height + 200;
      this.simulation.force('center', d3.forceCenter(width / 2, height / 2))
        .alphaTarget(0.1).restart()
    }
  }

  createGraph(email) {
    // clean up svg
    d3Selection.select("#email-graph").select('svg').remove();
    if (!email.relation_data) {
      return;
    }
    let entities = email.relation_data.entities
    let keys = Object.keys(entities);
    let sortedInts = keys.map((x) => parseInt(x)).sort()
    let nodes = []
    keys.forEach((k, index) => {
      const entity = entities[k.toString()];
      nodes.push({ name: entity.text, id: '' + index, type: entity.type });
    })
    let legendTypes = nodes.map((o) => o.type);
    legendTypes = Array.from(new Set(legendTypes)) // make the array with unique legend types

    const colors = d3Scale.scaleOrdinal(d3Scale.schemeCategory10);

    const links_raw = email.relation_data.relations;
    let links = [];
    links_raw.forEach((l) => {
      links.push({
        source: l.source.id,
        target: l.target.id,
        srcData: l.source,
        targetData: l.target
      });
    });
    console.log('Email graph edges and nodes:', email, links, nodes, legendTypes);

    const containerNode = <HTMLElement>this.graphDiv.nativeElement;
    let width = containerNode.getBoundingClientRect().width;
    let height = containerNode.getBoundingClientRect().height;
    console.log('width:' + width + ' height:' + height);
    let linkDistance = 200;
    const svg = d3Selection.select("#email-graph").append("svg").attr('width', '100%').attr('height', '100%');

    // Arrow head def
    svg.append('defs').append('marker')
      .attr('id', 'arrowhead')
      .attr('viewBox', '-0 -5 10 10')
      .attr('refX', 25)
      .attr('refY', 0)
      .attr('orient', 'auto')
      .attr('markerWidth', 5)
      .attr('markerHeight', 5)
      .attr('xoverflow', 'visible')
      .append('svg:path')
      .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
      .attr('fill', '#999')
      .attr('stroke', '#999');

    this.simulation = d3.forceSimulation()
      .force('link', d3.forceLink().id((d: any) => { return d.id; }))
      .force('charge', d3.forceManyBody().strength(-1600).distanceMin(200).distanceMax(600).theta(0.1))
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force("y", d3.forceY(0.001))
      .force("x", d3.forceX(0.001))

    this.simulation
      .nodes(nodes)
      .on('tick', ticked);

    this.simulation.force('link').links(links);

    const link = svg.append('g')
      .attr('class', 'links')
      .selectAll('line')
      .data(links)
      .enter().append('line')
      .attr('stroke-width', (d: any) => { return 1; })
      .attr('id', (d, i) => { return 'edge' + i })
      .attr('marker-end', 'url(#arrowhead)')
      .style('stroke', '#ccc')
      .style('pointer-events', 'none');

    const node = svg.selectAll('.node')
      .data(nodes)
      .enter().append('g')
      .attr('class', (d) => 'node' )
      .on('mouseover', (d, i, g) => {
        d3Selection.select(this.legendDiv.nativeElement)
          .selectAll('.legend')
          .classed('blur', (l) => {
            if (l !== d.type) {
              return true
            } else {
              return false
            }
          })
          .classed('selected', (l) => {
            if (l === d.type) {
              return true
            } else {
              return false
            }
          })
          
      })
      .on('mouseout', (d, i, g) => {
        d3Selection.select(this.legendDiv.nativeElement)
          .selectAll('.legend')
          .classed('blur', false)
          .classed('selected', false)
      })
      .call(d3.drag()
        .on('start', (d) => this.dragstarted(d))
        .on('drag', (d) => this.dragged(d))
        .on('end', (d) => this.dragended(d)));

    const radius = 12;
    node.append('circle')
      .attr('r', radius)
      .attr('fill', (d: any) => { return colors(d.type) });

    node.append('text')
      .attr("dx", radius+1)
      .attr("dy", 5)
      .attr('class', 'nodelabel')
      .attr('stroke', '#555')
      .text(function (d) { return d.name; });

      node.append('text')
      .attr("dx", radius+1)
      .attr("dy", 20)
      .attr('class', 'nodelabel small')
      .attr('stroke', '#999')
      .text(function (d) { return d.type; });

    node.append('title')
      .text(function (d) { return d.name; });

    const edge = svg.append('g')
      .attr('class', 'edges')
      .selectAll('path')
      .data(links)
      .enter().append('path')
      .attr('class', 'edgepath')
      .attr('fill-opacity', 0)
      .attr('stroke-opacity', 0)
      .attr('fill', 'blue')
      .attr('stroke', 'red')
      .attr('id', (d, i) => { return 'edgepath' + i })
      .style("pointer-events", "none");

    function ticked() {
      link
        .attr('x1', function (d: any) { return d.source.x; })
        .attr('y1', function (d: any) { return d.source.y; })
        .attr('x2', function (d: any) { return d.target.x; })
        .attr('y2', function (d: any) { return d.target.y; });

      node
        .attr('transform', (d) => 'translate(' + d.x + ',' + d.y + ')');
      edge
        .attr('d', (d: any) => { return 'M ' + d.source.x + ' ' + d.source.y + ' L ' + d.target.x + ' ' + d.target.y })
    }

    // creates legend
    const legend = d3Selection.select(this.legendDiv.nativeElement);
    legend.selectAll('*').remove();
    const legendDivs = legend
      .selectAll('.legend')
      .data(legendTypes)
      .enter()
      .append('div')
      .on('mouseover', (l, i, divs: any[]) => {
        svg.selectAll('.node')
        .transition().duration(200)
        .attr('opacity', (d: any) => {
          divs.forEach((div, index) => {
            if (index === i) {
              d3Selection.select(div).classed('selected', true)
            } else {
              d3Selection.select(div).classed('blur', true)
            }
          })
          if (d.type === l) {
            return 1;
          } else {
            return 0.5;
          }
          
        })
      })
      .on('mouseout', (l, i, divs) => {
        legend
        .selectAll('.legend')
        .classed('selected', false)
        .classed('blur', false);
        svg.selectAll('.node')
        .transition().duration(200)
        .attr('opacity', (d: any) => {
          return 1
        })
      });

    legendDivs.attr('class', 'legend')
      .attr('id', (d) => 'rel-legend-' + d)
      .append('i').attr('class', 'fa fa-circle')
      .style('color', (d) => colors(d))
    legendDivs.append('span').html((d) => d);

    legendDivs.transition().duration(500).style('opacity', 1);
  }

  dragstarted(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.3).restart();
    d.fx = d.x;
    d.fy = d.y;
  }

  dragged(d) {
    d.fx = d3.event.x;
    d.fy = d3.event.y;
  }

  dragended(d) {
    if (!d3.event.active) this.simulation.alphaTarget(0.1);
    d.fx = null;
    d.fy = null;
  }

  ngOnDestroy() {
    if (this.resizeEvent) {
      window.removeEventListener('resize', this.resizeEvent);
    }
  }
}
