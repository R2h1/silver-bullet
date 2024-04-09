//#region docs
function reverse(str: string) {
  return str.split('').reverse().join('');
}

function reverseByReduce(str: string) {
  return str.split('').reduce((acc, cur) => `${cur}${acc}`, '')
}
//#endregion docs