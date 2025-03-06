const https = require('node:https');
module.exports = {
    // todo how to make timeouts
    getTextAttachment: (url) => {

        return new Promise((resolve, reject) => {
            https.get(url, (res) => {
                let data = '';
                res.on('data', (chunk) => {
                    data += chunk;
                });
                res.on('end', () => {
                    resolve(data)
                });
            }).on('error', (err) => {
                reject(err)
            });
        })
        }
}


