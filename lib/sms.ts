import twilio from 'twilio';

const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const fromPhoneNumber = process.env.TWILIO_PHONE_NUMBER;

const client = twilio(accountSid, authToken);

export async function sendSms(to: string, body: string) {
    if (!accountSid || !authToken || !fromPhoneNumber) {
        console.error("Twilio credentials are not set in .env file.");
        // Simulate SMS send for local development if credentials are missing
        console.log(`--- SMS SIMULATION ---`);
        console.log(`TO: ${to}`);
        console.log(`BODY: ${body}`);
        console.log(`----------------------`);
        return;
    }

    try {
        const message = await client.messages.create({
            body,
            from: fromPhoneNumber,
            to,
        });
        console.log(`SMS sent successfully to ${to}. SID: ${message.sid}`);
    } catch (error) {
        console.error("Failed to send SMS:", error);
    }
}