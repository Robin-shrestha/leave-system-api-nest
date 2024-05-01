export const interpolate = (
  str: string,
  params: Record<string, string | number>,
): string => {
  let url = str;

  Object.keys(params).forEach((key) => {
    url = url.replaceAll(`:${key}`, `${params[key]}`);
  });

  return url;
};

export const urlBuilder = (baseUrl: string, ...keys: string[]) => {
  return keys.reduce<string>((acc, curr) => {
    return acc.concat('/', curr);
  }, baseUrl);
};
