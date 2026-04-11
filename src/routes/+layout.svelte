<script lang="ts">
  import '../app.css';
  import 'maplibre-gl/dist/maplibre-gl.css';
  import Analytics from '../components/Analytics.svelte';
  import SEO from '../components/SEO.svelte';
  import { page } from '$app/state';

  import type { Snippet } from 'svelte';

  let { children }: { children: Snippet } = $props();

  const hasAnalytics = Boolean(import.meta.env['VITE_GOOGLE_ANALYTICS_ID']);
</script>

{#if hasAnalytics}
  <Analytics />
{/if}
<SEO title={page.params['city'] ? undefined : 'City Officials'} />
{@render children()}
