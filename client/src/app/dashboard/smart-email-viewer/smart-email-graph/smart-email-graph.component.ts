import { Component, OnInit, Input/*, OnChanges*/ } from '@angular/core';

declare var d3: any
@Component({
  selector: 'smart-email-graph',
  templateUrl: './smart-email-graph.component.html',
  styleUrls: ['./smart-email-graph.component.css']
})

export class SmartEmailGraphComponent implements OnInit/*, OnChanges */{
  @Input() emailToGraph
  constructor() {}
  ngOnInit() {
    if (this.emailToGraph) {
      console.log("ngOnInit for smart-email-graph")
      console.log("going to graph email id: " + this.emailToGraph.id)
    } else {
      console.log("ngOnInit for smart-email-graph but nothing to graph")
    }
  }

  createGraph(email) {
    let entities = email.relation_data.entities
    let keys = Object.keys(entities);
    let sortedInts = keys.map((x) => parseInt(x)).sort()
    let nodes = []
    for (let key of keys) {
      nodes.push({text: entities[key.toString()].text})
    }
    var colors = d3.scale.category10();

    let edges = email.relation_data.relations;
    let w = 600;
    let h = 600;
    let linkDistance = 200;
    var svg = d3.select("email-graph").append("svg").attr({"width":w,"height":h});
    var force = d3.layout.force()
        .nodes(nodes)
        .links(edges)
        .size([w,h])
        .linkDistance([linkDistance])
        .charge([-500])
        .theta(0.1)
        .gravity(0.05)
        .start();

        edges = svg.selectAll("line")
          .data(edges)
          .enter()
          .append("line")
          .attr("id",function(d,i) {return 'edge'+i})
          .attr('marker-end','url(#arrowhead)')
          .style("stroke","#ccc")
          .style("pointer-events", "none");

        nodes = svg.selectAll("circle")
          .data(nodes)
          .enter()
          .append("circle")
          .attr({"r":15})
          .style("fill",function(d,i){return colors(i);})
          .call(force.drag)


        let nodelabels = svg.selectAll(".nodelabel")
           .data(nodes)
           .enter()
           .append("text")
           .attr({"x":function(d){return d.x;},
                  "y":function(d){return d.y;},
                  "class":"nodelabel",
                  "stroke":"black"})
           .text(function(d){return d.name;});

        let edgepaths = svg.selectAll(".edgepath")
            .data(edges)
            .enter()
            .append('path')
            .attr({'d': function(d) {return 'M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y},
                   'class':'edgepath',
                   'fill-opacity':0,
                   'stroke-opacity':0,
                   'fill':'blue',
                   'stroke':'red',
                   'id':function(d,i) {return 'edgepath'+i}})
            .style("pointer-events", "none");

        let edgelabels = svg.selectAll(".edgelabel")
            .data(edges)
            .enter()
            .append('text')
            .style("pointer-events", "none")
            .attr({'class':'edgelabel',
                   'id':function(d,i){return 'edgelabel'+i},
                   'dx':80,
                   'dy':0,
                   'font-size':10,
                   'fill':'#aaa'});

        edgelabels.append('textPath')
            .attr('xlink:href',function(d,i) {return '#edgepath'+i})
            .style("pointer-events", "none")
            .text(function(d,i){return 'label '+i});


        svg.append('defs').append('marker')
            .attr({'id':'arrowhead',
                   'viewBox':'-0 -5 10 10',
                   'refX':25,
                   'refY':0,
                   //'markerUnits':'strokeWidth',
                   'orient':'auto',
                   'markerWidth':10,
                   'markerHeight':10,
                   'xoverflow':'visible'})
            .append('svg:path')
                .attr('d', 'M 0,-5 L 10 ,0 L 0,5')
                .attr('fill', '#ccc')
                .attr('stroke','#ccc');


        force.on("tick", function(){

            edges.attr({"x1": function(d){return d.source.x;},
                        "y1": function(d){return d.source.y;},
                        "x2": function(d){return d.target.x;},
                        "y2": function(d){return d.target.y;}
            });

            // nodes.attr({"cx":function(d){return d.x;},
            //             "cy":function(d){return d.y;}
            // });

            nodelabels.attr("x", function(d) { return d.x; })
                      .attr("y", function(d) { return d.y; });

            edgepaths.attr('d', function(d) { var path='M '+d.source.x+' '+d.source.y+' L '+ d.target.x +' '+d.target.y;
                                               //console.log(d)
                                               return path});

            edgelabels.attr('transform',function(d,i){
                if (d.target.x<d.source.x){
                    let bbox = this.getBBox();
                    let rx = bbox.x+bbox.width/2;
                    let ry = bbox.y+bbox.height/2;
                    return 'rotate(180 '+rx+' '+ry+')';
                    }
                else {
                    return 'rotate(0)';
                    }
            });
        });
  }

/*
  ngOnChanges (changes: { [propKey: string]: SimpleChange }) {

  }*/
}
