interface CreateConversationInput {
  title?: string;
  content: string;
}

interface CreateConversationResponse {
  conversationId: string;
}

export async function createConversation(
  data: CreateConversationInput
): Promise<CreateConversationResponse> {
  const response = await fetch('/api/conversations', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    const errorData = await response.json();
    throw new Error(errorData.error || 'Erreur lors de la création de la conversation');
  }

  return response.json();
}
