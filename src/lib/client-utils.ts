import { AiTool } from '@/types';

export async function fetchToolById(id: string): Promise<AiTool | null> {
  // Ensure NEXT_PUBLIC_APP_URL is defined in your environment variables
  const appUrl = process.env.NEXT_PUBLIC_APP_URL;
  if (!appUrl) {
    console.error('NEXT_PUBLIC_APP_URL is not defined. Please set it in your environment variables.');
    // Optionally, throw an error or return a specific state to indicate configuration issue
    // For now, returning null to match original behavior on fetch failure
    return null;
  }

  try {
    const res = await fetch(`${appUrl}/api/tools/${id}`);
    if (!res.ok) {
      console.error('Failed to fetch tool', res.status, await res.text());
      return null;
    }
    // Ensure the response is JSON before parsing
    const contentType = res.headers.get("content-type");
    if (contentType && contentType.indexOf("application/json") !== -1) {
        return await res.json();
    } else {
        console.error('Received non-JSON response from API', await res.text());
        return null;
    }
  } catch (e) {
    console.error('Failed to parse tool JSON or network error', e);
    return null;
  }
} 