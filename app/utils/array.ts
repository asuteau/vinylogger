export const groupBy = <T>(iterable: Iterable<T>, fn: (item: T) => string | number) => {
  return [...iterable].reduce<Record<string, T[]>>((groups, curr) => {
    const key = fn(curr);
    const group = groups[key] ?? [];
    group.push(curr);
    return {...groups, [key]: group};
  }, {});
};
