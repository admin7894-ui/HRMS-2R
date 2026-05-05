
const counters = {};
const shortCounters = {};
const { TABLE_PREFIXES } = require('../models');

const toIso = (value) => {
  if (!value) return null;
  const d = new Date(value);
  return Number.isNaN(d.getTime()) ? null : d.toISOString();
};

const displayIdRegex = (prefix) => new RegExp(`^${String(prefix).toUpperCase()}(\\d+)$`, 'i');

const extractDisplayNumber = (value, prefix) => {
  if (!value) return null;
  const match = String(value).trim().match(displayIdRegex(prefix));
  if (!match) return null;
  const n = Number.parseInt(match[1], 10);
  return Number.isFinite(n) ? n : null;
};

const getRecordSortValue = (record) =>
  toIso(record?.created_at) ||
  toIso(record?.effective_from) ||
  toIso(record?.updated_at) ||
  String(record?.id || '');

const getNextSequenceNumber = (records, prefix) => {
  let max = 0;
  for (const x of records || []) {
    const n = extractDisplayNumber(x?._displayId, prefix);
    if (n && n > max) max = n;
  }
  return max + 1;
};

const genId = (prefix, table) => {
  const normalizedPrefix = String(prefix || 'REC').toUpperCase();
  const { db } = require('../seed/store');
  const records = db?.[table] || [];
  const nextNumber = getNextSequenceNumber(records, normalizedPrefix);
  return normalizedPrefix + String(nextNumber).padStart(3, '0');
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

const backfillDisplayIds = (db) => {
  let changed = false;
  const tableEntries = Object.entries(TABLE_PREFIXES || {});

  for (const [table, prefix] of tableEntries) {
    const records = db?.[table];
    if (!Array.isArray(records) || records.length === 0) continue;

    const normalizedPrefix = String(prefix).toUpperCase();
    const sorted = [...records].sort((a, b) =>
      String(getRecordSortValue(a)).localeCompare(String(getRecordSortValue(b)))
    );

    const counts = new Map();
    let maxAssigned = 0;

    for (const rec of sorted) {
      const n = extractDisplayNumber(rec?._displayId, normalizedPrefix);
      if (!n) continue;
      counts.set(n, (counts.get(n) || 0) + 1);
      if (n > maxAssigned) maxAssigned = n;
    }

    for (const rec of sorted) {
      const n = extractDisplayNumber(rec?._displayId, normalizedPrefix);
      const isValidUnique = n && counts.get(n) === 1;
      if (isValidUnique) {
        continue;
      }

      maxAssigned += 1;
      rec._displayId = normalizedPrefix + String(maxAssigned).padStart(3, '0');
      changed = true;
    }
  }

  return changed;
};

module.exports = { genId, genShortCode, genCodeFromName, genBenefitCode, previewCode, backfillDisplayIds };
