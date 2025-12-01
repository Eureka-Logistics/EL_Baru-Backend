const core = require('../config/core.config')
const fs = require('fs')
const path = require('path')

// Load SSO public key once at startup
const SSO_PUBLIC_KEY_PATH = path.join(__dirname, '../config/public.key')
let SSO_PUBLIC_KEY = null
try {
    SSO_PUBLIC_KEY = fs.readFileSync(SSO_PUBLIC_KEY_PATH, 'utf8')
} catch (e) {
    // If public key is not available, SSO verification will be skipped
    SSO_PUBLIC_KEY = null
}

const verifyUserToken = (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send(
        {
            status: {
                code: 401,
                message: "Access Denied / Unauthorized request"
            },
        }
    );

    let token = null
    try {
        token = authHeader.split(' ')[1] // Remove Bearer from string
    } catch (e) {
        token = null
    }

    if (token === 'null' || !token) return res.status(401).send('Unauthorized request');

    // Try local JWT (HS256 with TOKEN_KEY)
    try {
        const decodedLocal = core.jwt.verify(token, core.env.TOKEN_KEY)
        if (decodedLocal) {
            req.user = decodedLocal
            return next()
        }
    } catch (errLocal) {
        // proceed to SSO verification
    }

    // Try SSO JWT (RS256 with public.key)
    try {
        if (!SSO_PUBLIC_KEY) throw new Error('SSO public key unavailable')
        const decodedSso = core.jwt.verify(token, SSO_PUBLIC_KEY, { algorithms: ['RS256'] })
        if (decodedSso) {
            req.user = decodedSso
            return next()
        }
    } catch (errSso) {
        return res.status(401).send({
            status: {
                code: 401,
                message: "Invalid Authorization"
            },
        })
    }
}


module.exports = verifyUserToken;
