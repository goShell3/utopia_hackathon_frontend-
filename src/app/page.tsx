'use client';

import { useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Users, Zap, MessageSquare, BarChart3, ArrowRight, CheckCircle2, Cpu } from 'lucide-react';
import { tokenStorage } from '@/lib/api/client';

const features = [
  {
    icon: Users,
    title: 'Lead Intelligence',
    desc: 'Import, deduplicate, and score leads from PMS, CSV, Meta Ads, and data brokers. AI-powered segmentation into hot, warm, and cold.',
  },
  {
    icon: Zap,
    title: 'Campaign Automation',
    desc: 'Build trigger-based, scheduled, or manual campaigns. Visual workflow builder with A/B testing and throttle controls.',
  },
  {
    icon: MessageSquare,
    title: 'SMS at Scale',
    desc: 'Send personalized SMS to thousands of guests via AfroMessage. Real-time delivery tracking and response monitoring.',
  },
  {
    icon: Cpu,
    title: 'AI-Powered Insights',
    desc: 'Generate personalized messages, score leads, enrich guest profiles, and get campaign recommendations — all powered by AI.',
  },
];

const stats = [
  { value: '28K+', label: 'Leads Managed' },
  { value: '142K', label: 'SMS Delivered' },
  { value: '18.4%', label: 'Response Rate' },
  { value: '90%', label: 'AI Accuracy' },
];

export default function LandingPage() {
  const router = useRouter();

  useEffect(() => {
    if (tokenStorage.getAccess()) {
      router.replace('/dashboard');
    }
  }, [router]);

  return (
    <div className="min-h-screen bg-black text-white">
      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-6 border-b border-white/5">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 bg-white text-black flex items-center justify-center font-black italic text-lg">U</div>
          <span className="text-lg font-black italic tracking-tighter uppercase">Utopia</span>
        </div>
        <div className="flex items-center gap-4">
          <Link href="/login" className="text-[10px] technical-label text-neutral-400 hover:text-white transition-colors uppercase">Sign In</Link>
          <Link href="/login" className="px-4 py-2 bg-utopia text-white text-[10px] font-black italic uppercase tracking-widest hover:bg-utopia/90 transition-colors">
            Get Started
          </Link>
        </div>
      </nav>

      {/* Hero */}
      <section className="px-8 pt-24 pb-20 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-white/5 border border-white/10 rounded-[1px] mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-utopia animate-pulse" />
          <span className="text-[10px] technical-label text-neutral-400 uppercase">Built for Ethiopian Hospitality</span>
        </div>

        <h1 className="display-header text-6xl md:text-7xl italic tracking-tighter leading-none mb-6">
          Hotel Lead Intelligence,<br />
          <span className="text-utopia">Automated.</span>
        </h1>

        <p className="text-neutral-400 text-lg font-bold italic max-w-2xl mx-auto mb-10 leading-relaxed">
          Utopia turns your guest data into revenue. Score leads, run AI-powered SMS campaigns, and track every conversion — all in one platform.
        </p>

        <div className="flex items-center justify-center gap-4">
          <Link href="/login" className="flex items-center gap-2 px-8 py-4 bg-utopia text-white text-sm font-black italic uppercase tracking-widest hover:bg-utopia/90 transition-colors">
            Access Platform <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="px-8 py-24 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="display-header text-4xl italic tracking-tighter mb-3">Everything you need</h2>
          <p className="technical-label text-neutral-500">Enterprise-grade tools for hotel marketing teams</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {features.map((f) => (
            <div key={f.title} className="p-6 bg-white/5 border border-white/10 hover:border-utopia/40 transition-colors group">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 bg-utopia/10 border border-utopia/20 flex items-center justify-center group-hover:bg-utopia/20 transition-colors">
                  <f.icon size={18} className="text-utopia" />
                </div>
                <h3 className="text-sm font-black italic uppercase tracking-tight">{f.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 font-bold italic leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* How it works */}
      <section className="px-8 py-24 border-t border-white/5 max-w-5xl mx-auto">
        <div className="text-center mb-16">
          <h2 className="display-header text-4xl italic tracking-tighter mb-3">How it works</h2>
          <p className="technical-label text-neutral-500">From raw guest data to booked revenue in three steps</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {[
            { step: '01', title: 'Import & Score', desc: 'Connect your PMS or upload a CSV. Utopia deduplicates, normalizes, and AI-scores every lead automatically.' },
            { step: '02', title: 'Build Campaigns', desc: 'Create trigger-based or scheduled SMS campaigns. Target by segment, source, or score. Generate copy with AI.' },
            { step: '03', title: 'Track & Optimize', desc: 'Monitor delivery rates, response rates, and conversions in real time. Let AI surface the next best action.' },
          ].map(s => (
            <div key={s.step} className="flex flex-col gap-4">
              <span className="display-header text-5xl italic text-white/10">{s.step}</span>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={14} className="text-utopia shrink-0" />
                <h3 className="text-sm font-black italic uppercase tracking-tight">{s.title}</h3>
              </div>
              <p className="text-sm text-neutral-400 font-bold italic leading-relaxed">{s.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* CTA */}
      <section className="px-8 py-24 border-t border-white/5">
        <div className="max-w-2xl mx-auto text-center">
          <h2 className="display-header text-5xl italic tracking-tighter mb-4">Ready to start?</h2>
          <p className="text-neutral-400 font-bold italic mb-8">Sign in with a demo account and explore the full platform.</p>
          <Link href="/login" className="inline-flex items-center gap-2 px-10 py-4 bg-utopia text-white text-sm font-black italic uppercase tracking-widest hover:bg-utopia/90 transition-colors">
            Enter Platform <ArrowRight size={16} />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="px-8 py-8 border-t border-white/5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <div className="w-6 h-6 bg-white text-black flex items-center justify-center font-black italic text-xs">U</div>
          <span className="text-[10px] technical-label text-neutral-600 uppercase">Utopia · Enterprise Hotel CRM · v0.1.0-alpha</span>
        </div>
        <span className="text-[10px] technical-label text-neutral-700 uppercase">Built for Hackathon 2025</span>
      </footer>
    </div>
  );
}
