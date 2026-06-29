import crypto from 'crypto';

let keysCache = null;

export const getServiceKeys = () => {
    if (keysCache) return keysCache;

    const { privateKey, publicKey } = crypto.generateKeyPairSync('rsa', {
        modulusLength: 2048,
        publicKeyEncoding: {
            type: 'spki',
            format: 'pem'
        },
        privateKeyEncoding: {
            type: 'pkcs8',
            format: 'pem'
        }
    });

    const keyId = crypto.randomUUID();

    keysCache = {
        kid: keyId,
        privateKey,
        publicKey
    };

    return keysCache;
};

export const getJwksFormat = () => {
    const { kid, publicKey } = getServiceKeys();

    return {
        keys: [
            {
                kty: "RSA",
                use: "sig",
                alg: "RS256",
                kid: kid,
                pem: publicKey
            }
        ]
    };
};