'use client';

import React, { useState, useRef } from 'react';
import { FileUp, Database, CheckCircle2, AlertCircle, ArrowRight, Trash2, ChevronDown } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { useImportCustomers, useCustomers } from '@/hooks/useCustomers';

const previewData = [
  { id: 1, name: 'Tessema Belay', phone: '+251 911 222 333', source: 'PMS_EXPORT_V1', status: 'valid' },
  { id: 2, name: 'Hanna Yohannes', phone: '0911000111', source: 'PMS_EXPORT_V1', status: 'invalid', error: 'Invalid phone format' },
  { id: 3, name: 'Duplicate Entry', phone: '+251 911 222 333', source: 'Internal_DB', status: 'error', error: 'Duplicate record' },
  { id: 4, name: 'Mekonen Haile', phone: '+251 922 444 555', source: 'PMS_EXPORT_V1', status: 'valid' },
];

export default function DataImportPage() {
  const [step, setStep] = useState(1);
  const [fileName, setFileName] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const importMut = useImportCustomers();
  const { data: customers } = useCustomers();

  const handleFile = async (file: File | null | undefined) => {
    if (!file) return;
    if (!file.name.endsWith('.csv')) {
      toast.error('Only .csv files are supported. Please upload a valid CSV file.');
      return;
    }
    setFileName(file.name);
    try {
      await importMut.mutateAsync(file);
      toast.success(`${file.name} loaded and uploaded successfully`);
      setStep(2);
    } catch (err: any) {
      toast.error(err.message || 'Error occurred while uploading CSV');
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    handleFile(e.dataTransfer.files[0]);
  };
  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="display-header text-4xl italic tracking-tighter">Data Ingestion</h1>
          <p className="technical-label text-neutral-500 mt-1">AI-assisted normalization & sync</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-white border border-neutral-200">
          <Database size={14} className="text-neutral-400" />
          <span className="text-[10px] technical-label text-black uppercase">Connected PMS: TotalEnergies</span>
        </div>
      </div>

      <div className="flex items-center gap-4 border-b border-neutral-100 pb-8">
        {[{ num: 1, label: 'Source Selection' }, { num: 2, label: 'Column Mapping' }, { num: 3, label: 'Validation & Sync' }].map((s, i) => (
          <React.Fragment key={s.num}>
            {i > 0 && <ArrowRight size={16} className="text-neutral-300" />}
            <div className={cn("flex items-center gap-3 transition-all", step === s.num ? "opacity-100" : "opacity-40")}>
              <div className={cn("w-8 h-8 rounded-full flex items-center justify-center font-black italic text-sm border-2",
                step > s.num ? "bg-emerald-500 border-emerald-500 text-white" :
                step === s.num ? "border-utopia text-utopia" : "border-neutral-300 text-neutral-400"
              )}>
                {step > s.num ? <CheckCircle2 size={16} /> : s.num}
              </div>
              <span className={cn("text-[10px] technical-label uppercase tracking-tighter", step === s.num ? "text-black" : "text-neutral-500")}>{s.label}</span>
            </div>
          </React.Fragment>
        ))}
      </div>

      {step === 1 && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div
            className="industrial-card p-12 flex flex-col items-center justify-center text-center space-y-6 border-2 border-dashed border-neutral-200 bg-neutral-50/50 hover:border-utopia transition-colors cursor-pointer group"
            onDragOver={e => e.preventDefault()}
            onDrop={handleDrop}
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".csv"
              className="hidden"
              onChange={e => { handleFile(e.target.files?.[0]); e.target.value = ''; }}
            />
            <div className="w-20 h-20 bg-white border border-neutral-200 flex items-center justify-center rounded-2xl group-hover:scale-110 transition-transform shadow-sm">
              <FileUp size={40} className="text-neutral-400" />
            </div>
            <div className="space-y-2">
              <h3 className="text-sm font-black italic uppercase tracking-tight">
                {fileName ? fileName : 'Drop CSV File Here'}
              </h3>
              <p className="text-[10px] technical-label text-neutral-400 max-w-[200px]">Only .csv files are supported</p>
            </div>
            <Button variant="primary" size="md" onClick={e => { e.stopPropagation(); fileInputRef.current?.click(); }}>Browse File</Button>
          </div>
          <div className="space-y-6 text-left">
            <h3 className="text-sm font-black italic uppercase tracking-tight">PMS Integrations</h3>
            <div className="grid grid-cols-1 gap-3">
              {[{ name: 'TotalEnergies Cloud', status: 'Active', icon: 'T' }, { name: 'Opera Cloud (Oracle)', status: 'Disconnected', icon: 'O' }, { name: 'Cloudbeds PMS', status: 'Setup Required', icon: 'C' }].map(p => (
                <div key={p.name} className="industrial-card p-4 flex items-center justify-between hover:border-utopia cursor-pointer transition-all">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 bg-black text-white flex items-center justify-center font-black italic rounded-[1px]">{p.icon}</div>
                    <div className="flex flex-col">
                      <span className="text-xs font-black italic tracking-tight">{p.name}</span>
                      <span className="text-[9px] technical-label text-neutral-400 uppercase">PMS Provider</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {p.status === 'Active' && <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />}
                    <span className="text-[9px] technical-label font-bold uppercase">{p.status}</span>
                    <ChevronDown size={14} className="text-neutral-300" />
                  </div>
                </div>
              ))}
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
                {[{ source: 'Full_Name', target: 'Name', transformation: 'Direct Map' }, { source: 'Guest_Phone', target: 'Phone', transformation: 'Format: Intl E.164' }, { source: 'Check_Out', target: 'Last_Stay', transformation: 'Format: ISO-8601' }, { source: 'LTV_USD', target: 'Total_Value', transformation: 'Currency conversion' }].map(r => (
                  <tr key={r.source} className="hover:bg-neutral-50 transition-colors">
                    <td className="p-4 text-sm font-black">{r.source}</td>
                    <td className="p-4 text-neutral-300"><ArrowRight size={14} /></td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 px-3 py-1.5 bg-black text-white rounded-[1px] w-fit">
                        <Database size={10} className="text-neutral-500" />
                        <span className="text-[10px] uppercase font-black tracking-tight">{r.target}</span>
                      </div>
                    </td>
                    <td className="p-4">
                      <div className="flex items-center gap-2 group cursor-pointer">
                        <div className="w-6 h-6 bg-emerald-50 flex items-center justify-center border border-emerald-200"><AlertCircle size={10} className="text-emerald-500" /></div>
                        <span className="text-[9px] technical-label text-neutral-400 group-hover:text-black transition-colors">{r.transformation}</span>
                      </div>
                    </td>
                  </tr>
                ))}
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
            <div className="flex items-center gap-1.5 px-3 py-1 bg-emerald-50 text-emerald-600 rounded-[1px] border border-emerald-100">
              <CheckCircle2 size={12} /><span className="text-[10px] font-black italic uppercase">Safe to sync</span>
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
                      <div className={cn("px-2 py-0.5 rounded-[1px] inline-flex items-center gap-1.5",
                        row.status === 'valid' ? "bg-emerald-50 text-emerald-600 border border-emerald-100" :
                        row.status === 'invalid' ? "bg-amber-50 text-amber-600 border border-amber-100" :
                        "bg-rose-50 text-rose-600 border border-rose-100"
                      )}>
                        <span className="text-[9px] font-black italic uppercase tracking-tighter">{row.status}</span>
                      </div>
                    </td>
                    <td className="p-4"><span className={cn("text-[10px] font-bold technical-label", row.status === 'valid' ? "text-neutral-400" : "text-rose-500")}>{row.error || 'Passed AI normalization scan'}</span></td>
                    <td className="p-4 text-right"><button className="p-2 text-neutral-300 hover:text-rose-500 opacity-0 group-hover:opacity-100 transition-all"><Trash2 size={14} /></button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-end gap-3 pb-12">
            <Button variant="outline" size="md" onClick={() => setStep(2)} className="bg-white">Re-map Columns</Button>
            <Button variant="primary" size="md" icon={Database} onClick={() => toast.success('Leads synced to database successfully')}>Sync Leads to Database</Button>
          </div>
        </div>
      )}
    </div>
  );
}
