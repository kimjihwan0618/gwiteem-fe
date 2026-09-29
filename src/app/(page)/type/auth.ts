import { z } from "zod";
import { passwordSchema } from "./password";

export const loginRequestSchema = z.object({
  email: z.string().email(),
  password: z.string().min(6),
  remember: z.boolean(),
});

export const registerRequestSchema = z.object({
  email: z.string().email(),
  password: passwordSchema,
  nickname: z.string().min(1),
  remember: z.boolean().default(true),
});

export const emailCodeSendRequestSchema = z.object({
  email: z.string().email(),
});

export const emailCodeConfirmRequestSchema = z.object({
  email: z.string().email(),
  code: z.string().min(1),
});

export const passwordResetRequestSchema = z.object({
  email: z.string().email(),
  newPassword: passwordSchema,
});

export const authUserSchema = z.object({
  id: z.string(),
  name: z.string(),
  email: z.string().email().nullable().optional(),
  avatarUrl: z.string().nullable().optional(),
});

export const loginResultSchema = z.object({ user: authUserSchema });
export const sessionResultSchema = z.object({
  user: authUserSchema.nullable(),
});
export const socialLoginUrlSchema = z.object({ loginUrl: z.string().url() });

export const socialProviderSchema = z.enum(["kakao", "naver", "google"]);

export const oauthCallbackRequestSchema = z.object({
  provider: socialProviderSchema,
  code: z.string().min(1),
  state: z.string().min(1).optional(),
  remember: z.boolean().default(true),
});

export const backendUserSummarySchema = z.object({
  id: z.number(),
  nickname: z.string(),
  profile_image_url: z.string().nullable().optional(),
});

export const tokenResponseSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int().positive(),
  is_new_user: z.boolean(),
  user: backendUserSummarySchema,
});

export const accessTokenResponseSchema = z.object({
  access_token: z.string(),
  token_type: z.string(),
  expires_in: z.number().int().positive(),
});

export const loginUrlResponseSchema = z.object({ login_url: z.string().url() });

export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type RegisterRequest = z.input<typeof registerRequestSchema>;
export type EmailCodeSendRequest = z.infer<typeof emailCodeSendRequestSchema>;
export type EmailCodeConfirmRequest = z.infer<
  typeof emailCodeConfirmRequestSchema
>;
export type PasswordResetRequest = z.infer<typeof passwordResetRequestSchema>;
export type OAuthCallbackRequest = z.input<typeof oauthCallbackRequestSchema>;
export type AuthUser = z.infer<typeof authUserSchema>;
export type SocialProvider = z.infer<typeof socialProviderSchema>;
export type TokenResponse = z.infer<typeof tokenResponseSchema>;
