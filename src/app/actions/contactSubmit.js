"use server";

export async function callWebhook(payload) {
    
  const webhookUrl = "https://services.leadconnectorhq.com/hooks/m0qO8Jmz7jS7ZBy987oo/webhook-trigger/15e98912-a931-469d-be63-ff197c512074";

  try {
    const response = await fetch(webhookUrl, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error("Webhook call failed", error);
    throw error;
  }
}