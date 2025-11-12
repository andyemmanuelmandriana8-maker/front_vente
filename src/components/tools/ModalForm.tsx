import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"

interface ModalFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  title: string
  description?: string
  children: React.ReactNode
  onCancel?: () => void
  onConfirm?: () => void
  confirmText?: string
  cancelText?: string
  isLoading?: boolean
  confirmVariant?: "default" | "destructive" | "outline" | "secondary" | "ghost" | "link"
}

export function ModalForm({
  open,
  onOpenChange,
  title,
  description,
  children,
  onCancel,
  onConfirm,
  confirmText = "Ajouter",
  cancelText = "Annuler",
  isLoading = false,
  confirmVariant = "default",
}: ModalFormProps) {
  const handleCancel = () => {
    onCancel?.()
    onOpenChange(false)
  }

  const handleConfirm = () => {
    onConfirm?.()
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange} modal={true}>
      <DialogContent className="sm:max-w-[500px] max-h-[90vh] flex flex-col p-0">
        <DialogHeader className="px-6 pt-6 pb-4">
          <DialogTitle>{title}</DialogTitle>
          {description && <DialogDescription>{description}</DialogDescription>}
        </DialogHeader>
        <div className="flex-1 overflow-y-auto px-6 pb-4">
          {children}
        </div>
        <DialogFooter className="border-t px-6 py-4 mt-auto">
          <Button
            variant="outline"
            onClick={handleCancel}
            disabled={isLoading}
          >
            {cancelText}
          </Button>
          <Button
            variant={confirmVariant}
            onClick={handleConfirm}
            disabled={isLoading}
          >
            {isLoading ? "Traitement..." : confirmText}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

