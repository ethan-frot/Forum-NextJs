import { UpdateMessageRepository } from './UpdateMessageRepository';

export interface UpdateMessageCommand {
  messageId: string;
  userId: string;
  content: string;
}

export class UpdateMessageUseCase {
  constructor(private repository: UpdateMessageRepository) {}

  async execute(command: UpdateMessageCommand): Promise<void> {
    const message = await this.repository.findById(command.messageId);

    if (!message) {
      throw new Error('Message non trouvé');
    }

    if (message.authorId !== command.userId) {
      throw new Error("Vous n'êtes pas autorisé à modifier ce message");
    }

    message.updateContent(command.content);

    await this.repository.update(message);
  }
}
