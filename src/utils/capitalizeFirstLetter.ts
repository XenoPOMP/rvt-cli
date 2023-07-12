export const capitalizeFirstLetter = (str: string) => {
  return `${str.at(0)?.toUpperCase()}${str.slice(1, str.length)}`;
};
