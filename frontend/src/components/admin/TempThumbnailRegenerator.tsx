// TEMPORARY: remove this component (and its usage in AdminSettingsPage) after running once.
import React, { useState } from 'react';
import { RefreshCw } from 'lucide-react';
import api from '../../services/api';
import Button from '../ui/Button';

export default function TempThumbnailRegenerator() {
  const [running, setRunning] = useState(false);
  const [finished, setFinished] = useState(false);
  const [done, setDone] = useState(0);
  const [total, setTotal] = useState(0);
  const [log, setLog] = useState<string[]>([]);

  const run = async () => {
    setRunning(true);
    setFinished(false);
    setDone(0);
    setLog([]);
    let afterId: string | undefined;
    let count = 0;
    try {
      for (;;) {
        const { data } = await api.post(
          '/temp-maintenance/regenerate-thumbnails',
          { afterId },
          { timeout: 120000 }
        );
        count += data.processed;
        setTotal(data.total);
        setDone(count);
        setLog((l) => [...l, ...data.results.map((r: any) => `${r.name} - ${r.status}`)]);
        if (data.done) break;
        afterId = data.nextAfterId;
      }
      setFinished(true);
    } catch (err: any) {
      setLog((l) => [...l, `ERROR: ${err?.response?.data?.message || err.message}. Click again to restart (safe to re-run).`]);
    } finally {
      setRunning(false);
    }
  };

  return (
    <div className="bg-luxury-white border border-luxury-border rounded-xl p-6 space-y-4 shadow-sm mt-8 max-w-3xl">
      <h3 className="text-sm font-serif text-luxury-gold tracking-wider uppercase">
        One-time: Regenerate Product Thumbnails
      </h3>
      <p className="text-sm text-luxury-steel">
        Rebuilds sharper card thumbnails for all products. Takes a minute or two; keep this page open.
      </p>
      <Button type="button" variant="primary" onClick={run} isLoading={running}>
        <RefreshCw size={16} /> Regenerate thumbnails
      </Button>
      {(running || done > 0) && (
        <p className="text-sm text-luxury-charcoal">
          {done} / {total} products processed
          {finished && ' - all done! Homepage cache cleared.'}
        </p>
      )}
      {log.length > 0 && (
        <pre className="text-xs text-luxury-steel max-h-48 overflow-auto whitespace-pre-wrap">{log.join('\n')}</pre>
      )}
    </div>
  );
}
