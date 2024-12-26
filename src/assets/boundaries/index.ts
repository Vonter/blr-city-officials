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
  | 'stamps_dro'
  | 'stamps_sro'
  | 'pincode';

export interface ILayer {
  /** Human-readable name, e.g. "Community District" */
  name: string;

  /** Human-readable name in Kannada, e.g. "ಸಮುದಾಯ ಜಿಲ್ಲೆ" */
  name_kn: string;

  /** Human-readable name, plural, e.g. "Community Districts" */
  name_long: string;

  /** Human-readable name, plural in Kannada, e.g. "ಸಮುದಾಯ ಜಿಲ್ಲೆಗಳು" */
  name_long_kn: string;

  /** Succinct definition of what this boundary represents. */
  description: string;

  /** Optional 'learn more' link for the description. */
  description_url?: string;

  /** Icon to display */
  icon: string;

  /** Url to link to for more info */
  formatUrl?: (name: string) => string;
}

type ILayers = {
  [key in string]: ILayer;
};

export const layers: ILayers = {
  bbmp_zone: {
    name: 'Zone',
    name_kn: 'ವಲಯ',
    name_long: 'BBMP Zone',
    name_long_kn: 'ಬಿಬಿಎಂಪಿ ವಲಯ',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://site.bbmp.gov.in/zonewiseofficers.html'
  },
  bbmp_wards: {
    name: 'Ward',
    name_kn: 'ವಾರ್ಡ್',
    name_long: 'BBMP Ward',
    name_long_kn: 'ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/'
  },
  bescom_division: {
    name: 'Division',
    name_kn: 'ವಿಭಾಗ',
    name_long: 'BESCOM Division',
    name_long_kn: 'ಬೆಸ್ಕಾಂ ವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name =>
      'https://bescom.karnataka.gov.in/new-page/Contact%20Us/en'
  },
  bescom_subdivision: {
    name: 'Subdivision',
    name_kn: 'ಉಪವಿಭಾಗ',
    name_long: 'BESCOM Subdivision',
    name_long_kn: 'ಬೆಸ್ಕಾಂ ಉಪವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name =>
      'https://bescom.karnataka.gov.in/new-page/Contact%20Us/en'
  },
  bwssb_division: {
    name: 'Division',
    name_kn: 'ವಿಭಾಗ',
    name_long: 'BWSSB Division',
    name_long_kn: 'ಬಿಡಬ್ಲ್ಯುಎಸ್ಎಸ್ಬಿ ವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name =>
      'https://bwssb.karnataka.gov.in/page/Contact+Us/Service+Station/en'
  },
  bwssb_service_station: {
    name: 'Service Station',
    name_kn: 'ಸೇವಾ ಕೇಂದ್ರ',
    name_long: 'BWSSB Service Station',
    name_long_kn: 'ಬಿಡಬ್ಲ್ಯುಎಸ್ಎಸ್ಬಿ ಸೇವಾ ಕೇಂದ್ರ',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name =>
      'https://bwssb.karnataka.gov.in/page/Contact+Us/Service+Station/en'
  },
  police_city: {
    name: 'City Police',
    name_kn: 'ನಗರ ಪೊಲೀಸ್',
    name_long: 'City Police',
    name_long_kn: 'ನಗರ ಪೊಲೀಸ್',
    description: '',
    description_url: '',
    icon: '👮',
    formatUrl: name => 'https://bcp.karnataka.gov.in/24/law-&-order-/en'
  },
  police_traffic: {
    name: 'Traffic Police',
    name_kn: 'ಟ್ರಾಫಿಕ್ ಪೊಲೀಸ್',
    name_long: 'Traffic Police',
    name_long_kn: 'ಟ್ರಾಫಿಕ್ ಪೊಲೀಸ್',
    description: '',
    description_url: '',
    icon: '🚔',
    formatUrl: name => 'https://btp.gov.in/Contactus.aspx'
  },

  admin_district: {
    name: 'District',
    name_kn: 'ಜಿಲ್ಲೆ',
    name_long: 'District',
    name_long_kn: 'ಜಿಲ್ಲೆ',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/'
  },
  admin_taluk: {
    name: 'Taluk',
    name_kn: 'ತಾಲ್ಲೂಕು',
    name_long: 'Taluk',
    name_long_kn: 'ತಾಲ್ಲೂಕು',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/'
  },
  election_pc: {
    name: 'Lok Sabha',
    name_kn: 'ಲೋಕಸಭಾ',
    name_long: 'Lok Sabha',
    name_long_kn: 'ಲೋಕಸಭಾ',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://sansad.in/ls/'
  },
  election_ac: {
    name: 'State Assembly',
    name_kn: 'ರಾಜ್ಯ ವಿಧಾನಸಭೆ',
    name_long: 'State Assembly',
    name_long_kn: 'ರಾಜ್ಯ ವಿಧಾನಸಭೆ',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://kla.kar.nic.in/'
  },
  stamps_dro: {
    name: 'DRO',
    name_kn: 'ಡಿಆರ್ಒ',
    name_long: 'DRO',
    name_long_kn: 'ಡಿಆರ್ಒ',
    description: '',
    description_url: '',
    icon: '📝',
    formatUrl: name =>
      'https://igr.karnataka.gov.in/page/Contact+Us/District+Registrar+Officers/en'
  },
  stamps_sro: {
    name: 'SRO',
    name_kn: 'ಎಸ್ಆರ್ಒ',
    name_long: 'SRO',
    name_long_kn: 'ಎಸ್ಆರ್ಒ',
    description: '',
    description_url: '',
    icon: '📝',
    formatUrl: name =>
      'https://igr.karnataka.gov.in/page/Contact+Us/Sub+Registrars/en'
  },
  pincode: {
    name: 'Pin Code',
    name_kn: 'ಪಿನ್ ಕೋಡ್',
    name_long: 'Pin Code',
    name_long_kn: 'ಪಿನ್ ಕೋಡ್',
    description: '',
    description_url: '',
    icon: '📮',
    formatUrl: name =>
      'https://www.indiapost.gov.in/sites/PostalCircles/Karnataka/Pages/cpio.aspx'
  }
};
