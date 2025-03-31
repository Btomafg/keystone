import { cn } from "@/lib/utils";
import { Eye, EyeOffIcon } from "lucide-react";
import * as React from "react";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input
        type={type}
        className={cn(
          "flex h-8 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className
        )}
        ref={ref}
        {...props}
      />
    );
  }
);
Input.displayName = "Input";

const PasswordInput: React.FC<React.ComponentProps<"input">> = ({
  className,
  ...props
}) => {
  const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

  const toggleVisibility = () => {
    setIsPasswordVisible((prev) => !prev);
  };

  return (
    <div className="relative flex items-center">
      <Input
        type={isPasswordVisible ? "text" : "password"}
        className={cn("pr-10", className)}
        {...props}
      />
      <button
        type="button"
        onClick={toggleVisibility}
        className="absolute right-3 text-muted-foreground focus:outline-none"
      >
        {isPasswordVisible ? (
          <span aria-label="Hide password"><EyeOffIcon className="text-anchorYellow" /></span>
        ) : (
          <span aria-label="Show password"><Eye className="text-zinc-500" /></span>
        )}
      </button>
    </div>
  );
};

export { Input, PasswordInput };
