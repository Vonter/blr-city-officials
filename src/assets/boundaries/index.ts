import { format_default } from './format';

export type BoundaryId =
  | 'bbmp_zone'
  | 'bbmp_wards'
  | 'bescom_division'
  | 'bescom_subdivision'
  | 'bwssb_division'
  | 'bwssb_service_station'
  | 'police_city'
  | 'police_traffic'
  | 'admin_district'
  | 'admin_taluk'
  | 'election_pc'
  | 'election_ac'
  | 'pincode';

export interface ILayer {
  /** Human-readable name, e.g. "Community District" */
  name: string;

  /** Human-readable name, plural, e.g. "Community Districts" */
  name_long: string;

  /** Succinct definition of what this boundary represents. */
  description: string;

  /** Optional 'learn more' link for the description. */
  description_url?: string;

  /** Icon to display */
  icon: string;

  /** Url to link to for more info */
  formatUrl?: (name: string) => string;

  /** Formatted display name of district, e.g. transforms 101 to Manhattan - 1 */
  formatContent: (name: any) => string;

  /** Parent group for nested hierarchy */
  group?: string;
}

type ILayers = {
  [key in string]: ILayer;
};

export const layers: ILayers = {
  bbmp_zone: {
    name: 'Zone',
    name_long: 'BBMP Zone',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/',
    formatContent: name => name,
    group: 'BBMP'
  },
  bbmp_wards: {
    name: 'Ward',
    name_long: 'BBMP Ward',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/',
    formatContent: name => name,
    group: 'BBMP'
  },
  bescom_division: {
    name: 'Division',
    name_long: 'BESCOM Division',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name => 'https://bescom.co.in/',
    formatContent: name => name,
    group: 'BESCOM'
  },
  bescom_subdivision: {
    name: 'Subdivision',
    name_long: 'BESCOM Subdivision',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name => 'https://bescom.co.in/',
    formatContent: name => name,
    group: 'BESCOM'
  },
  bwssb_division: {
    name: 'Division',
    name_long: 'BWSSB Division',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name => 'https://bwssb.karnataka.gov.in/',
    formatContent: name => name,
    group: 'BWSSB'
  },
  bwssb_service_station: {
    name: 'Service Station',
    name_long: 'BWSSB Service Station',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name => 'https://bwssb.karnataka.gov.in/',
    formatContent: name => name,
    group: 'BWSSB'
  },
  police_city: {
    name: 'City Police',
    name_long: 'City Police',
    description: '',
    description_url: '',
    icon: '👮',
    formatUrl: name => 'https://bcp.karnataka.gov.in/',
    formatContent: name => name,
    group: 'Police'
  },
  police_traffic: {
    name: 'Traffic Police',
    name_long: 'Traffic Police',
    description: '',
    description_url: '',
    icon: '🚔',
    formatUrl: name => 'https://btp.gov.in/',
    formatContent: name => name,
    group: 'Police'
  },

  admin_district: {
    name: 'District',
    name_long: 'Districts',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/',
    formatContent: name => name,
    group: 'Administrative'
  },
  admin_taluk: {
    name: 'Taluk',
    name_long: 'Taluks',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/',
    formatContent: name => name,
    group: 'Administrative'
  },
  election_pc: {
    name: 'Lok Sabha',
    name_long: 'Lok Sabha',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://sansad.in/ls/',
    formatContent: name => name,
    group: 'Political'
  },
  election_ac: {
    name: 'State Assembly',
    name_long: 'State Assembly',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://kla.kar.nic.in/',
    formatContent: name => name,
    group: 'Political'
  },
  pincode: {
    name: 'PIN Code',
    name_long: 'Pin Codes',
    description: '',
    description_url: '',
    icon: '📮',
    formatUrl: name =>
      'https://www.indiapost.gov.in/sites/PostalCircles/Karnataka/Pages/cpio.aspx',
    formatContent: name => name,
    group: 'Other'
  }
};
