/** Keep the current step outside the story or when two steps are equally visible. */
export function mostVisible(ratios, current = 0) {
  const maximum = Math.max(0, ...ratios);
  if (maximum <= 0 || ratios[current] === maximum) return current;
  return ratios.indexOf(maximum);
}
