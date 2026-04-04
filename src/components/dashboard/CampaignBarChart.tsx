'use client';

import React, { useEffect, useRef } from 'react';
import * as d3 from 'd3';

interface CampaignData {
  campaign: string;
  sent: number;
  conversion: number;
}

export function CampaignBarChart({ data, width = 600, height = 300 }: { data: CampaignData[], width?: number, height?: number }) {
  const svgRef = useRef<SVGSVGElement>(null);

  useEffect(() => {
    if (!svgRef.current || !data.length) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll("*").remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 100 };
    const chartWidth = width - margin.left - margin.right;
    const chartHeight = height - margin.top - margin.bottom;

    const y = d3.scaleBand()
      .domain(data.map(d => d.campaign))
      .range([0, chartHeight])
      .padding(0.3);

    const x = d3.scaleLinear()
      .domain([0, d3.max(data, d => d.sent) || 0])
      .range([0, chartWidth]);

    const g = svg.append("g")
      .attr("transform", `translate(${margin.left},${margin.top})`);

    // X-axis grid
    g.append("g")
      .attr("class", "grid")
      .attr("transform", `translate(0,${chartHeight})`)
      .call(d3.axisBottom(x)
        .tickSize(-chartHeight)
        .tickFormat(() => "")
      )
      .attr("color", "#f3f4f6")
      .select(".domain").remove();

    // Bars
    g.selectAll(".bar")
      .data(data)
      .enter()
      .append("rect")
      .attr("class", "bar")
      .attr("y", d => y(d.campaign) || 0)
      .attr("height", y.bandwidth())
      .attr("x", 0)
      .attr("width", d => x(d.sent))
      .attr("fill", d => d.sent > 5000 ? "#ff0000" : "#000000") // Utopia Red for top performing
      .attr("rx", 2)
      .style("cursor", "pointer")
      .on("mouseover", function() {
        d3.select(this).attr("opacity", 0.8);
      })
      .on("mouseout", function() {
        d3.select(this).attr("opacity", 1);
      });

    // Conversion % text on right
    g.selectAll(".label")
      .data(data)
      .enter()
      .append("text")
      .attr("class", "technical-label text-[8px] font-black italic")
      .attr("x", d => x(d.sent) + 5)
      .attr("y", d => (y(d.campaign) || 0) + y.bandwidth() / 2 + 4)
      .attr("fill", "#ff0000")
      .text(d => `${d.conversion}% CONV`);

    // Y Axis labels
    g.append("g")
      .call(d3.axisLeft(y).tickSize(0).tickPadding(10))
      .attr("font-size", "10px")
      .attr("font-weight", "800")
      .attr("font-family", "Inter, sans-serif")
      .attr("text-transform", "uppercase")
      .attr("font-style", "italic")
      .select(".domain").remove();

  }, [data, width, height]);

  return (
    <div className="w-full h-full flex items-center justify-center">
      <svg ref={svgRef} width={width} height={height} className="overflow-visible" />
    </div>
  );
}
