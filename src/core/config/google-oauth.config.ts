import { registerAs } from "@nestjs/config"

// This code exports Google OAuth configuration settings using NestJS's registerAs function.

export default registerAs("googleoAuth", ()=> ({
    clientId: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_SECRET,  
    callbackUrl: process.env.GOOGLE_CALLBACK_URL
}))