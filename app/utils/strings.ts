export const cleanId = (name: string): string => {
  const regex = /\s?\(\d+\)$/;
  return name.replace(regex, '');
};
