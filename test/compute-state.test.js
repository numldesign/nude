import { computeState } from '../src/index';
import { expect } from './utils';

function checkNormalization(list) {
  list.forEach((obj, i) => {
    it(`input ${i}`, () => {
      expect(computeState(...obj.input)).to.eql(obj.output);
    });
  });
}

const NOT = 4;
const AND = 2;
const OR = 1;
const XOR = 0;

describe('State normalization', () => {
  checkNormalization([
    {
      input: [
        [XOR, [OR, [AND, 2, 2], 1], 0],
        [1, 0, 1],
      ],
      output: ((1 & 1) | 0) ^ 1,
    },
    {
      input: [
        [OR, [AND, [XOR, 2, 2], 1], 0],
        [1, 0, 1],
      ],
      output: ((1 ^ 1) & 0) | 1,
    },
    {
      input: [
        [AND, [OR, [XOR, 2, 2], 1], 0],
        [1, 0, 1],
      ],
      output: ((1 ^ 1) | 0) & 1,
    },
  ]);
});
