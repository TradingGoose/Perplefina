import { loadPersistence } from '@/lib/persistence';

export const GET = async (req: Request) => {
  try {
    const persistence = await loadPersistence();
    if (!persistence) {
      return Response.json({ chats: [] }, { status: 200 });
    }

    let chats = await persistence.db.query.chats.findMany();
    chats = chats.reverse();
    return Response.json({ chats: chats }, { status: 200 });
  } catch (err) {
    console.error('Error in getting chats: ', err);
    return Response.json(
      { message: 'An error has occurred.' },
      { status: 500 },
    );
  }
};
