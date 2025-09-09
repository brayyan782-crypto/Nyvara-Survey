import type { z } from "zod";
import type { surveySchema } from "./schema";

export type SurveyFormData = z.infer<typeof surveySchema>;
