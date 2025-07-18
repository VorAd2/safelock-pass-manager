function generateJwtSecret() {
    console.log(require('crypto').randomBytes(64).toString('hex'))
}
generateJwtSecret()