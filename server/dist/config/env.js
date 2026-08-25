import "dotenv/config";
function requireEnv(name) {
    const value = process.env[name];
    if (!value) {
        throw new Error(`Missing environment variable: ${name}`);
    }
    return value;
}
export const env = {
    DATABASE_URL: requireEnv("DATABASE_URL"),
    JWT_SECRET: requireEnv("JWT_SECRET"),
    JWT_EXPIRES_IN: requireEnv("JWT_EXPIRES_IN"),
};
