export type PokemonList = {
  count: number;
  next: string | null;
  previous: string | null;
  results: {
    name: string;
    url: string;
  }[];
};

export type PokemonDetail = {
  id: number;
  name: string;
  height: number;
  weight: number;
  base_experience: number;
  types: {
    slot: number;
    type: {
      name: string;
      url: string;
    };
  }[];
  stats: {
    base_stat: number;
    effort: number;
    stat: {
      name: string;
      url: string;
    };
  }[];
  abilities: {
    is_hidden: boolean;
    slot: number;
    ability: {
      name: string;
      url: string;
    };
  }[];
  moves: {
    move: {
      name: string;
      url: string;
    };
  }[];
  sprites: {
    front_default: string | null;
    other?: {
      'official-artwork'?: {
        front_default: string | null;
      };
    };
  };
};

export type PokemonSpecies = {
  name: string;
  evolution_chain: {
    url: string;
  };
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  genera: {
    genus: string;
    language: {
      name: string;
      url: string;
    };
  }[];
  flavor_text_entries: {
    flavor_text: string;
    language: {
      name: string;
      url: string;
    };
    version?: {
      name: string;
      url: string;
    };
    version_group?: {
      name: string;
      url: string;
    };
  }[];
};

export type EvolutionChain = {
  id?: number;
  chain: EvolutionChainLink;
};

export type EvolutionChainLink = {
  species: {
    name: string;
    url: string;
  };
  evolves_to: EvolutionChainLink[];
};

export type Ability = {
  name: string;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

export type Move = {
  name: string;
  names: {
    name: string;
    language: {
      name: string;
      url: string;
    };
  }[];
};

export type PokemonType = {
  id: number;
  name: string;
  pokemon: {
    pokemon: {
      name: string;
      url: string;
    };
    slot: number;
  }[];
};
