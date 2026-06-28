"use client";

import { Button } from "@/components/ui/Button";
import { ja } from "@/lib/i18n/ja";
import { Captions } from "lucide-react";

type CaptionsControlProps = {
  enabled: boolean;
  onToggle: () => void;
};

export function CaptionsControl({ enabled, onToggle }: CaptionsControlProps) {
  return (
    <Button
      variant="icon"
      aria-label={enabled ? "字幕を非表示" : ja.captions}
      title={enabled ? "字幕を非表示にします" : "字幕を表示します"}
      aria-pressed={enabled}
      onClick={onToggle}
    >
      <Captions size={18} aria-hidden />
    </Button>
  );
}
