// #region docs
enum Tristate {
  False,
  True,
  Unknown
}

/**
  // 枚举类型的编译结果
  var Tristate;
  (function(Tristate) {
    Tristate[(Tristate['False'] = 0)] = 'False';
    Tristate[(Tristate['True'] = 1)] = 'True';
    Tristate[(Tristate['False'] = 0)] = 'Unknown';
  })(Tristate || (Tristate = {}))
 */

console.log(Tristate[0]); // 'False'
console.log(Tristate.False); // 0
console.log(Tristate[Tristate.False]); // 'False' 因为 Tristate.False 为 0

// #endregion docs
