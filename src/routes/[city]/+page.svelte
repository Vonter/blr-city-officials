<script lang="ts">
  import CityPage from '../../components/CityPage.svelte';
  import type { PageData } from './$types';

  let { data }: { data: PageData } = $props();
</script>

<CityPage
  prefetchedDepartment={data.prefetchedDepartment}
  prefetchedDepartmentData={data.prefetchedDepartmentData}
  initialLocale={data.initialLocale}
/>
