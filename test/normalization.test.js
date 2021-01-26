import { normalizeStates } from '../src/index';
import { expect } from './utils';

function checkNormalization(list) {
  list.forEach((obj, i) => {
    it(`input ${i}`, () => {
      expect(normalizeStates(obj.input)).to.eql(obj.output);
    });
  });
}

describe('State normalization', () => {
  checkNormalization([
    {
      input: [
        {
          mods: [],
          value: '1',
        },
        {
          mods: ['state'],
          value: '2',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state'],
          value: '1',
        },
        {
          mods: ['state'],
          notMods: [],
          value: '2',
        },
      ],
    },
    {
      input: [
        {
          mods: [],
          value: '1',
        },
        {
          mods: ['state-1', 'state-2'],
          value: '2',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state-1', 'state-2'],
          value: '1',
        },
        {
          mods: ['state-1', 'state-2'],
          notMods: [],
          value: '2',
        },
        {
          mods: ['state-1'],
          notMods: ['state-2'],
          value: '1',
        },
        {
          mods: ['state-2'],
          notMods: ['state-1'],
          value: '1',
        },
      ],
    },
    {
      input: [
        {
          mods: ['state'],
          value: '1',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state'],
          value: '',
        },
        {
          mods: ['state'],
          notMods: [],
          value: '1',
        },
      ]
    },
    {
      input: [
        {
          mods: [],
          value: '1',
        },
        {
          mods: ['state-1'],
          value: '2',
        },
        {
          mods: ['state-1', 'state-2'],
          value: '3',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state-1', 'state-2'],
          value: '1',
        },
        {
          mods: ['state-1'],
          notMods: ['state-2'],
          value: '2',
        },
        {
          mods: ['state-1', 'state-2'],
          notMods: [],
          value: '3',
        },
        {
          mods: ['state-2'],
          notMods: ['state-1'],
          value: '1',
        },
      ],
    },
    {
      input: [
        {
          mods: [],
          value: '1',
        },
        {
          mods: ['state-1'],
          value: '2',
        },
        {
          mods: ['state-2', 'state-3'],
          value: '3',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state-1', 'state-2', 'state-3'],
          value: '1',
        },
        {
          mods: ['state-1'],
          notMods: ['state-2', 'state-3'],
          value: '2',
        },
        {
          mods: ['state-2', 'state-3'],
          notMods: ['state-1'],
          value: '3',
        },
        {
          mods: ['state-1', 'state-2'],
          notMods: ['state-3'],
          value: '1',
        },
        {
          mods: ["state-1", "state-2", "state-3"],
          notMods: [],
          value: "1"
        },
        {
          mods: ["state-1", "state-3"],
          notMods: ["state-2"],
          value: "1"
        },
        {
          mods: ["state-2"],
          notMods: ["state-1", "state-3"],
          value: "1"
        },
        {
          mods: ["state-3"],
          notMods: ["state-1", "state-2"],
          value: "1"
        }
      ],
    },
    {
      input: [
        {
          mods: [],
          value: '1',
        },
        {
          mods: ['state-1'],
          value: '2',
        },
        {
          mods: ['state-2', 'state-3'],
          value: '2',
        },
      ],
      output: [
        {
          mods: [],
          notMods: ['state-1', 'state-2', 'state-3'],
          value: '1',
        },
        {
          mods: ['state-1'],
          notMods: ['state-2', 'state-3'],
          value: '2',
        },
        {
          mods: ['state-2', 'state-3'],
          notMods: ['state-1'],
          value: '2',
        },
        {
          mods: ['state-1', 'state-2'],
          notMods: ['state-3'],
          value: '1',
        },
        {
          mods: ["state-1", "state-2", "state-3"],
          notMods: [],
          value: "1"
        },
        {
          mods: ["state-1", "state-3"],
          notMods: ["state-2"],
          value: "1"
        },
        {
          mods: ["state-2"],
          notMods: ["state-1", "state-3"],
          value: "1"
        },
        {
          mods: ["state-3"],
          notMods: ["state-1", "state-2"],
          value: "1"
        }
      ],
    },
  ]);
});
