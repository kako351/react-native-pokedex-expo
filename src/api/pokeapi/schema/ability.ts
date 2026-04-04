import { AbilityDetail } from '../generated/schema/index.zod';

export const AbilitySchema = AbilityDetail.pick({
  name: true,
  names: true,
});

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
