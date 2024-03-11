const db = require('./db');

async function getJournalByUserId(userId){
    const data = await db.query(
        'SELECT user_id,journal_id, notes,created_date,updated_date FROM journal WHERE user_id = ?',
        [userId]
    )
    return data;
}

async function createJournal(journal,userId){
    const {notes} = journal;
    const data = await db.query(
        'INSERT INTO journal (user_id, notes) VALUES (?,?)',
        [userId, notes]
    );
    return data;
}

async function updateJournal(journal, userId, journalId){
    const {notes} = journal;
    const data = await db.query(
        'UPDATE journal.journal SET notes = ? WHERE user_id =? and journal_id=?',
        [notes,userId,journalId]
    );
    return data;
}

async function deleteJournal(userId, journalId){
    const data = await db.query(
        'DELETE FROM journal.journal WHERE user_id =? AND journal_id=?',
        [userId,journalId]
    );
    return data;
}

module.exports = {
    getJournalByUserId,
    createJournal,
    updateJournal,
    deleteJournal
};