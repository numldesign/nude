import { styleValueToStyleStateList } from '../src/index';
import { expect } from './utils';

function checkNormalization(list) {
  list.forEach((obj, i) => {
    it(`to list ${i}`, () => {
      expect(styleValueToStyleStateList(obj.input)).to.eql(obj.output);
    });
  });
}

describe('State map convertion', () => {
  checkNormalization([
    {
      input: {
        '': 'value1',
        'mod1 & mod2': 'value2',
      },
      output: [
        {
          mods: [],
          value: 'value1',
        },
        {
          mods: ['mod1', 'mod2'],
          value: 'value2',
        },
      ]
    },
    {
      input: {
        '': 'value1',
        'mod1, mod2': 'value2',
      },
      output: [
        {
          mods: [],
          value: 'value1',
        },
        {
          mods: ['mod1'],
          value: 'value2',
        },
        {
          mods: ['mod2'],
          value: 'value2',
        },
      ]
    },
    {
      input: {
        '': 'value1',
        'mod1, mod2 & mod3': 'value2',
      },
      output: [
        {
          mods: [],
          value: 'value1',
        },
        {
          mods: ['mod1'],
          value: 'value2',
        },
        {
          mods: ['mod2', 'mod3'],
          value: 'value2',
        },
      ]
    },
  ]);
});
