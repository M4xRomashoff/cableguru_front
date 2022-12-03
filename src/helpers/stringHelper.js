export const formatPhone = (string) => string?.replace?.(/[\s()_-]/g, '').trim();

export const removeMaskSymbols = (phone) => phone?.replace?.('+7', '')
  .replace('(', '')
  .replace(')', '')
  .replaceAll('_', '')
  .replaceAll('-', '');

const stringWithLabel = (string, label = '') => (string ? `${label}${string} ` : '');

export const formatAddressString = (address = {}) => stringWithLabel(address?.region, 'Регион ')
  + stringWithLabel(address?.district, 'район ')
  + stringWithLabel(address?.city, 'поселение ')
  + stringWithLabel(address?.street, 'ул. ')
  + stringWithLabel(address?.house, 'дом ');

export const getFullName = ({
  last_name,
  first_name,
  middle_name,
}) => `${stringWithLabel(last_name)}${stringWithLabel(first_name)}${stringWithLabel(middle_name)}`;
