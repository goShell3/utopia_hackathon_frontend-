'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface SourcePoint {
  label: string;
  value: number;
  color: string;
}

interface SourceDonutChartProps {
  data: SourcePoint[];
  size?: number;
}

export function SourceDonutChart({ data, size = 250 }: SourceDonutChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const radius = size / 2;
    const innerRadius = radius * 0.6;
    const outerRadius = radius;

    const g = svg.append("g")
      .attr("transform", `translate(${radius},${radius})`);

    const pie = d3.pie<SourcePoint>()
      .value(d => d.value)
      .sort(null);

    const arc = d3.arc<d3.PieArcDatum<SourcePoint>>()
      .innerRadius(innerRadius)
      .outerRadius(outerRadius)
      .cornerRadius(4)
      .padAngle(0.04);

    const path = g.selectAll(".arc")
      .data(pie(data))
      .enter()
      .append("path")
      .attr("class", "arc")
      .attr("d", arc)
      .attr("fill", d => d.data.color)
      .style("cursor", "pointer")
      .on("mouseover", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1.05)");
      })
      .on("mouseout", function(event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr("transform", "scale(1)");
      });

    // Center text
    const center = g.append("g")
      .attr("text-anchor", "middle");

    center.append("text")
      .attr("class", "total-label")
      .attr("dy", "-0.5em")
      .attr("fill", "#9ca3af")
      .attr("font-size", "12px")
      .attr("font-weight", "500")
      .text("Total Leads");

    center.append("text")
      .attr("class", "total-value")
      .attr("dy", "0.7em")
      .attr("fill", "#111827")
      .attr("font-size", "24px")
      .attr("font-weight", "700")
      .text(d3.sum(data, d => d.value).toLocaleString());

  }, [data, size]);

  return (
    <div className="flex flex-col items-center gap-6">
      <svg ref={svgRef} width={size} height={size} className="overflow-visible" />
      
      {/* Legend */}
      <div className="grid grid-cols-2 gap-x-8 gap-y-2 w-full max-w-[200px]">
        {data.map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div 
              className="w-2.5 h-2.5 rounded-full" 
              style={{ backgroundColor: item.color }} 
            />
            <span className="text-xs font-medium text-gray-500 whitespace-nowrap">{item.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
