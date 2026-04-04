'use client';

import React, { useEffect, useRef, useCallback, useState } from 'react';
import * as d3 from 'd3';
import { Plus, Minus } from 'lucide-react';
import type { Campaign } from '@/types';

const STATUS_COLORS: Record<string, { bar: string; text: string }> = {
  active:    { bar: '#22c55e', text: '#ffffff' },
  paused:    { bar: '#000000', text: '#ffffff' },
  draft:     { bar: '#d4d4d4', text: '#525252' },
  completed: { bar: '#ff0000', text: '#ffffff' },
};

interface Props {
  campaigns: Campaign[];
}

export function CampaignTimeline({ campaigns }: Props) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const zoomRef = useRef<d3.ZoomBehavior<SVGSVGElement, unknown> | null>(null);
  const [zoomLevel, setZoomLevel] = useState(100);

  const buildChart = useCallback((containerWidth: number) => {
    if (!svgRef.current || containerWidth === 0) return;

    const valid = campaigns.filter(c => (c as any).start_date && (c as any).end_date);
    if (!valid.length) return;

    const ROW_HEIGHT = 48;
    const ROW_GAP = 12;
    const margin = { top: 40, right: 24, bottom: 24, left: 180 };
    const chartWidth = containerWidth - margin.left - margin.right;
    const chartHeight = valid.length * (ROW_HEIGHT + ROW_GAP);
    const totalHeight = chartHeight + margin.top + margin.bottom;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();
    svg
      .attr('width', containerWidth)
      .attr('height', totalHeight)
      .attr('viewBox', `0 0 ${containerWidth} ${totalHeight}`)
      .attr('preserveAspectRatio', 'xMidYMid meet');

    svg.append('defs').append('clipPath').attr('id', 'timeline-clip')
      .append('rect').attr('width', chartWidth).attr('height', chartHeight + margin.top);

    const root = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    const allDates = valid.flatMap(c => [
      new Date((c as any).start_date),
      new Date((c as any).end_date),
    ]);
    const padded: [Date, Date] = [
      d3.timeDay.offset(d3.min(allDates)!, -5),
      d3.timeDay.offset(d3.max(allDates)!, 5),
    ];

    const x = d3.scaleTime().domain(padded).range([0, chartWidth]);

    const xAxisG = root.append('g')
      .attr('transform', 'translate(0,-16)')
      .call(
        d3.axisTop(x)
          .ticks(d3.timeWeek.every(1))
          .tickFormat(d3.timeFormat('%b %d') as any)
          .tickSize(0)
          .tickPadding(8)
      )
      .attr('color', '#9ca3af')
      .attr('font-size', '9px')
      .attr('font-weight', '800')
      .attr('font-style', 'italic');
    xAxisG.select('.domain').remove();

    const today = new Date();
    if (today >= padded[0] && today <= padded[1]) {
      root.append('line')
        .attr('class', 'today-line')
        .attr('x1', x(today)).attr('x2', x(today))
        .attr('y1', -24).attr('y2', chartHeight)
        .attr('stroke', '#ff0000')
        .attr('stroke-width', 1.5)
        .attr('stroke-dasharray', '4,3')
        .attr('opacity', 0.7);

      root.append('text')
        .attr('class', 'today-label')
        .attr('x', x(today) + 4).attr('y', -28)
        .attr('fill', '#ff0000')
        .attr('font-size', '8px')
        .attr('font-weight', '800')
        .attr('font-style', 'italic')
        .text('TODAY');
    }

    const barsG = root.append('g').attr('clip-path', 'url(#timeline-clip)');

    valid.forEach((campaign, i) => {
      const y = i * (ROW_HEIGHT + ROW_GAP);
      const colors = STATUS_COLORS[campaign.status] ?? STATUS_COLORS.draft;
      const start = new Date((campaign as any).start_date);
      const end = new Date((campaign as any).end_date);

      root.append('rect')
        .attr('x', 0).attr('y', y)
        .attr('width', chartWidth).attr('height', ROW_HEIGHT)
        .attr('fill', i % 2 === 0 ? '#fafafa' : '#ffffff')
        .attr('rx', 2);

      svg.append('text')
        .attr('x', margin.left - 12)
        .attr('y', margin.top + y + ROW_HEIGHT / 2 + 4)
        .attr('text-anchor', 'end')
        .attr('font-size', '10px')
        .attr('font-weight', '800')
        .attr('font-style', 'italic')
        .attr('fill', '#171717')
        .text(campaign.name.length > 22 ? campaign.name.slice(0, 22) + '…' : campaign.name);

      barsG.append('rect')
        .attr('class', `bar-${campaign.id}`)
        .attr('x', x(start))
        .attr('y', y + 8)
        .attr('width', Math.max(x(end) - x(start), 4))
        .attr('height', ROW_HEIGHT - 16)
        .attr('fill', colors.bar)
        .attr('rx', 3);

      barsG.append('text')
        .attr('class', `bar-label-${campaign.id}`)
        .attr('x', x(start) + 8)
        .attr('y', y + ROW_HEIGHT / 2 + 4)
        .attr('fill', colors.text)
        .attr('font-size', '8px')
        .attr('font-weight', '800')
        .attr('font-style', 'italic')
        .attr('pointer-events', 'none')
        .text(`${(campaign as any).start_date} → ${(campaign as any).end_date}`);
    });

    const zoom = d3.zoom<SVGSVGElement, unknown>()
      .scaleExtent([0.4, 10])
      .translateExtent([[-chartWidth, -totalHeight], [chartWidth * 2, totalHeight * 2]])
      .filter(event => event.type !== 'wheel')
      .on('zoom', (event) => {
        const newX = event.transform.rescaleX(x);

        setZoomLevel(Math.round(event.transform.k * 100));

        xAxisG.call(
          d3.axisTop(newX)
            .ticks(d3.timeWeek.every(Math.max(1, Math.round(2 / event.transform.k))))
            .tickFormat(d3.timeFormat('%b %d') as any)
            .tickSize(0)
            .tickPadding(8)
        );
        xAxisG.select('.domain').remove();

        root.select('.today-line')
          .attr('x1', newX(today)).attr('x2', newX(today));
        root.select('.today-label')
          .attr('x', newX(today) + 4);

        valid.forEach((campaign) => {
          const start = new Date((campaign as any).start_date);
          const end = new Date((campaign as any).end_date);
          const newW = Math.max(newX(end) - newX(start), 4);

          barsG.select(`.bar-${campaign.id}`)
            .attr('x', newX(start))
            .attr('width', newW);

          barsG.select(`.bar-label-${campaign.id}`)
            .attr('x', newX(start) + 8)
            .attr('display', newW < 80 ? 'none' : null);
        });
      });

    zoomRef.current = zoom;
    svg.call(zoom);
  }, [campaigns]);

  // Use ResizeObserver so we get the real rendered width
  useEffect(() => {
    if (!containerRef.current) return;
    // Initial build after paint
    const raf = requestAnimationFrame(() => {
      if (containerRef.current) {
        buildChart(containerRef.current.clientWidth);
      }
    });
    const observer = new ResizeObserver(entries => {
      const width = entries[0]?.contentRect.width ?? 0;
      if (width > 0) buildChart(width);
    });
    observer.observe(containerRef.current);
    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
    };
  }, [buildChart]);

  const applyZoom = useCallback((factor: number) => {
    if (!svgRef.current || !zoomRef.current) return;
    d3.select(svgRef.current)
      .transition().duration(250)
      .call(zoomRef.current.scaleBy, factor);
  }, []);

  return (
    <div className="w-full space-y-3">
      <div className="flex items-center justify-end gap-2">
        <button
          onClick={() => applyZoom(0.6)}
          className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-colors text-neutral-500"
        >
          <Minus size={12} />
        </button>
        <span className="text-[10px] font-black italic uppercase text-neutral-400 w-12 text-center tabular-nums">
          {zoomLevel}%
        </span>
        <button
          onClick={() => applyZoom(1.6)}
          className="w-7 h-7 flex items-center justify-center border border-neutral-200 hover:border-black hover:bg-black hover:text-white transition-colors text-neutral-500"
        >
          <Plus size={12} />
        </button>
      </div>
      <div ref={containerRef} className="w-full overflow-hidden min-h-[100px]">
        <svg ref={svgRef} style={{ display: 'block', width: '100%' }} className="cursor-grab active:cursor-grabbing" />
      </div>
      <p className="text-[9px] technical-label text-neutral-400 text-right uppercase tracking-widest">
        Drag to pan
      </p>
    </div>
  );
}
