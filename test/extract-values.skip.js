import { extractValuesFromStates } from '../src/index';
import { expect } from './utils';

function checkExtraction(list) {
  list.forEach((obj, i) => {
    it(`to list ${i}`, () => {
      expect(extractValuesFromStates(obj.input)).to.eql(obj.output);
    });
  });
}

describe('Extraction of values from state', () => {
  checkExtraction([
    {
      input: [
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
      output: ['value1', 'value2']
    },
  ]);
});
