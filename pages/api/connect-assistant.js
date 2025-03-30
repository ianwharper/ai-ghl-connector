import { google } from 'googleapis';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const {
    name,
    model,
    greeting,
    purpose,
    openaiKey,
    ghlApiKey,
    ghlSource
  } = req.body;

  if (!name || !model || !greeting || !purpose || !openaiKey || !ghlApiKey || !ghlSource) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const response = await fetch('https://api.openai.com/v1/assistants', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${openaiKey}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        name,
        model,
        instructions: `${greeting}\n\nPurpose: ${purpose}`,
        tools: [{ type: 'retrieval' }, { type: 'code_interpreter' }]
      })
    });

    const data = await response.json();
    if (!response.ok) return res.status(500).json({ error: data.error?.message });

    const assistantId = data.id;

    await logToGoogleSheet({
      name,
      model,
      assistantId,
      purpose,
      ghlSource
    });

    return res.status(200).json({ assistant_id: assistantId });
  } catch (err) {
    console.error('Error:', err);
    return res.status(500).json({ error: 'Server error occurred' });
  }
}

async function logToGoogleSheet(entry) {
  const auth = new google.auth.GoogleAuth({
    credentials: {
      client_email: process.env.GOOGLE_CLIENT_EMAIL,
      private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n')
    },
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
  });

  const sheets = google.sheets({ version: 'v4', auth });
  const sheetId = process.env.GOOGLE_SHEET_ID;

  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: 'Sheet1!A1',
    valueInputOption: 'RAW',
    requestBody: {
      values: [[
        new Date().toISOString(),
        entry.name,
        entry.model,
        entry.assistantId,
        entry.purpose,
        entry.ghlSource
      ]]
    }
  });
}
