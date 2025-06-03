// This file will contain the logic to interact with the Google Sheets API.
// We'll use the googleapis library.

import { google } from 'googleapis';
import { AiTool, Review } from '@/types';
import { v4 as uuidv4 } from 'uuid'; // For generating unique IDs

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

// Function to get the Google Sheets API client
async function getSheetsClient() {
  const credentialsJson = process.env.GOOGLE_SHEETS_CREDENTIALS;
  if (!credentialsJson) {
    throw new Error('GOOGLE_SHEETS_CREDENTIALS environment variable is not set.');
  }

  const credentials = JSON.parse(credentialsJson);
  const auth = new google.auth.GoogleAuth({
    credentials,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });
  const authClient = await auth.getClient();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return google.sheets({ version: 'v4', auth: authClient as any }); 
}

const SPREADSHEET_ID = process.env.GOOGLE_SHEET_ID;
const TOOLS_SHEET_NAME = 'כלי AI לחינוך - Tools'; 
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const EXAMPLES_SHEET_NAME = 'כלי AI לחינוך - EXAMPLES';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
const TUTORIALS_SHEET_NAME = 'כלי AI לחינוך - TUTORIALS';

// Helper to map sheet rows to AiTool objects based on the new structure
function mapRowToAiTool(row: (string | number | boolean | null)[]): AiTool { // Removed _headers
  const tool: AiTool = {
    id: String(row[0] || ''), // ID
    name: String(row[1] || ''), // שם הכלי
    link: String(row[2] || ''), // קישור
    logo: row[3] ? String(row[3]) : undefined, // לוגו
    generalRating: row[4] ? Number(row[4]) : undefined, // דירוג
    description: String(row[5] || ''), // תיאור
    cons: row[6] ? String(row[6]) : undefined, // חסרונות
    pros: row[7] ? String(row[7]) : undefined, // יתרונות
    limitations: row[8] ? String(row[8]) : undefined, // מגבלות
    uploadedBy: row[9] ? String(row[9]) : undefined, // הועלה ע"י
    timestamp: row[10] ? String(row[10]) : undefined, // Timestamp
  };
  return tool;
}

export async function getToolsFromSheet(): Promise<AiTool[]> {
  try {
    const sheets = await getSheetsClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TOOLS_SHEET_NAME}!A:K`, // Adjusted to K for 11 columns (ID to Timestamp)
    });

    const rows = response.data.values;
    if (rows && rows.length > 1) {
      // const headers = rows[0]; // Headers are not used in mapRowToAiTool anymore
      return rows.slice(1).map(row => mapRowToAiTool(row as (string | number | boolean | null)[])).filter(tool => tool.id && tool.name); 
    } else {
      console.log('No data found in Tools sheet or sheet is empty.');
      return [];
    }
  } catch (error) {
    console.error('Error fetching tools from Google Sheet:', error);
    // It's often better to throw the error or handle it in a way that the caller knows about it
    // For now, returning an empty array to prevent crashes, but this might hide issues.
    throw new Error(`Failed to fetch tools: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function getToolByIdFromSheet(id: string): Promise<AiTool | null> {
  try {
    const tools = await getToolsFromSheet();
    const tool = tools.find(t => t.id === id);
    return tool || null;
  } catch (error) {
    console.error(`Error fetching tool with id ${id} from Google Sheet:`, error);
    throw new Error(`Failed to fetch tool by ID: ${error instanceof Error ? error.message : String(error)}`);
  }
}

export async function addToolToSheet(toolData: Omit<AiTool, 'id' | 'timestamp' | 'generalRating'> & { generalRating?: string | number }): Promise<AiTool> {
  try {
    const sheets = await getSheetsClient();
    const newId = uuidv4();
    const newTimestamp = new Date().toISOString();

    // Ensure all fields are defined, defaulting to empty strings or undefined if appropriate for the sheet
    const newRow = [
      newId, // ID
      toolData.name || '',
      toolData.link || '',
      toolData.logo || '', // logo can be empty
      toolData.generalRating !== undefined ? String(toolData.generalRating) : '', // generalRating can be empty
      toolData.description || '',
      toolData.cons || '', // cons can be empty
      toolData.pros || '', // pros can be empty
      toolData.limitations || '', // limitations can be empty
      toolData.uploadedBy || '', // uploadedBy can be empty
      newTimestamp
    ];

    await sheets.spreadsheets.values.append({
      spreadsheetId: SPREADSHEET_ID,
      range: `${TOOLS_SHEET_NAME}!A:K`, // Append to the range of columns
      valueInputOption: 'USER_ENTERED',
      requestBody: {
        values: [newRow],
      },
    });
    
    // Construct the AiTool object that was added
    const addedTool: AiTool = {
        ...toolData,
        id: newId,
        timestamp: newTimestamp,
        generalRating: toolData.generalRating // ensure this is passed correctly
    };
    return addedTool;

  } catch (error) {
    console.error('Error adding tool to Google Sheet:', error);
    throw new Error(`Failed to add tool: ${error instanceof Error ? error.message : String(error)}`);
  }
}

// Placeholder functions for reviews, examples, and tutorials - to be implemented
export async function getReviewsForTool(toolId: string): Promise<Review[]> {
  console.log(`Fetching reviews for toolId: ${toolId}`);
  return [];
}

export async function addReviewToSheet(reviewData: Omit<Review, 'id'>): Promise<Review> {
  console.log('Adding review:', reviewData);
  const newReview: Review = { ...reviewData, id: uuidv4() }; 
  return newReview;
}

// Similar stubs for Examples and Tutorials
// For EXAMPLES_SHEET_NAME and TUTORIALS_SHEET_NAME
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getExamplesForTool(toolId: string): Promise<any[]> { 
  console.log(`Fetching examples for toolId: ${toolId}`);
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addExampleToSheet(exampleData: any): Promise<any> { 
  console.log('Adding example:', exampleData);
  const newExample = { ...exampleData, id: uuidv4() };
  return newExample;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function getTutorialsForTool(toolId: string): Promise<any[]> {
  console.log(`Fetching tutorials for toolId: ${toolId}`);
  return [];
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export async function addTutorialToSheet(tutorialData: any): Promise<any> {
  console.log('Adding tutorial:', tutorialData);
  const newTutorial = { ...tutorialData, id: uuidv4() };
  return newTutorial;
}

export async function updateToolInSheet(toolId: string, updates: Partial<AiTool>): Promise<AiTool | null> {
    console.warn('updateToolInSheet is not fully implemented.');
    const tools = await getToolsFromSheet();
    const toolIndex = tools.findIndex(t => t.id === toolId);
    if (toolIndex === -1) return null;
    return { ...tools[toolIndex], ...updates };
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export async function deleteToolFromSheet(_toolId: string): Promise<boolean> {
    console.warn('deleteToolFromSheet is not fully implemented.');
    return false;
} 