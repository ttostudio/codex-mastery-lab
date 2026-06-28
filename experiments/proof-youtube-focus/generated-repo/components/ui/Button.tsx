import type { ButtonHTMLAttributes, ReactNode } from "react";

type ButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: "primary" | "secondary" | "icon";
  children: ReactNode;
};

export function Button({ variant = "secondary", children, ...props }: ButtonProps) {
  const className = variant === "primary" ? "primary-button" : variant === "icon" ? "icon-button" : "secondary-button";
  return (
    <button {...props} className={[className, props.className].filter(Boolean).join(" ")}>
      {children}
    </button>
  );
}
