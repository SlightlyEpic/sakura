import { z } from 'zod';

export const loginBodySchema = z.object({
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
});

export const signupBodySchema = z.object({
    name: z.string().min(1).max(255),
    email: z.string().email().min(1).max(255),
    password: z.string().min(8).max(255),
});
