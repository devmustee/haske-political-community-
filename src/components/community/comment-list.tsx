"use client";

import { createContext, useCallback, useContext, useMemo, useRef, useState } from "react";
import { useSession } from "next-auth/react";
import { toast } from "sonner";
import { createComment, deleteComment } from "@/lib/actions/posts";
import { runAction } from "@/lib/run-action";
import type { CommentThreadItem } from "@/lib/comment-item";

interface CommentListApi {
  comments: CommentThreadItem[];
  /** How many comments this list added or removed since the page loaded. */
  countDelta: number;
  /** Shows the comment at once, then saves it. Resolves true when saved. */
  send: (input: { postId: string; parentId?: string; content: string }) => Promise<boolean>;
  retry: (tempId: string) => void;
  discard: (tempId: string) => void;
  remove: (id: string) => Promise<void>;
}

const CommentListContext = createContext<CommentListApi | null>(null);

export function useCommentList() {
  return useContext(CommentListContext);
}

function mapTree(items: CommentThreadItem[], fn: (c: CommentThreadItem) => CommentThreadItem | null): CommentThreadItem[] {
  return items.flatMap((c) => {
    const next = fn(c);
    return next ? [{ ...next, children: mapTree(next.children, fn) }] : [];
  });
}

function contains(items: CommentThreadItem[], id: string): boolean {
  return items.some((c) => c.id === id || contains(c.children, id));
}

function insert(items: CommentThreadItem[], item: CommentThreadItem, parentId?: string): CommentThreadItem[] {
  if (!parentId) return [...items, item];
  return items.map((c) =>
    c.id === parentId ? { ...c, children: [...c.children, item] } : { ...c, children: insert(c.children, item, parentId) }
  );
}

/**
 * Holds a post's comments in the browser so a new comment appears the moment
 * it's sent, instead of after a save and a full page reload. If saving fails
 * the comment stays on screen, marked "not sent", with Retry and Discard.
 */
export function CommentListProvider({
  initial = [],
  onCountChange,
  children,
}: {
  initial?: CommentThreadItem[];
  onCountChange?: (delta: number) => void;
  children: React.ReactNode;
}) {
  const { data: session } = useSession();
  const [comments, setComments] = useState(initial);
  const [countDelta, setCountDelta] = useState(0);
  // Inputs of unsaved comments, kept so Retry can resend them.
  const pendingInputs = useRef(new Map<string, { postId: string; parentId?: string; content: string }>());

  const bumpCount = useCallback(
    (delta: number) => {
      setCountDelta((d) => d + delta);
      onCountChange?.(delta);
    },
    [onCountChange]
  );

  const save = useCallback(
    async (tempId: string) => {
      const input = pendingInputs.current.get(tempId);
      if (!input) return false;
      setComments((list) => mapTree(list, (c) => (c.id === tempId ? { ...c, status: "sending" } : c)));
      const result = await runAction(() => createComment(input));
      if (!result.ok) {
        setComments((list) => mapTree(list, (c) => (c.id === tempId ? { ...c, status: "failed" } : c)));
        toast.error(result.error);
        return false;
      }
      pendingInputs.current.delete(tempId);
      const saved = result.data.comment;
      setComments((list) =>
        // A repeat of a comment already shown (a double send) just disappears;
        // otherwise the saved comment replaces its temporary copy, keeping
        // any replies already added under it.
        contains(list, saved.id)
          ? mapTree(list, (c) => (c.id === tempId ? null : c))
          : mapTree(list, (c) => (c.id === tempId ? { ...saved, children: c.children } : c))
      );
      if (!result.data.duplicate) bumpCount(1);
      return true;
    },
    [bumpCount]
  );

  const send = useCallback<CommentListApi["send"]>(
    async (input) => {
      const user = session?.user;
      const tempId = `temp-${Date.now()}-${Math.random().toString(36).slice(2)}`;
      pendingInputs.current.set(tempId, input);
      const item: CommentThreadItem = {
        id: tempId,
        postId: input.postId,
        authorId: user?.id ?? "",
        content: input.content,
        createdAt: new Date().toISOString(),
        deletedAt: null,
        likesCount: 0,
        liked: false,
        author: {
          name: user?.name ?? "You",
          username: user?.username ?? "",
          avatarUrl: user?.image ?? null,
          verification: user?.verification ?? "NONE",
        },
        children: [],
        status: "sending",
      };
      setComments((list) => insert(list, item, input.parentId));
      return save(tempId);
    },
    [session, save]
  );

  const retry = useCallback((tempId: string) => void save(tempId), [save]);

  const discard = useCallback((tempId: string) => {
    pendingInputs.current.delete(tempId);
    setComments((list) => mapTree(list, (c) => (c.id === tempId ? null : c)));
  }, []);

  const remove = useCallback(
    async (id: string) => {
      const result = await runAction(() => deleteComment(id));
      if (!result.ok) {
        toast.error(result.error);
        return;
      }
      setComments((list) =>
        mapTree(list, (c) => (c.id === id ? { ...c, content: "[deleted]", deletedAt: new Date().toISOString() } : c))
      );
      bumpCount(-1);
    },
    [bumpCount]
  );

  const value = useMemo(
    () => ({ comments, countDelta, send, retry, discard, remove }),
    [comments, countDelta, send, retry, discard, remove]
  );
  return <CommentListContext.Provider value={value}>{children}</CommentListContext.Provider>;
}
