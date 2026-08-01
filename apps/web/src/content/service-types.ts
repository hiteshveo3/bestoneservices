import { z } from "zod";

export const serviceFaqSchema = z.object({
  question: z.string().min(1),
  answer: z.string().min(1),
});

export type ServiceFaq = z.infer<typeof serviceFaqSchema>;
