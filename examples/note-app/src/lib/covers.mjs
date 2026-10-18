/** Local artwork selection. Note text never leaves the browser. */
const themes = [
  { file: 'wandering-path', words: 'walk walks walked walking travel travels traveled travelled traveling travelling trip trips hike hikes hiking weekend weekends wander wandering journey journeys trail trails holiday holidays vacation vacations voyage voyages balade balades randonnee randonnees' },
  { file: 'reading-corner', words: 'book books reading read study studying learn learning library libraries literature course courses lecture lectures livre livres lire lecture apprentissage etude etudes' },
  { file: 'paper-ideas', words: 'idea ideas brainstorm brainstorming creative creativity inspiration imagine imagination sketch sketches drawing design designs ideation idee idees creativite dessin dessins' },
  { file: 'kitchen-table', words: 'recipe recipes cooking cook cooks bake baking bread soup dinner lunch breakfast kitchen ingredients meal meals recette recettes cuisine cuisiner pain soupe repas' },
].map(theme => ({ ...theme, keywords: new Set(theme.words.split(' ')) }));

function tokens(text) {
  return new Set(text.normalize('NFD').replace(/\p{M}/gu, '').toLowerCase().match(/\p{L}+/gu) ?? []);
}

function match(text) {
  const words = tokens(text);
  let best = null;
  let bestScore = 0;
  for (const theme of themes) {
    const score = [...words].filter(word => theme.keywords.has(word)).length;
    // A stable library order resolves ties; repetitions cannot dominate a theme.
    if (score > bestScore) { best = theme.file; bestScore = score; }
  }
  return best;
}

export function coverFor(note) {
  // A named subject in the title wins over incidental mentions in the body.
  const file = match(note.title) ?? match(note.body) ?? 'paper-boat';
  return `/illustrations/${file}.png`;
}
