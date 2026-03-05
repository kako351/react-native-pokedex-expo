import { z } from 'zod';

export const NamedApiResource = z.object({
  name: z.string(),
  url: z.string(),
});
