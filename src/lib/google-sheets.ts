// This file will contain the logic to interact with the Google Sheets API.
// We'll use the googleapis library.

import { google, Auth } from 'googleapis';
import { AiTool } from '@/types'; // Assuming your AiTool type is defined here

// TODO: Implement functions to:
// 1. Authenticate with Google Sheets API (using service account or OAuth2)
// 2. Get all tools
// 3. Get a specific tool by ID
// 4. Add a new tool
// 5. Update an existing tool (if needed, though maybe not for MVP)
// 6. Delete a tool (if needed)
// 7. Get reviews for a tool
// 8. Add a review for a tool
// 9. Get examples for a tool
// 10. Add an example for a tool
// 11. Manage collections (if stored in Google Sheets, might be client-side or another DB for user-specific data)

// Helper function to get authenticated Google Sheets API client
async function getSheetsClient(): Promise<ReturnType<typeof google.sheets>> {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  const spreadsheetId = process.env.GOOGLE_SHEET_ID;

  if (!credentialsJson) {
    throw new Error('Missing GOOGLE_SHEETS_CREDENTIALS environment variable. Should contain the full JSON credentials.');
  }
  if (!spreadsheetId) {
    throw new Error('Missing GOOGLE_SHEET_ID environment variable.');
  }

  const credentials = JSON.parse(credentialsJson);

  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  const authClient = await auth.getClient();
  return google.sheets({ version: 'v4', auth: authClient as Auth.OAuth2Client });
}

const SHEET_NAME = 'Tools'; // This matches your sheet name
const DATA_RANGE = `${SHEET_NAME}!A:V`; // Covers columns A (Timestamp) to V (createdBy)

// Function to map sheet rows to AiTool objects
// Adjusted to your sheet structure
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function mapRowToAiTool(row: any[]): AiTool | null {
  if (!row || !row[0]) { // Timestamp (A) must exist to be a valid row for an ID
    return null;
  }
  // Indices: A=0, B=1, C=2, D=3, E=4, ..., U=20, V=21
  const id = String(row[0]); // Timestamp as ID
  const createdAt = String(row[0]); // Timestamp as createdAt
  const name = String(row[1] || ''); // שם הכלי (B)
  const link = String(row[2] || ''); // קישור (C)
  // const logo = String(row[3] || ''); // לוגו (D) - Not currently in AiTool type
  const description = String(row[4] || ''); // תיאור (E)
  // Skipping F-T for now as they are not in the basic AiTool type
  const tagsString = String(row[20] || ''); // tags (U)
  const createdBy = String(row[21] || 'anonymous'); // createdBy (V)

  return {
    id,
    name,
    description,
    link,
    tags: tagsString ? tagsString.split(',').map((tag: string) => tag.trim()).filter(tag => tag) : [],
    createdBy,
    createdAt,
  };
}

export async function getToolsFromSheet(): Promise<AiTool[]> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;
    
    console.log(`Fetching tools from sheet: ${spreadsheetId}, range: ${DATA_RANGE}`);

    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: DATA_RANGE,
    });

    const rows = response.data.values;
    if (rows && rows.length) {
      const tools = rows
        // Skip header row if present - simple check if first cell of first row is "Timestamp"
        .filter((row, index) => index === 0 ? String(row[0]).trim().toLowerCase() !== 'timestamp' : true)
        .map(mapRowToAiTool)
        .filter(tool => tool !== null && tool.name) as AiTool[]; // Ensure tool is valid and has a name
      console.log(`Successfully fetched ${tools.length} tools.`);
      return tools;
    } else {
      console.log('No tools found in the sheet or sheet is empty.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching tools from Google Sheets:', error);
    throw new Error('Failed to fetch tools from Google Sheets');
  }
}

export async function addToolToSheet(tool: Omit<AiTool, 'id' | 'createdAt'> & { id?: string; createdAt?: string }): Promise<AiTool> {
  try {
    const sheets = await getSheetsClient();
    const spreadsheetId = process.env.GOOGLE_SHEET_ID;

    const newIdAndCreatedAt = new Date().toISOString(); // Use current ISO string for Timestamp, ID, and CreatedAt

    const newToolData: AiTool = {
        id: newIdAndCreatedAt, // Using new timestamp as ID
        name: tool.name,
        description: tool.description,
        link: tool.link,
        tags: tool.tags || [],
        createdBy: tool.createdBy || 'anonymous',
        createdAt: newIdAndCreatedAt, // Using new timestamp as CreatedAt
    };

    // Prepare a full row array corresponding to columns A to V
    // A: Timestamp (ID, CreatedAt), B: שם הכלי, C: קישור, D: לוגו (empty), E: תיאור
    // F-T: Empty for now
    // U: tags, V: createdBy
    const rowValues = new Array(22).fill(''); // Initialize an array for 22 columns (A-V)
    
    rowValues[0] = newToolData.createdAt;    // Column A: Timestamp (also ID and CreatedAt)
    rowValues[1] = newToolData.name;         // Column B: שם הכלי
    rowValues[2] = newToolData.link;         // Column C: קישור
    // rowValues[3] is Logo - leave empty
    rowValues[4] = newToolData.description;  // Column E: תיאור
    // Columns F (index 5) to T (index 19) remain empty
    rowValues[20] = newToolData.tags.join(','); // Column U: tags
    rowValues[21] = newToolData.createdBy;      // Column V: createdBy


    console.log("Attempting to append to Google Sheets with values:", [rowValues]);

    const response = await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: DATA_RANGE, // Append to the defined data range (e.g., Tools!A:V)
      valueInputOption: 'USER_ENTERED',
      insertDataOption: 'INSERT_ROWS',
      requestBody: {
        values: [rowValues], // The row to append
      },
    });
    
    console.log("Successfully appended to Google Sheets. API Response:", response.data);
    return newToolData;

  } catch (error) {
    console.error('Error adding tool to Google Sheets:', error);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const err = error as any;
    if (err.response && err.response.data && err.response.data.error) {
        console.error('Google API Error Details:', JSON.stringify(err.response.data.error, null, 2));
        throw new Error(`Google API Error: ${err.response.data.error.message} (Code: ${err.response.data.error.code})`);
    }
    throw new Error('Failed to add tool to Google Sheets');
  }
}

// Placeholder for other functions if needed in the future
// export async function getToolByIdFromSheet(id: string): Promise<AiTool | null> { /* ... */ }
// export async function updateToolInSheet(id: string, updates: Partial<AiTool>): Promise<AiTool | null> { /* ... */ }
// export async function deleteToolFromSheet(id: string): Promise<boolean> { /* ... */ }

export {}; // Remove this if you have actual exports like getToolsFromSheet and addToolToSheet 