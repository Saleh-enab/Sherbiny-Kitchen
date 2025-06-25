import { z } from 'zod';
import 'dotenv/config';

const envSchema = z.object({
    PORT: z.coerce.number().default(3000),
    DATABASE_URL: z.string().startsWith("postgresql://"),
    EMAIL_APP_USER: z.string().email(),
    EMAIL_APP_PASSWORD: z.string(),
})

const env = envSchema.parse(process.env);
export default env;