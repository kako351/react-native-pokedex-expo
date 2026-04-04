import { MoveDetail } from '../generated/schema/index.zod';

export const MoveSchema = MoveDetail.pick({
  name: true,
  names: true,
});

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
