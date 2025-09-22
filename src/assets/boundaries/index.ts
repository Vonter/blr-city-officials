export type BoundaryId =
  | 'gba_corporation'
  | 'gba_zone'
  | 'bbmp_zone'
  | 'bbmp_wards'
  | 'bbmp_wards_old'
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

  /** Succinct definition of what this boundary represents. */
  description: string;

  /** Optional 'learn more' link for the description. */
  description_url?: string;

  /** Icon to display */
  icon: string;

  /** Url to link to for more info */
  formatUrl?: (name: string) => string;

  /** Url source of the GIS data */
  geodata_url: string;

  /** Default officials for the boundary */
  defaultOfficials?: Array<{
    titleEn: string;
    titleKn: string;
    nameEn: string;
    nameKn: string;
    messageEn: string;
    messageKn: string;
  }>;

  /** Default contacts for the boundary */
  defaultContacts?: Array<{
    type: 'phone' | 'email' | 'whatsapp';
    label: string;
    labelKn: string;
    value: string;
  }>;
}

type ILayers = {
  [key in string]: ILayer;
};

export const layers: ILayers = {
  gba_corporation: {
    name: 'GBA Corporation',
    name_kn: 'ಜಿಬಿಎ ಕಾರ್ಪೊರೇಷನ್',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/home',
    geodata_url:
      'https://data.opencity.in/dataset/greater-bengaluru-authority-corporations-delimitation-2025/resource/greater-bengaluru-authority-five-corporations-map---september-2025',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1533'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919480685700'
      },
      {
        type: 'whatsapp',
        label: 'Garbage/Solid Waste',
        labelKn: 'ಕಸ/ಘನತ್ಯಾಜ್ಯ',
        value: '919448197197'
      },
      {
        type: 'phone',
        label: 'Other',
        labelKn: 'ಇತರೆ',
        value: '+9108022660000'
      },
      {
        type: 'phone',
        label: 'Other',
        labelKn: 'ಇತರೆ',
        value: '+9108022975595'
      },
      {
        type: 'phone',
        label: 'Other',
        labelKn: 'ಇತರೆ',
        value: '+9108022221188'
      }
    ]
  },
  gba_zone: {
    name: 'GBA Zone',
    name_kn: 'ಜಿಬಿಎ ವಲಯ',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/home',
    geodata_url:
      'https://data.opencity.in/dataset/greater-bengaluru-authority-corporations-delimitation-2025/resource/gba-zones-2025',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1533'
      }
    ]
  },
  bbmp_wards_old: {
    name: 'BBMP Ward (Old)',
    name_kn: 'ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್ (ಹಳೆ)',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/',
    geodata_url:
      'https://data.opencity.in/dataset/bbmp-ward-information/resource/bbmp-ward-map---2015',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1533'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919480685700'
      },
      {
        type: 'email',
        label: 'Email',
        labelKn: 'ಇಮೇಲ್',
        value: 'comm@bbmp.gov.in'
      }
    ]
  },
  bescom_division: {
    name: 'BESCOM Division',
    name_kn: 'ಬೆಸ್ಕಾಂ ವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name =>
      'https://bescom.karnataka.gov.in/new-page/Contact%20Us/en',
    geodata_url:
      'https://data.opencity.in/dataset/bescom-boundary-maps/resource/bescom-division-boundary-map',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1912'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919449844640'
      },
      {
        type: 'email',
        label: 'Email',
        labelKn: 'ಇಮೇಲ್',
        value: 'helpline@bescom.co.in'
      }
    ]
  },
  bescom_subdivision: {
    name: 'BESCOM Subdivision',
    name_kn: 'ಬೆಸ್ಕಾಂ ಉಪವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💡',
    formatUrl: name =>
      'https://bescom.karnataka.gov.in/new-page/Contact%20Us/en',
    geodata_url:
      'https://data.opencity.in/dataset/bescom-boundary-maps/resource/map-of-subdivision-boundaries-of-bescom',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1912'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919449844640'
      },
      {
        type: 'email',
        label: 'Email',
        labelKn: 'ಇಮೇಲ್',
        value: 'helpline@bescom.co.in'
      }
    ]
  },
  bwssb_division: {
    name: 'BWSSB Division',
    name_kn: 'ಬಿಡಬ್ಲ್ಯುಎಸ್ಎಸ್ಬಿ ವಿಭಾಗ',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name =>
      'https://bwssb.karnataka.gov.in/page/Contact+Us/Service+Station/en',
    geodata_url:
      'https://data.opencity.in/dataset/bwssb-boundary-maps/resource/bwssb-division-boundary-maps',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1916'
      },
      {
        type: 'phone',
        label: 'Septic Tanks/Sewers',
        labelKn: 'ಸೀಪ್ಟಿಕ್ ಟಾಂಕ್ಸ್/ಸೀವರ್ಸ್',
        value: '14420'
      },
      {
        type: 'phone',
        label: 'Water Supply',
        labelKn: 'ಜಲವಾಣಿ',
        value: '08022238888'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '918762228888'
      },
      {
        type: 'email',
        label: 'Complaints',
        labelKn: 'ಸಮಸ್ಯೆಗಳು',
        value: 'callcenter@bwssb.gov.in'
      },
      {
        type: 'email',
        label: 'Public Relations Officer',
        labelKn: 'ಪ್ರಜಾತಿಕ ಸಂಬಂಧ ಅಧಿಕಾರಿ',
        value: 'pro@bwssb.gov.in'
      }
    ]
  },
  bwssb_service_station: {
    name: 'BWSSB Service Station',
    name_kn: 'ಬಿಡಬ್ಲ್ಯುಎಸ್ಎಸ್ಬಿ ಸೇವಾ ಕೇಂದ್ರ',
    description: '',
    description_url: '',
    icon: '💧',
    formatUrl: name =>
      'https://bwssb.karnataka.gov.in/page/Contact+Us/Service+Station/en',
    geodata_url:
      'https://data.opencity.in/dataset/bwssb-boundary-maps/resource/bwssb-service-station-division-boundaries-map',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1916'
      },
      {
        type: 'phone',
        label: 'Septic Tanks/Sewers',
        labelKn: 'ಸೀಪ್ಟಿಕ್ ಟಾಂಕ್ಸ್/ಸೀವರ್ಸ್',
        value: '14420'
      },
      {
        type: 'phone',
        label: 'Water Supply',
        labelKn: 'ಜಲವಾಣಿ',
        value: '08022238888'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '918762228888'
      },
      {
        type: 'email',
        label: 'Complaints',
        labelKn: 'ಸಮಸ್ಯೆಗಳು',
        value: 'callcenter@bwssb.gov.in'
      },
      {
        type: 'email',
        label: 'Public Relations Officer',
        labelKn: 'ಪ್ರಜಾತಿಕ ಸಂಬಂಧ ಅಧಿಕಾರಿ',
        value: 'pro@bwssb.gov.in'
      }
    ]
  },
  police_city: {
    name: 'City Police',
    name_kn: 'ನಗರ ಪೊಲೀಸ್',
    description: '',
    description_url: '',
    icon: '👮',
    formatUrl: name => 'https://bcp.karnataka.gov.in/24/law-&-order-/en',
    geodata_url:
      'https://data.opencity.in/dataset/police-jurisdiction-maps-for-major-cities-of-india/resource/bengaluru-police-jurisdictions-map',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '112'
      }
    ]
  },
  police_traffic: {
    name: 'Traffic Police',
    name_kn: 'ಟ್ರಾಫಿಕ್ ಪೊಲೀಸ್',
    description: '',
    description_url: '',
    icon: '🚔',
    formatUrl: name => 'https://btp.gov.in/Contactus.aspx',
    geodata_url:
      'https://data.opencity.in/dataset/bengaluru-traffic-police-jurisdictions',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '112'
      }
    ]
  },
  admin_district: {
    name: 'District',
    name_kn: 'ಜಿಲ್ಲೆ',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/',
    geodata_url: 'https://kgis.ksrsac.in/kgis/downloads.aspx',
    defaultOfficials: [],
    defaultContacts: []
  },
  admin_taluk: {
    name: 'Taluk',
    name_kn: 'ತಾಲ್ಲೂಕು',
    description: '',
    description_url: '',
    icon: '🏦',
    formatUrl: name => 'https://karnataka.gov.in/',
    geodata_url: 'https://kgis.ksrsac.in/kgis/downloads.aspx',
    defaultOfficials: [],
    defaultContacts: []
  },
  election_pc: {
    name: 'Lok Sabha',
    name_kn: 'ಲೋಕಸಭಾ',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://sansad.in/ls/',
    geodata_url: 'https://kgis.ksrsac.in/kgis/downloads.aspx',
    defaultOfficials: [],
    defaultContacts: []
  },
  election_ac: {
    name: 'State Assembly',
    name_kn: 'ರಾಜ್ಯ ವಿಧಾನಸಭೆ',
    description: '',
    description_url: '',
    icon: '🗳',
    formatUrl: name => 'https://kla.kar.nic.in/',
    geodata_url: 'https://kgis.ksrsac.in/kgis/downloads.aspx',
    defaultOfficials: [],
    defaultContacts: []
  },
  stamps_dro: {
    name: 'DRO',
    name_kn: 'ಡಿಆರ್ಒ',
    description: '',
    description_url: '',
    icon: '📝',
    formatUrl: name =>
      'https://igr.karnataka.gov.in/page/Contact+Us/District+Registrar+Officers/en',
    geodata_url:
      'https://data.opencity.in/dataset/karnataka-and-bengaluru-stamps-and-duties-registrar-offices-maps/resource/karnataka-dro-jurisdictions-map',
    defaultOfficials: [],
    defaultContacts: []
  },
  stamps_sro: {
    name: 'SRO',
    name_kn: 'ಎಸ್ಆರ್ಒ',
    description: '',
    description_url: '',
    icon: '📝',
    formatUrl: name =>
      'https://igr.karnataka.gov.in/page/Contact+Us/Sub+Registrars/en',
    geodata_url:
      'https://data.opencity.in/dataset/karnataka-and-bengaluru-stamps-and-duties-registrar-offices-maps/resource/karnataka-sub-registrar-office-jurisdictions-map',
    defaultOfficials: [],
    defaultContacts: []
  },
  pincode: {
    name: 'Pin Code',
    name_kn: 'ಪಿನ್ ಕೋಡ್',
    description: '',
    description_url: '',
    icon: '📮',
    formatUrl: name =>
      'https://www.indiapost.gov.in/sites/PostalCircles/Karnataka/Pages/cpio.aspx',
    geodata_url: 'https://github.com/justinelliotmeyers/INDIA_PINCODES',
    defaultOfficials: [],
    defaultContacts: []
  },
  bbmp_zone: {
    name: 'BBMP Zone',
    name_kn: 'ಬಿಬಿಎಂಪಿ ವಲಯ',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://site.bbmp.gov.in/zonewiseofficers.html',
    geodata_url:
      'https://data.opencity.in/dataset/bbmp-wards-delimitation-2023/resource/bbmp-final-wards-map---2023',
    defaultOfficials: [],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1533'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919480685700'
      },
      {
        type: 'whatsapp',
        label: 'Garbage/Solid Waste',
        labelKn: 'ಕಸ/ಘನತ್ಯಾಜ್ಯ',
        value: '919448197197'
      },
      {
        type: 'email',
        label: 'Email',
        labelKn: 'ಇಮೇಲ್',
        value: 'comm@bbmp.gov.in'
      }
    ]
  },
  bbmp_wards: {
    name: 'BBMP Ward',
    name_kn: 'ಬಿಬಿಎಂಪಿ ವಾರ್ಡ್',
    description: '',
    description_url: '',
    icon: '🏤',
    formatUrl: name => 'https://bbmp.gov.in/',
    geodata_url:
      'https://data.opencity.in/dataset/bbmp-ward-information/resource/bbmp-zone-boundaries---2022',
    defaultOfficials: [
      {
        titleEn: 'Corporator',
        titleKn: 'ಕಾರ್ಪೊರೇಟರ್',
        nameEn: 'N/A',
        nameKn: 'ಯಾರೂ ಇಲ್ಲ',
        messageEn: 'No elected corporator since 2020.',
        messageKn: '2020 ರಿಂದ ಯಾವುದೇ ಚುನಾಯಿತ ಕಾರ್ಪೊರೇಟರ್ ಇಲ್ಲ.'
      }
    ],
    defaultContacts: [
      {
        type: 'phone',
        label: 'Helpline',
        labelKn: 'ಸಹಾಯ ಸಂಪರ್ಕ',
        value: '1533'
      },
      {
        type: 'whatsapp',
        label: 'WhatsApp',
        labelKn: 'ವಾಟ್ಸ್ಅಪ್',
        value: '919480685700'
      },
      {
        type: 'whatsapp',
        label: 'Garbage/Solid Waste',
        labelKn: 'ಕಸ/ಘನತ್ಯಾಜ್ಯ',
        value: '919448197197'
      },
      {
        type: 'email',
        label: 'Email',
        labelKn: 'ಇಮೇಲ್',
        value: 'comm@bbmp.gov.in'
      }
    ]
  }
};
