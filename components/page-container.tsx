import { cn } from "@/lib/utils";

interface PageContainerProps extends React.HTMLAttributes<HTMLDivElement> {}

export function PageContainer({ className, ...props }: PageContainerProps) {
  return <div className={cn("mx-auto w-full max-w-7xl px-5 sm:px-8 lg:px-10", className)} {...props} />;
}
