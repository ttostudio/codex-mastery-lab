import { Button } from "./Button";

type StateViewProps = {
  title: string;
  message: string;
  actionLabel?: string;
  onAction?: () => void;
};

export function StateView({ title, message, actionLabel, onAction }: StateViewProps) {
  return (
    <div className="state" role="status" aria-live="polite">
      <div>
        <h2>{title}</h2>
        <p className="muted">{message}</p>
        {actionLabel && onAction ? <Button onClick={onAction}>{actionLabel}</Button> : null}
      </div>
    </div>
  );
}
