const pool = require("../database/");

/**
 * Get messages sent to account id
 * @param {number} accountId
 * @param {boolean} archived
 * @returns {object}
 */
async function getMessagesToId(accountId, archived = false) {
  const sqlQuery = `
    SELECT 
        mes_id, 
        mes_subject, 
        mes_body, 
        mes_created, 
        mes_receiver, 
        mes_sender, 
        mes_read, 
        mes_archived, 
        account_firstname, 
        account_lastname, 
        account_type
    FROM public.message JOIN public.account ON public.message.mes_sender = public.account.account_id
    WHERE mes_receiver = $1 AND mes_archived = $2
    ORDER BY mes_created DESC`;

  try {
    return (await pool.query(sqlQuery, [accountId, archived])).rows;
  } catch (error) {
    console.error(error.message);
  }
}

async function getMessageById(accountId) {
  const sqlQuery = `
        SELECT 
            mes_id, 
            mes_subject, 
            mes_body, 
            mes_created, 
            mes_receiver, 
            mes_sender, 
            mes_read,
            mes_archived,
            account_id,
            account_firstname,
            account_lastname,
            account_type
        FROM public.message JOIN public.account
        ON public.message.mes_sender = public.account.account_id
        WHERE mes_id = $1`;

  try {
    return (await pool.query(sqlQuery, [accountId])).rows[0];
  } catch (error) {
    console.error(error.message);
  }
}

async function sendMessage(messageData) {
  const sqlQuery = `
    INSERT INTO public.message (mes_subject, mes_body, mes_receiver, mes_sender)
    VALUES ($1, $2, $3, $4);  
  `;
  try {
    const result = await pool.query(sqlQuery, [
      messageData.mes_subject,
      messageData.mes_body,
      messageData.mes_receiver,
      messageData.mes_sender
    ]);
    return result;
  } catch (error) {
    console.error("Failed to send message");
  }
}

async function getMessageCountById(accountId, archived = false) {
  const sqlQuery = `
          SELECT COUNT(*) 
          FROM public.message
          WHERE mes_receiver = $1 AND mes_archived = $2`;

  try {
    return (await pool.query(sqlQuery, [accountId, archived])).rows[0].count;
  } catch (error) {
    console.error("Failed to count the number of messages");
  }
}

async function toggleRead(messageId) {
  const sqlQuery =
    "UPDATE public.message SET mes_read = NOT mes_read WHERE mes_id = $1 RETURNING mes_read";

  const result = await pool.query(sqlQuery, [messageId]);
  return result.rows[0].mes_read;
}

async function toggleArchived(messageId) {
  const sqlQuery =
    "UPDATE public.message SET mes_archived = NOT mes_archived WHERE mes_id = $1 RETURNING mes_archived";
  const result = await pool.query(sqlQuery, [messageId]);
  return result.rows[0].mes_archived;
}

async function deleteMessage(messageId) {
  const sqlQuery = "DELETE FROM public.message WHERE mes_id = $1";
  try {
    const result = await pool.query(sqlQuery, [messageId]);
    return result;
  } catch (error) {
    console.error("Failed to delete message " + messageId + "\n" + error);
  }
}

module.exports = {
  getMessagesToId,
  getMessageById,
  sendMessage,
  getMessageCountById,
  toggleRead,
  toggleArchived,
  deleteMessage
};