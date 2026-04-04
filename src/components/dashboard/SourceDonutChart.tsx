'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SourceData {
  name: string;
  value: number;
}

export function SourceDonutChart({ data, width = 300, height = 300 }: { data: SourceData[], width?: number, height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const radius = Math.min(width, height) / 2;
    const innerRadius = radius * 0.6;

    const color = d3.scaleOrdinal<string>()
      .domain(data.map(d => d.name))
      .range(['#ff0000', '#000000', '#404040', '#808080', '#c0c0c0']);

    const pie = d3.pie<SourceData>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<SourceData>>()
      .innerRadius(innerRadius)
      .outerRadius(radius);

    const g = svg.append("g")
      .attr("transform", `translate(${width / 2},${height / 2})`);

    const paths = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .attr("fill", d => color(d.data.name))
      .attr("stroke", "white")
      .attr("stroke-width", 2)
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this).transition().duration(200).attr("transform", "scale(1.05)");
      })
      .on("mouseout", function() {
        d3.select(this).transition().duration(200).attr("transform", "scale(1)");
      });

    // Add labels in the center
    const total = d3.sum(data, d => d.value);
    
    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "-0.5em")
      .attr("class", "technical-label text-neutral-400")
      .style("font-size", "10px")
      .text("TOTAL LEADS");

    g.append("text")
      .attr("text-anchor", "middle")
      .attr("dy", "0.7em")
      .attr("class", "display-header text-2xl")
      .text(total.toLocaleString());

  }, [data, width, height]);

  return (
    <div className="flex flex-col items-center">
      <svg ref={svgRef} width={width} height={height} />
      <div className="mt-4 grid grid-cols-2 gap-x-8 gap-y-2">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center gap-2">
            <div 
              className="w-2 h-2 rounded-full" 
              style={{ backgroundColor: ['#ff0000', '#000000', '#404040', '#808080', '#c0c0c0'][i] }} 
            />
            <span className="text-[10px] font-bold uppercase tracking-tight text-neutral-500">{d.name}</span>
            <span className="text-[10px] font-black italic ml-auto">{d.value}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
