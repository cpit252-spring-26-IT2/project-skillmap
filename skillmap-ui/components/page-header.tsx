import { Separator } from "@/components/ui/separator"
import { SidebarTrigger } from "@/components/ui/sidebar"

export function PageHeader({
  title,
  description,
  eyebrow,
  actions,
}: {
  title: string
  description?: string
  eyebrow?: string
  actions?: React.ReactNode
}) {
  return (
    <header className="sticky top-0 z-10 flex flex-col gap-4 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 px-4 py-4 lg:px-8">
      <div className="flex items-center gap-4">
        <SidebarTrigger className="-ml-2 lg:hidden" />
        <Separator orientation="vertical" className="h-6 lg:hidden" />
        <div className="flex flex-1 items-center justify-between gap-4">
          <div className="space-y-0.5">
            {eyebrow && (
              <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                {eyebrow}
              </p>
            )}
            <h1 className="font-serif text-2xl tracking-tight lg:text-3xl">
              {title}
            </h1>
          </div>
          {actions && <div className="flex items-center gap-2">{actions}</div>}
        </div>
      </div>
      {description && (
        <p className="text-sm text-muted-foreground max-w-2xl">{description}</p>
      )}
    </header>
  )
}
