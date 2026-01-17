'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

interface Node {
  id: string;
  label: string;
  type: 'article' | 'essay' | 'roundtable' | 'gossip' | 'ranking' | 'media';
  connections: number;
  x: number;
  y: number;
}

interface Connection {
  source: string;
  target: string;
  strength: number;
}

interface NetworkVisualizationProps {
  selectedFilters: {
    contentTypes: string[];
    themes: string[];
    connectionStrength: string;
  };
}

const NetworkVisualization = ({ selectedFilters }: NetworkVisualizationProps) => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedNode, setSelectedNode] = useState<Node | null>(null);
  const [hoveredNode, setHoveredNode] = useState<string | null>(null);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const mockNodes: Node[] = [
    { id: 'n1', label: 'Lebanese Coffee Culture', type: 'article', connections: 12, x: 250, y: 150 },
    { id: 'n2', label: 'Feelers vs Thinkers Debate', type: 'roundtable', connections: 8, x: 450, y: 200 },
    { id: 'n3', label: 'Social Dynamics Case #47', type: 'gossip', connections: 6, x: 350, y: 350 },
    { id: 'n4', label: 'Philosophy of Hospitality', type: 'essay', connections: 10, x: 150, y: 300 },
    { id: 'n5', label: 'Best Coffee Shops 2026', type: 'ranking', connections: 5, x: 550, y: 150 },
    { id: 'n6', label: 'Cultural Identity Podcast', type: 'media', connections: 7, x: 400, y: 450 },
    { id: 'n7', label: 'Diaspora Stories', type: 'article', connections: 9, x: 200, y: 450 },
    { id: 'n8', label: 'Emotional Intelligence', type: 'essay', connections: 11, x: 550, y: 350 },
  ];

  const mockConnections: Connection[] = [
    { source: 'n1', target: 'n2', strength: 0.8 },
    { source: 'n1', target: 'n4', strength: 0.9 },
    { source: 'n2', target: 'n3', strength: 0.6 },
    { source: 'n2', target: 'n8', strength: 0.7 },
    { source: 'n3', target: 'n6', strength: 0.5 },
    { source: 'n4', target: 'n7', strength: 0.8 },
    { source: 'n5', target: 'n1', strength: 0.6 },
    { source: 'n6', target: 'n7', strength: 0.7 },
    { source: 'n7', target: 'n4', strength: 0.9 },
    { source: 'n8', target: 'n2', strength: 0.8 },
  ];

  const getNodeColor = (type: string) => {
    const colors = {
      article: 'var(--color-primary)',
      essay: 'var(--color-accent)',
      roundtable: 'var(--color-gold)',
      gossip: 'var(--color-peru)',
      ranking: 'var(--color-coffee-medium)',
      media: 'var(--color-slate)',
    };
    return colors[type as keyof typeof colors] || 'var(--color-muted)';
  };

  const getNodeSize = (connections: number) => {
    return Math.max(20, Math.min(40, connections * 3));
  };

  if (!isHydrated) {
    return (
      <div className="w-full h-[600px] bg-card rounded-lg border border-border flex items-center justify-center">
        <div className="text-center space-y-3">
          <div className="w-12 h-12 border-4 border-accent border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-muted-foreground font-body">Loading network visualization...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-[600px] bg-card rounded-lg border border-border overflow-hidden relative warm-shadow">
      <svg width="100%" height="100%" className="absolute inset-0">
        <defs>
          <filter id="glow">
            <feGaussianBlur stdDeviation="2" result="coloredBlur" />
            <feMerge>
              <feMergeNode in="coloredBlur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Connections */}
        <g>
          {mockConnections.map((conn, idx) => {
            const sourceNode = mockNodes.find(n => n.id === conn.source);
            const targetNode = mockNodes.find(n => n.id === conn.target);
            if (!sourceNode || !targetNode) return null;

            const isHighlighted = hoveredNode === conn.source || hoveredNode === conn.target;

            return (
              <line
                key={idx}
                x1={sourceNode.x}
                y1={sourceNode.y}
                x2={targetNode.x}
                y2={targetNode.y}
                stroke={isHighlighted ? 'var(--color-accent)' : 'var(--color-border)'}
                strokeWidth={isHighlighted ? 2 : 1}
                strokeOpacity={conn.strength}
                className="transition-all duration-300"
              />
            );
          })}
        </g>

        {/* Nodes */}
        <g>
          {mockNodes.map((node) => {
            const size = getNodeSize(node.connections);
            const isHovered = hoveredNode === node.id;
            const isSelected = selectedNode?.id === node.id;

            return (
              <g
                key={node.id}
                onMouseEnter={() => setHoveredNode(node.id)}
                onMouseLeave={() => setHoveredNode(null)}
                onClick={() => setSelectedNode(node)}
                className="cursor-pointer"
              >
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={size}
                  fill={getNodeColor(node.type)}
                  opacity={isHovered || isSelected ? 1 : 0.8}
                  filter={isHovered || isSelected ? 'url(#glow)' : undefined}
                  className="transition-all duration-300"
                />
                <text
                  x={node.x}
                  y={node.y + size + 15}
                  textAnchor="middle"
                  className="text-xs font-body fill-foreground"
                  style={{ pointerEvents: 'none' }}
                >
                  {node.label.length > 20 ? `${node.label.substring(0, 20)}...` : node.label}
                </text>
              </g>
            );
          })}
        </g>
      </svg>

      {/* Node Details Panel */}
      {selectedNode && (
        <div className="absolute bottom-4 right-4 w-80 bg-background border border-border rounded-lg warm-shadow-lg p-4 animate-fade-in">
          <div className="flex items-start justify-between mb-3">
            <div className="flex-1">
              <h3 className="font-headline text-lg font-bold text-foreground mb-1">
                {selectedNode.label}
              </h3>
              <span className="inline-block px-2 py-1 text-xs font-cta font-medium rounded-full"
                style={{ 
                  backgroundColor: getNodeColor(selectedNode.type),
                  color: 'white'
                }}>
                {selectedNode.type.charAt(0).toUpperCase() + selectedNode.type.slice(1)}
              </span>
            </div>
            <button
              onClick={() => setSelectedNode(null)}
              className="p-1 hover:bg-muted rounded transition-colors"
            >
              <Icon name="XMarkIcon" size={20} />
            </button>
          </div>
          <div className="space-y-2 text-sm font-body">
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Connections:</span>
              <span className="font-medium text-foreground">{selectedNode.connections}</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-muted-foreground">Network Position:</span>
              <span className="font-medium text-foreground">Central Hub</span>
            </div>
            <button className="w-full mt-3 px-4 py-2 bg-accent text-accent-foreground font-cta font-medium rounded-lg hover:bg-gold transition-colors">
              View Content
            </button>
          </div>
        </div>
      )}

      {/* Legend */}
      <div className="absolute top-4 left-4 bg-background border border-border rounded-lg warm-shadow p-3 space-y-2">
        <h4 className="text-xs font-cta font-bold text-foreground mb-2">Content Types</h4>
        {['article', 'essay', 'roundtable', 'gossip', 'ranking', 'media'].map((type) => (
          <div key={type} className="flex items-center space-x-2">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: getNodeColor(type) }}
            />
            <span className="text-xs font-body text-muted-foreground capitalize">{type}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default NetworkVisualization;