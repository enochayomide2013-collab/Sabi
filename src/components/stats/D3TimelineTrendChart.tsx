import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { TrendingUp, Clock, ShieldAlert } from 'lucide-react';

interface TimelinePoint {
  week: string;
  totalSubmissions: number;
  debunkedFalse: number;
  verifiedTrue: number;
  outdatedMedia: number;
  avgResolutionMinutes: number;
}

const TIMELINE_DATA: TimelinePoint[] = [
  { week: 'W1 (Jun)', totalSubmissions: 38, debunkedFalse: 26, verifiedTrue: 7, outdatedMedia: 5, avgResolutionMinutes: 28 },
  { week: 'W2 (Jun)', totalSubmissions: 52, debunkedFalse: 39, verifiedTrue: 8, outdatedMedia: 5, avgResolutionMinutes: 24 },
  { week: 'W3 (Jun)', totalSubmissions: 45, debunkedFalse: 31, verifiedTrue: 9, outdatedMedia: 5, avgResolutionMinutes: 21 },
  { week: 'W4 (Jun)', totalSubmissions: 68, debunkedFalse: 50, verifiedTrue: 11, outdatedMedia: 7, avgResolutionMinutes: 18 },
  { week: 'W5 (Jul)', totalSubmissions: 84, debunkedFalse: 62, verifiedTrue: 14, outdatedMedia: 8, avgResolutionMinutes: 16 },
  { week: 'W6 (Jul)', totalSubmissions: 73, debunkedFalse: 51, verifiedTrue: 13, outdatedMedia: 9, avgResolutionMinutes: 15 },
  { week: 'W7 (Jul)', totalSubmissions: 95, debunkedFalse: 70, verifiedTrue: 15, outdatedMedia: 10, avgResolutionMinutes: 13 },
  { week: 'W8 (Jul)', totalSubmissions: 112, debunkedFalse: 83, verifiedTrue: 18, outdatedMedia: 11, avgResolutionMinutes: 11 },
  { week: 'W9 (Aug)', totalSubmissions: 104, debunkedFalse: 75, verifiedTrue: 17, outdatedMedia: 12, avgResolutionMinutes: 9 },
  { week: 'W10 (Aug)', totalSubmissions: 128, debunkedFalse: 96, verifiedTrue: 19, outdatedMedia: 13, avgResolutionMinutes: 8 },
  { week: 'W11 (Aug)', totalSubmissions: 145, debunkedFalse: 108, verifiedTrue: 22, outdatedMedia: 15, avgResolutionMinutes: 6 },
  { week: 'W12 (Live)', totalSubmissions: 162, debunkedFalse: 122, verifiedTrue: 25, outdatedMedia: 15, avgResolutionMinutes: 4.8 },
];

export const D3TimelineTrendChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [activeSeries, setActiveSeries] = useState<'all' | 'false' | 'speed'>('all');
  const [hoveredPoint, setHoveredPoint] = useState<TimelinePoint | null>(null);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 30, bottom: 40, left: 45 };
    const width = 760;
    const height = 300;
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);

    // X Scale
    const x = d3.scalePoint()
      .domain(TIMELINE_DATA.map(d => d.week))
      .range([0, innerWidth])
      .padding(0.2);

    // Y Scale (Volume)
    const yVolume = d3.scaleLinear()
      .domain([0, d3.max(TIMELINE_DATA, d => d.totalSubmissions)! * 1.15])
      .range([innerHeight, 0]);

    // Y Scale 2 (Resolution Speed)
    const ySpeed = d3.scaleLinear()
      .domain([0, 35])
      .range([innerHeight, 0]);

    // Grid lines
    g.append('g')
      .attr('class', 'grid')
      .call(d3.axisLeft(yVolume).ticks(5).tickSize(-innerWidth).tickFormat(() => ''))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('line').attr('stroke', 'rgba(255,255,255,0.06)'));

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x))
      .call(g => g.select('.domain').attr('stroke', 'rgba(255,255,255,0.2)'))
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#9ca3af')
        .attr('font-size', '10px')
        .attr('font-weight', '600')
      );

    // Y Axis Left
    g.append('g')
      .call(d3.axisLeft(yVolume).ticks(5))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', '#9ca3af')
        .attr('font-size', '10px')
      );

    // Gradients
    const defs = svg.append('defs');

    // Total area gradient
    const totalGrad = defs.append('linearGradient')
      .attr('id', 'total-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    totalGrad.append('stop').attr('offset', '0%').attr('stop-color', '#10b981').attr('stop-opacity', 0.4);
    totalGrad.append('stop').attr('offset', '100%').attr('stop-color', '#10b981').attr('stop-opacity', 0.0);

    // False area gradient
    const falseGrad = defs.append('linearGradient')
      .attr('id', 'false-grad')
      .attr('x1', '0%').attr('y1', '0%')
      .attr('x2', '0%').attr('y2', '100%');
    falseGrad.append('stop').attr('offset', '0%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.35);
    falseGrad.append('stop').attr('offset', '100%').attr('stop-color', '#ef4444').attr('stop-opacity', 0.0);

    // Area Generators
    const totalArea = d3.area<TimelinePoint>()
      .x(d => x(d.week)!)
      .y0(innerHeight)
      .y1(d => yVolume(d.totalSubmissions))
      .curve(d3.curveMonotoneX);

    const falseArea = d3.area<TimelinePoint>()
      .x(d => x(d.week)!)
      .y0(innerHeight)
      .y1(d => yVolume(d.debunkedFalse))
      .curve(d3.curveMonotoneX);

    // Line Generators
    const totalLine = d3.line<TimelinePoint>()
      .x(d => x(d.week)!)
      .y(d => yVolume(d.totalSubmissions))
      .curve(d3.curveMonotoneX);

    const falseLine = d3.line<TimelinePoint>()
      .x(d => x(d.week)!)
      .y(d => yVolume(d.debunkedFalse))
      .curve(d3.curveMonotoneX);

    const speedLine = d3.line<TimelinePoint>()
      .x(d => x(d.week)!)
      .y(d => ySpeed(d.avgResolutionMinutes))
      .curve(d3.curveMonotoneX);

    // Draw Areas
    if (activeSeries === 'all') {
      g.append('path')
        .datum(TIMELINE_DATA)
        .attr('fill', 'url(#total-grad)')
        .attr('d', totalArea);

      g.append('path')
        .datum(TIMELINE_DATA)
        .attr('fill', 'url(#false-grad)')
        .attr('d', falseArea);
    }

    // Draw Lines
    if (activeSeries === 'all' || activeSeries === 'false') {
      // Total Line
      g.append('path')
        .datum(TIMELINE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#10b981')
        .attr('stroke-width', 3)
        .attr('d', totalLine);

      // False Line
      g.append('path')
        .datum(TIMELINE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#ef4444')
        .attr('stroke-width', 2.5)
        .attr('stroke-dasharray', '4,3')
        .attr('d', falseLine);
    }

    if (activeSeries === 'all' || activeSeries === 'speed') {
      // Speed Line (Yellow)
      g.append('path')
        .datum(TIMELINE_DATA)
        .attr('fill', 'none')
        .attr('stroke', '#FFD60A')
        .attr('stroke-width', 3)
        .attr('d', speedLine);
    }

    // Interactive Circles & Overlay
    const points = g.selectAll('.point-marker')
      .data(TIMELINE_DATA)
      .enter()
      .append('g')
      .attr('class', 'point-marker')
      .attr('cursor', 'pointer')
      .on('mouseenter', (event, d) => setHoveredPoint(d))
      .on('mouseleave', () => setHoveredPoint(null));

    // Dots on Total
    points.append('circle')
      .attr('cx', d => x(d.week)!)
      .attr('cy', d => yVolume(d.totalSubmissions))
      .attr('r', 4.5)
      .attr('fill', '#10b981')
      .attr('stroke', '#ffffff')
      .attr('stroke-width', 1.5);

    // Dots on Speed
    points.append('circle')
      .attr('cx', d => x(d.week)!)
      .attr('cy', d => ySpeed(d.avgResolutionMinutes))
      .attr('r', 4.5)
      .attr('fill', '#FFD60A')
      .attr('stroke', '#06261c')
      .attr('stroke-width', 1.5);

  }, [activeSeries]);

  return (
    <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 space-y-4" id="d3-timeline-trend-chart-container">
      
      {/* Header & Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4 text-[#FFD60A]" />
            <span className="text-[11px] font-black text-[#FFD60A] uppercase tracking-wider font-display">
              D3.js Virality & Resolution Trend
            </span>
          </div>
          <h3 className="text-base sm:text-lg font-black font-display text-white mt-0.5">
            Verification Influx vs AI/Community Speed
          </h3>
        </div>

        {/* Filter Series */}
        <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setActiveSeries('all')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeSeries === 'all' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'
            }`}
          >
            All Metrics
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries('false')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeSeries === 'false' ? 'bg-red-500 text-white' : 'text-gray-300'
            }`}
          >
            False Spikes
          </button>
          <button
            type="button"
            onClick={() => setActiveSeries('speed')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              activeSeries === 'speed' ? 'bg-amber-400 text-amber-950' : 'text-gray-300'
            }`}
          >
            Resolution Speed
          </button>
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full select-none" />
      </div>

      {/* Hover Card or Status Footer */}
      {hoveredPoint ? (
        <div className="bg-emerald-950/90 border border-[#FFD60A] rounded-2xl p-3 flex flex-wrap items-center justify-between gap-3 text-xs animate-in fade-in">
          <div className="flex items-center gap-2">
            <span className="font-black text-sm text-[#FFD60A]">{hoveredPoint.week}</span>
            <span className="text-gray-300">Weekly Breakdown:</span>
          </div>
          <div className="flex items-center gap-4 text-[11px]">
            <div>Total: <strong className="text-emerald-400 font-bold">{hoveredPoint.totalSubmissions}</strong></div>
            <div>False Debunked: <strong className="text-red-400 font-bold">{hoveredPoint.debunkedFalse}</strong></div>
            <div>Verified True: <strong className="text-emerald-300 font-bold">{hoveredPoint.verifiedTrue}</strong></div>
            <div>Avg Debunk Time: <strong className="text-[#FFD60A] font-bold">{hoveredPoint.avgResolutionMinutes} mins</strong></div>
          </div>
        </div>
      ) : (
        <div className="flex flex-wrap items-center justify-between gap-3 text-[11px] text-gray-400 pt-1">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#10b981]" />
              <span>Total Verified Rumors</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-1 bg-[#ef4444] rounded" />
              <span>Debunked False Claims</span>
            </div>
            <div className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-[#FFD60A]" />
              <span>Avg Debunk Time (Mins)</span>
            </div>
          </div>
          <span className="text-[#FFD60A] font-semibold">Live Real-time Feed</span>
        </div>
      )}

    </div>
  );
};
