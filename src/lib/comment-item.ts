/** A comment as the browser sees it: only public author fields, dates as strings. */
export interface CommentThreadItem {
  id: string;
  postId: string;
  authorId: string;
  content: string;
  createdAt: string;
  deletedAt: string | null;
  likesCount: number;
  liked: boolean;
  author: { name: string; username: string; avatarUrl: string | null; verification: string };
  children: CommentThreadItem[];
  /** Set only on comments shown before the server has confirmed them. */
  status?: "sending" | "failed";
}
