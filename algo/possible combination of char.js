var tree = function(leafs) {
  var branches = [];
  if (leafs.length == 1) return leafs;
  for (var k in leafs) {
    var leaf = leafs[k];
    tree(leafs.join('').replace(leaf, '').split('')).concat("").map(function(subtree) {
      branches.push([leaf].concat(subtree));
    });
  }
  return branches;
};
tree("abc".split('')).map(function(str) {
  return str.join('')
})
