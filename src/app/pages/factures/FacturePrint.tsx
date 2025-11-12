import { forwardRef } from "react"
import type { Facture } from "./columns"
import "./facture-print.css"

interface FacturePrintProps {
  facture: Facture
}

export const FacturePrint = forwardRef<HTMLDivElement, FacturePrintProps>(
  ({ facture }, ref) => {
    return (
      <div
        ref={ref}
        className="p-8 max-w-4xl mx-auto bg-white text-black print:p-8 print:max-w-none"
        style={{ fontFamily: "Arial, sans-serif" }}
      >
        {/* En-tête */}
        <div className="mb-8 border-b-2 border-gray-800 pb-4">
          <h1 className="text-3xl font-bold mb-2">FACTURE</h1>
          <div className="flex justify-between">
            <div>
              <p className="text-sm text-gray-600">Numéro de facture</p>
              <p className="text-lg font-semibold">{facture.numero}</p>
            </div>
            <div className="text-right">
              <p className="text-sm text-gray-600">Date</p>
              <p className="text-lg font-semibold">
                {new Date(facture.date).toLocaleDateString("fr-FR")}
              </p>
            </div>
          </div>
        </div>

        {/* Informations client */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4">Client</h2>
          <p className="text-lg">{facture.client}</p>
        </div>

        {/* Tableau des produits */}
        <div className="mb-8">
          <table className="w-full border-collapse border border-gray-800">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-800 px-4 py-2 text-left">
                  Produit
                </th>
                <th className="border border-gray-800 px-4 py-2 text-center">
                  Quantité
                </th>
                <th className="border border-gray-800 px-4 py-2 text-right">
                  Prix unitaire
                </th>
                <th className="border border-gray-800 px-4 py-2 text-right">
                  Total
                </th>
              </tr>
            </thead>
            <tbody>
              {facture.lignes.map((ligne, index) => (
                <tr key={index}>
                  <td className="border border-gray-800 px-4 py-2">
                    {ligne.produitNom}
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-center">
                    {ligne.quantite}
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-right">
                    {ligne.prixUnitaire.toFixed(2)} Ar
                  </td>
                  <td className="border border-gray-800 px-4 py-2 text-right">
                    {ligne.total.toFixed(2)} Ar
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Total */}
        <div className="flex justify-end mb-8">
          <div className="w-64">
            <div className="flex justify-between items-center py-2 border-t-2 border-gray-800">
              <span className="text-lg font-semibold">Total TTC</span>
              <span className="text-xl font-bold">
                {facture.total.toFixed(2)} Ar
              </span>
            </div>
            <div className="mt-4">
              <p className="text-sm text-gray-600">Statut</p>
              <p className="text-lg font-semibold">{facture.statut}</p>
            </div>
          </div>
        </div>

        {/* Pied de page */}
        <div className="mt-12 pt-4 border-t border-gray-300 text-sm text-gray-600 text-center">
          <p>Merci de votre confiance !</p>
        </div>
      </div>
    )
  }
)

FacturePrint.displayName = "FacturePrint"

