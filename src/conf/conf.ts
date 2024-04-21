
const conf = {
    mongoDbUri: String(process.env.MONGO_DB_ATLAS_URI),
    tokenSecret: String(process.env.JWT_TOKEN_SECRET),
    mailtrapHost: String(process.env.MAILTRAP_HOST),
    mailtrapPort: Number(process.env.MAILTRAP_PORT),
    mailtrapUser: String(process.env.MAILTRAP_USER),
    mailtrapPassword: String(process.env.MAILTRAP_PASSWORD),
    domain: String(process.env.DOMAIN),
    authJsToken: String(process.env.AUTH_SECRET),
}

export default conf;