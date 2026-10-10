/**
 * Calls a server action from the client and never throws. Network failures,
 * timeouts and server errors become a normal `{ ok: false }` result, so the
 * UI always re-enables its buttons and shows a message instead of spinning
 * forever with nothing saved.
 */
export const ACTION_FAILED_MESSAGE = "That didn't go through. Please check your connection and try again.";

export async function runAction<T extends { ok: boolean }>(call: () => Promise<T>): Promise<T | { ok: false; error: string }> {
  try {
    return await call();
  } catch (err) {
    console.error("Server action failed:", err);
    return { ok: false, error: ACTION_FAILED_MESSAGE };
  }
}
