export const schemaGet = (sortPattern) => {
  return {
    sort: {type: 'string', min: 3, max: 255, sortPattern, patternFlags: 'g', optional: true},
    filter: {type: 'string', min: 1, max: 1000, optional: true},
    size: {type: 'number', positive: true, integer: true, optional: true, convert: true},
    page: {type: 'number', positive: true, integer: true, optional: true, convert: true},
  };
};
