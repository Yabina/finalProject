const bcrypt = require ('bcryptjs');
const connection = require ('../db-config');
const query = require ('../utils/query');
const {
    GET_ME_BY_USERNAME,
    GET_ME_BY_USERNAME_WITH_PASSWORD,
    INSERT_NEW_USER,
} = require ('../queries/user.queries');


exports.getMe = async (req, res) => {

const decoded = req.user;

   // const token = req.headers['auth-token'];

  if (decoded.id) {
    // establish a connection
    const con = await connection().catch((err) => {
        throw err;
    });
    const user = await query (con, GET_ME_BY_USER_ID, [decoded.id]).catch(
        (err) => {
            res.status(500).json({ msg: 'Could not find the user.'});
        }
    );
    if(!user.length) {
        res.status(400).json({msg: 'No user found.'});
    }

    res.status(200).send(user);
   }
};
exports.updateMe = async (req, res) => {
    // establish a connection
    const con = await connection().catch((err) => {
        throw err;
    });
    // check for existing user first
    const user = await query(con, GET_ME_BY_USER_ID_WITH_PASSWORD, [
        req.user.id,
    ]).catch((err) => {
        res.status(500);
        res.json({ msg: 'Could not retrive user.'});
    });
    // checked for password changed
    // SAME LOGIC AS CHECKING FOR A VALID PASSWORD
    const passwordUnchanged = await bcrypt
    .compare(req.body.password, user[0].password)
    .catch((err) => {
        res.json(500).json({ msg: 'Invalid password!'});
    });

    if(!passwordUnchanged) { 
        const passwordHash = bcrypt.hashSync(req.body.password);

        // perform update
        const result = await query(con, UPDATE_USER, [
            req.body.username,
            req.body.email,
            passwordHash,
            user[0].id,
        ]).catch((err) => {
            res.status(500).send({ msg: 'Could not update user settings.' });
        });

        if(result.affectedRows === 1) {
            res.json({ msg: 'Updated successfuly!' });
        }
        res.json({ msg: 'Nothing to update ...'});
    }
};
