import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import type { Commande } from "./columns"
import type { Paiement } from "./paiements"

interface CommandeDetailsProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  commande: Commande | null
  paiements?: Paiement[]
}

export function CommandeDetails({
  open,
  onOpenChange,
  commande,
  paiements = [],
}: CommandeDetailsProps) {
  if (!commande) return null

  const paiementsCommande = paiements.filter((p) => p.commandeId === commande.id)
  const totalPaye = paiementsCommande.reduce((sum, p) => sum + p.montant, 0)
  const reste = commande.total - totalPaye

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Détails de la commande {commande.numero}</DialogTitle>
          <DialogDescription>
            Informations complètes de la commande
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 mt-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Numéro</p>
              <p className="text-sm font-semibold">{commande.numero}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Date</p>
              <p className="text-sm font-semibold">
                {new Date(commande.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Client</p>
              <p className="text-sm font-semibold">{commande.client}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Statut</p>
              <p className="text-sm font-semibold">{commande.statut}</p>
            </div>
          </div>

          <div className="border-t pt-4">
            <p className="text-sm font-medium text-muted-foreground mb-3">
              Produits
            </p>
            <div className="space-y-2">
              {commande.lignes.map((ligne, index) => (
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
              <p className="text-lg font-semibold">Total de la commande</p>
              <p className="text-lg font-bold">{commande.total.toFixed(2)} Ar</p>
            </div>
          </div>

          {paiementsCommande.length > 0 && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-3">
                Paiements
              </p>
              <div className="space-y-2">
                {paiementsCommande.map((paiement) => (
                  <div
                    key={paiement.id}
                    className="flex justify-between items-center p-3 border rounded-md"
                  >
                    <div className="flex-1">
                      <p className="text-sm font-semibold">
                        {new Date(paiement.date).toLocaleDateString("fr-FR")}
                      </p>
                    </div>
                    <p className="text-sm font-semibold text-green-600">
                      {paiement.montant.toFixed(2)} Ar
                    </p>
                  </div>
                ))}
              </div>
              <div className="mt-4 space-y-2 pt-4 border-t">
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Total payé</span>
                  <span className="font-semibold text-green-600">
                    {totalPaye.toFixed(2)} Ar
                  </span>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-muted-foreground">Reste à payer</span>
                  <span
                    className={`font-semibold ${
                      reste <= 0 ? "text-green-600" : "text-orange-600"
                    }`}
                  >
                    {reste.toFixed(2)} Ar
                  </span>
                </div>
              </div>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

