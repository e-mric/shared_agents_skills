export const stages = [
  { label: 'Baseline', section: 'The starting point', title: '“Build me a\nnote app.”', description: 'A familiar screen. An unclear brief.', kind: 'baseline' },
  { label: 'Understand', section: '01 / Understand before changing', title: 'What are we\nactually building?', description: 'One goal: write a note, save it, find it again.', kind: 'brief' },
  { label: 'Guidance', section: '02 / Establish project guidance', title: 'The next chat\nneeds a compass.', description: 'Give the next agent the rules and checks.', kind: 'guidance' },
  { label: 'Context', section: '03 / Build shared context', title: 'Context should\noutlive a chat.', description: 'Keep decisions in the repo. Link them from an index.', kind: 'context' },
  { label: 'Methods', section: '04 / Verify available skills', title: 'A method for\nthe question.', description: 'Choose a method that fits the task.', kind: 'methods' },
  { label: 'Team', section: '05 / Optional team and permissions', title: 'One agent,\nor a small team?', description: 'One builds. Another checks. Findings go back.', kind: 'team' },
  { label: 'Design', section: '06 / Design first', title: 'See it before\nwe build it.', description: 'Bring a Figma design, or generate a direction.', kind: 'design', phase: 'design' },
  { label: 'Write', section: '07 / Build a bounded outcome', title: 'First, a place\nfor a thought.', description: 'Agree on technologies and team. Build one working slice.', kind: 'live', phase: 'implement', iteration: 0 },
  { label: 'Save', section: '08 / Verify persistence', title: 'A thought,\nkept.', description: 'Save, reopen, reload. Is the note still here?', kind: 'live', phase: 'implement', iteration: 1 },
  { label: 'Recover', section: '08 / Verify recovery', title: 'What if\nsaving fails?', description: 'Interrupt a save. Keep the draft. Retry.', kind: 'live', phase: 'implement', iteration: 2 },
  { label: 'Review', section: '08 / Review and simplify', title: 'Compare.\nTry. Refine.', description: 'Compare the design. Test the app. Refine what matters.', kind: 'live', phase: 'review', iteration: 3 },
  { label: 'Handoff', section: '09 / Complete and report', title: 'Leave the next\nstep clear.', description: 'Record what works, its limits and the next step.', kind: 'handoff' },
];

export const workflowLoop = [
  { phase: 'design', label: 'Design first', chapter: 6 },
  { phase: 'implement', label: 'Implement', chapter: 7 },
  { phase: 'review', label: 'Review', chapter: 10 },
];

export const rates = {
  astra: { name: 'GPT-6 Astra', input: 10, output: 50, creditInput: 250, creditOutput: 1250 },
  sol: { name: 'GPT-6.1 Sol', input: 2, output: 10, creditInput: 50, creditOutput: 250 },
  luna: { name: 'GPT-6 Luna', input: 0.1, output: 0.5, creditInput: 2.5, creditOutput: 12.5 },
};
export const plans = [
  { id: 'single', name: 'One agent', description: 'Sol handles planning, execution and review.', allocation: [['sol', 1, 1]] },
  { id: 'depth', name: 'A small team', description: 'Astra plans and reviews. Sol coordinates and executes.', allocation: [['astra', 1 / 3, 0.4], ['sol', 2 / 3, 0.6]] },
  { id: 'budget', name: 'Lighter execution', description: 'Astra plans and reviews. Sol coordinates. Luna executes bounded tasks.', allocation: [['astra', 1 / 3, 0.4], ['sol', 1 / 6, 0.2], ['luna', 0.5, 0.4]] },
];
export function estimate(planId, input = 60000, output = 10000) {
  const plan = plans.find(p => p.id === planId);
  if (!plan || !Number.isFinite(input) || !Number.isFinite(output) || input < 0 || output < 0) throw new Error('Invalid estimate assumptions');
  return plan.allocation.reduce((sum, [key, inputShare, outputShare]) => {
    const r = rates[key];
    return {
      usd: sum.usd + (input * inputShare * r.input + output * outputShare * r.output) / 1e6,
      credits: sum.credits + (input * inputShare * r.creditInput + output * outputShare * r.creditOutput) / 1e6,
    };
  }, { usd: 0, credits: 0 });
}
