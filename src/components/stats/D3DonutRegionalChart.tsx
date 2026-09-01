import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ALL_36_NIGERIAN_STATES, GLOBAL_RUMOR_REGIONS } from '../../data/nigerianStatesData';
import { PieChart, Globe2 } from 'lucide-react';

interface ZoneDonutItem {
  label: string;
  count: number;
  falseCount: number;
  percentage: number;
  color: string;
  type: 'Nigeria Zone' | 'Global Region';
}

export const D3DonutRegionalChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [hoveredSlice, setHoveredSlice] = useState<ZoneDonutItem | null>(null);
  const [viewScope, setViewScope] = useState<'nigeria_zones' | 'combined_global'>('combined_global');

  // Compute breakdown
  const calculateData = (): ZoneDonutItem[] => {
    const swTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South West').reduce((a, b) => a + b.totalRumorsCount, 0);
    const swFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South West').reduce((a, b) => a + b.falseClaimsCount, 0);

    const ncTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North Central').reduce((a, b) => a + b.totalRumorsCount, 0);
    const ncFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North Central').reduce((a, b) => a + b.falseClaimsCount, 0);

    const nwTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North West').reduce((a, b) => a + b.totalRumorsCount, 0);
    const nwFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North West').reduce((a, b) => a + b.falseClaimsCount, 0);

    const neTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North East').reduce((a, b) => a + b.totalRumorsCount, 0);
    const neFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'North East').reduce((a, b) => a + b.falseClaimsCount, 0);

    const seTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South East').reduce((a, b) => a + b.totalRumorsCount, 0);
    const seFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South East').reduce((a, b) => a + b.falseClaimsCount, 0);

    const ssTotal = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South South').reduce((a, b) => a + b.totalRumorsCount, 0);
    const ssFalse = ALL_36_NIGERIAN_STATES.filter(s => s.zone === 'South South').reduce((a, b) => a + b.falseClaimsCount, 0);

    const globalTotal = GLOBAL_RUMOR_REGIONS.reduce((a, b) => a + b.totalRumorsCount, 0);
    const globalFalse = GLOBAL_RUMOR_REGIONS.reduce((a, b) => a + b.falseClaimsCount, 0);

    let items: ZoneDonutItem[] = [
      { label: 'South West', count: swTotal, falseCount: swFalse, percentage: 0, color: '#10b981', type: 'Nigeria Zone' },
      { label: 'North West', count: nwTotal, falseCount: nwFalse, percentage: 0, color: '#047857', type: 'Nigeria Zone' },
      { label: 'North Central', count: ncTotal, falseCount: ncFalse, percentage: 0, color: '#065f46', type: 'Nigeria Zone' },
      { label: 'South South', count: ssTotal, falseCount: ssFalse, percentage: 0, color: '#14b8a6', type: 'Nigeria Zone' },
      { label: 'South East', count: seTotal, falseCount: seFalse, percentage: 0, color: '#0d9488', type: 'Nigeria Zone' },
      { label: 'North East', count: neTotal, falseCount: neFalse, percentage: 0, color: '#0f766e', type: 'Nigeria Zone' },
    ];

    if (viewScope === 'combined_global') {
      items.push({
        label: 'Global & Diaspora',
        count: globalTotal,
        falseCount: globalFalse,
        percentage: 0,
        color: '#FFD60A',
        type: 'Global Region'
      });
    }

    const grandTotal = items.reduce((a, b) => a + b.count, 0);
    items.forEach(i => {
      i.percentage = Math.round((i.count / grandTotal) * 100);
    });

    return items;
  };

  const donutData = calculateData();
  const totalRumors = donutData.reduce((a, b) => a + b.count, 0);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 360;
    const height = 360;
    const radius = Math.min(width, height) / 2 - 20;

    const g = svg.append('g').attr('transform', `translate(${width / 2},${height / 2})`);

    const pie = d3.pie<ZoneDonutItem>()
      .value(d => d.count)
      .sort(null)
      .padAngle(0.04);

    const arc = d3.arc<d3.PieArcDatum<ZoneDonutItem>>()
      .innerRadius(radius * 0.58)
      .outerRadius(radius)
      .cornerRadius(8);

    const hoverArc = d3.arc<d3.PieArcDatum<ZoneDonutItem>>()
      .innerRadius(radius * 0.56)
      .outerRadius(radius * 1.07)
      .cornerRadius(10);

    const arcs = g.selectAll('.arc')
      .data(pie(donutData))
      .enter()
      .append('g')
      .attr('class', 'arc')
      .attr('cursor', 'pointer');

    arcs.append('path')
      .attr('d', arc as any)
      .attr('fill', d => d.data.color)
      .attr('stroke', '#06261c')
      .attr('stroke-width', 2.5)
      .style('transition', 'all 0.25s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', hoverArc as any)
          .attr('stroke', '#FFD60A')
          .attr('stroke-width', 3);

        setHoveredSlice(d.data);
      })
      .on('mouseleave', function () {
        d3.select(this)
          .transition()
          .duration(200)
          .attr('d', arc as any)
          .attr('stroke', '#06261c')
          .attr('stroke-width', 2.5);

        setHoveredSlice(null);
      });

  }, [donutData, viewScope]);

  return (
    <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 space-y-4" id="d3-donut-regional-chart-container">
      
      {/* Header */}
      <div className="flex items-center justify-between gap-3 pb-3 border-b border-emerald-800/60">
        <div className="flex items-center gap-2">
          <PieChart className="w-4 h-4 text-[#FFD60A]" />
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-white">
              Geopolitical & Global Share (D3)
            </h3>
            <p className="text-xs text-emerald-200/80">
              Proportional distribution across Nigeria & Diaspora
            </p>
          </div>
        </div>

        <div className="flex items-center gap-1 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
          <button
            type="button"
            onClick={() => setViewScope('combined_global')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewScope === 'combined_global' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'
            }`}
          >
            Nigeria + Global
          </button>
          <button
            type="button"
            onClick={() => setViewScope('nigeria_zones')}
            className={`px-2.5 py-1 rounded-lg font-bold transition-all ${
              viewScope === 'nigeria_zones' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-gray-300'
            }`}
          >
            6 Zones Only
          </button>
        </div>
      </div>

      {/* Main Donut Visualizer & Legend */}
      <div className="grid grid-cols-1 md:grid-cols-2 items-center gap-6">
        
        {/* SVG Donut Center */}
        <div className="relative flex items-center justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 360 360"
            className="w-full max-w-[280px] h-auto select-none"
          />

          {/* Center Summary Label */}
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center pointer-events-none p-4">
            <span className="text-[10px] uppercase font-black text-emerald-300 tracking-wider">
              {hoveredSlice ? hoveredSlice.label : 'Total Claims'}
            </span>
            <span className="text-2xl font-black font-display text-white">
              {hoveredSlice ? hoveredSlice.count : totalRumors}
            </span>
            <span className="text-xs font-extrabold text-[#FFD60A]">
              {hoveredSlice ? `${hoveredSlice.percentage}% Share` : 'Verified Claims'}
            </span>
          </div>
        </div>

        {/* Legend Pills Grid */}
        <div className="space-y-2">
          {donutData.map(item => (
            <div
              key={item.label}
              onMouseEnter={() => setHoveredSlice(item)}
              onMouseLeave={() => setHoveredSlice(null)}
              className={`p-2.5 rounded-2xl border transition-all flex items-center justify-between cursor-pointer ${
                hoveredSlice?.label === item.label
                  ? 'bg-emerald-900/90 border-[#FFD60A] scale-105'
                  : 'bg-emerald-950/60 border-emerald-800/60 hover:bg-emerald-900/40'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className="w-3.5 h-3.5 rounded-lg shrink-0 shadow-sm"
                  style={{ backgroundColor: item.color }}
                />
                <div>
                  <div className="font-bold text-xs text-white">{item.label}</div>
                  <div className="text-[10px] text-gray-400">{item.type}</div>
                </div>
              </div>

              <div className="text-right">
                <div className="font-extrabold text-xs text-[#FFD60A]">{item.count} claims</div>
                <div className="text-[10px] text-emerald-300 font-semibold">{item.percentage}%</div>
              </div>
            </div>
          ))}
        </div>

      </div>

    </div>
  );
};
