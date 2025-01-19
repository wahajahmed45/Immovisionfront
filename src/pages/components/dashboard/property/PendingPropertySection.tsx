import { useRouter } from 'next/router';
import { PropertyDashboardDTO } from "@/types/Property/PropertyDashboardDTO";

interface PendingPropertySectionProps {
  pendingProperties?: PropertyDashboardDTO[];
}

export default function PendingPropertySection({ pendingProperties = [] }: PendingPropertySectionProps) {
  const router = useRouter();

  return (
    <div className="transition-all duration-300">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {pendingProperties.map((property) => (
          <div
            key={property.id}
            onClick={() => router.push(`/properties/details/${property.id}`)}
            className="bg-white rounded-lg shadow-md overflow-hidden cursor-pointer hover:shadow-lg transition-shadow"
          >
            {/* Image de la propriété */}
            <div className="relative h-48">
              <img
                src={property.imageUrl || '/img/placeholder-property.jpg'}
                alt={property.title}
                className="w-full h-full object-cover"
              />
              <span className="absolute top-4 right-4 px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm font-medium">
                En attente d'approbation
              </span>
            </div>

            {/* Informations de la propriété */}
            <div className="p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-2 line-clamp-1">
                {property.title}
              </h3>

              <div className="space-y-2 text-sm text-gray-600">
                <div className="flex items-center">
                  <i className="fas fa-map-marker-alt w-5 text-secondary-color"></i>
                  <span>{property.location}</span>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-tag w-5 text-secondary-color"></i>
                  <span className="font-semibold text-primary-color">
                    {property.price.toLocaleString()} {property.priceLabel}
                  </span>
                </div>

                <div className="flex items-center">
                  <i className="far fa-calendar w-5 text-secondary-color"></i>
                  <span>
                    Publié le: {new Date(property.createdAt).toLocaleDateString()}
                  </span>
                </div>

                <div className="flex items-center">
                  <i className="fas fa-clock w-5 text-secondary-color"></i>
                  <span>
                    Dernière mise à jour: {new Date(property.lastUpdatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </div>

            <div className="px-4 py-3 bg-gray-50 border-t flex justify-between items-center">
              <span className="text-sm text-gray-500">
                Cliquez pour voir les détails
              </span>
              <i className="fas fa-arrow-right text-secondary-color"></i>
            </div>
          </div>
        ))}
      </div>

      {pendingProperties.length === 0 && (
        <div className="text-center py-8 bg-gray-50 rounded-lg">
          <i className="fas fa-clipboard-check text-4xl text-gray-400 mb-3"></i>
          <p className="text-gray-500">Aucune propriété en attente d'approbation pour le moment</p>
        </div>
      )}
    </div>
  );
}
