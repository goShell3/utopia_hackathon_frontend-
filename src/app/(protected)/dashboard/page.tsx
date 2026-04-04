'use client';

import React from 'react';
import { Users, Zap, MessageSquare, BarChart3, Plus, Send, TrendingUp } from 'lucide-react';
import { StatCard } from '@/components/dashboard/StatCard';
import { LeadsTrendChart } from '@/components/dashboard/LeadsTrendChart';
import { SourceDonutChart } from '@/components/dashboard/SourceDonutChart';
import { CampaignBarChart } from '@/components/dashboard/CampaignBarChart';
import { ActivityFeed } from '@/components/dashboard/ActivityFeed';
import { Button } from '@/components/shared/Button';

const kpiData = [
  { label: 'Total Leads', value: '28,492', icon: Users, variant: 'black' as const, active: true },
  { label: 'Active Campaigns', value: '12', icon: Zap },
  { label: 'SMS Sent', value: '142.8k', icon: MessageSquare },
  { label: 'Response Rate', value: '18.4%', icon: BarChart3 },
];

const trendData = [
  { date: 'Oct', value: 400 }, { date: 'Nov', value: 300 }, { date: 'Dec', value: 500 },
  { date: 'Jan', value: 450 }, { date: 'Feb', value: 700 }, { date: 'Mar', value: 600 },
];

const sourceData = [
  { name: 'PMS Integration', value: 12400 }, { name: 'CSV Upload', value: 8200 },
  { name: 'Meta Ads', value: 4900 }, { name: 'Data Broker', value: 2992 },
];

const campaignData = [
  { campaign: 'Welcome SMS', sent: 8400, conversion: 22 },
  { campaign: 'Churn Prevention', sent: 5200, conversion: 14 },
  { campaign: 'Upsell Offer', sent: 3900, conversion: 9 },
  { campaign: 'Loyalty Bonus', sent: 2100, conversion: 31 },
];

const activities = [
  { id: '1', type: 'lead' as const, user: 'John Doe', message: 'New lead imported from TotalEnergies PMS', timestamp: '2m ago' },
  { id: '2', type: 'sms' as const, user: 'System', message: 'Welcome SMS sent to +251 911 000 000', timestamp: '15m ago' },
  { id: '3', type: 'sync' as const, message: 'Database synchronization complete', timestamp: '1h ago' },
  { id: '4', type: 'system' as const, message: 'Updated campaign "Loyalty Bonus" priority', timestamp: '2h ago' },
];

import { useIntegration } from '@/contexts/IntegrationContext';

export default function Dashboard() {
  const { integrations } = useIntegration();
  
  const isPmsConnected = integrations.some(i => i.category === 'PMS' && i.status === 'Connected');
  const isMetaConnected = integrations.some(i => i.category === 'Marketing' && i.status === 'Connected');

  const activeSourceData = sourceData.filter(src => {
    if (src.name === 'PMS Integration' && !isPmsConnected) return false;
    if (src.name === 'Meta Ads' && !isMetaConnected) return false;
    return true;
  });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Analytical Hub</h1>
          <p className="technical-label text-neutral-500 mt-1">Real-time performance monitoring</p>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={Plus} className="bg-white">Add Lead</Button>
          <Button variant="outline" size="md" icon={Zap} className="bg-white">Campaign</Button>
          <Button variant="primary" size="md" icon={Send}>Trigger SMS</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {kpiData.map((kpi, idx) => <StatCard key={idx} {...kpi} />)}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 industrial-card p-6">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h3 className="display-header text-xl italic">Leads Growth</h3>
              <p className="technical-label text-[9px] text-neutral-400">Past 6 months trend analysis</p>
            </div>
            <div className="flex items-center gap-2 px-3 py-1 bg-accent-green/10 rounded-[1px] border border-accent-green/20">
              <TrendingUp className="w-3 h-3 text-accent-green" />
              <span className="text-[10px] font-black italic text-accent-green uppercase">Top Performance</span>
            </div>
          </div>
          <div className="h-[300px]">
            <LeadsTrendChart data={trendData} height={300} width={700} />
          </div>
        </div>

        <div className="industrial-card p-6 flex flex-col items-center">
          <div className="w-full text-left mb-8">
            <h3 className="display-header text-xl italic">Lead Distribution</h3>
            <p className="technical-label text-[9px] text-neutral-400">Core acquisition channels</p>
          </div>
          <div className="flex-1 w-full flex items-center justify-center">
            {activeSourceData.length > 0 ? (
              <SourceDonutChart data={activeSourceData} />
            ) : (
              <div className="text-center text-neutral-400 technical-label text-xs">NO ACTIVE SOURCES</div>
            )}
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <div className="lg:col-span-3 industrial-card p-6">
          <div className="mb-8">
            <h3 className="display-header text-xl italic">Campaign Reach</h3>
            <p className="technical-label text-[9px] text-neutral-400">Volume vs Conversion Efficiency</p>
          </div>
          <div className="h-[250px] w-full">
            <CampaignBarChart data={campaignData} height={250} width={500} />
          </div>
        </div>
        <div className="lg:col-span-2 industrial-card p-6">
          <ActivityFeed items={activities} />
        </div>
      </div>
    </div>
  );
}
