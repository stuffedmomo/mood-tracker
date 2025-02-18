import { google } from "googleapis";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('Starting mood logging process...');
    const { timestamp, moodRating, notes } = await req.json();
    console.log('Received data:', { timestamp, moodRating, notes });

    console.log('Initializing Google Sheets connection...');
    // Load credentials from the environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS || "{}");
    console.log('Credentials loaded');

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });
    console.log('Auth initialized');

    const sheets = google.sheets({ version: "v4", auth });
    console.log('Sheets API initialized');

    // Append values to the spreadsheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId: process.env.GOOGLE_SHEETS_SHEET_ID,
      range: 'Sheet1!A:C', // Adjust range as needed
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, moodRating, notes]],
      },
    });
    console.log('Data appended successfully:', response.data);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Error in mood logging:', error);
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined
    });
    return NextResponse.json(
      { success: false, error: 'Failed to log mood' },
      { status: 500 }
    );
  }
}
