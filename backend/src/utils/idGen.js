
const counters = {};
const shortCounters = {};

const genId = (prefix, table) => {
  if (!counters[table]) counters[table] = 0;
  counters[table]++;
  return prefix.toUpperCase() + String(counters[table]).padStart(3, '0');
};

const genShortCode = (name, table) => {
  if (!name) return '';
  const words = name.trim().split(/\s+/);
  let base = words.length === 1
    ? words[0].slice(0, 2).toUpperCase()
    : words.map(w => w[0].toUpperCase()).join('').slice(0, 5);
  const key = table + '_' + base;
  if (!shortCounters[key]) shortCounters[key] = 0;
  shortCounters[key]++;
  return base + '-' + String(shortCounters[key]).padStart(3, '0');
};

const genCodeFromName = (name) => {
  if (!name) return '';
  return name.trim().toUpperCase().replace(/\s+/g, '_').replace(/[^A-Z0-9_]/g, '');
};

const genBenefitCode = () => {
  if (!counters['benefit_plans']) counters['benefit_plans'] = 0;
  counters['benefit_plans']++;
  return 'BP' + String(counters['benefit_plans']).padStart(3, '0');
};

const previewCode = (name) => {
  if (!name) return '';
  return genCodeFromName(name);
};

module.exports = { genId, genShortCode, genCodeFromName, genBenefitCode, previewCode };
