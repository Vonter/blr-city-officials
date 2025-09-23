import { cityConfig } from '../../configs/config';
import type { DepartmentConfig } from '../../configs/types';
import type { ILayer } from '../../configs/types';

type ILayers = {
  [key in string]: ILayer;
};

// Helper function to create default contacts from department config
function createDefaultContacts(dept: DepartmentConfig): Array<{
  type: 'phone' | 'email' | 'whatsapp';
  labelKey: string;
  value: string;
}> {
  return dept.contacts.map(contact => ({
    type: contact.type,
    labelKey: contact.labelKey,
    value: contact.value
  }));
}

// Helper function to generate layers from city configuration
function generateLayers(): ILayers {
  const generatedLayers: ILayers = {};

  Object.entries(cityConfig.departments).forEach(([key, dept]) => {
    generatedLayers[key] = {
      nameKey: dept.nameKey,
      description: '',
      description_url: '',
      icon: dept.icon,
      formatUrl: () => dept.websiteUrl,
      geodata_url: dept.geodataUrl,
      defaultOfficials: [],
      defaultContacts: createDefaultContacts(dept)
    };
  });

  return generatedLayers;
}

// Generate layers from city configuration
export const layers: ILayers = generateLayers();