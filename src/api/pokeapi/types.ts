import { z } from 'zod';
import {
  AbilitySchema,
  EvolutionChainSchema,
  PokemonDetailSchema,
  PokemonListSchema,
  PokemonSpeciesSchema,
  PokemonTypeSchema,
  MoveSchema,
} from './parsers';

export type PokemonList = z.infer<typeof PokemonListSchema>;
export type PokemonDetail = z.infer<typeof PokemonDetailSchema>;
export type PokemonSpecies = z.infer<typeof PokemonSpeciesSchema>;
export type EvolutionChain = z.infer<typeof EvolutionChainSchema>;
export type EvolutionChainLink = EvolutionChain['chain'];
export type Ability = z.infer<typeof AbilitySchema>;
export type Move = z.infer<typeof MoveSchema>;
export type PokemonType = z.infer<typeof PokemonTypeSchema>;
