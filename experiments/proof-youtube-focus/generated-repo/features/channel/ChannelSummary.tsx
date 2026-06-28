import type { Channel } from "@/lib/mocks/types";
import { formatNumber } from "@/lib/utils/format";
import Link from "next/link";
import type { CSSProperties } from "react";

export function ChannelSummary({ channel }: { channel: Channel }) {
  return (
    <div className="channel-row">
      <div className="avatar" style={{ "--avatar-color": channel.avatarColor } as CSSProperties} aria-hidden>
        {channel.name.slice(0, 1)}
      </div>
      <div>
        <h2 style={{ margin: 0 }}>
          <Link href={`/channel/${channel.id}`}>{channel.name}</Link> {channel.verified ? "✓" : ""}
        </h2>
        <p className="muted">
          {channel.handle} / 登録者 {formatNumber(channel.subscriberCount)} 人
        </p>
        <p>{channel.description}</p>
      </div>
    </div>
  );
}
