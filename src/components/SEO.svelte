<!-- SEO.svelte -->
<script lang="ts">
  export let title = 'BLR City Officials';
  export let description =
    'Find your local jurisdiction and officials from GBA, BBMP, BESCOM, BWSSB, Police and more.';
  export let keywords =
    'blr,bangalore,bengaluru,boundaries,gba,bbmp,bescom,bwssb,bda,bmrda,btp,official,officers';
  export let author = 'Vivek Matthew';
  export let image = 'https://cityofficials.bengawalk.com/sharecard.jpg';
  export let url = 'https://cityofficials.bengawalk.com';
  export let type = 'website';
</script>

<svelte:head>
  <!-- Favicon -->
  <link rel="icon" href="/favicon.png" />

  <!-- Basic Meta Tags -->
  <title>{title}</title>
  <meta name="description" content={description} />
  <meta name="keywords" content={keywords} />
  <meta name="author" content={author} />
  <meta name="robots" content="index, follow" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />

  <!-- Canonical URL -->
  <link rel="canonical" href={url} />

  <!-- Open Graph Tags -->
  <meta property="og:title" content={title} />
  <meta property="og:site_name" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={image} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />

  <!-- Additional Meta Tags -->
  <meta name="language" content="English" />
  <meta name="revisit-after" content="7 days" />
  <meta name="distribution" content="global" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="mobile-web-app-capable" content="yes" />
</svelte:head>
