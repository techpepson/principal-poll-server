import ShortUniqueId from 'short-unique-id';

export const generateId = () => {
  const uniqueId = new ShortUniqueId({ dictionary: 'number', length: 8 });
  return uniqueId.rnd();
};
