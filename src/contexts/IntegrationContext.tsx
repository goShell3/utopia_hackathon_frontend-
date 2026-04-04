'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export type IntegrationStatus = 'Connected' | 'Disconnected' | 'Inactive';

export interface IntegrationNode {
  id: number;
  name: string;
  category: string;
  status: IntegrationStatus;
  lastSync: string;
  iconName: string;
  desc: string;
}

interface IntegrationContextType {
  integrations: IntegrationNode[];
  toggleIntegration: (id: number) => void;
  syncIntegration: (id: number) => void;
}

const defaultIntegrations: IntegrationNode[] = [
  { id: 1, name: 'TotalEnergies PMS', category: 'PMS', status: 'Connected', lastSync: '5m ago', iconName: 'Globe', desc: 'Bi-directional guest profile and stay history synchronization.' },
  { id: 2, name: 'Meta Ads Manager', category: 'Marketing', status: 'Connected', lastSync: '1h ago', iconName: 'BarChart3', desc: 'Import leads from Facebook & Instagram lead forms.' },
  { id: 3, name: 'AWS Pinpoint', category: 'SMS Gateway', status: 'Disconnected', lastSync: 'Never', iconName: 'MessageCircle', desc: 'High-throughput enterprise SMS delivery service.' },
  { id: 4, name: 'Opera Cloud', category: 'PMS', status: 'Inactive', lastSync: '2d ago', iconName: 'Layers', desc: 'Oracle Hospitality cloud node integration.' },
];

const IntegrationContext = createContext<IntegrationContextType | undefined>(undefined);

export function IntegrationProvider({ children }: { children: React.ReactNode }) {
  const [integrations, setIntegrations] = useState<IntegrationNode[]>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('utopia_integrations');
      if (saved) {
        try {
          return JSON.parse(saved);
        } catch (e) {
          console.error('Failed to parse integrations', e);
        }
      }
    }
    return defaultIntegrations;
  });

  // Save to local storage on change
  useEffect(() => {
    if (integrations !== defaultIntegrations) {
      localStorage.setItem('utopia_integrations', JSON.stringify(integrations));
    }
  }, [integrations]);

  const toggleIntegration = (id: number) => {
    setIntegrations(prev => prev.map(node => {
      if (node.id === id) {
        return {
          ...node,
          status: node.status === 'Connected' ? 'Disconnected' : 'Connected',
          lastSync: node.status === 'Connected' ? node.lastSync : 'Just now'
        };
      }
      return node;
    }));
  };

  const syncIntegration = (id: number) => {
    setIntegrations(prev => prev.map(node => {
      if (node.id === id && node.status === 'Connected') {
        return { ...node, lastSync: 'Just now' };
      }
      return node;
    }));
  };

  return (
    <IntegrationContext.Provider value={{ integrations, toggleIntegration, syncIntegration }}>
      {children}
    </IntegrationContext.Provider>
  );
}

export function useIntegration() {
  const context = useContext(IntegrationContext);
  if (!context) {
    throw new Error('useIntegration must be used within an IntegrationProvider');
  }
  return context;
}
