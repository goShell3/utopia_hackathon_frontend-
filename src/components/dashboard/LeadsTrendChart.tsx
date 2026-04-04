'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface DataPoint {
  date: string;
  value: number;
}

interface LeadsTrendChartProps {
  data: DataPoint[];
  width?: number;
  height?: number;
}

export function LeadsTrendChart({ data, width = 600, height = 300 }: LeadsTrendChartProps) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove(); // Clear previous

    const margin = { top: 20, right: 30, bottom: 40, left: 50 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const x = d3.scalePoint()
      .domain(data.map(d => d.date))
      .range([0, chartWidth]);

    const y = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.value) || 0])
      .range([chartHeight, 0])
      .nice();

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // Grid lines
    g.append("g")
      .attr("class", "grid")
      .attr("stroke", "#f3f4f6")
      .attr("stroke-opacity", 0.5)
      .call(d3.axisLeft(y)
        .tickSize(-chartWidth)
        .tickFormat(() => "")
      );

    // Line
    const line = d3.line<DataPoint>()
      .x(d => x(d.date) || 0)
      .y(d => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "#ff0000") // Utopia Red
      .attr("stroke-width", 3)
      .attr("d", line);

    // Area under the line
    const area = d3.area<DataPoint>()
      .x(d => x(d.date) || 0)
      .y0(chartHeight)
      .y1(d => y(d.value))
      .curve(d3.curveMonotoneX);

    g.append("path")
      .datum(data)
      .attr("fill", "url(#gradient)")
      .attr("d", area);

    // Gradient definition
    const defs = svg.append("defs");
    const gradient = defs.append("linearGradient")
      .attr("id", "gradient")
      .attr("x1", "0%")
      .attr("y1", "0%")
      .attr("x2", "0%")
      .attr("y2", "100%");

    gradient.append("stop")
      .attr("offset", "0%")
      .attr("stop-color", "#ff0000")
      .attr("stop-opacity", 0.1);

    gradient.append("stop")
      .attr("offset", "100%")
      .attr("stop-color", "#ff0000")
      .attr("stop-opacity", 0);

    // Axes
    const xAxis = d3.axisBottom(x).tickSize(0).tickPadding(15);
    const yAxis = d3.axisLeft(y).ticks(5).tickSize(0).tickPadding(10);

    g.append("g")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(xAxis)
      .attr("color", "#9ca3af")
      .attr("font-size", "10px")
      .select(".domain").remove();

    g.append("g")
      .call(yAxis)
      .attr("color", "#9ca3af")
      .attr("font-size", "10px")
      .select(".domain").remove();

    // Data points (dots)
    g.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("cx", d => x(d.date) || 0)
      .attr("cy", d => y(d.value))
      .attr("r", 4)
      .attr("fill", "#ffffff")
      .attr("stroke", "#ff0000")
      .attr("stroke-width", 2)
      .attr("class", "dot")
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this).attr("r", 6).attr("stroke-width", 3);
      })
      .on("mouseout", function() {
        d3.select(this).attr("r", 4).attr("stroke-width", 2);
      });

  }, [data, width, height]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
    </div>
  );
}
