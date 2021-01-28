import { replaceStateValues } from '../src/index';
import { expect } from './utils';

function checkReplacement(list) {
  list.forEach((obj, i) => {
    it(`to list ${i}`, () => {
      expect(replaceStateValues(...obj.input)).to.eql(obj.output);
    });
  });
}

describe('Replace state values', () => {
  checkReplacement([
    {
      input: [
        [
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
        ],
        {
          value1: 'compiled value1',
          value2: 'compiled value2',
        }
      ],
      output: [
        {
          mods: [],
          value: 'compiled value1',
        },
        {
          mods: ['mod1'],
          value: 'compiled value2',
        },
        {
          mods: ['mod2'],
          value: 'compiled value2',
        },
      ]
    },
  ]);
});
