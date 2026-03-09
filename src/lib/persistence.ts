type Persistence = {
  db: any;
  chats: any;
  messages: any;
};

let persistencePromise: Promise<Persistence | null> | null = null;

export const loadPersistence = async (): Promise<Persistence | null> => {
  if (!persistencePromise) {
    persistencePromise = (async () => {
      try {
        const [{ default: db }, schema] = await Promise.all([
          import('@/lib/db'),
          import('@/lib/db/schema'),
        ]);

        return {
          db,
          chats: schema.chats,
          messages: schema.messages,
        };
      } catch (error) {
        console.warn(
          'Persistent storage unavailable. Continuing in stateless mode.',
          error,
        );
        return null;
      }
    })();
  }

  return persistencePromise;
};
