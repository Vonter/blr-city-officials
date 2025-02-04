<script lang="ts">
  import { page } from '$app/stores';

  const GA_ID = import.meta.env.VITE_GOOGLE_ANALYTICS_ID;

  $: {
    if (typeof gtag !== 'undefined') {
      gtag('config', GA_ID, {
        page_title: document.title,
        page_path: $page.url.pathname
      });
    }
  }
</script>

<svelte:head>
  <script async src={`https://www.googletagmanager.com/gtag/js?id=${GA_ID}`}>
  </script>
  <script>
    window.dataLayer = window.dataLayer || [];

    function gtag() {
      dataLayer.push(arguments);
    }

    gtag('js', new Date());
    gtag('config', GA_ID);
  </script>
</svelte:head>
