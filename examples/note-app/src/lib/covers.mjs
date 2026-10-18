/** Local artwork selection. Note text never leaves the browser. */
export function coverFor(note) {
  const text = `${note.title} ${note.body}`;
  const walking = /\b(walk(?:s|ed|ing)?|travel(?:s|led|ling)?|trip|hike|hiking|weekend|wander(?:s|ing)?|journey|trail|holiday|vacation|voyage|balade|randonn[ée]e)\b/iu;
  return walking.test(text) ? '/illustrations/wandering-path.png' : '/illustrations/paper-boat.png';
}
