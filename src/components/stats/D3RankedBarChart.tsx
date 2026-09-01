import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ALL_36_NIGERIAN_STATES, GLOBAL_RUMOR_REGIONS, NigerianStateInfo, GlobalRegionInfo } from '../../data/nigerianStatesData';
import { BarChart3, ArrowUpDown, Search, Filter } from 'lucide-react';

interface D3RankedBarChartProps {
  onSelectState: (state: NigerianStateInfo) => void;
  selectedStateCode?: string;
}

interface RankedChartItem {
  id: string;
  code: string;
  name: string;
  total: number;
  falseCount: number;
  spotters: number;
  category: string;
  isGlobal: boolean;
  original: NigerianStateInfo | GlobalRegionInfo;
}

export const D3RankedBarChart: React.FC<D3RankedBarChartProps> = ({
  onSelectState,
  selectedStateCode
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  
  const [scope, setScope] = useState<'all_states' | 'top_15' | 'global_regions'>('top_15');
  const [sortBy, setSortBy] = useState<'total' | 'false' | 'spotters'>('total');
  const [searchQuery, setSearchQuery] = useState('');

  // Prepare dataset based on scope and search
  const getPreparedData = (): RankedChartItem[] => {
    if (scope === 'global_regions') {
      return GLOBAL_RUMOR_REGIONS.map((g): RankedChartItem => ({
        id: g.id,
        code: g.flag,
        name: g.name,
        total: g.totalRumorsCount,
        falseCount: g.falseClaimsCount,
        spotters: g.spottersCount,
        category: g.category,
        isGlobal: true,
        original: g
      })).filter(item => item.name.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    let states: RankedChartItem[] = ALL_36_NIGERIAN_STATES.map((s): RankedChartItem => ({
      id: s.code,
      code: s.code,
      name: s.name,
      total: s.totalRumorsCount,
      falseCount: s.falseClaimsCount,
      spotters: s.spottersCount,
      category: s.zone,
      isGlobal: false,
      original: s
    }));

    if (searchQuery) {
      states = states.filter(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()) || s.code.toLowerCase().includes(searchQuery.toLowerCase()));
    }

    // Sort
    states.sort((a, b) => {
      if (sortBy === 'false') return b.falseCount - a.falseCount;
      if (sortBy === 'spotters') return b.spotters - a.spotters;
      return b.total - a.total;
    });

    if (scope === 'top_15') {
      return states.slice(0, 15);
    }
    return states;
  };

  const data = getPreparedData();

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const margin = { top: 20, right: 40, bottom: 40, left: 130 };
    const barHeight = 28;
    const width = 760;
    const height = Math.max(data.length * barHeight + margin.top + margin.bottom, 240);

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const g = svg.append('g').attr('transform', `translate(${margin.left},${margin.top})`);
    const innerWidth = width - margin.left - margin.right;
    const innerHeight = height - margin.top - margin.bottom;

    // Scales
    const maxVal: number = (d3.max(data, d => (sortBy === 'false' ? d.falseCount : sortBy === 'spotters' ? d.spotters : d.total)) as number) || 50;

    const x = d3.scaleLinear()
      .domain([0, maxVal * 1.1])
      .range([0, innerWidth]);

    const y = d3.scaleBand()
      .domain(data.map(d => d.name))
      .range([0, innerHeight])
      .padding(0.24);

    // X Axis
    g.append('g')
      .attr('transform', `translate(0,${innerHeight})`)
      .call(d3.axisBottom(x).ticks(6).tickSize(-innerHeight))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick line').attr('stroke', 'rgba(255,255,255,0.08)'))
      .call(g => g.selectAll('.tick text').attr('fill', '#9ca3af').attr('font-size', '10px').attr('font-weight', '600'));

    // Y Axis
    g.append('g')
      .call(d3.axisLeft(y).tickSize(0))
      .call(g => g.select('.domain').remove())
      .call(g => g.selectAll('.tick text')
        .attr('fill', d => {
          const item = data.find(x => x.name === d);
          return item?.code === selectedStateCode ? '#FFD60A' : '#e5e7eb';
        })
        .attr('font-size', '11px')
        .attr('font-weight', '700')
        .attr('font-family', 'Plus Jakarta Sans, sans-serif')
        .style('cursor', 'pointer')
        .on('click', (event, d) => {
          const item = data.find(x => x.name === d);
          if (item && !item.isGlobal) {
            onSelectState(item.original as NigerianStateInfo);
          }
        })
      );

    // Bars
    const barGroups = g.selectAll<SVGGElement, RankedChartItem>('.bar-group')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'bar-group')
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        if (!d.isGlobal) {
          onSelectState(d.original as NigerianStateInfo);
        }
      });

    // Bar background track
    barGroups.append('rect')
      .attr('x', 0)
      .attr('y', d => y(d.name) || 0)
      .attr('width', innerWidth)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', 'rgba(255,255,255,0.04)');

    // Active Bar fill
    barGroups.append('rect')
      .attr('x', 0)
      .attr('y', d => y(d.name) || 0)
      .attr('width', 0)
      .attr('height', y.bandwidth())
      .attr('rx', 6)
      .attr('fill', d => {
        if (d.code === selectedStateCode) return '#FFD60A';
        if (sortBy === 'false') return '#ef4444';
        if (sortBy === 'spotters') return '#10b981';
        return '#059669';
      })
      .transition()
      .duration(750)
      .attr('width', d => {
        const val = sortBy === 'false' ? d.falseCount : sortBy === 'spotters' ? d.spotters : d.total;
        return x(val);
      });

    // Value Labels at end of bar
    barGroups.append('text')
      .attr('x', d => {
        const val = sortBy === 'false' ? d.falseCount : sortBy === 'spotters' ? d.spotters : d.total;
        return x(val) + 8;
      })
      .attr('y', d => (y(d.name) || 0) + y.bandwidth() / 2)
      .attr('dominant-baseline', 'central')
      .attr('fill', d => (d.code === selectedStateCode ? '#FFD60A' : '#ffffff'))
      .attr('font-size', '11px')
      .attr('font-weight', '800')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .text(d => {
        const val = sortBy === 'false' ? d.falseCount : sortBy === 'spotters' ? d.spotters : d.total;
        return val;
      });

  }, [data, sortBy, scope, selectedStateCode]);

  return (
    <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 space-y-4" ref={containerRef} id="d3-ranked-bar-chart-container">
      
      {/* Header */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-3 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2">
            <BarChart3 className="w-4 h-4 text-[#FFD60A]" />
            <span className="text-[11px] font-black text-[#FFD60A] uppercase tracking-wider font-display">
              D3.js Ranked Distribution
            </span>
          </div>
          <h3 className="text-lg sm:text-xl font-black font-display text-white mt-0.5">
            Regional Verification Ranking & Volume
          </h3>
        </div>

        {/* Scope Controls */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setScope('top_15')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              scope === 'top_15' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Top 15 States
          </button>
          <button
            type="button"
            onClick={() => setScope('all_states')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              scope === 'all_states' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-emerald-200 hover:text-white'
            }`}
          >
            All 36 States
          </button>
          <button
            type="button"
            onClick={() => setScope('global_regions')}
            className={`px-3 py-1 rounded-xl text-xs font-black transition-all ${
              scope === 'global_regions' ? 'bg-[#FFD60A] text-[#0A3D2E]' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Global Regions
          </button>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Metric Sorting Tabs */}
        <div className="flex items-center gap-2 text-xs w-full sm:w-auto">
          <span className="text-gray-400 text-[11px] font-bold">Sort by:</span>
          <button
            type="button"
            onClick={() => setSortBy('total')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'total' ? 'bg-emerald-800 text-white' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            Total Claims
          </button>
          <button
            type="button"
            onClick={() => setSortBy('false')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'false' ? 'bg-red-700 text-white' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            False Rate
          </button>
          <button
            type="button"
            onClick={() => setSortBy('spotters')}
            className={`px-2.5 py-1 rounded-lg text-xs font-bold transition-all ${
              sortBy === 'spotters' ? 'bg-emerald-600 text-white' : 'bg-emerald-950 text-emerald-300 hover:bg-emerald-900'
            }`}
          >
            Spotters
          </button>
        </div>

        {/* Search Filter */}
        <div className="relative w-full sm:w-64">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-gray-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search state name or code..."
            className="w-full bg-emerald-950/70 border border-emerald-800 text-xs rounded-xl pl-9 pr-3 py-1.5 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-[#FFD60A]"
          />
        </div>
      </div>

      {/* SVG Canvas */}
      <div className="w-full overflow-x-auto">
        <svg ref={svgRef} className="w-full select-none" />
      </div>

      <div className="text-[11px] text-gray-400 text-center pt-2">
        Click any state row to view full misinformation intelligence and truth reports.
      </div>

    </div>
  );
};
