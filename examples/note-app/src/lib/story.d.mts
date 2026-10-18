export type Stage = { label: string; section: string; title: string; description: string; addition: string; cue: string; kind: string; phase?: string; iteration?: number };
export const stages: Stage[];
export const plans: { id: string; name: string; description: string; allocation: [string, number, number][] }[];
export const rates: Record<string, { name: string; input: number; output: number; creditInput: number; creditOutput: number }>;
export function estimate(planId: string, input?: number, output?: number): { usd: number; credits: number };

export const workflowLoop: { phase: string; label: string; chapter: number }[];
