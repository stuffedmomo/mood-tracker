import { google } from "googleapis";
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  try {
    console.log('📌 Starting mood logging process...');

    // Parse request body
    const { timestamp, moodRating, notes } = await req.json();
    console.log('✅ Received data:', { timestamp, moodRating, notes });

    // Load credentials securely
    if (!process.env.GOOGLE_SHEETS_CREDENTIALS) {
      throw new Error("Missing GOOGLE_SHEETS_CREDENTIALS in environment variables.");
    }

    const credentials = JSON.parse(process.env.GOOGLE_SHEETS_CREDENTIALS);
    console.log('🔑 Credentials loaded successfully.');

    // Authenticate with Google Sheets API
    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });
    console.log('✅ Google Sheets API initialized.');

    // Validate spreadsheet ID
    const spreadsheetId = process.env.GOOGLE_SHEETS_SHEET_ID;
    if (!spreadsheetId) {
      throw new Error("Missing required environment variable: GOOGLE_SHEETS_SHEET_ID");
    }

    // Append data to the Google Sheet
    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: 'Sheet1!A:C', // Adjust based on your sheet structure
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [[timestamp, moodRating, notes]],
      },
    });

    console.log('✅ Data appended successfully:', response.data);

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error('❌ Error in mood logging:', error);

    return NextResponse.json(
      { success: false, error: error instanceof Error ? error.message : 'Failed to log mood' },
      { status: 500 }
    );
  }
}
