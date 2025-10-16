module.exports = {
  apps: [
    {
      name: "bookkeeping",
      script: "./server.js",
      env: {
        NODE_ENV: "production",
        DB_HOST: "localhost",
        DB_USER: "bk_app",
        DB_DATABASE: "bookkeeping",
        DB_PASSWORD: "your-db-password",
        APP_PORT: 3000,
        JWT_KEY: "secret",
        ADMIN_USERNAME: "admin",
        ADMIN_PASSWORD: "your-admin-password-in-bcrypt-hash",
      }
    }
  ]
};