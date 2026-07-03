'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import MaturitySelector from '@/components/MaturitySelector';

interface Props {
  controlId: string;
  initialTarget: number | null;
}

const CIS_FRAMEWORK_ID = 2;

export default function CisTargetEditor({ controlId, initialTarget }: Props) {
  const router = useRouter();
  const [target, setTarget] = useState<number | null>(initialTarget);
  const [saving, setSaving] = useState(false);

  async function handleChange(score: number | null) {
    setTarget(score);
    setSaving(true);
    if (score === null) {
      await fetch('/api/targets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework_id: CIS_FRAMEWORK_ID, control_id: controlId }),
      });
    } else {
      await fetch('/api/targets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ framework_id: CIS_FRAMEWORK_ID, control_id: controlId, target_score: score }),
      });
    }
    setSaving(false);
    router.refresh();
  }

  return <MaturitySelector value={target} onChange={handleChange} disabled={saving} controlId={controlId} />;
}
