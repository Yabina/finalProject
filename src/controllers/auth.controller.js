//const jwt = require ('jsonwebtoken');
const bcrypt = require ('bcryptjs');

const connection = require ('../db-config');
const {
    GET_ME_BY_USERNAME,
    GET_ME_BY_USERNAME_WITH_PASSWORD,
    INSERT_NEW_USER,
} = require ('../queries/user.queries');
const query = require ('../utils/query');
const { refreshTokens, generateToken, generateRefreshToken} =require('../utils/jwt-helpers');
//const jwtconfig = require ('../jwt-config');
//const authQueries = require ('../queries/auth.queries');
//const userQueries = require ('../queries/user.queries');
//exports.registerUser = function (req, res, next) {
exports.register = async (req, res) => {
    console.log(req.body, "text")
    //params setup
   // if(!req.body.password) {
   //     res.status(500);
    //    res.json({msg: 'Password cannot be empty!'});
   //     next();
  //  }
    const passwordHash =bcrypt.hashSync (req.body.password);
    const params = [req.body.username, req.body.email, passwordHash];

    // establish a connection
    const con = await connection().catch((err) => {

        console.log(err, "sql errr..............")
        throw err;
    });

    // check for existing user frist
    const user =await query(con, GET_ME_BY_USERNAME, [req.body.username]).catch((err)=> {
        res.status(500);
        res.send({msg: 'Could not retrieve user.'});
    });


    
    // if we get one result back
    if (user.length === 1) {
        res.status(403).send({ msg: 'User already exists!'});
    } else {
        //add new user
        const result = await query(con, INSERT_NEW_USER, params).catch((err) => {
            // stop registeration
            res
            .status(500)
            .send({ msg: 'Could not register user. Please try again later.'});
        });

        if (!!result) {
            res.send({ msg: 'New user created!'});
        }
    }
};

exports.login =async (req, res) => {
    // establish a connection
    const con = await connection().catch((err) => {
        throw err;
    });
    
    //check for existing user first
    const user = await query(con, GET_ME_BY_USERNAME_WITH_PASSWORD, [
        req.body.username,
    ]).catch((err) => {
        res.status(500);
        res.send({ msg: 'COuld not retrieve user.'});
    });

    //if the user exists
    if (user.length === 1) {
        // validate entered password from database saved password
        const validPass = await bcrypt
        .compare(req.body.password, user[0].password)
        .catch((err) => {
            res.json(500).json({ msg: 'Invalid password!'});
        });

        if(!validPass) {
            res.status(400).send({ msg: 'Invalid password'});
        } else {
            // create token
            const accessToken = generateToken(user[0].user_id, { expiresIn: 86400 });
            const refreshToken = generateRefreshToken(user[0].user_id, { expiresIn: 86400 });

            refreshTokens.push(refreshToken);

            res
            .header('access_token', accessToken) //ex.: {'auth-token: '  '}
            .send({
                auth:true,
                msg: 'Logged in!',
                token_type: 'bearer',
                access_token: accessToken,
                expires_in: 86400,
                refresh_token: refreshToken,
                user_id: user[0].user_id,
            });
        }
    };
};
exports.token = (req, res) => {
        const refreshToken = req.body.token;

        // stop user auth validation if no token provided
        if (!refreshToken) {
            res
            .status(401)
            .send({
                auth:false,
                msg: 'Access Denied.No token provided'});
            }

            // stop refresh is refresh token invalid
            if (!refreshTokens.includes(refreshToken)) {
                res
                .status(403)
                .send({
                    msg: 'Invalid Refresh Token' });
                }
    
            const verified = verifyToken(refreshToken, jwtconfig.refresh, req, res);
    
            if(verified) {
                const accessToken = generateToken(user[0].user_id, { expiresIn: 86400 });
    
                res
                .header('access_token', accessToken) //ex.: {'auth-token: '  '}
                .send({
                    auth:true,
                    msg: 'Logged in!',
                    token_type: 'bearer',
                    access_token: accessToken,
                    expires_in: 20,
                    refresh_token: refreshToken,
    });
}
    res.status(403).send({ msg: 'Invalid Taken'});
};
exports.logout = (re,res) => {
       // const { token } = req.body;
       const refreshToken = req.body.token;
        refreshTokens = refreshTokens.filter((t) => t !== token);

        res.send('Logout successful');
};







