import { GoogleSpreadsheet } from 'google-spreadsheet';
import { JWT } from 'google-auth-library';

const SCOPES = [
  'https://www.googleapis.com/auth/spreadsheets',
];

export async function POST(req: Request) {
  try {
    const { timestamp, moodRating, notes } = await req.json();

    const jwt = new JWT({
      email: process.env.GOOGLE_SHEETS_CLIENT_EMAIL,
      key: process.env.GOOGLE_SHEETS_PRIVATE_KEY?.replace(/\\n/g, '\n'),
      scopes: SCOPES,
    });

    const doc = new GoogleSpreadsheet(process.env.GOOGLE_SHEETS_SHEET_ID!, jwt);
    await doc.loadInfo();
    
    const sheet = doc.sheetsByIndex[0];
    
    await sheet.addRow({
      Timestamp: timestamp,
      'Mood Rating': moodRating,
      Notes: notes,
    });

    return Response.json({ success: true });
  } catch (error) {
    console.error('Error logging mood:', error);
    return Response.json({ success: false, error: 'Failed to log mood' }, { status: 500 });
  }
} 