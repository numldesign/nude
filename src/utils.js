export function getCombinations(array) {
  const result = [];

  const f = function (prefix = [], array) {
    for (let i = 0; i < array.length; i++) {
      result.push([...prefix, array[i]]);
      f([...prefix, array[i]], array.slice(i + 1));
    }
  }

  f('', array);

  return result;
}
