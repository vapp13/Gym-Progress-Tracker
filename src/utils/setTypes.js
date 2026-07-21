// Single source of truth for set types — label, badge letter, badge
// color, and the help-icon explanation shown in the selection modal.
export const SET_TYPES = [
  {
    value: 'working',
    label: 'Working',
    badge: null,
    color: null,
    softColor: null,
    explanation: 'Normal training set used for progression.',
  },
  {
    value: 'warmup',
    label: 'Warm-up',
    badge: 'W',
    color: 'var(--color-primary)',
    softColor: 'var(--color-primary-soft)',
    explanation: 'Lower intensity set preparing for heavier work.',
  },
  {
    value: 'drop',
    label: 'Drop-set',
    badge: 'D',
    color: 'var(--color-accent)',
    softColor: 'var(--color-accent-soft)',
    explanation: 'Reduce weight after reaching fatigue and continue.',
  },
  {
    value: 'failure',
    label: 'Failure',
    badge: 'F',
    color: 'var(--color-danger)',
    softColor: 'var(--color-danger-soft)',
    explanation: 'Set performed until no more repetitions can be completed safely.',
  },
  {
    value: 'assisted',
    label: 'Assisted',
    badge: 'A',
    color: 'var(--color-success)',
    softColor: 'var(--color-success-soft)',
    explanation: 'Set completed with help from a partner or machine assistance.',
  },
];

export function getSetTypeConfig(value) {
  return SET_TYPES.find((t) => t.value === value) || SET_TYPES[0];
}
