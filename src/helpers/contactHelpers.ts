import type { Contact } from '../configs/types';

export const CONTACT_LINK_CLASS =
  'inline-flex items-center px-3 py-1 text-sm rounded bg-gray-50 dark:bg-neutral-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-neutral-600 border border-gray-200 dark:border-neutral-600 transition-colors max-w-full';

export function getContactHref(contact: Contact): string {
  switch (contact.type) {
    case 'phone':
      return `tel:${contact.value}`;
    case 'email':
      return `mailto:${contact.value}`;
    case 'whatsapp':
      return `https://wa.me/${contact.value}`;
    case 'twitter':
      return `https://x.com/${contact.value}`;
    case 'facebook':
      return `https://facebook.com/${contact.value}`;
    case 'instagram':
      return `https://instagram.com/${contact.value}`;
    default:
      return '#';
  }
}

export function getContactIconName(type: string): string {
  if (type === 'whatsapp') return 'phone';
  return type;
}

export function isExternalContact(type: string): boolean {
  return ['twitter', 'facebook', 'instagram'].includes(type);
}

export function getContactDisplay(contact: Contact): string {
  if (isExternalContact(contact.type)) return `@${contact.value}`;
  return contact.value;
}
