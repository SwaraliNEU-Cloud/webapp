const bcrypt = require('bcrypt');
const sequelize = require('../Models/db');
const basicAuth = async (req, res, next) => {
    try {
        
        if (req.headers.authorization && req.headers.authorization.startsWith('Basic')) {
            const base64Credentials = req.headers.authorization.split(' ')[1];
            const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii');
            const [email, password] = credentials.split(':');
            console.log(email);
            console.log(password)
            const user = await sequelize.models.User.findOne({ where: { email } });
            
            if (!user) {
                return res.status(401).json({ message: 'Authentication failed' });
            }
            const hashedPassword = await bcrypt.hash(password, 10)
            const isValidPassword = await bcrypt.compare(password, user.password);
            if (!isValidPassword) {
                console.log('Please give correct Credentials')
                return res.status(401).json({ message: 'Authentication failed, Invalid Cred' });
            }
            else{
                console.log('User Authorized');
            }
            // console.log('this line')
            req.user = user;
            next();
        } else {
            res.status(401).json({ message: 'Authentication header missing' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Authentication error', error: error.message });
    }
};
module.exports = basicAuth;