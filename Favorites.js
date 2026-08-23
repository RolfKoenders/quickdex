.pragma library

// Pure list logic for the user-curated favorites list. Unlike Recents,
// membership is explicit add/remove, not an automatic MRU stack, so there's
// no cap and nothing ever re-bumps an existing entry. See tests/test_favorites.js.

// Prepends slug (most-recently-favorited first). No-op if already present.
// Pure: returns the same array (not a copy) when there's nothing to do.
function add(slugs, slug) {
  var source = Array.isArray(slugs) ? slugs : []
  if (source.indexOf(slug) !== -1) return source
  return [slug].concat(source)
}

// Removes slug. Pure: returns a new array.
function remove(slugs, slug) {
  var source = Array.isArray(slugs) ? slugs : []
  var next = []
  for (var i = 0; i < source.length; i++) {
    if (source[i] !== slug) next.push(source[i])
  }
  return next
}

function isFavorite(slugs, slug) {
  var source = Array.isArray(slugs) ? slugs : []
  return source.indexOf(slug) !== -1
}
