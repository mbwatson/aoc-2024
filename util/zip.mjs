export const zip = function(arr1, arr2) {
  const length = Math.min(arr1.length, arr2.length); // Ensure the arrays are the same length
  const result = [];
  
  for (let i = 0; i < length; i++) {
    result.push([arr1[i], arr2[i]]);
  }
  
  return result;
};

export const unzip = function(arr) {
  return arr.reduce((acc, [first, second]) => {
    acc[0].push(first);
    acc[1].push(second);
    return acc;
  }, [[], []]);
};
