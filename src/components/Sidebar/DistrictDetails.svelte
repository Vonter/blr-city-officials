<script lang="ts">
  import { _ as _store, locale as localeStore } from 'svelte-i18n';
  import { fromStore } from 'svelte/store';

  import { layers } from '../../assets/boundaries';
  import SidebarHeader from './SidebarHeader.svelte';
  import DepartmentDetails from './DepartmentDetails.svelte';
  import OfficialCard from './OfficialCard.svelte';
  import Icon from '../Icon.svelte';
  import {
    selectedBoundaryMap as selectedBoundaryMapStore,
    selectedDistrict as selectedDistrictStore,
    selectedCoordinates as selectedCoordinatesStore,
    mapStore as mapStoreStore,
    allBoundaries as allBoundariesStore,
    officeMarker as officeMarkerStore,
    officialsData as officialsDataStore
  } from '../../stores';
  import { getOfficeLocation, resetZoom } from '../../helpers/helpers';
  import { getLocalizedDistrictName } from '../../helpers/districtDisplay';
  import {
    resolveHierarchy,
    type HierarchyLevel
  } from '../../helpers/hierarchy';
  import {
    CONTACT_LINK_CLASS,
    getExtraContacts
  } from '../../helpers/contactHelpers';
  import maplibregl from 'maplibre-gl';
  import { untrack } from 'svelte';

  import Loader from '../Loader.svelte';
  import HierarchyBreadcrumb from './HierarchyBreadcrumb.svelte';
  import ShareButton from '../ShareButton.svelte';

  const t = fromStore(_store);
  const locale = fromStore(localeStore);
  const selectedBoundaryMap = fromStore(selectedBoundaryMapStore);
  const selectedDistrict = fromStore(selectedDistrictStore);
  const selectedCoordinates = fromStore(selectedCoordinatesStore);
  const mapState = fromStore(mapStoreStore);
  const allBoundaries = fromStore(allBoundariesStore);
  const officeMarker = fromStore(officeMarkerStore);
  const officialsData = fromStore(officialsDataStore);

  function getDistrictTitle(
    boundaryId: string | null,
    districtId: string | null
  ) {
    if (boundaryId && districtId && layers[boundaryId]) {
      const displayWithNumber = getLocalizedDistrictName(
        boundaryId,
        districtId,
        officialsData.current,
        locale.current
      );

      return `${layers[boundaryId].icon} \u00A0 ${t.current(layers[boundaryId].nameKey)} ${displayWithNumber}`;
    }

    return 'Unknown District';
  }

  function handleBack() {
    selectedDistrictStore.set(null);
    if (selectedCoordinates.current) {
      selectedBoundaryMapStore.set(null);
    }
    if (officeMarker.current) {
      officeMarker.current.remove();
      officeMarker.current = undefined as any;
    }
    if (mapState.current) {
      resetZoom(mapState.current);
    }
  }

  function isVisibleOfficial(official: any): boolean {
    return !!(
      official.Phone ||
      official['E-Mail'] ||
      official.WhatsApp ||
      (official.Name && official.Name !== '-')
    );
  }

  let hierarchyLevels: HierarchyLevel[] = $state([]);
  let isLoadingOfficials = $state(false);

  $effect(() => {
    if (!selectedBoundaryMap.current || !selectedDistrict.current) {
      hierarchyLevels = [];
      return;
    }

    const officials = officialsData.current;
    if (officials.length === 0) {
      isLoadingOfficials = true;
      return;
    }

    isLoadingOfficials = true;
    hierarchyLevels = resolveHierarchy(
      selectedBoundaryMap.current,
      selectedDistrict.current,
      officials,
      allBoundaries.current
    );
    isLoadingOfficials = false;
  });

  const currentOfficials = $derived(
    hierarchyLevels.length > 0 && hierarchyLevels[0]
      ? hierarchyLevels[0].officials
      : []
  );

  const shownContactsByLevel = $derived.by(() => {
    const result: Set<string>[] = [];
    const cumulative = new Set<string>();
    for (const level of hierarchyLevels) {
      result.push(new Set(cumulative));
      const contacts = layers[level.deptKey]?.defaultContacts || [];
      for (const c of contacts) {
        cumulative.add(c.value);
      }
    }
    return result;
  });

  function levelHasContent(level: HierarchyLevel, levelIndex: number): boolean {
    const config = layers[level.deptKey] || ({} as any);
    const shownValues = shownContactsByLevel[levelIndex] || new Set<string>();
    const deptContacts =
      config.defaultContacts?.filter((c: any) => !shownValues.has(c.value)) ||
      [];
    const socialContacts = getExtraContacts(
      level.officials,
      layers[level.deptKey]?.showWebsite
    );
    const hasContacts = deptContacts.length > 0 || socialContacts.length > 0;
    const hasOfficials = level.officials.filter(isVisibleOfficial).length > 0;
    const hasDefaultOfficials =
      config.defaultOfficials && config.defaultOfficials.length > 0;
    const hasOfficeLocation =
      levelIndex === 0 &&
      !!getOfficeLocation(level.deptKey, level.areaName, officialsData.current);
    return (
      hasContacts || hasOfficials || hasDefaultOfficials || hasOfficeLocation
    );
  }

  $effect(() => {
    const map = mapState.current;
    const boundaryId = selectedBoundaryMap.current;
    const districtId = selectedDistrict.current;
    const officials = officialsData.current;

    untrack(() => {
      if (officeMarker.current) {
        officeMarker.current.remove();
        officeMarker.current = undefined as any;
      }
    });

    if (!map || !boundaryId || !districtId) return;

    const office = getOfficeLocation(boundaryId, districtId, officials);
    if (!office) return;

    const icon = layers[boundaryId]?.icon || '';
    const el = document.createElement('div');
    el.style.fontSize = '24px';
    el.style.lineHeight = '1';
    el.style.cursor = 'pointer';
    el.textContent = icon;
    el.title = office.name;

    officeMarker.current = new maplibregl.Marker({ element: el })
      .setLngLat([office.lng, office.lat])
      .addTo(map);
  });
</script>

<SidebarHeader
  title={getDistrictTitle(
    selectedBoundaryMap.current,
    selectedDistrict.current
  )}
  onBack={handleBack}
>
  {#if currentOfficials.length > 0 && currentOfficials[0].Source}
    <a
      href={currentOfficials[0].Source}
      target="_blank"
      rel="noopener noreferrer"
      aria-label={t.current('details_source')}
      class="w-8 h-8 flex justify-center items-center rounded-full text-gray-500 hover:bg-gray-100 dark:hover:bg-white/20 hover:text-gray-800 dark:hover:text-gray-200 invisible"
    >
      <Icon name="external-link" class="h-5 w-5" />
    </a>
  {/if}
  <ShareButton />
</SidebarHeader>
{#if selectedBoundaryMap.current}
  <HierarchyBreadcrumb
    departmentKey={selectedBoundaryMap.current}
    districtName={selectedDistrict.current}
  />
{/if}
{#if selectedBoundaryMap.current && selectedDistrict.current}
  {#if isLoadingOfficials}
    <div class="py-2 dark:bg-neutral-900">
      <div class="px-4 text-gray-800 dark:text-gray-200">
        {t.current('fetching_location_details')}
        <Loader />
      </div>
    </div>
  {:else}
    {#each hierarchyLevels as level, levelIndex}
      {#if levelHasContent(level, levelIndex)}
        {#if levelIndex > 0}
          <div class="mx-4 my-2 flex items-center gap-3">
            <div
              class="flex-1 border-t border-gray-200 dark:border-neutral-700"
            ></div>
            <span
              class="text-xs font-medium text-gray-400 dark:text-gray-500 whitespace-nowrap"
            >
              {t.current(layers[level.deptKey]?.nameKey || '')} — {getLocalizedDistrictName(
                level.deptKey,
                level.areaName,
                officialsData.current,
                locale.current
              )}
            </span>
            <div
              class="flex-1 border-t border-gray-200 dark:border-neutral-700"
            ></div>
          </div>
        {/if}

        <div class="px-4 py-2">
          <DepartmentDetails
            department={level.deptKey}
            locale={locale.current}
            shownContactValues={shownContactsByLevel[levelIndex] || new Set()}
            officeLocation={levelIndex === 0
              ? getOfficeLocation(
                  level.deptKey,
                  level.areaName,
                  officialsData.current
                )
              : null}
            extraContacts={getExtraContacts(
              level.officials,
              layers[level.deptKey]?.showWebsite
            )}
          />

          {#if level.officials.filter(isVisibleOfficial).length > 0}
            <div class="grid gap-3 grid-cols-1">
              {#each level.officials.filter(isVisibleOfficial) as official}
                <OfficialCard {official} locale={locale.current} />
              {/each}
            </div>
          {/if}
        </div>
      {/if}
    {/each}

    {#if hierarchyLevels.length === 0 || (hierarchyLevels.length === 1 && hierarchyLevels[0] && hierarchyLevels[0].officials.length === 0 && !levelHasContent(hierarchyLevels[0], 0))}
      {#if selectedBoundaryMap.current && layers[selectedBoundaryMap.current]?.formatUrl}
        <div class="px-4 mt-2 pb-4">
          <DepartmentDetails
            department={selectedBoundaryMap.current}
            locale={locale.current}
          />
        </div>
      {/if}
    {/if}
  {/if}
{/if}
<div class="px-4 mt-4 pb-4">
  <div class="bg-white dark:bg-neutral-900 p-4">
    <div class="flex flex-col gap-4 items-center text-center">
      <p class="text-sm text-gray-600 dark:text-gray-400">
        {t.current('details_error')}
      </p>
      <a
        href="https://forms.gle/6rBZHs21szmXvxBx8"
        target="_blank"
        rel="noopener noreferrer"
        class={CONTACT_LINK_CLASS}
      >
        <Icon name="edit" class="h-5 w-5 mr-2" />
        {t.current('details_add_comment')}
      </a>
    </div>
  </div>
</div>
