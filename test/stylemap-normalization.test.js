import { styleMapToStyleMapStateList } from '../src/index';
import { expect } from './utils';

function checkStyleMapNormalization(list) {
  list.forEach((obj, i) => {
    it(`input ${i}`, () => {
      expect(styleMapToStyleMapStateList(...obj.input)).to.eql(obj.output);
    });
  });
}

describe('State normalization', () => {
  checkStyleMapNormalization([
    {
      input: [
        {
          one: {
            '': 'value1',
            'mod1 & mod2': 'value2',
          },
          two: {
            '': 'value1',
            'mod1, mod2 & mod3': 'value2',
          },
        },
        ['one']
      ],
      output: [
        {
          "mods": [],
          "notMods": [
            "mod1",
            "mod2",
          ],
          "value": {
            "one": "value1",
          },
        },
        {
          "mods": [
            "mod1",
          ],
          "notMods": [
            "mod2",
          ],
          "value": {
            "one": "value1",
          },
        },
        {
          "mods": [
            "mod1",
            "mod2",
          ],
          "notMods": [],
          "value": {
            "one": "value2",
          },
        },
        {
          "mods": [
            "mod2",
          ],
          "notMods": [
            "mod1",
          ],
          "value": {
            "one": "value1",
          },
        },
      ],
    },
    {
      input: [
        {
          one: {
            '': 'value1',
            'mod1 & mod2': 'value2',
          },
          two: {
            '': 'value3',
            'mod1, mod2 & mod3': 'value4',
          },
        },
        ['one', 'two']
      ],
      output: [
        {
          "mods": [],
          "notMods": [
            "mod1",
            "mod2",
            "mod3",
          ],
          "value": {
            "one": "value1",
            "two": "value3",
          },
        },
        {
          "mods": [
            "mod1",
          ],
          "notMods": [
            "mod2",
            "mod3",
          ],
          "value": {
            "one": "value1",
            "two": "value4",
          },
        },
        {
          "mods": [
            "mod1",
            "mod2",
          ],
          "notMods": [
            "mod3",
          ],
          "value": {
            "one": "value2",
            "two": "value3",
          },
        },
        {
          "mods": [
            "mod1",
            "mod2",
            "mod3",
          ],
          "notMods": [],
          "value": {
            "one": "value1",
            "two": "value3",
          },
        },
        {
          "mods": [
            "mod1",
            "mod3",
          ],
          "notMods": [
            "mod2",
          ],
          "value": {
            "one": "value1",
            "two": "value3",
          },
        },
        {
          "mods": [
            "mod2",
          ],
          "notMods": [
            "mod1",
            "mod3",
          ],
          "value": {
            "one": "value1",
            "two": "value3",
          },
        },
        {
          "mods": [
            "mod2",
            "mod3",
          ],
          "notMods": [
            "mod1",
          ],
          "value": {
            "one": "value1",
            "two": "value4",
          },
        },
        {
          "mods": [
            "mod3",
          ],
          "notMods": [
            "mod1",
            "mod2",
          ],
          "value": {
            "one": "value1",
            "two": "value3",
          },
        },
      ],
    }
  ]);
});
