// Read env at request time, so the settings page reflects what the chat route
// actually uses instead of a value baked into the client bundle at build time.
export const dynamic = 'force-dynamic';

/**
 * Public, non-secret description of the model the bot uses in free mode.
 * Mirrors getDefaultFreeModel() in app/api/chat/route.ts.
 */
export async function GET() {
  const freeMode = process.env.NEXT_PUBLIC_FREE_MODE === 'true';
  return Response.json({
    model: freeMode
      ? process.env.FREE_MODE_DEFAULT_MODEL || '~deepseek/deepseek-v4-flash-latest'
      : null,
  });
}
