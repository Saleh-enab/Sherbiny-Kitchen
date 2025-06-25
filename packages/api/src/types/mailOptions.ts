export interface MailTemplateOptions {
    recipient: string;
    verificationToken: string | null;
    resetPasswordUrl?: string | null;
    type: "emailVerification" | "resetPassword";
    userName: string;
}