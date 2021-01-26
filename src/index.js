import { getCombinations } from './utils';

export const DIRECTIONS = ['top', 'right', 'bottom', 'left'];
export const COLOR_FUNCS = ['rgb', 'rgba'];

const CONFIG = {
  getModSelector(modName) {
    return `[data-is-${modName}]`;
  }
};
let CUSTOM_CONFIG = CONFIG;
const CUSTOM_CONFIGS = new Map;

/**
 * Provide custom config inside the callback.
 * @param {Object} config
 * @param {Function} callback
 */
export function withConfig(config, callback) {
  if (!CUSTOM_CONFIG.get(config)) {
    CUSTOM_CONFIG.set(config, Object.assign(CONFIG, config));
  }

  CUSTOM_CONFIG = CUSTOM_CONFIG.get(config);

  callback();

  CUSTOM_CONFIG = CONFIG;
}

/**
 * @typedef State
 * @property {String[]} mods
 * @property {String[]} [notMods]
 * @property {string} value
 */

/**
 *
 * @param {Object<String,String>} styleMap
 * @return {State[]}
 */
export function stateMapToList(styleMap) {
  return Object.entries(styleMap).reduce((list, [mods, value]) => {
    mods = mods.trim();

    if (mods) {
      mods.split(/[|,]/).forEach(mod => {
        list.push({
          mods: mod.trim().split(/[\s&]+/),
          value,
        });
      });
    } else {
      list.push({
        mods: [],
        value,
      });
    }

    return list;
  }, []);
}

/**
 * Fill all unspecified states and cover all possible combinations of presented modifiers.
 * @param {State[]} states
 * @return {State[]}
 */
export function normalizeStates(states) {
  let baseState;

  states.forEach(state => {
    if (!state.mods.length) {
      baseState = state;
    }

    state.mods.sort();
  });

  if (!baseState) {
    baseState = {
      mods: [],
      value: '',
    };

    states.unshift(baseState);
  }

  const allModsSet = new Set;

  states.forEach(state => state.mods.forEach(mod => allModsSet.add(mod)));

  const allMods = Array.from(allModsSet);

  const allCombinations = getCombinations(allMods).concat([]);

  allCombinations.forEach(comb => {
    comb.sort();

    const existState = states.find(state => state.mods.join() === comb.join());

    if (existState) return;

    states.push({
      mods: comb,
      notMods: [],
      value: baseState.value,
    });
  });

  states.forEach(state => {
    state.notMods = allMods.filter(mod => !state.mods.includes(mod));
  });

  return states;
}

/**
 * Extract all unique values from the list of state objects.
 * @param {State[]} states
 * @return {String[]}
 */
export function extractValuesFromStates(states) {
  const values = [];

  states.forEach(state => {
    if (!values.includes(state.value)) {
      values.push(state.value);
    }
  });

  return values;
}

/**
 * Replace state values with new ones.
 * For example, if you want to replace initial values with finite CSS code.
 * @param {State[]} states
 * @param {Object<String,String>} map
 */
export function replaceStateValues(states, map) {
  states.forEach(state => {
    state.value = map[state.value] || state.value;
  });

  return states;
}

/**
 * Compile states to finite CSS with selectors.
 * State values should contain a string value with CSS style list.
 * @param {String} selector
 * @param {State[]} states
 */
export function applyStates(selector, states) {
  const getModSelector = CUSTOM_CONFIG.getModSelector;

  return states.reduce((css, state) => {
    const modifiers = `${(state.mods || []).map(getModSelector).join('')}${(state.notMods || []).map(mod => `:not(${getModSelector(mod)})`).join('')}`;

    return `${css}${selector}${modifiers}{${state.value}}\n`;
  }, '');
}
