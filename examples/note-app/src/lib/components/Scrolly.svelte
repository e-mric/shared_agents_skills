<script lang="ts">
  import { onMount, type Snippet } from 'svelte';
  import { mostVisible } from '../scrolly.mjs';

  // Svelte 5 implementation of the most-visible-step pattern in the user’s example:
  // https://svelte.dev/playground/e59b909384c04393af26be2eb7fa859e
  // That example credits Russell Goldenberg, Connor Rothschild and Sebastian Lammers.
  let { value = $bindable(0), top = 0, bottom = 0, increments = 100, disabled = false, children }: {
    value?: number;
    top?: number;
    bottom?: number;
    increments?: number;
    disabled?: boolean;
    children: Snippet;
  } = $props();
  let container: HTMLDivElement;
  let mounted = $state(false);
  onMount(() => { mounted = true; });

  $effect(() => {
    if (!mounted || disabled || !container) return;
    const nodes = Array.from(container.children);
    const ratios = nodes.map(() => 0);
    const count = Math.max(1, Math.floor(increments));
    const threshold = Array.from({ length: count + 1 }, (_, index) => index / count);
    const observer = new IntersectionObserver(entries => {
      if (disabled) return;
      for (const entry of entries) {
        const index = nodes.indexOf(entry.target);
        if (index !== -1) ratios[index] = entry.isIntersecting ? entry.intersectionRatio : 0;
      }
      value = mostVisible(ratios, value);
    }, { rootMargin: `-${Math.max(0, top)}px 0px -${Math.max(0, bottom)}px 0px`, threshold });
    nodes.forEach(node => observer.observe(node));
    return () => observer.disconnect();
  });
</script>

<div bind:this={container} class="scrolly-story">{@render children()}</div>
