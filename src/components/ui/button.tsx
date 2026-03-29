import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-extrabold transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-[#a3b18a] text-white hover:bg-[#588157] hover:translate-x-2.5",
        active:
          "bg-[#588157] text-white hover:bg-[#588157] hover:translate-x-2.5",
        ghost: "hover:bg-[#a3b18a]/20 text-white",
        outline:
          "border border-[#588157] bg-transparent text-[#588157] hover:bg-[#588157] hover:text-white",
        login:
          "bg-[#a3b18a] text-white hover:bg-[#7a8d63] hover:-translate-y-0.5 shadow-md",
        cta: "bg-white text-black hover:bg-[#DAD7CD] hover:scale-110 shadow-[0_4px_0px_#bcbcbc] active:translate-y-1 active:shadow-none",
      },
      size: {
        default: "h-10 px-6 py-2",
        sm: "h-8 px-4 text-xs",
        lg: "h-12 px-8 text-base",
        icon: "h-10 w-10",
        menu: "w-full px-7 py-4 text-base text-left justify-start",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  }
);
Button.displayName = "Button";

export { Button, buttonVariants };
