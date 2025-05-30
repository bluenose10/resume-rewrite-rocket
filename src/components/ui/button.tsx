
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-full text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 touch-manipulation",
  {
    variants: {
      variant: {
        default: "bg-brand-cyan text-black hover:bg-brand-cyan/90 glow-cyan active:scale-95 transition-transform",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90 active:scale-95 transition-transform",
        outline:
          "border border-brand-cyan bg-transparent text-brand-cyan hover:bg-brand-cyan hover:text-black active:scale-95 transition-transform",
        secondary:
          "bg-brand-white text-brand-dark-navy hover:bg-brand-white/90 active:scale-95 transition-transform",
        ghost: "text-brand-cyan hover:bg-brand-cyan/10 hover:text-brand-cyan active:scale-95 transition-transform",
        link: "text-brand-cyan underline-offset-4 hover:underline",
      },
      size: {
        default: "h-10 px-4 py-2 min-h-[44px]",
        sm: "h-9 rounded-full px-3 min-h-[44px]",
        lg: "h-11 rounded-full px-8 min-h-[44px] text-base sm:text-lg",
        icon: "h-10 w-10 min-h-[44px] min-w-[44px]",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
