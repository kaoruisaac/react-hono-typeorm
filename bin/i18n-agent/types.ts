import { z } from "zod";

export const Hit = z.object({
  key: z.string(),
  file: z.string(),
  line: z.number(),
  usage: z.string().optional(),
});
export type Hit = z.infer<typeof Hit>;

export type Dict = Record<string, string>;