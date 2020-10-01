const queryMapper = (map, src) => {
  if (!map || typeof map !== 'object' || Object.keys(map).length === 0)
    throw new Error('queryMapper: mapper must be object and must have at least one key value pair.');

  if (typeof src !== 'object') return {};

  return Object.keys(src || {}).reduce((prev, key) => {
    if (map[key])
      prev[map[key]] = src[key];

    return prev;
  }, {});
};

module.exports = queryMapper;