export interface CityConfig {
  cityId: string;
  pageTitleKey: string;
  supportedLanguages: Array<{
    code: string;
    nameKey: string;
  }>;
  map: {
    defaultZoom: number;
    defaultCenter: [number, number];
  };
  seo: {
    title: string;
    description: string;
    keywords: string;
    author: string;
    baseUrl: string;
    image: string;
  };
  googleSheet: {
    id: string;
    gid: string;
  };
  departments: {
    [key: string]: DepartmentConfig;
  };
}

export interface LocaleStrings {
  search_placeholder: string;
  footer_data: string;
  footer_code: string;
  footer_betanyc: string;
  introduction: string;
  filter_placeholder: string;
  details_title: string;
  details_source: string;
  details_error: string;
  details_google_sheet: string;
  details_add_comment: string;
  information_source_url: string;
  information_last_updated: string;
  fetching_location_details: string;
  no_officials: string;
  [key: string]: string; // Allow additional string properties for svelte-i18n compatibility
}

export interface DepartmentConfig {
  nameKey: string;
  icon: string;
  websiteUrl: string;
  geodataUrl: string;
  contacts: Contact[];
}

export interface Contact {
  type: 'phone' | 'email' | 'whatsapp';
  labelKey: string;
  value: string;
}

export interface ILayer {
  nameKey: string;
  description: string;
  description_url: string;
  icon: string;
  formatUrl: (name: string) => string;
  geodata_url: string;
  defaultOfficials: any[];
  defaultContacts: Contact[];
}
