<!-- SEO.svelte -->
<script lang="ts">
  import { cityConfig } from '../configs/config';

  interface Props {
    title?: string;
    description?: string;
    keywords?: string;
    author?: string;
    image?: string;
    imageWidth?: number;
    imageHeight?: number;
    url?: string;
    type?: string;
  }

  let {
    title = cityConfig.seo.title,
    description = cityConfig.seo.description,
    keywords = cityConfig.seo.keywords,
    author = cityConfig.seo.author,
    image = cityConfig.seo.image,
    imageWidth = 1200,
    imageHeight = 630,
    url = cityConfig.seo.baseUrl,
    type = 'website'
  }: Props = $props();
</script>

<svelte:head>
  <!-- Favicon -->
  <link rel="icon" href="/favicon.png" sizes="32x32" />
  <link rel="apple-touch-icon" href="/apple-touch-icon.png" />

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
  <meta property="og:image:width" content={String(imageWidth)} />
  <meta property="og:image:height" content={String(imageHeight)} />
  <meta property="og:image:type" content="image/jpeg" />
  <meta property="og:image:alt" content={description} />
  <meta property="og:url" content={url} />
  <meta property="og:type" content={type} />
  <meta property="og:locale" content="en_IN" />

  <!-- Twitter Card Tags -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={title} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={image} />
  <meta name="twitter:image:alt" content={description} />

  <!-- Additional Meta Tags -->
  <meta name="language" content="English" />
  <meta name="revisit-after" content="7 days" />
  <meta name="distribution" content="global" />
  <meta http-equiv="content-type" content="text/html; charset=utf-8" />
  <meta name="mobile-web-app-capable" content="yes" />
</svelte:head>
