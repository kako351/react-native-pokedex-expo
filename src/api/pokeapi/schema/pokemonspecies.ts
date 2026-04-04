import { PokemonSpeciesDetail } from '../generated/schema/index.zod';

export const PokemonSpeciesSchema = PokemonSpeciesDetail.pick({
  name: true,
  evolution_chain: true,
  names: true,
  genera: true,
  flavor_text_entries: true,
});

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
