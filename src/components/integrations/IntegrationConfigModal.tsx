'use client';

import React, { useState } from 'react';
import { X, Save, AlertCircle } from 'lucide-react';
import { Button } from '@/components/shared/Button';
import { IntegrationNode } from '@/contexts/IntegrationContext';

interface Props {
  node: IntegrationNode;
  onClose: () => void;
  onSave: () => void;
}

export function IntegrationConfigModal({ node, onClose, onSave }: Props) {
  const [isSaving, setIsSaving] = useState(false);

  const handleSave = () => {
    setIsSaving(true);
    // Simulate save network delay
    setTimeout(() => {
      setIsSaving(false);
      onSave();
      onClose();
    }, 1000);
  };

  const renderFields = () => {
    if (node.category === 'PMS') {
      return (
        <>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">Host URL</label>
            <input type="text" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" defaultValue="https://api.pms.local" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">API Key / Token</label>
            <input type="password" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" defaultValue="************************" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">Nightly Sync Time</label>
            <input type="time" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" defaultValue="02:00" />
          </div>
        </>
      );
    }

    if (node.category === 'Marketing') {
      return (
        <>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">Business ID</label>
            <input type="text" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="e.g. 1012938475" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">OAuth Token</label>
            <input type="password" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Paste long-lived token here" />
          </div>
        </>
      );
    }

    if (node.category === 'SMS Gateway') {
      return (
        <>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">Sender ID</label>
            <input type="text" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" defaultValue="UTOPIA" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">API Secret</label>
            <input type="password" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" placeholder="Gateway Secret" />
          </div>
          <div className="space-y-2">
            <label className="text-[10px] technical-label text-neutral-500 uppercase">Delivery Webhook URL</label>
            <input type="text" className="w-full bg-neutral-100 border-none p-3 text-sm focus:ring-1 focus:ring-black outline-none" defaultValue="https://api.utopia.com/webhooks/sms" readOnly />
            <p className="text-[9px] text-neutral-400 mt-1 italic">Use this URL in your gateway dashboard to receive delivery receipts.</p>
          </div>
        </>
      );
    }

    return (
      <div className="p-4 bg-neutral-50 flex items-start gap-3">
        <AlertCircle className="w-5 h-5 text-neutral-400" />
        <p className="text-sm text-neutral-600">No additional configuration required for this node.</p>
      </div>
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-full max-w-md bg-white shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">

        {/* Header */}
        <div className="p-6 border-b border-neutral-100 flex items-start justify-between bg-neutral-50">
          <div>
            <h2 className="display-header text-2xl italic leading-none">{node.name}</h2>
            <p className="technical-label text-[10px] text-neutral-500 uppercase mt-2">Configuration / {node.category}</p>
          </div>
          <button onClick={onClose} className="p-2 hover:bg-black/5 rounded-full transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 overflow-y-auto flex-1 space-y-6">
          {renderFields()}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-neutral-100 bg-neutral-50 flex items-center justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="bg-white">Cancel</Button>
          <Button variant="primary" icon={Save} onClick={handleSave} disabled={isSaving}>
            {isSaving ? 'Saving...' : 'Save Configuration'}
          </Button>
        </div>
      </div>
    </div>
  );
}
