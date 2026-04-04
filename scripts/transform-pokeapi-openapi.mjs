const moveResourceFieldNames = new Set([
  'known_move',
  'known_move_type',
  'used_move',
]);

const allowedPathnames = new Set([
  '/api/v2/ability/{id}/',
  '/api/v2/evolution-chain/{id}/',
  '/api/v2/move/{id}/',
  '/api/v2/pokemon/',
  '/api/v2/pokemon/{id}/',
  '/api/v2/pokemon-species/{id}/',
  '/api/v2/type/{id}/',
]);

const namedApiResourceSchema = {
  type: 'object',
  required: ['name', 'url'],
  properties: {
    name: {
      type: 'string',
    },
    url: {
      type: 'string',
      format: 'uri',
    },
  },
};

function cloneSpec(spec) {
  if (typeof structuredClone === 'function') {
    return structuredClone(spec);
  }

  return JSON.parse(JSON.stringify(spec));
}

function patchInvalidSchemaTypes(node, key) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      patchInvalidSchemaTypes(item);
    }

    return;
  }

  if (typeof node.type === 'string' && node.type.trim() === '') {
    delete node.type;

    if (moveResourceFieldNames.has(key ?? '')) {
      Object.assign(node, cloneSpec(namedApiResourceSchema));
    }
  }

  for (const [childKey, childValue] of Object.entries(node)) {
    patchInvalidSchemaTypes(childValue, childKey);
  }
}

function collectRefs(node, refs) {
  if (!node || typeof node !== 'object') {
    return;
  }

  if (Array.isArray(node)) {
    for (const item of node) {
      collectRefs(item, refs);
    }

    return;
  }

  if (typeof node.$ref === 'string') {
    refs.add(node.$ref);
  }

  for (const childValue of Object.values(node)) {
    collectRefs(childValue, refs);
  }
}

function getComponentEntry(spec, ref) {
  const [, componentsKey, entryKey] =
    ref.match(/^#\/components\/([^/]+)\/([^/]+)$/) ?? [];

  if (!componentsKey || !entryKey) {
    return null;
  }

  const collection = spec.components?.[componentsKey];
  const value = collection?.[entryKey];

  if (!value) {
    return null;
  }

  return { componentsKey, entryKey, value };
}

function prunePaths(spec) {
  if (!spec.paths) {
    return;
  }

  spec.paths = Object.fromEntries(
    Object.entries(spec.paths).filter(([pathname]) =>
      allowedPathnames.has(pathname),
    ),
  );
}

function pruneComponents(spec) {
  if (!spec.components) {
    return;
  }

  const refs = new Set();
  const visitedRefs = new Set();
  const keptEntries = new Set();

  collectRefs(spec.paths, refs);

  while (refs.size > 0) {
    const iterator = refs.values().next();
    const ref = iterator.value;
    refs.delete(ref);

    if (visitedRefs.has(ref)) {
      continue;
    }

    visitedRefs.add(ref);

    const entry = getComponentEntry(spec, ref);
    if (!entry) {
      continue;
    }

    const mapKey = `${entry.componentsKey}:${entry.entryKey}`;
    keptEntries.add(mapKey);
    collectRefs(entry.value, refs);
  }

  spec.components = Object.fromEntries(
    Object.entries(spec.components)
      .map(([componentsKey, collection]) => {
        const nextCollection = Object.fromEntries(
          Object.entries(collection).filter(([entryKey]) => {
            return keptEntries.has(`${componentsKey}:${entryKey}`);
          }),
        );

        return [componentsKey, nextCollection];
      })
      .filter(([, collection]) => Object.keys(collection).length > 0),
  );
}

export function transformPokeApiOpenApi(spec) {
  const clonedSpec = cloneSpec(spec);

  patchInvalidSchemaTypes(clonedSpec);
  prunePaths(clonedSpec);
  pruneComponents(clonedSpec);

  return clonedSpec;
}
