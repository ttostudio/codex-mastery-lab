import type { Comment } from "@/lib/mocks/types";
import { formatDate, formatNumber } from "@/lib/utils/format";
import type { CSSProperties } from "react";

export function CommentsSection({ comments }: { comments: Comment[] }) {
  if (comments.length === 0) {
    return <p className="muted">まだコメントはありません。</p>;
  }

  return (
    <section aria-labelledby="comments-heading">
      <h2 id="comments-heading">コメント</h2>
      {comments.map((comment) => (
        <article className="comment" key={comment.id}>
          <div className="avatar" aria-hidden style={{ "--avatar-color": "#365c3a" } as CSSProperties}>
            {comment.author.slice(0, 1)}
          </div>
          <div>
            <strong>{comment.author}</strong>
            <div className="meta-line">
              <span>{formatDate(comment.postedAt)}</span>
              <span>{formatNumber(comment.likeCount)} 件のいいね</span>
            </div>
            <p>{comment.body}</p>
          </div>
        </article>
      ))}
    </section>
  );
}
