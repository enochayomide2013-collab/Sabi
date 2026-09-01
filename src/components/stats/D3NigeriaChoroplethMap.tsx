import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { ALL_36_NIGERIAN_STATES, NigerianStateInfo } from '../../data/nigerianStatesData';
import { MapPin, ShieldCheck, AlertTriangle, Users, ExternalLink, Sparkles, Filter } from 'lucide-react';

interface D3NigeriaChoroplethMapProps {
  selectedState: NigerianStateInfo | null;
  onSelectState: (state: NigerianStateInfo) => void;
  activeZoneFilter: string;
  onZoneFilterChange: (zone: string) => void;
}

export const D3NigeriaChoroplethMap: React.FC<D3NigeriaChoroplethMapProps> = ({
  selectedState,
  onSelectState,
  activeZoneFilter,
  onZoneFilterChange
}) => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const containerRef = useRef<HTMLDivElement | null>(null);
  const [metric, setMetric] = useState<'total' | 'false' | 'spotters' | 'outdated'>('total');
  const [hoveredState, setHoveredState] = useState<NigerianStateInfo | null>(null);
  const [tooltipPos, setTooltipPos] = useState<{ x: number; y: number } | null>(null);

  const zones = ['All Zones', 'South West', 'North Central', 'North West', 'North East', 'South East', 'South South'];

  // Calculate max value for current metric
  const getMetricValue = (st: NigerianStateInfo) => {
    switch (metric) {
      case 'false': return st.falseClaimsCount;
      case 'spotters': return st.spottersCount;
      case 'outdated': return st.outdatedMediaCount;
      default: return st.totalRumorsCount;
    }
  };

  const getMetricLabel = () => {
    switch (metric) {
      case 'false': return 'False Viral Claims';
      case 'spotters': return 'Verified Spotters';
      case 'outdated': return 'Outdated Media Clips';
      default: return 'Total Verified Rumors';
    }
  };

  // Color generator based on metric
  const getColorScale = () => {
    const maxVal = d3.max(ALL_36_NIGERIAN_STATES, getMetricValue) || 50;
    const minVal = d3.min(ALL_36_NIGERIAN_STATES, getMetricValue) || 10;

    if (metric === 'false') {
      return d3.scaleSequential()
        .domain([minVal, maxVal])
        .interpolator(d3.interpolateRgbBasis(['#fef2f2', '#f87171', '#dc2626', '#7f1d1d']));
    } else if (metric === 'spotters') {
      return d3.scaleSequential()
        .domain([minVal, maxVal])
        .interpolator(d3.interpolateRgbBasis(['#ecfdf5', '#34d399', '#059669', '#064e3b']));
    } else if (metric === 'outdated') {
      return d3.scaleSequential()
        .domain([minVal, maxVal])
        .interpolator(d3.interpolateRgbBasis(['#fffbeb', '#fcd34d', '#f59e0b', '#78350f']));
    } else {
      // Default total
      return d3.scaleSequential()
        .domain([minVal, maxVal])
        .interpolator(d3.interpolateRgbBasis(['#e6f4ea', '#6ee7b7', '#10b981', '#065f46', '#022c22']));
    }
  };

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 840;
    const height = 620;

    const colorScale = getColorScale();

    // Background water/country canvas container
    const g = svg.append('g').attr('class', 'map-container');

    // Add subtle grid pattern
    const defs = svg.append('defs');
    const pattern = defs.append('pattern')
      .attr('id', 'd3-map-grid')
      .attr('width', 20)
      .attr('height', 20)
      .attr('patternUnits', 'userSpaceOnUse');

    pattern.append('circle')
      .attr('cx', 2)
      .attr('cy', 2)
      .attr('r', 0.8)
      .attr('fill', 'rgba(16, 185, 129, 0.25)');

    g.append('rect')
      .attr('width', width)
      .attr('height', height)
      .attr('fill', 'url(#d3-map-grid)')
      .attr('rx', 24);

    // Filter states based on zone filter
    const displayedStates = ALL_36_NIGERIAN_STATES;

    // Draw state shapes as rounded interconnected geopolitical cartogram tiles
    const stateGroups = g.selectAll('.state-node')
      .data(displayedStates)
      .enter()
      .append('g')
      .attr('class', 'state-node')
      .attr('cursor', 'pointer')
      .attr('transform', d => `translate(${d.mapX - 40}, ${d.mapY - 40})`);

    // Outer glow for selected state
    stateGroups.append('rect')
      .attr('class', 'state-selection-ring')
      .attr('width', d => d.mapWidth + 12)
      .attr('height', d => d.mapHeight + 12)
      .attr('x', -6)
      .attr('y', -6)
      .attr('rx', 18)
      .attr('fill', 'none')
      .attr('stroke', d => (selectedState?.code === d.code ? '#FFD60A' : 'none'))
      .attr('stroke-width', 3.5)
      .attr('opacity', d => (selectedState?.code === d.code ? 1 : 0));

    // Main State Tile Rect
    stateGroups.append('rect')
      .attr('class', 'state-rect')
      .attr('width', d => d.mapWidth)
      .attr('height', d => d.mapHeight)
      .attr('rx', 14)
      .attr('fill', d => {
        const matchesZone = activeZoneFilter === 'All Zones' || d.zone === activeZoneFilter;
        if (!matchesZone) return '#1f2937';
        return colorScale(getMetricValue(d));
      })
      .attr('opacity', d => {
        const matchesZone = activeZoneFilter === 'All Zones' || d.zone === activeZoneFilter;
        return matchesZone ? 0.92 : 0.25;
      })
      .attr('stroke', d => {
        if (selectedState?.code === d.code) return '#FFD60A';
        const matchesZone = activeZoneFilter === 'All Zones' || d.zone === activeZoneFilter;
        return matchesZone ? 'rgba(255,255,255,0.7)' : 'rgba(255,255,255,0.1)';
      })
      .attr('stroke-width', d => (selectedState?.code === d.code ? 2.5 : 1.5))
      .style('transition', 'all 0.25s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this)
          .attr('stroke', '#FFD60A')
          .attr('stroke-width', 2.5)
          .attr('transform', 'scale(1.06)')
          .attr('transform-origin', `${d.mapWidth / 2}px ${d.mapHeight / 2}px`);

        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
        setHoveredState(d);
      })
      .on('mousemove', function (event) {
        const rect = containerRef.current?.getBoundingClientRect();
        if (rect) {
          setTooltipPos({
            x: event.clientX - rect.left,
            y: event.clientY - rect.top
          });
        }
      })
      .on('mouseleave', function (event, d) {
        d3.select(this)
          .attr('stroke', selectedState?.code === d.code ? '#FFD60A' : 'rgba(255,255,255,0.7)')
          .attr('stroke-width', selectedState?.code === d.code ? 2.5 : 1.5)
          .attr('transform', 'scale(1)')
          .attr('transform-origin', `${d.mapWidth / 2}px ${d.mapHeight / 2}px`);

        setHoveredState(null);
      })
      .on('click', function (event, d) {
        onSelectState(d);
      });

    // State Code Text
    stateGroups.append('text')
      .attr('class', 'state-code')
      .attr('x', d => d.mapWidth / 2)
      .attr('y', d => d.mapHeight / 2 - 3)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '11px')
      .attr('font-weight', '900')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('fill', d => {
        const matchesZone = activeZoneFilter === 'All Zones' || d.zone === activeZoneFilter;
        if (!matchesZone) return '#6b7280';
        return '#022c22';
      })
      .attr('pointer-events', 'none')
      .text(d => d.code);

    // Metric Count Badge
    stateGroups.append('text')
      .attr('class', 'state-count')
      .attr('x', d => d.mapWidth / 2)
      .attr('y', d => d.mapHeight / 2 + 11)
      .attr('text-anchor', 'middle')
      .attr('dominant-baseline', 'central')
      .attr('font-size', '9.5px')
      .attr('font-weight', '800')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('fill', d => {
        const matchesZone = activeZoneFilter === 'All Zones' || d.zone === activeZoneFilter;
        if (!matchesZone) return '#4b5563';
        return '#064e3b';
      })
      .attr('pointer-events', 'none')
      .text(d => getMetricValue(d));

  }, [metric, selectedState, activeZoneFilter]);

  return (
    <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 relative overflow-hidden" ref={containerRef} id="d3-nigeria-choropleth-container">
      
      {/* Header & Controls */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-emerald-800/60">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-[#FFD60A] animate-pulse" />
            <span className="text-[11px] font-black text-[#FFD60A] uppercase tracking-wider font-display">
              D3.js Geopolitical Choropleth Matrix
            </span>
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-white mt-0.5">
            Verified Rumor Density Across All 36 States + FCT
          </h2>
          <p className="text-xs text-emerald-200/80 mt-1">
            Visualizing live community verifications, false claim clusters, and registered spotter coverage.
          </p>
        </div>

        {/* Metric Selector Tabs */}
        <div className="flex items-center gap-1.5 bg-black/40 backdrop-blur-md p-1 rounded-2xl border border-white/10 overflow-x-auto scrollbar-none">
          <button
            type="button"
            onClick={() => setMetric('total')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              metric === 'total' ? 'bg-[#FFD60A] text-[#0A3D2E] shadow-sm' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Total Rumors
          </button>
          <button
            type="button"
            onClick={() => setMetric('false')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              metric === 'false' ? 'bg-red-500 text-white shadow-sm' : 'text-emerald-200 hover:text-white'
            }`}
          >
            False Claims
          </button>
          <button
            type="button"
            onClick={() => setMetric('spotters')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              metric === 'spotters' ? 'bg-emerald-400 text-[#0A3D2E] shadow-sm' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Active Spotters
          </button>
          <button
            type="button"
            onClick={() => setMetric('outdated')}
            className={`px-3 py-1.5 rounded-xl text-xs font-black transition-all ${
              metric === 'outdated' ? 'bg-amber-400 text-amber-950 shadow-sm' : 'text-emerald-200 hover:text-white'
            }`}
          >
            Outdated Media
          </button>
        </div>
      </div>

      {/* Zone Filter Toolbar */}
      <div className="flex items-center gap-2 pt-3 pb-2 overflow-x-auto scrollbar-none">
        <span className="text-[11px] font-bold text-emerald-300 flex items-center gap-1 shrink-0">
          <Filter className="w-3.5 h-3.5 text-[#FFD60A]" /> Zone:
        </span>
        {zones.map(z => (
          <button
            key={z}
            type="button"
            onClick={() => onZoneFilterChange(z)}
            className={`px-3 py-1 rounded-xl text-xs font-extrabold shrink-0 transition-all ${
              activeZoneFilter === z
                ? 'bg-white text-[#0A3D2E] shadow-sm'
                : 'bg-emerald-950/80 text-emerald-300 border border-emerald-800/80 hover:bg-emerald-900'
            }`}
          >
            {z}
          </button>
        ))}
      </div>

      {/* SVG Canvas Container */}
      <div className="relative w-full overflow-x-auto flex items-center justify-center py-2">
        <svg
          ref={svgRef}
          viewBox="0 0 840 620"
          className="w-full max-w-[840px] h-auto rounded-2xl select-none"
          style={{ minWidth: '600px' }}
        />

        {/* Hover Tooltip Overlay */}
        {hoveredState && tooltipPos && (
          <div
            className="absolute z-50 pointer-events-none bg-black/90 text-white backdrop-blur-md p-3.5 rounded-2xl border border-emerald-500/50 shadow-2xl space-y-1.5 min-w-[220px]"
            style={{
              left: `${Math.min(tooltipPos.x + 15, 580)}px`,
              top: `${Math.min(tooltipPos.y + 15, 460)}px`
            }}
          >
            <div className="flex items-center justify-between gap-2 border-b border-gray-700 pb-1.5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FFD60A]" />
                <span className="font-black text-sm text-white font-display">
                  {hoveredState.name} ({hoveredState.code})
                </span>
              </div>
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-emerald-900 text-emerald-200">
                {hoveredState.zone}
              </span>
            </div>

            <div className="space-y-1 text-xs">
              <div className="flex items-center justify-between text-gray-300">
                <span>{getMetricLabel()}:</span>
                <span className="font-extrabold text-[#FFD60A] text-sm">
                  {getMetricValue(hoveredState)}
                </span>
              </div>
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>False Misleading Claims:</span>
                <span className="font-bold text-red-400">{hoveredState.falseClaimsCount}</span>
              </div>
              <div className="flex items-center justify-between text-gray-400 text-[11px]">
                <span>Verified Spotters:</span>
                <span className="font-bold text-emerald-400">{hoveredState.spottersCount}</span>
              </div>
              <div className="pt-1 text-[11px] text-gray-300 italic truncate max-w-[200px]">
                Top: {hoveredState.topRumorTopic}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Map Legend & Summary Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pt-3 border-t border-emerald-800/60 text-xs text-emerald-200 font-medium">
        <div className="flex items-center gap-2">
          <span className="text-[11px] font-bold text-white">Intensity:</span>
          <div className="flex items-center gap-1.5">
            <span className="w-4 h-3 rounded bg-[#e6f4ea] border border-white/20" />
            <span className="text-[10px] text-gray-300">Low</span>
            <span className="w-4 h-3 rounded bg-[#10b981]" />
            <span className="w-4 h-3 rounded bg-[#065f46]" />
            <span className="w-4 h-3 rounded bg-[#022c22]" />
            <span className="text-[10px] text-gray-300">High Density</span>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <span className="text-gray-300 text-[11px]">
            Showing <strong className="text-white">all 36 States + FCT Abuja</strong>
          </span>
          <span className="text-[#FFD60A] font-extrabold text-[11px] bg-emerald-950 px-2.5 py-1 rounded-lg border border-emerald-800">
            Click any tile to inspect state dossier
          </span>
        </div>
      </div>

    </div>
  );
};
