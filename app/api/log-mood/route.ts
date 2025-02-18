import { google } from "googleapis";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    // Load credentials from the environment variable
    const credentials = JSON.parse(process.env.GOOGLE_SHEET_CREDENTIALS || "{}");

    const auth = new google.auth.GoogleAuth({
      credentials,
      scopes: ["https://www.googleapis.com/auth/spreadsheets"],
    });

    const sheets = google.sheets({ version: "v4", auth });

    // Your Google Sheets API logic here...
    return new Response(JSON.stringify({ message: "Mood logged successfully" }), { status: 200 });

  } catch (error) {
    console.error("Error logging mood:", error);
    return new Response(JSON.stringify({ error: "Failed to log mood" }), { status: 500 });
  }
}
