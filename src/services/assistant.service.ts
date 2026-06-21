export const getAiAssistantReply = async (query: string) => {
  const response = await fetch("/api/assistant", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ query }),
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`AI assistant API failed: ${response.status} ${errorText}`);
  }

  return response.json();
};
