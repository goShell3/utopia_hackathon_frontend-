'use client';

import React, { useState } from 'react';
import { 
  FileUp, 
  Database, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight, 
  Trash2, 
  MoreHorizontal,
  Table as TableIcon,
  ChevronDown
} from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';

// Mock Preview Data
const previewData = [
  { id: 1, name: 'Tessema Belay', phone: '+251 911 222 333', source: 'PMS_EXPORT_V1', status: 'valid' },
  { id: 2, name: 'Hanna Yohannes', phone: '0911000111', source: 'PMS_EXPORT_V1', status: 'invalid', error: 'Invalid phone format' },
  { id: 3, name: 'Duplicate Entry', phone: '+251 911 222 333', source: 'Internal_DB', status: 'error', error: 'Duplicate record' },
  { id: 4, name: 'Mekonen Haile', phone: '+251 922 444 555', source: 'PMS_EXPORT_V1', status: 'valid' },
];

export default function DataImportPage() {
  const [step, setStep] = useState(1);

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Data Ingestion</h1>
          <p className="technical-label text-neutral-500 mt-1">AI-assisted normalization & sync</p>
        </div>
        <div className="flex items-center gap-4">
           <div className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200">
              <Database size={14} className="text-neutral-400" />
              <span className="text-[10px] technical-label text-black uppercase">Connected PMS: TotalEnergies</span>
           </div>
        </div>
      </div>

      {/* Import Steps */}
      <div className="flex items-center gap-4 border-b border-neutral-100 pb-8">
        <StepIndicator num={1} label="Source Selection" active={step === 1} completed={step > 1} />
        <ArrowRight size={16} className="text-neutral-300" />
        <StepIndicator num={2} label="Column Mapping" active={step === 2} completed={step > 2} />
        <ArrowRight size={16} className="text-neutral-300" />
        <StepIndicator num={3} label="Validation & Sync" active={step === 3} completed={step > 3} />
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Drag & Drop Area */}
          <div className="industrial-card p-12 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-neutral-200 bg-neutral-50/50 hover:border-utopia transition-colors cursor-pointer group">
             <div className="w-20 h-20 bg-white border border-neutral-200 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
                <FileUp size={40} className="text-neutral-400" />
             </div>
             <div className="space-y-2">
                <h3 className="text-sm font-black italic uppercase tracking-tight">Drop Source Files Here</h3>
                <p className="text-[10px] technical-label text-neutral-400 max-w-[200px]">Support for .CSV, .XLSX, and XML exports from standard PMS platforms</p>
             </div>
             <Button variant="primary" size="md" onClick={() => setStep(2)}>
                Fetch Local Files
             </Button>
          </div>

          <div className="space-y-6 text-left">
             <h3 className="text-sm font-black italic uppercase tracking-tight">PMS Integrations</h3>
             <div className="grid grid-cols-1 gap-3">
                <PMSCard name="TotalEnergies Cloud" status="Active" icon="T" />
                <PMSCard name="Opera Cloud (Oracle)" status="Disconnected" icon="O" />
                <PMSCard name="Cloudbeds PMS" status="Setup Required" icon="C" />
             </div>
          </div>
        </div>
      )}

      {step === 2 && (
        <div className="space-y-8">
           <div className="industrial-card p-0">
             <table className="w-full text-left border-collapse">
               <thead className="bg-neutral-50 border-b border-neutral-200">
                  <tr>
                    <th className="p-4 technical-label text-neutral-400">CSV Header</th>
                    <th className="p-4"></th>
                    <th className="p-4 technical-label text-neutral-400">Utopia Destination</th>
                    <th className="p-4 technical-label text-neutral-400">Transformation AI</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-100 italic">
                  <MappingRow source="Full_Name" target="Name" transformation="Direct Map" />
                  <MappingRow source="Guest_Phone" target="Phone" transformation="Format: Intl E.164" />
                  <MappingRow source="Check_Out" target="Last_Stay" transformation="Format: ISO-8601" />
                  <MappingRow source="LTV_USD" target="Total_Value" transformation="Currency conversion" />
               </tbody>
             </table>
           </div>
           <div className="flex justify-end gap-3">
             <Button variant="outline" size="md" onClick={() => setStep(1)} className="bg-white">Back</Button>
             <Button variant="primary" size="md" onClick={() => setStep(3)}>Finalize Mapping</Button>
           </div>
        </div>
      )}

      {step === 3 && (
        <div className="space-y-8">
           <div className="flex items-center justify-between border-l-4 border-utopia pl-6 py-2">
              <div>
                 <h3 className="text-sm font-black italic uppercase">Preview & Validation Result</h3>
                 <p className="technical-label text-[10px] text-neutral-400 mt-1">420 nodes detected · 8 errors found</p>
              </div>
              <div className="flex items-center gap-2">
                 <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-[1px] border border-emerald-100">
                    <CheckCircle2 size={12} />
                    <span className="text-[10px] font-black italic uppercase">Safe to sync</span>
                 </div>
              </div>
           </div>

           <div className="industrial-card p-0">
              <table className="w-full text-left border-collapse text-sm italic">
                 <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                       <th className="p-4 technical-label text-neutral-400">Node Name</th>
                       <th className="p-4 technical-label text-neutral-400">Identifiers</th>
                       <th className="p-4 technical-label text-neutral-400">Scan Status</th>
                       <th className="p-4 technical-label text-neutral-400">Observations</th>
                       <th className="p-4"></th>
                    </tr>
                 </thead>
                 <tbody className="divide-y divide-neutral-100">
                    {previewData.map(row => (
                       <tr key={row.id} className="hover:bg-neutral-50 group">
                          <td className="p-4 font-black">{row.name}</td>
                          <td className="p-4 font-mono text-xs">{row.phone}</td>
                          <td className="p-4">
                             <div className={cn(
                               "px-2 py-0.5 rounded-[1px] inline-flex items-center gap-1.5",
                               row.status === 'valid' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                               row.status === 'invalid' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                               "bg-rose-50 text-rose-600 border border-rose-100"
                             )}>
                                <span className="text-[9px] font-black italic uppercase tracking-tighter">{row.status}</span>
                             </div>
                          </td>
                          <td className="p-4">
                             <span className={cn(
                               "text-[10px] font-bold technical-label",
                               row.status === 'valid' ? "text-neutral-400" : "text-rose-500"
                             )}>
                                {row.error || 'Passed AI normalization scan'}
                             </span>
                          </td>
                          <td className="p-4 text-right">
                             <button className="p-2 text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all">
                                <Trash2 size={14} />
                             </button>
                          </td>
                       </tr>
                    ))}
                 </tbody>
              </table>
           </div>

           <div className="flex justify-end gap-3 pb-12">
             <Button variant="outline" size="md" onClick={() => setStep(2)} className="bg-white">Re-map Columns</Button>
             <Button variant="primary" size="md" icon={Database}>Execute Sync to Production</Button>
           </div>
        </div>
      )}
    </div>
  );
}

function StepIndicator({ num, label, active, completed }: { num: number, label: string, active: boolean, completed: boolean }) {
  return (
    <div className={cn(
      "flex items-center gap-3 transition-all",
      active ? "opacity-100" : "opacity-40"
    )}>
       <div className={cn(
         "w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm border-2",
         completed ? "bg-emerald-500 border-emerald-500 text-white" : 
         active ? "border-utopia text-utopia" : "border-neutral-300 text-neutral-400"
       )}>
          {completed ? <CheckCircle2 size={16} /> : num}
       </div>
       <span className={cn(
         "text-[10px] technical-label uppercase tracking-tighter",
         active ? "text-black" : "text-neutral-500"
       )}>{label}</span>
    </div>
  );
}

function PMSCard({ name, status, icon }: { name: string, status: string, icon: string }) {
  return (
    <div className="industrial-card p-4 flex items-center justify-between hover:border-utopia cursor-pointer transition-all">
      <div className="flex items-center gap-4">
         <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black italic rounded-[1px]">{icon}</div>
         <div className="flex flex-col">
            <span className="text-xs font-black italic tracking-tight">{name}</span>
            <span className="text-[9px] technical-label text-neutral-400 uppercase">PMS Provider</span>
         </div>
      </div>
      <div className="flex items-center gap-2">
         {status === 'Active' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
         <span className="text-[9px] technical-label font-bold uppercase">{status}</span>
         <ChevronDown size={14} className="text-neutral-300" />
      </div>
    </div>
  );
}

function MappingRow({ source, target, transformation }: { source: string, target: string, transformation: string }) {
  return (
    <tr className="hover:bg-neutral-50 transition-colors">
       <td className="p-4 text-sm font-black">{source}</td>
       <td className="p-4 text-neutral-300"><ArrowRight size={14} /></td>
       <td className="p-4">
          <div className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-[1px] w-fit">
             <Database size={10} className="text-neutral-500" />
             <span className="text-[10px] uppercase font-black tracking-tight">{target}</span>
          </div>
       </td>
       <td className="p-4">
          <div className="flex items-center gap-2 group cursor-pointer">
             <div className="w-6 h-6 bg-emerald-50 flex items-center justify-center border border-emerald-200">
                <AlertCircle size={10} className="text-emerald-500" />
             </div>
             <span className="text-[9px] technical-label text-neutral-400 group-hover:text-black transition-colors">{transformation}</span>
          </div>
       </td>
    </tr>
  );
}
