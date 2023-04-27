import {Handler} from '@netlify/functions';
import * as sendGridMail from '@sendgrid/mail';

const {
  SENDGRID_API_KEY,
  SENDGRID_TO_EMAIL,
  SENDGRID_FROM_EMAIL,
} = process.env;

const handler: Handler = async (event, _context) => {
  if (event.body == null) throw new Error("");
  const {message, senderEmail, senderName} = JSON.parse(event.body);

  sendGridMail.setApiKey(SENDGRID_API_KEY ?? "");
  const data = {
    to: SENDGRID_TO_EMAIL ?? "",
    from: SENDGRID_FROM_EMAIL ?? "",
    subject: `New message from ${senderName} (${senderEmail})`,
    html: message,
  };

  try {
    await sendGridMail.send(data);
    return {
      statusCode: 200,
      body: 'Message sent',
    };
  } catch (err) {
    return {
      statusCode: err.code,
      body: JSON.stringify({msg: err.message}),
    };
  }
};

export {handler};

