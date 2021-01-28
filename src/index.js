import { getCombinations } from './utils';

export const DIRECTIONS = ['top', 'right', 'bottom', 'left'];
export const COLOR_FUNCS = ['rgb', 'rgba'];

const DEFAULT_CONFIG = {
  getModSelector(modName) {
    return `[data-is-${modName}]`;
  }
};
let CONFIG = DEFAULT_CONFIG;
const CUSTOM_CONFIGS = new Map;

/**
 * Provide custom config inside the callback.
 * @param {Object} config
 * @param {Function} callback
 */
export function withConfig(config, callback) {
  if (!CUSTOM_CONFIGS.get(config)) {
    CUSTOM_CONFIGS.set(config, Object.assign({}, DEFAULT_CONFIG, config));
  }

  CONFIG = CUSTOM_CONFIGS.get(config);

  callback();

  CONFIG = DEFAULT_CONFIG;
}

/**
 * An object that describes a relation between specific modifiers and style value.
 * @typedef StyleState
 * @property {string[]} mods
 * @property {string[]} [notMods]
 * @property {StyleValue} value
 */

/**
 * @typedef {StyleState[]} StyleStateList
 */

/**
 * @typedef {string|boolean|null|undefined} StyleValue
 */

/**
 * @typedef {Object.<string,StyleValue>} StyleMap
 */

/**
 * @typedef {Object.<string,StyleState>} StyleStateMap
 */

/**
 * @typedef {StyleStateMap[]} StyleStateMapList
 */

/**
 * @typedef {Object.<string,StyleStateList>} StyleStateListMap
 */

/**
 *
 * @param {StyleValue} styleValue
 * @return {StyleStateList}
 */
export function styleValueToStyleStateList(styleValue) {
  if (typeof styleValue !== 'object') {
    return [{
      mods: [],
      value: styleValue,
    }];
  }

  return Object.entries(styleValue).reduce((list, [mods, value]) => {
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
 * @param {StyleStateList} stateList
 * @param {string[]} [allModes]
 * @return {StyleStateList}
 */
export function normalizeStates(stateList, allModes) {
  let baseState;

  stateList.forEach(state => {
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

    stateList.unshift(baseState);
  }

  if (!allModes) {
    const allModesSet = new Set;

    stateList.forEach(state => state.mods.forEach(mod => allModesSet.add(mod)));

    allModes = Array.from(allModesSet);
  }

  const allCombinations = getCombinations(allModes).concat([]);

  allCombinations.forEach(comb => {
    comb.sort();

    const existState = stateList.find(state => state.mods.join() === comb.join());

    if (existState) return;

    stateList.push({
      mods: comb,
      notMods: [],
      value: baseState.value,
    });
  });

  stateList.forEach(state => {
    state.notMods = allModes.filter(mod => !state.mods.includes(mod));
  });

  return stateList;
}

/**
 * Replace state values with new ones.
 * For example, if you want to replace initial values with finite CSS code.
 * @param {StyleStateList|StyleStateMapList} states
 * @param {Function} replaceFn
 */
export function replaceStateValues(states, replaceFn) {
  const cache = new Map;

  states.forEach(state => {
    if (!cache.get(state.value)) {
      cache.set(state.value, replaceFn(state.value));
    }

    state.value = cache.get(state.value);
  });

  return states;
}

/**
 * Compile states to finite CSS with selectors.
 * State values should contain a string value with CSS style list.
 * @param {string} selector
 * @param {StyleStateList|StyleStateMapList} states
 */
export function applyStates(selector, states) {
  const getModSelector = CONFIG.getModSelector;

  return states.reduce((css, state) => {
    const modifiers = `${(state.mods || []).map(getModSelector).join('')}${(state.notMods || []).map(mod => `:not(${getModSelector(mod)})`).join('')}`;

    return `${css}${selector}${modifiers}{${state.value}}\n`;
  }, '');
}

/**
 * Filter map keys by the list.
 * @param {StyleMap|StyleStateMap} map
 * @param {string[]} list - list of keys to leave
 */
export function filterMap(map, list) {
  return list.reduce((newMap, key) => {
    newMap[key] = map[key];

    return newMap;
  }, {});
}

/**
 * Converts StyleMap to StyleStateMap with normalization.
 * @param {StyleMap} styleMap
 * @param {boolean} normalize
 * @return {StyleStateMap}
 * @constructor
 */
export function StyleMapToStyleStateMap(styleMap, normalize) {
  const styleStateMap = {};

  Object.keys(styleMap).forEach(style => {
    const styleValue = styleMap[style];

    styleStateMap[style] = typeof styleValue === 'object'
      ? styleValueToStyleStateList(styleValue)
      : [{ mods: [], value: styleValue }];

    if (normalize) {
      normalizeStates(styleStateMap[style]);
    }
  });

  return styleStateMap;
}

/**
 * Get all presented modes from style state list.
 * @param {StyleStateList} stateList
 */
export function getModesFromStyleStateList(stateList) {
  return stateList.reduce((list, state) => {
    state.mods.forEach(mod => {
      if (!list.includes(mod)) {
        list.push(mod);
      }
    });

    return list;
  }, []);
}

/**
 * Get all presented modes from style state list map.
 * @param {StyleStateMapList} stateListMap
 * @return {string[]}
 */
export function getModesFromStyleStateListMap(stateListMap) {
  return Object.keys(stateListMap)
    .reduce((list, style) => {
      const stateList = stateListMap[style];

      getModesFromStyleStateList(stateList).forEach(mod => {
        if (!list.includes(mod)) {
          list.push(mod);
        }
      });

      return list;
    }, []);
}

/**
 * Check if there is at least a single style (from the provided list) that is presented in a map.
 * @param styleMap
 * @param styleList
 */
export function checkStyleMap(styleMap, styleList) {
  return !!styleList.find(style => style in styleMap && (styleMap[style] || styleMap[style] === ''));
}

/**
 * Convert style map to the normalized style map state list.
 * @param {StyleMap} styleMap
 * @param {string[]} [keys]
 * @return {StyleStateListMap}
 */
export function styleMapToStyleMapStateList(styleMap, keys) {
  keys = keys || Object.keys(styleMap);

  if (!keys.length) return {};

  /**
   * @type {StyleStateListMap}
   */
  const stateListMap = {};

  keys.forEach(style => {
    stateListMap[style] = styleValueToStyleStateList(styleMap[style]);
  });

  const allModes = getModesFromStyleStateListMap(stateListMap);

  keys.forEach(style => {
    const stateList = stateListMap[style];

    normalizeStates(stateListMap[style], allModes);

    stateListMap[style] = stateList.sort((state1, state2) => {
      return state1.mods.join() < state2.mods.join() ? -1 : 1;
    });
  });

  return stateListMap[keys[0]].reduce((list, state, i) => {
    list.push({
      mods: state.mods,
      notMods: state.notMods,
      value: keys.reduce((map, style) => {
        map[style] = stateListMap[style][i].value;

        return map;
      }, {}),
    });

    return list;
  }, []);
}
