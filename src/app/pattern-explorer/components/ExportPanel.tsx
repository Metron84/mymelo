'use client';

import { useState, useEffect } from 'react';
import Icon from '@/components/ui/AppIcon';

const ExportPanel = () => {
  const [isHydrated, setIsHydrated] = useState(false);
  const [selectedFormat, setSelectedFormat] = useState('json');
  const [includeMetadata, setIncludeMetadata] = useState(true);
  const [includeConnections, setIncludeConnections] = useState(true);

  useEffect(() => {
    setIsHydrated(true);
  }, []);

  const exportFormats = [
    { id: 'json', label: 'JSON', icon: 'CodeBracketIcon', description: 'Machine-readable format' },
    { id: 'csv', label: 'CSV', icon: 'TableCellsIcon', description: 'Spreadsheet compatible' },
    { id: 'pdf', label: 'PDF', icon: 'DocumentTextIcon', description: 'Print-ready document' },
    { id: 'bibtex', label: 'BibTeX', icon: 'BookOpenIcon', description: 'Academic citations' },
  ];

  const handleExport = () => {
    // Simulate export
    alert(`Exporting pattern data as ${selectedFormat.toUpperCase()}...\nMetadata: ${includeMetadata ? 'Yes' : 'No'}\nConnections: ${includeConnections ? 'Yes' : 'No'}`);
  };

  if (!isHydrated) {
    return (
      <div className="bg-card rounded-lg border border-border p-6 warm-shadow">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-muted rounded w-1/2" />
          <div className="space-y-2">
            <div className="h-16 bg-muted rounded" />
            <div className="h-16 bg-muted rounded" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg border border-border warm-shadow">
      <div className="p-4 border-b border-border">
        <h2 className="font-headline text-lg font-bold text-foreground flex items-center space-x-2">
          <Icon name="ArrowDownTrayIcon" size={20} />
          <span>Export Data</span>
        </h2>
        <p className="text-sm font-body text-muted-foreground mt-1">
          Download pattern data for research or citation
        </p>
      </div>

      <div className="p-4 space-y-4">
        {/* Format Selection */}
        <div>
          <h3 className="font-cta text-sm font-bold text-foreground mb-3">Export Format</h3>
          <div className="grid grid-cols-2 gap-3">
            {exportFormats.map((format) => (
              <button
                key={format.id}
                onClick={() => setSelectedFormat(format.id)}
                className={`p-3 rounded-lg border transition-all duration-200 text-left ${
                  selectedFormat === format.id
                    ? 'border-accent bg-accent/10 warm-shadow'
                    : 'border-border hover:border-accent/50'
                }`}
              >
                <div className="flex items-center space-x-2 mb-1">
                  <Icon name={format.icon as any} size={18} className="text-accent" />
                  <span className="font-cta font-medium text-foreground">{format.label}</span>
                </div>
                <p className="text-xs font-body text-muted-foreground">{format.description}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Export Options */}
        <div>
          <h3 className="font-cta text-sm font-bold text-foreground mb-3">Include</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeMetadata}
                onChange={(e) => setIncludeMetadata(e.target.checked)}
                className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-body text-sm text-foreground">Content Metadata</div>
                <div className="text-xs text-muted-foreground">Titles, dates, authors, tags</div>
              </div>
            </label>

            <label className="flex items-center space-x-3 p-3 rounded-lg hover:bg-muted cursor-pointer transition-colors">
              <input
                type="checkbox"
                checked={includeConnections}
                onChange={(e) => setIncludeConnections(e.target.checked)}
                className="w-4 h-4 text-accent border-border rounded focus:ring-2 focus:ring-accent"
              />
              <div className="flex-1">
                <div className="font-body text-sm text-foreground">Connection Data</div>
                <div className="text-xs text-muted-foreground">Relationships and strength metrics</div>
              </div>
            </label>
          </div>
        </div>

        {/* Export Button */}
        <button
          onClick={handleExport}
          className="w-full px-4 py-3 bg-gradient-to-r from-accent to-gold text-accent-foreground font-cta font-bold rounded-lg warm-shadow hover:shadow-lg transition-all duration-300 hover:scale-105 flex items-center justify-center space-x-2"
        >
          <Icon name="ArrowDownTrayIcon" size={20} />
          <span>Export as {selectedFormat.toUpperCase()}</span>
        </button>

        {/* Info Note */}
        <div className="p-3 bg-muted rounded-lg flex items-start space-x-2">
          <Icon name="InformationCircleIcon" size={18} className="text-accent flex-shrink-0 mt-0.5" />
          <p className="text-xs font-body text-muted-foreground">
            Exported data respects your current filter settings and includes only visible content patterns.
          </p>
        </div>
      </div>
    </div>
  );
};

export default ExportPanel;