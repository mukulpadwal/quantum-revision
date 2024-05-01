
const conf = {
    mongoDbUri: String(process.env.MONGO_DB_ATLAS_URI),
    tokenSecret: String(process.env.JWT_TOKEN_SECRET),
    domain: String(process.env.AUTH_TRUST_HOST),
    authJsToken: String(process.env.AUTH_SECRET),
    resendApiKey: String(process.env.RESEND_API_KEY),
    novuApiKey: String(process.env.NOVU_API_KEY),
    sessionTokenName: String(process.env.NEXT_AUTH_SESSION_TOKEN_NAME),
    secureSessionTokenName: String(process.env.NEXT_AUTH_SECURE_SESSION_TOKEN_NAME),
    googleAuthId: String(process.env.AUTH_GOOGLE_ID),
    googleAuthSecret: String(process.env.AUTH_GOOGLE_SECRET)
}

export default conf;