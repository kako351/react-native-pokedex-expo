import { TypeDetail } from '../generated/schema/index.zod';

export const PokemonTypeSchema = TypeDetail.pick({
  id: true,
  name: true,
  pokemon: true,
});

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
