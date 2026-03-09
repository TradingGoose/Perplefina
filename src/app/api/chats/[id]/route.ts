import { eq } from 'drizzle-orm';
import { loadPersistence } from '@/lib/persistence';

export const GET = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const persistence = await loadPersistence();

    if (!persistence) {
      return Response.json({ message: 'Chat not found' }, { status: 404 });
    }

    const chatExists = await persistence.db.query.chats.findFirst({
      where: eq(persistence.chats.id, id),
    });

    if (!chatExists) {
      return Response.json({ message: 'Chat not found' }, { status: 404 });
    }

    const chatMessages = await persistence.db.query.messages.findMany({
      where: eq(persistence.messages.chatId, id),
    });

    return Response.json(
      {
        chat: chatExists,
        messages: chatMessages,
      },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error in getting chat by id: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};

export const DELETE = async (
  req: Request,
  { params }: { params: Promise<{ id: string }> },
) => {
  try {
    const { id } = await params;
    const persistence = await loadPersistence();

    if (!persistence) {
      return Response.json({ message: 'Chat not found' }, { status: 404 });
    }

    const chatExists = await persistence.db.query.chats.findFirst({
      where: eq(persistence.chats.id, id),
    });

    if (!chatExists) {
      return Response.json({ message: 'Chat not found' }, { status: 404 });
    }

    await persistence.db
      .delete(persistence.chats)
      .where(eq(persistence.chats.id, id))
      .execute();
    await persistence.db
      .delete(persistence.messages)
      .where(eq(persistence.messages.chatId, id))
      .execute();

    return Response.json(
      { message: 'Chat deleted successfully' },
      { status: 200 },
    );
  } catch (err) {
    console.error('Error in deleting chat by id: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
