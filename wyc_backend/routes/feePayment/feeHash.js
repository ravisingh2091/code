const jsSHA = require('jssha');

function feeHash(req, res) {
    const data = req.body;

    if (!data.txnid || !data.amount || !data.productinfo || !data.firstname || !data.email || !data.key_value || !data.salt_value) {
        return res.json({
            status: false,
            message: 'Mandatory fields missing'
        });
    } else {
        const hashString = data.key_value + '|' + data.txnid + '|' + data.amount + '|' + data.productinfo + '|' + data.firstname + '|' + data.email + '|' + '||||||||||' + data.salt_value;

        const sha = new jsSHA('SHA-512', 'TEXT');

        sha.update(hashString);

        const hash = sha.getHash('HEX');

        res.json({
            status: true,
            message: 'Hash generated successfully',
            data: { hash: hash }
        });
    }
}

module.exports = feeHash;
