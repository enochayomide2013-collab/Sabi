import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { Share2, Video, MessageSquare, ExternalLink, Sparkles } from 'lucide-react';

interface PlatformBubbleNode extends d3.SimulationNodeDatum {
  id: string;
  name: string;
  icon: string;
  totalVolume: number;
  falseRate: number; // percentage
  topRumorTheme: string;
  radius: number;
  color: string;
  textColor: string;
}

const PLATFORM_BUBBLE_DATA: PlatformBubbleNode[] = [
  {
    id: 'tiktok',
    name: 'TikTok Videos',
    icon: '🎵',
    totalVolume: 420,
    falseRate: 78,
    topRumorTheme: 'Altered Audio & Dubbed Speeches',
    radius: 64,
    color: '#000000',
    textColor: '#ffffff',
  },
  {
    id: 'twitter',
    name: 'Twitter (X)',
    icon: '𝕏',
    totalVolume: 380,
    falseRate: 64,
    topRumorTheme: 'Fake Quotes & Fabricated Gazette Screenshots',
    radius: 58,
    color: '#1d9bf0',
    textColor: '#ffffff',
  },
  {
    id: 'facebook',
    name: 'Facebook Groups',
    icon: '👥',
    totalVolume: 340,
    falseRate: 72,
    topRumorTheme: 'Clickbait Giveaways & Impersonation Schemes',
    radius: 54,
    color: '#1877f2',
    textColor: '#ffffff',
  },
  {
    id: 'whatsapp',
    name: 'WhatsApp Audio Notes',
    icon: '🎙️',
    totalVolume: 290,
    falseRate: 85,
    topRumorTheme: 'Panic-inducing Voice Memos & Bank Closure Rumors',
    radius: 50,
    color: '#25d366',
    textColor: '#06261c',
  },
  {
    id: 'youtube',
    name: 'YouTube Shorts',
    icon: '▶️',
    totalVolume: 210,
    falseRate: 58,
    topRumorTheme: 'Old Protests Rebranded as Current Breaking News',
    radius: 44,
    color: '#ff0000',
    textColor: '#ffffff',
  }
];

export const D3PlatformViralityBubbleChart: React.FC = () => {
  const svgRef = useRef<SVGSVGElement | null>(null);
  const [selectedPlatform, setSelectedPlatform] = useState<PlatformBubbleNode | null>(PLATFORM_BUBBLE_DATA[0]);

  useEffect(() => {
    if (!svgRef.current) return;

    const svg = d3.select(svgRef.current);
    svg.selectAll('*').remove();

    const width = 520;
    const height = 340;

    svg.attr('viewBox', `0 0 ${width} ${height}`);

    const nodes = PLATFORM_BUBBLE_DATA.map(d => ({ ...d }));

    // D3 Simulation to pack bubbles nicely
    const simulation = d3.forceSimulation(nodes)
      .force('center', d3.forceCenter(width / 2, height / 2))
      .force('charge', d3.forceManyBody().strength(30))
      .force('collision', d3.forceCollide().radius((d: any) => d.radius + 6))
      .stop();

    // Run simulation synchronously to avoid jitter
    for (let i = 0; i < 120; ++i) simulation.tick();

    const g = svg.append('g');

    const nodeGroups = g.selectAll('.platform-bubble')
      .data(nodes)
      .enter()
      .append('g')
      .attr('class', 'platform-bubble')
      .attr('transform', (d: any) => `translate(${d.x}, ${d.y})`)
      .attr('cursor', 'pointer')
      .on('click', (event, d) => {
        setSelectedPlatform(d);
      });

    // Outer Glow Ring
    nodeGroups.append('circle')
      .attr('r', d => d.radius + 3)
      .attr('fill', 'none')
      .attr('stroke', d => (selectedPlatform?.id === d.id ? '#FFD60A' : 'rgba(255,255,255,0.15)'))
      .attr('stroke-width', d => (selectedPlatform?.id === d.id ? 3 : 1.5))
      .style('transition', 'all 0.2s ease');

    // Main Circle
    nodeGroups.append('circle')
      .attr('r', d => d.radius)
      .attr('fill', d => d.color)
      .attr('opacity', 0.92)
      .style('transition', 'all 0.2s ease')
      .on('mouseenter', function (event, d) {
        d3.select(this).attr('transform', 'scale(1.05)');
      })
      .on('mouseleave', function () {
        d3.select(this).attr('transform', 'scale(1)');
      });

    // Icon
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', -14)
      .attr('font-size', '20px')
      .attr('pointer-events', 'none')
      .text(d => d.icon);

    // Platform Name
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 8)
      .attr('fill', d => d.textColor)
      .attr('font-size', '11px')
      .attr('font-weight', '800')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('pointer-events', 'none')
      .text(d => d.name.split(' ')[0]);

    // Misinformation rate pill badge
    nodeGroups.append('text')
      .attr('text-anchor', 'middle')
      .attr('y', 24)
      .attr('fill', d => (d.textColor === '#06261c' ? '#06261c' : '#FFD60A'))
      .attr('font-size', '10px')
      .attr('font-weight', '900')
      .attr('font-family', 'Plus Jakarta Sans, sans-serif')
      .attr('pointer-events', 'none')
      .text(d => `${d.falseRate}% False`);

  }, [selectedPlatform]);

  return (
    <div className="bg-[#06261c] text-white rounded-3xl p-5 sm:p-7 shadow-xl border border-emerald-900/60 space-y-4" id="d3-platform-virality-container">
      
      {/* Header */}
      <div className="flex items-center justify-between pb-3 border-b border-emerald-800/60">
        <div className="flex items-center gap-2">
          <Share2 className="w-4 h-4 text-[#FFD60A]" />
          <div>
            <h3 className="text-base sm:text-lg font-black font-display text-white">
              Social Media Virality Clusters (D3)
            </h3>
            <p className="text-xs text-emerald-200/80">
              Distribution & Misinformation Rate by Origin Platform
            </p>
          </div>
        </div>
      </div>

      {/* Bubble Chart Canvas & Selected Inspector */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-5 items-center">
        
        {/* SVG Bubbles */}
        <div className="md:col-span-7 flex justify-center">
          <svg
            ref={svgRef}
            viewBox="0 0 520 340"
            className="w-full max-w-[420px] h-auto select-none"
          />
        </div>

        {/* Selected Platform Detail Box */}
        <div className="md:col-span-5 bg-emerald-950/80 border border-emerald-800/80 rounded-2xl p-4 space-y-3">
          {selectedPlatform ? (
            <>
              <div className="flex items-center justify-between border-b border-emerald-800 pb-2">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">{selectedPlatform.icon}</span>
                  <div>
                    <h4 className="font-black text-sm text-white font-display">
                      {selectedPlatform.name}
                    </h4>
                    <span className="text-[10px] text-emerald-300">
                      {selectedPlatform.totalVolume} Tracked Influx Claims
                    </span>
                  </div>
                </div>
                <span className="px-2 py-1 bg-red-950/80 border border-red-500/50 text-red-300 text-xs font-black rounded-lg">
                  {selectedPlatform.falseRate}% False
                </span>
              </div>

              <div className="space-y-2 text-xs">
                <div>
                  <span className="text-[11px] text-gray-400 font-medium">Primary Virality Vector:</span>
                  <div className="text-emerald-100 font-bold mt-0.5">
                    {selectedPlatform.topRumorTheme}
                  </div>
                </div>

                <div className="pt-2 flex items-center justify-between text-[11px] text-gray-300 border-t border-emerald-900">
                  <span>AI Forensics Analysis:</span>
                  <span className="text-[#FFD60A] font-bold">Active Shield</span>
                </div>
              </div>
            </>
          ) : (
            <div className="text-xs text-gray-400 text-center py-6">
              Click any platform bubble to inspect misinformation forensic patterns.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
