import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Facture } from "./columns"

interface FactureDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  facture: Facture | null
}

export function FactureDetails({
  open,
  onOpenChange,
  facture,
}: FactureDetailsProps) {
  if (!facture) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la facture {facture.numero}</DialogTitle>
          <DialogDescription>
            Informations complètes de la facture
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Numéro</p>
              <p className="text-sm font-semibold">{facture.numero}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm font-semibold">
                {new Date(facture.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p className="text-sm font-semibold">{facture.client}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-sm font-semibold">{facture.statut}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Produits
            </p>
            <div className="space-y-2">
              {facture.lignes.map((ligne, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center p-3 border rounded-md"
                >
                  <div className="flex-1">
                    <p className="text-sm font-semibold">{ligne.produitNom}</p>
                    <p className="text-xs text-muted-foreground">
                      Quantité: {ligne.quantite} × {ligne.prixUnitaire.toFixed(2)} Ar
                    </p>
                  </div>
                  <p className="text-sm font-semibold">
                    {ligne.total.toFixed(2)} Ar
                  </p>
                </div>
              ))}
            </div>
          </div>

          <div className="border-t pt-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-semibold">Total de la facture</p>
              <p className="text-lg font-bold">{facture.total.toFixed(2)} Ar</p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

