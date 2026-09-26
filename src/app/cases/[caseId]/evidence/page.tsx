'use client';

import { useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';

export default function CaseEvidencePage() {
  const params = useParams();
  const router = useRouter();
  const caseId = (params?.caseId as string) || 'LS-2026-0042';

  useEffect(() => {
    router.replace(`/cases/${caseId}?tab=evidence`);
  }, [caseId, router]);

  return (
    <div className="w-full min-h-screen flex items-center justify-center bg-slate-50 dark:bg-[#090D16] text-xs text-slate-500">
      <div className="flex items-center gap-2">
        <span className="w-2 h-2 rounded-full bg-blue-600 animate-ping" />
        <span>Loading Evidence &amp; Documents in Unified Workspace...</span>
      </div>
    </div>
  );
}
