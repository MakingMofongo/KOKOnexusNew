const VAPI_TOKEN = process.env.VAPI_TOKEN;
const VAPI_API_URL = process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000';

export async function fetchVapiAssistants() {
  try {
    // Use the local Next.js API route instead of direct VAPI call
    const response = await fetch(`${VAPI_API_URL}/api/vapi/assistants`, {
      headers: {
        'Authorization': `Bearer ${VAPI_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch assistants');
    }

    const data = await response.json();
    return data.assistants || [];
  } catch (error) {
    console.error('Error fetching assistants:', error);
    throw error;
  }
} 