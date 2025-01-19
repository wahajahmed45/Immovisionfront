'use client';
import { useEffect, useState } from 'react';
import { getPropertyById, handlePropertyApproval, addFavoriteProperty, removeFavoriteProperty, isAlreadyAdded } from '@/services/property/PropertyServices';
import SwiperComponent from '@/pages/components/property/SwiperComponent'; // Importer le SwiperComponent
import config from '@/utils/config';
import { PropertyDTO } from '@/types/PropertyDTO';
import { useRouter } from 'next/router';
import { sendMessage } from '@/services/Message/MessageServices';
import { ReviewSection } from '@/pages/components/review/ReviewSection';
import { ContactForm } from '@/pages/components/contact/ContactForm';
import { AgentCard } from '@/pages/components/agent/AgentCard';
import { ReviewService } from '@/services/review/ReviewService';
import { getUserEmail, getUserRole } from '@/stores/auth/auth';
import Link from 'next/link';

/**
 * Page de détails d'une propriété.
 * Affiche toutes les informations d'une propriété spécifique avec ses images,
 * caractéristiques, et permet les interactions (favoris, contact, avis).
 */
export default function PropertyDetails() {
  const router = useRouter();
  const { id } = router.query;
  const [property, setProperty] = useState<PropertyDTO | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agentEmail, setAgentEmail] = useState<string | null>("");
  const [userEmail, setUserEmail] = useState<string>("");
  const [averageRating, setAverageRating] = useState<number>(0);
  const [reviewCount, setReviewCount] = useState<number>(0);
  const [agentRating, setAgentRating] = useState<number>(0);
  const [agentReviewCount, setAgentReviewCount] = useState<number>(0);
  const [userRole, setUserRole] = useState<string>("");
  const [rejectReason, setRejectReason] = useState<string>("");
  const [showRejectModal, setShowRejectModal] = useState<boolean>(false);
  const [isFavorite, setIsFavorite] = useState<boolean>(false);
  
  /**
   * Récupère l'email de l'utilisateur connecté.
   */
  useEffect(() => {
    const userEmail = getUserEmail();
    if (userEmail) {
      setUserEmail(userEmail);
    }
  }, []);

  /**
   * Récupère le rôle de l'utilisateur connecté.
   */
  useEffect(() => {
    const role = getUserRole();
    if (role) {
      setUserRole(role);
    }
  }, []);

  /**
   * Charge les données de la propriété et ses avis.
   * Récupère également les notes moyennes si un agent est assigné.
   */
  useEffect(() => {
    const fetchPropertyData = async () => {
      if (id) {
        try {
          setLoading(true);
          const propertyData = await getPropertyById(id as string);
          
          if (!propertyData) {
            setError("Property not found");
            setProperty(null);
          } else {
            setProperty(propertyData);
            setError(null);
            
            // Récupération des notes uniquement si un agent est assigné
            if (propertyData.agentEmail) {
              try {
                // Récupération des notes de la propriété
                const [propertyRating, propertyReviews, agentRating, agentReviews] = await Promise.all([
                  ReviewService.getPropertyAverageRating(id as string),
                  ReviewService.getPropertyReviews(id as string),
                  ReviewService.getAgentOverallRating(propertyData.agentEmail),
                  ReviewService.getAgentReviewCount(propertyData.agentEmail)
                ]);
                
                setAverageRating(propertyRating);
                setReviewCount(propertyReviews.length);
                setAgentRating(agentRating);
                setAgentReviewCount(agentReviews);
              } catch (reviewError) {
                console.error("Erreur lors de la récupération des notes:", reviewError);
                setAverageRating(0);
                setReviewCount(0);
                setAgentRating(0);
                setAgentReviewCount(0);
              }
            }
          }
        } catch (error) {
          console.error("Erreur générale:", error);
          setError("Error fetching data");
          setProperty(null);
        } finally {
          setLoading(false);
        }
      }
    };

    fetchPropertyData();
  }, [id]);

  /**
   * Met à jour l'email de l'agent quand la propriété change.
   */
  useEffect(() => {
    setAgentEmail(property?.agentEmail || "");
  }, [property]);

  /**
   * Met à jour les notes (propriété et agent).
   * Appelé après l'ajout d'un nouvel avis.
   */
  const updateRatings = async () => {
    if (!id || !agentEmail) return;

    try {
      const [propertyRating, propertyReviews, agentRating, agentReviews] = await Promise.all([
        ReviewService.getPropertyAverageRating(id as string),
        ReviewService.getPropertyReviews(id as string),
        ReviewService.getAgentOverallRating(agentEmail),
        ReviewService.getAgentReviewCount(agentEmail)
      ]);

      setAverageRating(propertyRating);
      setReviewCount(propertyReviews.length);
      setAgentRating(agentRating);
      setAgentReviewCount(agentReviews);
    } catch (error) {
      console.error("Error updating ratings:", error);
    }
  };

  /**
   * Gère l'approbation ou le rejet d'une propriété par un agent.
   * @param isApproved true pour approuver, false pour rejeter
   * @param comment commentaire optionnel (obligatoire pour rejet)
   */
  const handleApproval = async (isApproved: boolean, comment: string = "") => {
    try {
      const success = await handlePropertyApproval(id as string, isApproved, comment, userEmail);
      if (success) {
        router.reload();
      }
    } catch (error) {
      console.error("Erreur lors de l'approbation:", error);
    }
  };

  /**
   * Vérifie si la propriété est dans les favoris de l'utilisateur.
   */
  useEffect(() => {
    const checkFavoriteStatus = async () => {
      if (userEmail && id) {
        try {
          const status = await isAlreadyAdded(id as string, userEmail);
          setIsFavorite(status);
        } catch (error) {
          console.error("Error checking favorite status:", error);
        }
      }
    };
    
    checkFavoriteStatus();
  }, [userEmail, id]);

  /**
   * Gère l'ajout/suppression des favoris.
   */
  const handleFavoriteToggle = async () => {
    if (!userEmail || !id) return;

    try {
      if (isFavorite) {
        await removeFavoriteProperty(id as string, userEmail);
      } else {
        await addFavoriteProperty(id as string, userEmail);
      }
      setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Error toggling favorite:", error);
    }
  };

  // Affichage du loader pendant le chargement
  if (loading) return (
    <div className="container py-20 text-center">
      <div className="animate-spin inline-block w-8 h-8 border-4 border-secondary-color border-t-transparent rounded-full mb-4"></div>
      <p>Loading...</p>
    </div>
  );

  // Affichage de l'erreur si la propriété n'existe pas
  if (error || !property) return (
    <div className="min-h-screen bg-gray-50">
      <div className="container py-20 text-center">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-2xl mx-auto">
          <i className="fas fa-exclamation-circle text-5xl text-red-500 mb-4"></i>
          <h1 className="text-2xl font-bold text-gray-800 mb-4">
            Property Not Found
          </h1>
          <p className="text-gray-600 mb-6">
            The property you are looking for does not exist or has been removed.
          </p>
          <Link 
            href="/"
            className="inline-block bg-secondary-color hover:bg-primary-color text-white px-6 py-3 rounded-lg transition-colors duration-300"
          >
            <i className="fas fa-home mr-2"></i>
            Return to Homepage
          </Link>
        </div>
      </div>
    </div>
  );

  // Formatage de la date
  const createdAt = property.updatedAt ? property.updatedAt : [];
  const dateString = `${createdAt[0]}${String(createdAt[1]).padStart(2, '0')}${String(createdAt[2]).padStart(2, '0')}`;
  const formattedDate = `${dateString.substring(6, 8)}/${dateString.substring(4, 6)}/${dateString.substring(0, 4)}`;

  // Encodage de l'adresse pour Google Maps
  const fullAddress = encodeURIComponent(`${property.location}`);
  
  // Rendu de la page avec toutes les sections
  return (
    <div>
      <main>
        {/* <!-- banner section --> */}
        <section>
          {/* <!-- banner section --> */}
          <div
            className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1"
          >
            <div className="container py-110px">
              <h1
                className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px"
              >
                <span
                  className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3"
                >Property details</span
                >
              </h1>
            </div>
          </div>
        </section>
        {/* <!-- details slider --> */}
        <SwiperComponent property={property} />
      
        {/* <!-- product details section --> */}
        <section>
          <div className="container modal-container property-tab pt-70px pb-20">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-x-30px">
              {/* <!-- details body --> */}
              <div className="lg:col-start-1 lg:col-span-8">
                {/* <!--  top --> */}
                <div className="container px-4 py-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                    {/* Prix */}
                    <div className="bg-secondary-color hover:bg-primary-color transition-all duration-300 rounded-lg shadow-md p-4 flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-sm text-white/90 mb-1">Price</span>
                        <span className="text-xl md:text-2xl font-bold text-white">
                          {new Intl.NumberFormat('fr-FR', {
                            style: 'decimal',
                            maximumFractionDigits: 0
                          }).format(property.price)} {property.priceLabel}
                        </span>
                      </div>
                    </div>
                    {/* Statut */}
                    <div className={`
                      ${property.status === 'solded' ? 'bg-red-500' : 
                        property.status === 'rent' ? 'bg-orange-500' : 
                        'bg-green-500'
                      } hover:bg-primary-color transition-all duration-300 rounded-lg shadow-md p-4 flex items-center justify-center`}
                    >
                      <div className="text-center">
                        <span className="block text-sm text-white/90 mb-1">Status</span>
                        <span className="text-xl md:text-2xl font-bold text-white">
                          {property.status === 'rent' ? 'For Rent' :
                           property.status === 'sale' ? 'For Sale' :
                           property.status === 'solded' ? 'Solded' : 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Date de mise à jour */}
                    <div className="bg-gray-600 hover:bg-primary-color transition-all duration-300 rounded-lg shadow-md p-4 flex items-center justify-center">
                      <div className="text-center">
                        <span className="block text-sm text-white/90 mb-1">Last Updated</span>
                        <span className="text-xl md:text-2xl font-bold text-white flex items-center justify-center">
                          <i className="far fa-calendar-alt mr-2"></i>
                          {formattedDate}
                        </span>
                      </div>
                    </div>

                    {/* Date de disponibilité */}
                    {property.availableFrom && (
                      <div className="bg-blue-600 hover:bg-primary-color transition-all duration-300 rounded-lg shadow-md p-4 flex items-center justify-center">
                        <div className="text-center">
                          <span className="block text-sm text-white/90 mb-1">Available From</span>
                          <span className="text-xl md:text-2xl font-bold text-white flex items-center justify-center">
                            <i className="fas fa-clock mr-2"></i>
                            {new Date(property.availableFrom).toLocaleDateString()}
                          </span>
                        </div>
                      </div>
                    )}

                    {/* Bouton pour ajouter ou supprimer des favoris */}
                    {userEmail && property.approvationStatus === 'APPROVED' && (
                      <button
                        onClick={handleFavoriteToggle}
                        className={`flex items-center gap-3 px-6 py-3 rounded-lg transition-all duration-300 text-lg ${
                          isFavorite 
                            ? 'bg-red-500 hover:bg-red-600' 
                            : 'bg-gray-200 hover:bg-gray-300'
                        }`}
                      >
                        <i className={`fas fa-heart text-xl ${isFavorite ? 'text-white' : 'text-gray-600'}`}></i>
                        <span className={`font-medium ${isFavorite ? 'text-white' : 'text-gray-700'}`}>
                          {isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
                        </span>
                      </button>
                    )}
                  </div>
                </div>

                {/* <!-- main --> */}
                <div>
                  <div className="flex items-center gap-4 mb-4">
                    <h4 className="text-2xl md:text-3xl lg:text-4xl xl:text-5xl font-bold text-heading-color transition-colors hover:text-secondary-color">
                      <span className="leading-tight">
                        {property.title}
                      </span>
                    </h4>
                    
                    {/* Rating à côté du titre */}
                    {agentEmail && averageRating > 0 && (
                      <div className="flex items-center bg-yellow-500 hover:bg-primary-color transition-all duration-300 rounded-lg shadow-md px-4 py-2">
                        <div className="flex items-center gap-2">
                          <i className="fas fa-star text-white"></i>
                          <span className="text-xl font-bold text-white">
                            {averageRating.toFixed(1)} / 5
                          </span>
                          <span className="text-sm text-white/90">
                            ({reviewCount})
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <p className="text-base md:text-lg flex items-center text-gray-600 hover:text-secondary-color transition-colors">
                    <i className="flaticon-pin text-secondary-color text-xl md:text-2xl mr-3"></i>
                    <span className="leading-relaxed">
                      {property.location}
                    </span>
                  </p>
                  {/* <!-- Description --> */}
                  <h4
                    className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px"
                  >
                    Description
                  </h4>
                  <p className="text-sm lg:text-base my-5">
                    <span className="leading-1.8 lg:leading-1.8"
                    > {property.description}</span
                    >
                  </p>
                  {/* <!-- Property Detail --> */}
                  <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
                    <i className="fas text-secondary-color mr-3"></i>
                  Property Detail
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full bg-white rounded-lg shadow-md border-2 border-border-color-11 overflow-hidden mb-60px">
                    {/* Left Column */}
                    <ul className="px-30px md:px-50px py-5 md:pt-30px md:pb-10 md:border-r md:border-border-color-7 space-y-4">
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-ruler-combined text-secondary-color mr-2"></i>
                          Living Area (sqm):
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.livingArea}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-door-open text-secondary-color mr-2"></i>
                          Number of Rooms:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.roomCounts}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-bath text-secondary-color mr-2"></i>
                          Number of Bathrooms:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.bathroom}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-home-alt text-secondary-color mr-2"></i>
                          Attic:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.attic ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-leaf text-secondary-color mr-2"></i>
                          Garden:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.garden ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-parking text-secondary-color mr-2"></i>
                          Garage:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.garage}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-building text-secondary-color mr-2"></i>
                          Building Condition:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.buildingCondition}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-layer-group text-secondary-color mr-2"></i>
                          Number of Floors:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.floorNumber}
                        </span>
                      </li>
                    </ul>

                    {/* Right Column */}
                    <ul className="px-30px md:px-50px py-5 md:pt-30px md:pb-10 space-y-4">
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-ruler-combined text-secondary-color mr-2"></i>
                          Land Area (sqm):
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.landArea}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-bed text-secondary-color mr-2"></i>
                          Number of Bedrooms:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.bedroom}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-toilet text-secondary-color mr-2"></i>
                          Number of Toilets:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.toilet}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-warehouse text-secondary-color mr-2"></i>
                          Basement:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.basement ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-leaf text-secondary-color mr-2"></i>
                          Garden Area:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.garden ? `${property.gardenArea}` : '0'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-parking text-secondary-color mr-2"></i>
                          Parking Spaces:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.parking ? 'Yes' : 'No'}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-calendar text-secondary-color mr-2"></i>
                          Year of Construction:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.yearBuilt}
                        </span>
                      </li>
                      <li className="flex items-center justify-between hover:bg-gray-50 p-3 rounded transition-colors">
                        <span className="text-gray-600">
                          <i className="fas fa-tree text-secondary-color mr-2"></i>
                          Type of Environment:
                        </span>
                        <span className="font-semibold text-heading-color">
                          {property.typeOfEnvironnement}
                        </span>
                      </li>
                    </ul>
                  </div>
                  {/* <!-- Amenities --> */}
                  <h4 className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px">
                    Amenities
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-60px">
                    {/* Exterior */}
                    {property.amenities.exterior.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h5 className="text-lg font-semibold text-secondary-color mb-4">
                          <i className="fas fa-home mr-2"></i>
                          Exterior
                        </h5>
                        <ul className="space-y-3">
                          {property.amenities.exterior.map((amenity, index) => (
                            <li key={`ext-${index}`} className="text-sm font-medium flex items-center text-gray-700">
                              <i className="fas fa-check text-secondary-color mr-3"></i>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Interior */}
                    {property.amenities.interior.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h5 className="text-lg font-semibold text-secondary-color mb-4">
                          <i className="fas fa-couch mr-2"></i>
                          Interior
                        </h5>
                        <ul className="space-y-3">
                          {property.amenities.interior.map((amenity, index) => (
                            <li key={`int-${index}`} className="text-sm font-medium flex items-center text-gray-700">
                              <i className="fas fa-check text-secondary-color mr-3"></i>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {/* Others */}
                    {property.amenities.other.length > 0 && (
                      <div className="bg-gray-50 p-6 rounded-lg">
                        <h5 className="text-lg font-semibold text-secondary-color mb-4">
                          <i className="fas fa-plus-circle mr-2"></i>
                          Others
                        </h5>
                        <ul className="space-y-3">
                          {property.amenities.other.map((amenity, index) => (
                            <li key={`other-${index}`} className="text-sm font-medium flex items-center text-gray-700">
                              <i className="fas fa-check text-secondary-color mr-3"></i>
                              {amenity}
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </div>
                  {/* <!-- Location --> */}
                  <h4
                    className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px"
                  >
                    Location
                  </h4>
                  <div className="h-360px mb-60px">

                    {/* Section de la carte */}
                    <iframe
                      width='100%'
                      height='100%'
                      style={{ border: 0 }}
                      loading="lazy"
                      allowFullScreen
                      referrerPolicy="no-referrer-when-downgrade"
                      src={`https://www.google.com/maps/embed/v1/place?key=${config.apiGoogleMap}=${fullAddress}`}
                    />


                  </div>
                  {/* <!-- Property Video --> */}
                  <h4
                    className="text-22px font-semibold leading-1.3 pl-10px border-l-2 border-secondary-color text-heading-color my-30px"
                  >
                    Property Video
                  </h4>
                  {property.propertyVideo ? (
                    <div className="mb-60px">
                      <div className="w-full h-auto lg:h-[450px] xl:h-[500px] min-h-80 md:min-h-[350px]">
                        <iframe
                          className="w-full h-full"
                          src={property.propertyVideo.replace('watch?v=', 'embed/')} // Pour YouTube
                          title="Property Video"
                          frameBorder="0"
                          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                          allowFullScreen
                        ></iframe>
                      </div>
                    </div>
                  ) : (
                    <div className="mb-60px text-center py-10 bg-gray-100">
                      <p className="text-gray-500">Aucune vidéo disponible pour cette propriété</p>
                    </div>
                  )}
                  {/* <!-- Customer Reviews --> */}
                  {agentEmail && (
                    <ReviewSection 
                      propertyId={id as string}
                      agentEmail={agentEmail}
                      userEmail={userEmail}
                      propertyStatus={property.status}
                      onReviewAdded={updateRatings}
                    />
                  )}
                </div>
              </div>
              {/* <!-- sidebar --> */}
              {userRole === 'ROLE_agent' && property.approvationStatus === 'PENDING' ? (
                <div className="lg:col-start-9 lg:col-span-4 pt-60px lg:pt-0">
                  <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-border-color-11">
                    <h4 className="text-lg font-semibold text-heading-color mb-25px">
                      <span className="leading-1.3 pl-10px border-l-2 border-secondary-color">
                        Property Approval
                      </span>
                    </h4>
                    <div className="flex flex-col gap-4">
                      <button
                        onClick={() => handleApproval(true)}
                        className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded"
                      >
                        APPROVE
                      </button>
                      <button
                        onClick={() => setShowRejectModal(true)}
                        className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                      >
                        REJECT
                      </button>
                    </div>
                  </div>

                  {/* Modal de rejet */}
                  {showRejectModal && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
                      <div className="bg-white p-6 rounded-lg w-96">
                        <h3 className="text-xl font-bold mb-4">Rejection Reason</h3>
                        <textarea
                          className="w-full p-2 border rounded mb-4"
                          rows={4}
                          value={rejectReason}
                          onChange={(e) => setRejectReason(e.target.value)}
                          placeholder="Please provide a reason for rejection..."
                        />
                        <div className="flex justify-end gap-2">
                          <button
                            onClick={() => setShowRejectModal(false)}
                            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded"
                          >
                            Cancel
                          </button>
                          <button
                            onClick={() => {
                              handleApproval(false, rejectReason);
                              setShowRejectModal(false);
                            }}
                            className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded"
                          >
                            Confirm Rejection
                          </button>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : property.approvationStatus === 'REJECTED' ? (
                <div className="lg:col-start-9 lg:col-span-4 pt-60px lg:pt-0">
                  <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-red-500">
                    <h4 className="text-lg font-semibold text-red-500 mb-25px">
                      <span className="leading-1.3 pl-10px border-l-2 border-red-500">
                        Property Rejected
                      </span>
                    </h4>
                    <p className="text-gray-700">
                      Reason: {property.approvationComment}
                    </p>
                  </div>
                </div>
              ) : property.approvationStatus === 'PENDING' ? (
                <div className="lg:col-start-9 lg:col-span-4 pt-60px lg:pt-0">
                  <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-yellow-500">
                    <h4 className="text-lg font-semibold text-yellow-500 mb-25px">
                      <span className="leading-1.3 pl-10px border-l-2 border-yellow-500">
                        Property Pending Approval
                      </span>
                    </h4>
                    <p className="text-gray-700">
                      This property is currently awaiting approval from an agent.
                    </p>
                  </div>
                </div>
              ) : agentEmail && (
                <div className="lg:col-start-9 lg:col-span-4 pt-60px lg:pt-0">
                  <AgentCard
                    name={property.agentName}
                    role="Agent"
                    rating={agentRating}
                    reviewCount={agentReviewCount}
                  />
                  {property.status !== 'solded' && (
                  <div className="px-5 pt-35px pb-10 xl:pl-35px xl:pr-30px mb-10 border-2 border-border-color-11">
                    <h4 className="text-lg font-semibold text-heading-color mb-25px">
                      <span className="leading-1.3 pl-10px border-l-2 border-secondary-color">
                        Contact
                      </span>
                    </h4>
                    <ContactForm 
                    agentEmail={agentEmail}
                    propertyId={id as string}
                    />
                  </div>
                  )}
                </div>
              )}
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

