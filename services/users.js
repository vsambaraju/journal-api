const db = require('./db');

const createUser = async function(req){
    const {username, password, first_name, last_name} = req;
    const data = await db.query(
        'INSERT INTO USERS (username, password, first_name, last_name) VALUES (?,?,?,?)',
        [username, password,first_name,last_name]
    );

    return data;
}

const getUserById = async function(id){
    const data = await db.query(
        'SELECT username, first_name, last_name FROM USERS WHERE user_id = ?',
        [id]
    )
    return data;
}

const getUserByUsername = async function(username){
    const data = await db.query(
        'SELECT user_id, username, password, first_name, last_name FROM USERS WHERE username = ?',
        [username]
    )
    return data;
}

module.exports = {
    createUser,
    getUserById,
    getUserByUsername
}