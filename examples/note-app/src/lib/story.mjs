export const stages = [
  { label: 'Baseline', section: 'The starting point', title: '“Build me a\nnote app.”', description: 'A short prompt can produce a familiar interface. It leaves the audience, behavior and quality bar open to interpretation.', addition: 'A first draft gives us something to question.', cue: 'Ask the audience what this prompt leaves unspecified. The comparison is illustrative, not a recorded model experiment.', kind: 'baseline' },
  { label: 'Understand', section: '01 / Understand before changing', title: 'What are we\nactually building?', description: 'A presenter needs a small app that makes the development process visible. The first outcome is one note, safely saved and reopened.', addition: 'A bounded brief replaces assumptions.', cue: 'Toggle a proposed feature. Explain why each addition changes what we must design and test.', kind: 'brief' },
  { label: 'Guidance', section: '02 / Establish project guidance', title: 'The next chat\nneeds a compass.', description: 'Project instructions explain the constraints and how to verify the work. Keep the detailed product decisions in their owning document.', addition: 'A short AGENTS.md keeps working rules discoverable.', cue: 'Open one of the four role starters. Roles can run sequentially in one chat, as they do in this demonstration.', kind: 'guidance' },
  { label: 'Context', section: '03 / Build shared context', title: 'Context should\noutlive a chat.', description: 'Keep facts, proposals and accepted decisions distinct. The repository holds the useful context, and an index makes it easy to find.', addition: 'A small wiki gives future work a reliable starting point.', cue: 'Select each document. Explain that a new worktree sees committed files at its checked-out revision, not another chat’s unsaved work.', kind: 'context' },
  { label: 'Methods', section: '04 / Verify available skills', title: 'A method for\nthe question.', description: 'Use the skills already available. Research a storage question, diagnose a failure, or review a change when that method serves the task.', addition: 'A focused method helps keep the work proportionate.', cue: 'Choose a task to see a matching method. Skill selection does not authorize new external actions.', kind: 'methods' },
  { label: 'Team', section: '05 / Optional team and permissions', title: 'One agent,\nor a small team?', description: 'Ask about preferences before delegating. Match roles to the host’s capabilities and make the cost assumptions visible.', addition: 'Roles stay portable. Models are an optional example.', cue: 'Select an illustrative Codex assignment and workload. Compare API model dollars and credit-based usage. Neither predicts included subscription quota or this app’s actual cost.', kind: 'team' },
  { label: 'Design', section: '06 / Design first', title: 'See it before\nwe build it.', description: 'Generate a design from the brief, then check its layout, content and important states. Use that direction as the reference for implementation.', addition: 'Design first → implement → review. Repeat where the evidence calls for change.', cue: 'Show the generated design, then open the acceptance criteria. The image is a reference, not a working app or proof that every pictured feature is in scope. No generation happens during this presentation.', kind: 'design', phase: 'design' },
  { label: 'Write', section: '07 / Build a bounded outcome', title: 'First, a place\nfor a thought.', description: 'Implement the design in bounded iterations. Begin with a real title and editor; the next steps add saving and recovery. This first draft lives in memory.', addition: 'New in this iteration: a title and a plain-text editor.', cue: 'Type a short note. Move to Save without refreshing. The same editor and draft continue into the next iteration.', kind: 'live', phase: 'implement', iteration: 0 },
  { label: 'Save', section: '08 / Verify persistence', title: 'A thought,\nkept.', description: 'Iteration 02 adds saving and a library. Save your note, reopen it, then reload the page to check persistence in this browser.', addition: 'New: saving, search and an illustrated note library.', cue: 'Save the draft. Use the reload check only after saving. Browser storage is local to this origin and is not a backup.', kind: 'live', phase: 'implement', iteration: 1 },
  { label: 'Recover', section: '08 / Verify recovery', title: 'What if\nsaving fails?', description: 'Iteration 03 protects the draft when saving fails. Interrupt the next save, edit your note, then try saving it.', addition: 'New: a matching editor cover, draft protection and retry.', cue: 'Arm the interruption. Edit the body, save, and point out that the previous saved version remains intact. Retry and check the success feedback.', kind: 'live', phase: 'implement', iteration: 2 },
  { label: 'Review', section: '08 / Review and simplify', title: 'Does the whole\njourney make sense?', description: 'Compare the working app with the design and acceptance criteria. Walk the whole journey, record gaps, then return to the design for the next improvement.', addition: 'Final pass: refined typography, spacing and experience review.', cue: 'Compare the app with its generated reference. Check the review items only after observing them, then use Refine the design to close the loop. These are presenter observations, not an independent user study.', kind: 'live', phase: 'review', iteration: 3 },
  { label: 'Handoff', section: '09 / Complete and report', title: 'Leave the next\nstep clear.', description: 'Record what changed, the evidence and its limits, then name the remaining work. Keep the shared context concise and current.', addition: 'A useful handoff lets another chat continue safely.', cue: 'Download the handoff. It includes the evidence generated in this browser session and distinguishes checks from assumptions.', kind: 'handoff' },
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
