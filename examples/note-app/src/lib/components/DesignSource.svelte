<script lang="ts">
  let { source = $bindable('generated'), access = $bindable('connected'), generation = $bindable('available') } = $props();
</script>

<div class="workflow-choices">
  <fieldset class="choice-options">
    <legend>Do you already have a design?</legend>
    <label><input type="radio" name="design-source" value="figma" bind:group={source} /> Existing Figma design</label>
    <label><input type="radio" name="design-source" value="generated" bind:group={source} /> Generate a design</label>
  </fieldset>
  {#if source === 'figma'}
    <label class="choice-select">Figma connection (MCP)
      <select bind:value={access}><option value="connected">Connected</option><option value="unavailable">Unavailable or no file access</option></select>
    </label>
    <p class="choice-outcome">{access === 'connected' ? 'Share the frame link. Check access, layout and assets.' : 'Connect Figma, or attach exported screens and assets. Agree on the reference.'}</p>
  {:else}
    <label class="choice-select">Image generation in this host
      <select bind:value={generation}><option value="available">Available</option><option value="external">Use another tool</option></select>
    </label>
    <p class="choice-outcome">{generation === 'available' ? 'Generate from the brief. Review and accept the image.' : 'Provide a prompt. Ask for the generated image, then review it together.'}</p>
    {#if generation === 'external'}
      <details class="choice-details"><summary>Example portable prompt</summary><p>Design desktop and mobile screens for a calm Markdown note app. Show a note list, editor, save status and failed-save recovery. Use navy, Baltic blue and light blue with readable type and illustrated covers. Use fictional notes. Keep accounts and sync outside scope.</p></details>
    {/if}
  {/if}
  <p class="choice-footnote">Example choices only. This demo uses a generated image; no tools run.</p>
</div>
