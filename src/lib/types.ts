export type MaturityLevel = 1 | 2 | 3 | 4 | 5;

export const MATURITY_LABELS: Record<MaturityLevel, string> = {
  1: 'Initial',
  2: 'Managed',
  3: 'Defined',
  4: 'Quantitatively Managed',
  5: 'Optimizing',
};

export const MATURITY_DESCRIPTIONS: Record<MaturityLevel, string> = {
  1: 'Ad hoc and unpredictable. Success depends on individual effort.',
  2: 'Reactive. Processes are planned, performed, and controlled at the project level.',
  3: 'Proactive. Processes are well-characterized, standardized, and documented.',
  4: 'Measured and controlled with quantitative objectives.',
  5: 'Continuous process improvement through quantitative feedback.',
};

export const MATURITY_COLORS: Record<MaturityLevel, string> = {
  1: 'bg-red-100 text-red-800 border-red-200',
  2: 'bg-orange-100 text-orange-800 border-orange-200',
  3: 'bg-yellow-100 text-yellow-800 border-yellow-200',
  4: 'bg-emerald-100 text-emerald-800 border-emerald-200',
  5: 'bg-green-100 text-green-800 border-green-200',
};

export const MATURITY_BAR_COLORS: Record<MaturityLevel, string> = {
  1: '#ef4444',
  2: '#f97316',
  3: '#eab308',
  4: '#10b981',
  5: '#22c55e',
};

export type ControlLevel = 'function' | 'category' | 'subcategory';

export type AssessmentStatus = 'draft' | 'published';

export interface Framework {
  id: number;
  name: string;
  version: string;
  description: string | null;
  is_active: number;
}

export interface Control {
  id: string;
  framework_id: number;
  parent_id: string | null;
  level: ControlLevel;
  code: string;
  title: string;
  description: string | null;
  sort_order: number;
}

export interface Assessment {
  id: string;
  framework_id: number;
  title: string;
  description: string | null;
  assessor: string | null;
  status: AssessmentStatus;
  assessed_at: string | null;
  created_at: string;
  updated_at: string;
}

export interface AssessmentScore {
  id: number;
  assessment_id: string;
  control_id: string;
  score: MaturityLevel | null;
  rationale: string | null;
  created_at: string;
  updated_at: string;
}

export interface Target {
  id: number;
  framework_id: number;
  control_id: string;
  target_score: MaturityLevel;
  notes: string | null;
  updated_at: string;
}

export interface StakeholderInput {
  id: number;
  control_id: string;
  assessment_id: string | null;
  team: string;
  contact: string | null;
  input_text: string;
  evidence_url: string | null;
  created_at: string;
}

export interface Note {
  id: number;
  entity_type: string;
  entity_id: string;
  author: string | null;
  body: string;
  created_at: string;
}
