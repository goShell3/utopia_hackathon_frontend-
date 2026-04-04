'use client';

import { use } from 'react';
import { useRouter } from 'next/navigation';
import {
  ArrowLeft, MessageSquare, Zap, Target, TrendingUp,
  Loader2, AlertTriangle, Calendar, Globe, Mail, Phone
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { useLead, useScoreLead } from '@/hooks/useLeads';
import { useAIScore, useAIEnrichment } from '@/hooks/useAI';

const SEGMENT_COLORS: Record<string, string> = {
  hot: 'bg-utopia text-white',
  warm: 'bg-amber-400 text-white',
  cold: 'bg-blue-400 text-white',
  unqualified: 'bg-neutral-300 text-black',
};

export default function LeadDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params);
  const router = useRouter();

  const { data: lead, isLoading } = useLead(id);
  const { data: aiScore, isLoading: scoreLoading } = useAIScore(id, { include_explanation: true, include_recommendations: true });
  const { data: enrichment, isLoading: enrichLoading } = useAIEnrichment(id, { include_predictions: true, include_preferences: true });
  const scoreLead = useScoreLead();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="animate-spin text-neutral-300" size={32} />
      </div>
    );
  }

  if (!lead) {
    return (
      <div className="flex flex-col items-center justify-center h-64 gap-4">
        <p className="technical-label text-neutral-400 uppercase">Lead not found</p>
        <Button variant="outline" size="md" onClick={() => router.push('/leads')} icon={ArrowLeft} className="bg-white">Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button onClick={() => router.push('/leads')} className="p-2 hover:bg-neutral-100 transition-colors">
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-black text-white flex items-center justify-center font-black italic text-lg rounded-[1px]">
              {lead.first_name[0]}{lead.last_name[0]}
            </div>
            <div>
              <h1 className="display-header text-3xl italic tracking-tighter">{lead.first_name} {lead.last_name}</h1>
              <div className="flex items-center gap-3 mt-1">
                {lead.segment && (
                  <span className={cn('text-[9px] font-black italic uppercase px-2 py-0.5 rounded-[1px]', SEGMENT_COLORS[lead.segment])}>
                    {lead.segment}
                  </span>
                )}
                <span className="technical-label text-neutral-400">{lead.country} · {lead.language.toUpperCase()}</span>
              </div>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Button variant="outline" size="md" icon={MessageSquare} className="bg-white" onClick={() => router.push('/messages')}>
            Message
          </Button>
          <Button
            variant="primary" size="md" icon={Zap}
            isLoading={scoreLead.isPending}
            onClick={() => scoreLead.mutate(id)}
          >
            Score Lead
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Lead Info */}
        <div className="space-y-6">
          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-xs font-black italic uppercase tracking-tight">Contact Details</h3>
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <Phone size={14} className="text-neutral-400 shrink-0" />
                <span className="text-sm font-mono">{lead.phone}</span>
              </div>
              {lead.email && (
                <div className="flex items-center gap-3">
                  <Mail size={14} className="text-neutral-400 shrink-0" />
                  <span className="text-sm font-bold">{lead.email}</span>
                </div>
              )}
              <div className="flex items-center gap-3">
                <Globe size={14} className="text-neutral-400 shrink-0" />
                <span className="text-sm font-bold uppercase">{lead.country}</span>
              </div>
              <div className="flex items-center gap-3">
                <Calendar size={14} className="text-neutral-400 shrink-0" />
                <span className="text-[10px] technical-label text-neutral-500">
                  Added {new Date(lead.created_at).toLocaleDateString()}
                </span>
              </div>
            </div>
          </div>

          <div className="industrial-card p-6 space-y-4">
            <h3 className="text-xs font-black italic uppercase tracking-tight">Lead Profile</h3>
            <div className="grid grid-cols-2 gap-4">
              {[
                { label: 'Source', value: lead.source.replace('_', ' ').toUpperCase() },
                { label: 'Consent', value: lead.consent_status.replace('_', ' ').toUpperCase() },
                { label: 'Bookings', value: String(lead.total_bookings) },
                { label: 'Revenue', value: `$${lead.total_revenue.toLocaleString()}` },
              ].map(({ label, value }) => (
                <div key={label}>
                  <p className="text-[9px] technical-label text-neutral-400">{label}</p>
                  <p className="text-xs font-black italic mt-0.5">{value}</p>
                </div>
              ))}
            </div>
            {lead.last_booking_date && (
              <div>
                <p className="text-[9px] technical-label text-neutral-400">Last Booking</p>
                <p className="text-xs font-black italic mt-0.5">{new Date(lead.last_booking_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>

        {/* Middle: AI Score */}
        <div className="space-y-6">
          <div className="industrial-card p-6 bg-black text-white space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black italic uppercase tracking-tight">AI Score</h3>
              {scoreLoading && <Loader2 size={14} className="animate-spin text-neutral-500" />}
            </div>

            {aiScore ? (
              <>
                <div>
                  <div className="flex justify-between items-end mb-2">
                    <span className="text-[10px] technical-label text-neutral-400">Conversion Probability</span>
                    <span className="text-2xl font-black italic text-utopia">{Math.round(aiScore.conversion_probability)}%</span>
                  </div>
                  <div className="h-1.5 w-full bg-neutral-800 rounded-full overflow-hidden">
                    <div className="h-full bg-utopia transition-all duration-1000" style={{ width: `${aiScore.conversion_probability}%` }} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <Target size={10} className="text-emerald-500" />
                      <span className="text-[8px] technical-label text-neutral-500">Quality</span>
                    </div>
                    <span className="text-sm font-black italic">{aiScore.quality_score} / 10</span>
                  </div>
                  <div className="p-3 bg-neutral-900 border border-neutral-800">
                    <div className="flex items-center gap-1.5 mb-1">
                      <TrendingUp size={10} className="text-utopia" />
                      <span className="text-[8px] technical-label text-neutral-500">Confidence</span>
                    </div>
                    <span className="text-sm font-black italic">{Math.round(aiScore.confidence * 100)}%</span>
                  </div>
                </div>

                {aiScore.ai_reasoning && (
                  <div className="p-3 border-l-2 border-utopia bg-neutral-900/50">
                    <p className="text-[9px] font-bold italic text-neutral-400 leading-relaxed">{aiScore.ai_reasoning}</p>
                  </div>
                )}

                {aiScore.recommendations.length > 0 && (
                  <div className="space-y-2">
                    <span className="text-[9px] technical-label text-neutral-500">Recommendations</span>
                    {aiScore.recommendations.map((r, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-utopia mt-1.5 shrink-0" />
                        <p className="text-[10px] font-bold italic text-neutral-400">{r}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <div className="text-center py-4">
                <p className="text-[10px] technical-label text-neutral-500">
                  {scoreLoading ? 'Loading score...' : 'No score yet. Click "Score Lead" to generate.'}
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right: Enrichment */}
        <div className="space-y-6">
          <div className="industrial-card p-6 space-y-4">
            <div className="flex items-center justify-between">
              <h3 className="text-xs font-black italic uppercase tracking-tight">Guest Intelligence</h3>
              {enrichLoading && <Loader2 size={14} className="animate-spin text-neutral-400" />}
            </div>

            {enrichment ? (
              <>
                {enrichment.predicted_preferences && (
                  <div className="space-y-2">
                    <span className="text-[9px] technical-label text-neutral-400">Predicted Preferences</span>
                    <div className="flex flex-wrap gap-1.5">
                      {enrichment.predicted_preferences.amenities.map(a => (
                        <span key={a} className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[8px] font-black italic uppercase">{a}</span>
                      ))}
                      {enrichment.predicted_preferences.room_type && (
                        <span className="px-2 py-0.5 bg-neutral-100 border border-neutral-200 text-[8px] font-black italic uppercase">{enrichment.predicted_preferences.room_type}</span>
                      )}
                    </div>
                  </div>
                )}

                {enrichment.behavior_prediction && (
                  <div className="space-y-2">
                    <span className="text-[9px] technical-label text-neutral-400">Booking Probability</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { label: '30d', value: enrichment.behavior_prediction.booking_probability_30d },
                        { label: '60d', value: enrichment.behavior_prediction.booking_probability_60d },
                        { label: '90d', value: enrichment.behavior_prediction.booking_probability_90d },
                      ].map(({ label, value }) => (
                        <div key={label} className="p-2 bg-neutral-50 border border-neutral-100 text-center">
                          <p className="text-sm font-black italic">{Math.round(value * 100)}%</p>
                          <p className="text-[8px] technical-label text-neutral-400">{label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center justify-between text-[9px] technical-label text-neutral-400 pt-1">
                      <span>Churn Risk: <span className={cn('font-black italic', enrichment.behavior_prediction.churn_risk > 0.6 ? 'text-rose-500' : 'text-emerald-500')}>{Math.round(enrichment.behavior_prediction.churn_risk * 100)}%</span></span>
                      <span>CLV: <span className="font-black italic text-black">${enrichment.behavior_prediction.estimated_clv.toLocaleString()}</span></span>
                    </div>
                  </div>
                )}

                {enrichment.best_contact_time && (
                  <div>
                    <span className="text-[9px] technical-label text-neutral-400">Best Contact Time</span>
                    <p className="text-xs font-black italic mt-0.5">{enrichment.best_contact_time}</p>
                  </div>
                )}

                {enrichment.engagement_tips.length > 0 && (
                  <div className="p-3 bg-amber-50 border border-amber-100">
                    <div className="flex items-center gap-2 mb-2 text-amber-600">
                      <AlertTriangle size={12} />
                      <span className="text-[9px] font-black italic uppercase">Engagement Tip</span>
                    </div>
                    <p className="text-[10px] font-bold italic text-amber-800">{enrichment.engagement_tips[0]}</p>
                  </div>
                )}

                {enrichment.recommended_actions.length > 0 && (
                  <div className="space-y-1.5">
                    <span className="text-[9px] technical-label text-neutral-400">Recommended Actions</span>
                    {enrichment.recommended_actions.slice(0, 3).map((a, i) => (
                      <div key={i} className="flex items-start gap-2">
                        <div className="w-1 h-1 rounded-full bg-black mt-1.5 shrink-0" />
                        <p className="text-[10px] font-bold italic text-neutral-600">{a}</p>
                      </div>
                    ))}
                  </div>
                )}
              </>
            ) : (
              <p className="text-[10px] technical-label text-neutral-400">
                {enrichLoading ? 'Loading enrichment...' : 'No enrichment data yet.'}
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
