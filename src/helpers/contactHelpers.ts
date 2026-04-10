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
    case 'website':
      return contact.value;
    default:
      return '#';
  }
}

export function getContactIconName(type: string): string {
  if (type === 'whatsapp') return 'phone';
  if (type === 'website') return 'external-link';
  return type;
}

export function isExternalContact(type: string): boolean {
  return ['twitter', 'facebook', 'instagram', 'website'].includes(type);
}

export function getContactDisplay(contact: Contact): string {
  if (contact.type === 'website') {
    try {
      return new URL(contact.value).hostname;
    } catch {
      return contact.value;
    }
  }
  if (isExternalContact(contact.type)) return `@${contact.value}`;
  return contact.value;
}

/** Derives extra contacts from officials data: Twitter handles (for officials with no other info)
 *  and, when enabled, a Website link when all officials share a single source URL. */
export function getExtraContacts(
  officials: any[],
  showWebsite = false
): Contact[] {
  const contacts: Contact[] = officials
    .filter(
      o => o.Twitter && !o.Phone && !o['E-Mail'] && (!o.Name || o.Name === '-')
    )
    .map(o => ({
      type: 'twitter' as const,
      labelKey: 'contact_twitter',
      value: o.Twitter.replace('https://x.com/', '')
    }));

  if (showWebsite) {
    const sources = [
      ...new Set<string>(officials.map(o => o.Source).filter(Boolean))
    ];
    if (sources.length === 1) {
      contacts.push({
        type: 'website' as const,
        labelKey: 'contact_website',
        value: sources[0]
      });
    }
  }

  return contacts;
}
