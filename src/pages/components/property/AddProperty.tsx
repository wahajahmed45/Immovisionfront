'use client';

import React, { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Script from 'next/script';
import { createProperty } from '../../../services/property/PropertyServices';
import { useLoadScript } from '@react-google-maps/api';
import usePlacesAutocomplete, {
  getGeocode,
  getLatLng,
} from 'use-places-autocomplete';

import { GoogleMap, Marker } from '@react-google-maps/api';
import config from '../../../utils/config';
import { getUserEmail } from '@/stores/auth/auth';
import Link from 'next/link';

interface PropertyFormData {
  title: string;
  description: string;
  type: string;
  status: string;
  price: number;
  priceLabel: string;
  pricePrefix: string;
  yearlyTaxRate: string;
  hoaFee: string;
  bedroom: number;
  roomCounts: number;
  bathroom: number;
  toilet: number;
  landArea: number;
  livingArea: number;
  floorNumber: number;
  typeOfEnvironnement: string;
  buildingCondition: string;
  basement: boolean;
  attic: boolean;
  garden: boolean;
  gardenArea: number;
  garage: number;
  parking: boolean;
  availableFrom: string;
  extraDetails: string;
  location: string;
  country: string;
  state: string;
  city: string;
  zip: string;
  images: File[];
  virtualTour: string;
  propertyVideo: string;
  floorPlan: string;
  amenities: {
    interior: string[];
    exterior: string[];
    other: string[];
  };
  available: boolean;
  forRent: boolean;
  featured: boolean;
  yearBuilt: string;
  imageUrl: string[];
  ownerEmail: string;
  agentName: string;
}

interface ErrorState {
  title?: string;
  description?: string;
  type?: string;
  status?: string;
  price?: string;
  priceLabel?: string;
  images?: string;
  location?: string;
  country?: string;
  state?: string;
  city?: string;
  zip?: string;
  availableFrom?: string;
  roomCounts?: string;
  bathroom?: string;
  bedroom?: string;
  toilet?: string;
  landArea?: string;
  livingArea?: string;
  buildingCondition?: string;
  typeOfEnvironnement?: string;
  floorNumber?: string;
  garage?: string;
  gardenArea?: string;
}

export default function AddProperty() {
  const userEmail = getUserEmail();

  if (!userEmail) {
    return (
      <div className="container py-8 text-center">
        <h2 className="text-2xl font-bold mb-4">Please login to add a property</h2>
        <Link
          href="/login"
          className="bg-secondary-color text-white px-6 py-2 rounded hover:bg-primary-color transition-colors"
        >
          Go to Login
        </Link>
      </div>
    );
  }

  console.log("le mail est " + userEmail);

  const router = useRouter();

  // État pour suivre l'étape courante
  const [currentStep, setCurrentStep] = useState<number>(1);

  // État du formulaire
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    type: 'None',
    status: 'no status',
    price: 0,
    priceLabel: '',
    pricePrefix: '',
    yearlyTaxRate: '',
    hoaFee: '',
    bedroom: 0,
    roomCounts: 0,
    bathroom: 0,
    toilet: 0,
    landArea: 0,
    livingArea: 0,
    floorNumber: 0,
    typeOfEnvironnement: '',
    buildingCondition: '',
    basement: false,
    attic: false,
    garden: false,
    gardenArea: 0,
    garage: 0,
    parking: false,
    availableFrom: '',
    extraDetails: '',
    location: '',
    country: '',
    state: '',
    city: '',
    zip: '',
    images: [],
    virtualTour: '',
    propertyVideo: '',
    floorPlan: '',
    amenities: {
      interior: [],
      exterior: [],
      other: []
    },
    available: false,
    forRent: false,
    featured: false,
    yearBuilt: '',
    imageUrl: [],
    ownerEmail: '',
    agentName: ''
  });

  // État pour les erreurs
  const [errors, setErrors] = useState<ErrorState>({});

  // Liste des commodités
  const interiorAmenities = [
    'Air Conditioning', 'Elevator', 'WiFi', 'Washer and dryer',
    'Ventilation', 'Water', 'TV Cable', 'Swimming Pool'
  ];

  const exteriorAmenities = [
    'Back yard', 'Basketball court', 'Front yard', 'Garage Attached',
    'Hot Bath', 'Pool', 'Lawn', 'Gym'
  ];

  const otherAmenities = [
    'Fireplace', 'Smoke detectors', 'Window Coverings'
  ];

  // Gestion des changements de commodités
  const handleAmenityChange = (category: 'interior' | 'exterior' | 'other', value: string, checked: boolean) => {
    setFormData((prev) => ({
      ...prev,
      amenities: {
        ...prev.amenities,
        [category]: checked
          ? [...prev.amenities[category], value.toLowerCase()]
          : prev.amenities[category].filter((item: string) => item !== value.toLowerCase())
      }
    }));
  };

  // Fonctions de validation
  const validateStep1 = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required.';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required.';
    }
    if (formData.type === 'None') {
      newErrors.type = 'Property type is required.';
    }
    if (formData.status === 'no status') {
      newErrors.status = 'Property status is required.';
    }
    if (!formData.price || Number(formData.price) <= 0) {
      newErrors.price = 'Price must be greater than zero.';
    }
    if (!formData.priceLabel
    ) {
      newErrors.priceLabel = 'Currency is required.';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateStep2 = (): boolean => {
    const newErrors: ErrorState = {};
    if (formData.images.length === 0) {
      newErrors.images = 'At least one image is required.';
    } else {
      const oversized = formData.images.some((file) => file.size > 2 * 1024 * 1024);
      if (oversized) {
        newErrors.images = 'Each image must be smaller than 2MB.';
      }
    }
    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors
    }));
    return Object.keys(newErrors).length === 0;
  };

  const validateStep3 = (): boolean => {
    const newErrors: ErrorState = {};

    if (!formData.location.trim()) {
      newErrors.location = 'Address is required.';
    }

    setErrors((prevErrors) => ({
      ...prevErrors,
      ...newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  const validateStep4 = (): boolean => {
    const newErrors: ErrorState = {};

    if (formData.bedroom < 0) {
      newErrors.bedroom = 'Number of bedrooms cannot be negative';
    }
    if (formData.roomCounts < 0) {
      newErrors.roomCounts = 'Total number of rooms cannot be negative';
    }
    if (formData.bathroom < 0) {
      newErrors.bathroom = 'Number of bathrooms cannot be negative';
    }
    if (formData.toilet < 0) {
      newErrors.toilet = 'Number of toilets cannot be negative';
    }
    if (formData.landArea < 0) {
      newErrors.landArea = 'Land area cannot be negative';
    }
    if (formData.livingArea < 0) {
      newErrors.livingArea = 'Living area cannot be negative';
    }
    if (formData.floorNumber < 0) {
      newErrors.floorNumber = 'Number of floors cannot be negative';
    }
    if (!formData.buildingCondition) {
      newErrors.buildingCondition = 'Property condition is required';
    }
    if (!formData.typeOfEnvironnement) {
      newErrors.typeOfEnvironnement = 'Environment type is required';
    }
    if (!formData.availableFrom) {
      newErrors.availableFrom = 'Availability date is required';
    }
    if (formData.garage < 0) {
      newErrors.garage = 'Number of garages cannot be negative';
    }
    if (formData.garden && formData.gardenArea < 0) {
      newErrors.gardenArea = 'Garden area cannot be negative';
    }

    setErrors(prevErrors => ({
      ...prevErrors,
      ...newErrors
    }));

    return Object.keys(newErrors).length === 0;
  };

  // Gestion des changements d'étape (pour le menu en haut)
  const handleStepChange = (stepNumber: number) => {
    setCurrentStep(stepNumber);
  };

  // Gestion des champs <select>
  const handleSelectChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // Gestion des champs <input> ou <textarea>
  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement> | ChangeEvent<HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Pour les champs numériques, permettre une valeur vide
    if (type === 'number') {
      // Si la valeur est vide ou un nombre valide
      if (value === '' || !isNaN(Number(value))) {
        setFormData((prev) => ({
          ...prev,
          [name]: value
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value
      }));
    }
  };

  // Gestion de l'upload d'images
  const handleImageUpload = (e: ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return;
    const files = Array.from(e.target.files);
    const oversized = files.some((file) => file.size > 2 * 1024 * 1024);
    if (oversized) {
      setErrors(prev => ({ ...prev, images: 'Each image must be smaller than 2MB.' }));
      return;
    }
    setFormData((prev) => ({
      ...prev,
      images: [...prev.images, ...files]
    }));
    // Réinitialiser l'erreur si l'image est valide
    setErrors(prev => ({ ...prev, images: undefined }));
  };

  // Navigation
  const goToNextStep = () => {
    setCurrentStep((prevStep) => prevStep + 1);
  };

  const goToPrevStep = () => {
    setCurrentStep((prevStep) => prevStep - 1);
  };

  // Gestion de la soumission du formulaire
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Map the form data to match the PropertyDTO structure
    const propertyDTO = {
      ...formData,
      bathroom: Number(formData.bathroom),
      area: Number(formData.livingArea),
      roomCount: Number(formData.roomCounts),
      bedroom: Number(formData.bedroom),
      toilet: Number(formData.toilet),
      landArea: Number(formData.landArea),
      garage: Number(formData.garage),
      gardenArea: Number(formData.gardenArea),
      availableFrom: formData.availableFrom,
      basement: formData.basement,
      attic: formData.attic,
      garden: formData.garden,
      parking: formData.parking,
      price: Number(formData.price),
      yearBuilt: formData.yearBuilt ? formData.yearBuilt.toString() : undefined,
      ownerEmail: userEmail
    };

    try {
      await createProperty(propertyDTO);
      router.push('/');
      alert('Property created successfully!');
    } catch (error: any) {
      console.error('Error:', error);
      alert('There was an error creating the property. Please try again.');
    }
  };

  // Ajout d'un nouvel état pour gérer la saisie de la nouvelle commodité
  const [newInteriorAmenity, setNewInteriorAmenity] = useState<string>('');

  // Ajout d'un état pour gérer les commodités personnalisées
  const [customInteriorAmenities, setCustomInteriorAmenities] = useState<string[]>([]);

  // Fonction pour ajouter une nouvelle commodité
  const handleAddCustomAmenity = () => {
    if (newInteriorAmenity.trim()) {
      setCustomInteriorAmenities(prev => [...prev, newInteriorAmenity.trim()]);
      // Ajouter automatiquement la nouvelle commodité à la sélection
      handleAmenityChange('interior', newInteriorAmenity.trim(), true);
      setNewInteriorAmenity(''); // Réinitialiser le champ
    }
  };

  // Ajout des nouveaux états pour les commodités extérieures personnalisées
  const [newExteriorAmenity, setNewExteriorAmenity] = useState<string>('');
  const [customExteriorAmenities, setCustomExteriorAmenities] = useState<string[]>([]);

  // Fonction pour ajouter une nouvelle commodité extérieure
  const handleAddCustomExteriorAmenity = () => {
    if (newExteriorAmenity.trim()) {
      setCustomExteriorAmenities(prev => [...prev, newExteriorAmenity.trim()]);
      // Ajouter automatiquement la nouvelle commodité à la sélection
      handleAmenityChange('exterior', newExteriorAmenity.trim(), true);
      setNewExteriorAmenity(''); // Réinitialiser le champ
    }
  };

  // Ajout des états pour les autres commodités personnalisées
  const [newOtherAmenity, setNewOtherAmenity] = useState<string>('');
  const [customOtherAmenities, setCustomOtherAmenities] = useState<string[]>([]);

  // Fonction pour ajouter une nouvelle commodité autre
  const handleAddCustomOtherAmenity = () => {
    if (newOtherAmenity.trim()) {
      setCustomOtherAmenities(prev => [...prev, newOtherAmenity.trim()]);
      // Ajouter automatiquement la nouvelle commodité à la sélection
      handleAmenityChange('other', newOtherAmenity.trim(), true);
      setNewOtherAmenity(''); // Réinitialiser le champ
    }
  };

  // Configuration de l'API Google Maps
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: config.apiGoogleMap.replace('&q', ''),
    libraries: ['places']
  });

  function LocationSearchBox() {
    const [searchValue, setSearchValue] = useState('');
  
    const handleSearch = async () => {
      if (!searchValue) return;
  
      try {
        const results = await getGeocode({ address: searchValue });
        const { lat, lng } = await getLatLng(results[0]);
  
        const formattedAddress = results[0].formatted_address;
        const addressComponents = results[0].address_components;
  
        // Extract individual address components
        let street = '';
        let city = '';
        let state = '';
        let country = '';
        let zip = '';
  
        addressComponents.forEach(component => {
          if (component.types.includes('street_number')) {
            street = component.long_name + ' ';
          }
          if (component.types.includes('route')) {
            street += component.long_name;
          }
          if (component.types.includes('locality')) {
            city = component.long_name;
          }
          if (component.types.includes('administrative_area_level_1')) {
            state = component.long_name;
          }
          if (component.types.includes('country')) {
            country = component.long_name;
          }
          if (component.types.includes('postal_code')) {
            zip = component.long_name;
          }
        });
  
        
        setFormData(prev => ({
          ...prev,
          location: formattedAddress,
          street,
          city,
          state,
          country,
          zip
        }));
  
       
        setErrors(prev => ({
          ...prev,
          location: undefined
        }));
      } catch (error) {
        console.error('Error geocoding address:', error);
      }
    };
    return (
      <div className="relative">
        <div className="mb-6">
          <label className="block text-sm font-bold text-gray-700 mb-1">
            Location <span className="text-red-500">*</span>
          </label>
          <div className="relative flex gap-2">
            <input
              type="text"
              value={searchValue}
              onChange={(e) => setSearchValue(e.target.value)}
              placeholder="Entrez une adresse..."
              className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleSearch();
                }
              }}
            />
            <button
              type="button"
              onClick={handleSearch}
              className="px-4 bg-secondary-color text-white hover:bg-black transition-colors duration-300"
            >
              Rechercher
            </button>
          </div>
        </div>

        {/* Carte Google Maps avec iframe */}
        {formData.location && (
          <iframe
            width='100%'
            height='400'
            style={{ border: 0, marginTop: '20px' }}
            loading="lazy"
            allowFullScreen
            referrerPolicy="no-referrer-when-downgrade"
            src={`https://www.google.com/maps/embed/v1/place?key=${config.apiGoogleMap.replace('&q', '')}&q=${encodeURIComponent(formData.location)}&zoom=18`}
          />
        )}

        {/* Affichage de l'adresse sélectionnée */}
        {formData.location && (
          <div className="mt-4 p-4 bg-gray-50 rounded">
            <h6 className="font-bold mb-2">Adresse sélectionnée :</h6>
            <p>{formData.location}</p>
          </div>
        )}
      </div>
    );
  }

  return (
    <div>
      <section>
        {/* Banner section */}
        <div className="w-full bg-[url('/img/bg/14.jpg')] bg-no-repeat bg-cover bg-center relative z-0 after:w-full after:h-full after:absolute after:top-0 after:left-0 after:bg-white after:bg-opacity-30 after:-z-1">
          <div className="container py-110px">
            <h1 className="text-2xl sm:text-3xl md:text-26px lg:text-3xl xl:text-4xl font-bold text-heading-color mb-15px">
              <span className="leading-1.3 md:leading-1.3 lg:leading-1.3 xl:leading-1.3">
                Add Listing
              </span>
            </h1>
          </div>
        </div>

        <div className="container py-30">
          <div className="tab plan-tab">
            {/* Tab Navigation */}
            <div className="tab-links flex flex-wrap items-center justify-center gap-x-5 lg:gap-x-30px xl:gap-x-50px gap-y-10px text-sm lg:text-lg xl:text-xl text-heading-color mb-50px">
              {['Description', 'Media', 'Location', 'Details', 'Amenities'].map(
                (step, index) => (
                  <button
                    key={step}
                    onClick={() => handleStepChange(index + 1)}
                    className={`p-1px border-b-2 ${currentStep === index + 1 ? 'border-secondary-color' : 'border-transparent'
                      } font-semibold relative leading-1.2 select-none pointer-events-none`}
                  >
                    {index + 1}. {step}
                  </button>
                )
              )}
            </div>

            <div className="tab-contents">
              {/* Step 1: Description */}
              <div className={currentStep === 1 ? '' : 'hidden'}>
                <form
                  onSubmit={handleSubmit}
                  className="form-primary add-property-form bg-white text-sm lg:text-base"
                >
                  {/* Basic Information */}
                  <div>
                    <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                      <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                        Basic Information
                      </span>
                    </h5>
                    <div className="grid grid-cols-1 gap-30px mb-35px">
                      {/* Title Field */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Title *
                        </label>
                        <input
                          type="text"
                          name="title"
                          value={formData.title}
                          onChange={handleInputChange}
                          placeholder="Property Title"
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.title ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                        />
                        {errors.title && (
                          <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                        )}
                      </div>

                      {/* Description Field */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Description *
                        </label>
                        <textarea
                          name="description"
                          value={formData.description}
                          onChange={handleInputChange}
                          placeholder="Property Description"
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.description ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color min-h-[150px] block w-full rounded-none`}
                        ></textarea>
                        {errors.description && (
                          <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                        )}
                      </div>
                    </div>

                    {/* Property Type and Status */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mb-35px">
                      {/* Property Type */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Property Type *
                        </label>
                        <select
                          name="type"
                          value={formData.type}
                          onChange={handleSelectChange}
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.type ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                        >
                          <option value="None">Select Property Type</option>
                          <option value="Apartment">Apartment</option>
                          <option value="House">House</option>
                          <option value="Commercial">Commercial</option>
                          <option value="Garage">Garage</option>
                          <option value="Garden">Garden</option>
                          <option value="Condos">Condos</option>
                          <option value="Duplexes">Duplexes</option>
                          <option value="Industrial">Industrial</option>
                          <option value="Land">Land</option>
                          <option value="Offices">Offices</option>
                          <option value="Retail">Retail</option>
                          <option value="Villas">Villas</option>
                        </select>
                        {errors.type && (
                          <p className="text-red-500 text-sm mt-1">{errors.type}</p>
                        )}
                      </div>

                      {/* Property Status */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Status *
                        </label>
                        <select
                          name="status"
                          value={formData.status}
                          onChange={handleSelectChange}
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.status ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                        >
                          <option value="no status">Select Property Status</option>
                          <option value="for_sale">For Sale</option>
                          <option value="for_rent">For Rent</option>
                        </select>
                        {errors.status && (
                          <p className="text-red-500 text-sm mt-1">{errors.status}</p>
                        )}
                      </div>
                    </div>

                    {/* Price Information */}
                    <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                      <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                        Price Information
                      </span>
                    </h5>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mb-35px">
                      {/* Price Field */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Price *
                        </label>
                        <input
                          type="number"
                          name="price"
                          value={formData.price}
                          onChange={handleInputChange}
                          placeholder="Price (*numeric)"
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.price ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                        />
                        {errors.price && (
                          <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                        )}
                      </div>

                      {/* Price Label Select */}
                      <div className="relative">
                        <label className="block text-sm font-bold text-gray-700 mb-1">
                          Price Label *
                        </label>
                        <select
                          name="priceLabel"
                          value={formData.priceLabel}
                          onChange={handleSelectChange}
                          className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.priceLabel ? 'border-red-500' : 'border-border-color-9'
                            } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                        >
                          <option value="">Select Price Label</option>
                          <option value="€">€</option>
                          <option value="$">$</option>
                        </select>
                        {errors.priceLabel && (
                          <p className="text-red-500 text-sm mt-1">{errors.priceLabel}</p>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* "Next Step" Button */}
                  <div className="flex gap-5 justify-start">
                    <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                      <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          if (validateStep1()) {
                            goToNextStep();
                          }
                        }}
                        className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                      >
                        Next Step
                      </button>
                    </h5>
                  </div>
                </form>
              </div>

              {/* Step 2: Media */}
              <div className={currentStep === 2 ? '' : 'hidden'}>
                <div className="tab-content-item">
                  <div className="bg-white">
                    <div className="p-7">
                      {/* Images Upload */}
                      <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                        <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                          Upload Photo
                        </span>
                      </h5>

                      <div className="mb-30px">
                        <div className="upload-file">
                          <input
                            type="file"
                            name="images"
                            onChange={handleImageUpload}
                            multiple
                            accept="image/*"
                            className={`mt-1 block w-full ${errors.images ? 'border-red-500' : ''}`}
                          />
                          {errors.images && (
                            <p className="text-red-500 text-sm mt-1">{errors.images}</p>
                          )}

                          {/* Aperçu des images */}
                          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mt-4">
                            {formData.images.map((file, index) => (
                              <div key={index} className="relative group">
                                <img
                                  src={URL.createObjectURL(file)}
                                  alt={`Selected ${index + 1}`}
                                  className="w-full h-48 object-cover rounded"
                                />
                                <button
                                  onClick={() => {
                                    setFormData(prev => ({
                                      ...prev,
                                      images: prev.images.filter((_, i) => i !== index)
                                    }));
                                  }}
                                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center"
                                >
                                  ×
                                </button>
                              </div>
                            ))}
                          </div>
                        </div>
                        <p className="p-5 mb-5 lg:mb-6 text-sm space-y-1">
                          <span className="block leading-1.8 lg:leading-1.8">
                            * At least 1 image is required for a valid submission.
                          </span>
                          <span className="block leading-1.8 lg:leading-1.8">
                            * Maximum file size: 2 MB
                          </span>
                        </p>
                      </div>

                      {/* Video URL */}
                      <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                        <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                          Property Video
                        </span>
                      </h5>
                      <div className="mb-30px">
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Video URL
                          </label>
                          <input
                            type="url"
                            name="propertyVideo"
                            value={formData.propertyVideo}
                            onChange={handleInputChange}
                            placeholder="Enter video URL (YouTube, Vimeo, etc.)"
                            className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
                          />
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-5 justify-start">
                        {/* Prev Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPrevStep();
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Prev Step
                          </button>
                        </h5>

                        {/* Next Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (validateStep2()) {
                                goToNextStep();
                              }
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Next Step
                          </button>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 3: Location */}
              <div className={currentStep === 3 ? '' : 'hidden'}>
                <div className="tab-content-item">
                  <div className="bg-white">
                    <div className="p-7">
                      <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                        <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                          Listing Location
                        </span>
                      </h5>

                      <div className="grid grid-cols-1 gap-30px mb-35px">
                        {/* Location Search with Google Places Autocomplete */}
                        {isLoaded ? (
                          <LocationSearchBox />
                        ) : (
                          <div>Loading location search...</div>
                        )}
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-5 justify-start">
                        {/* Prev Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPrevStep();
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Prev Step
                          </button>
                        </h5>

                        {/* Next Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (validateStep3()) {
                                goToNextStep();
                              }
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Next Step
                          </button>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 4: Details */}
              <div className={currentStep === 4 ? '' : 'hidden'}>
                <div className="tab-content-item">
                  <div className="bg-white">
                    <div className="p-7">
                      <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                        <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                          Listing Details
                        </span>
                      </h5>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-30px mb-35px">
                        {/* Bedroom Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Bedrooms <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="bedroom"
                            value={formData.bedroom}
                            onChange={handleInputChange}
                            placeholder="Number of Bedrooms"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.bedroom ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.bedroom && (
                            <p className="text-red-500 text-sm mt-1">{errors.bedroom}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-bed text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Room Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Total Rooms <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="roomCounts"
                            value={formData.roomCounts}
                            onChange={handleInputChange}
                            placeholder="Total Number of Rooms"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.roomCounts ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.roomCounts && (
                            <p className="text-red-500 text-sm mt-1">{errors.roomCounts}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-door-open text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Bathroom Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Bathrooms <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="bathroom"
                            value={formData.bathroom}
                            onChange={handleInputChange}
                            placeholder="Number of Bathrooms"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.bathroom ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.bathroom && (
                            <p className="text-red-500 text-sm mt-1">{errors.bathroom}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-bath text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Toilet Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Toilets <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="toilet"
                            value={formData.toilet}
                            onChange={handleInputChange}
                            placeholder="Number of Toilets"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.toilet ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.toilet && (
                            <p className="text-red-500 text-sm mt-1">{errors.toilet}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-toilet text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Land Area */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Land Area (m²) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="landArea"
                            value={formData.landArea}
                            onChange={handleInputChange}
                            placeholder="Land Area in m²"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.landArea ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.landArea && (
                            <p className="text-red-500 text-sm mt-1">{errors.landArea}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-chart-area text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Living Area */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Living Area (m²) <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="livingArea"
                            value={formData.livingArea}
                            onChange={handleInputChange}
                            placeholder="Living Area in m²"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.livingArea ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.livingArea && (
                            <p className="text-red-500 text-sm mt-1">{errors.livingArea}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-home text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Floor Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Number of Floors <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="floorNumber"
                            value={formData.floorNumber}
                            onChange={handleInputChange}
                            placeholder="Number of Floors"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.floorNumber ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.floorNumber && (
                            <p className="text-red-500 text-sm mt-1">{errors.floorNumber}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-building text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Environment Type */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Environment Type <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="typeOfEnvironnement"
                            value={formData.typeOfEnvironnement}
                            onChange={handleSelectChange}
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.typeOfEnvironnement ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          >
                            <option value="">Select Environment Type</option>
                            <option value="urban">Urban</option>
                            <option value="suburban">Suburban</option>
                            <option value="rural">Rural</option>
                            <option value="coastal">Coastal</option>
                          </select>
                          {errors.typeOfEnvironnement && (
                            <p className="text-red-500 text-sm mt-1">{errors.typeOfEnvironnement}</p>
                          )}
                        </div>

                        {/* Property Condition */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Property Condition <span className="text-red-500">*</span>
                          </label>
                          <select
                            name="buildingCondition"
                            value={formData.buildingCondition}
                            onChange={handleSelectChange}
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.buildingCondition ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          >
                            <option value="">Select Property Condition</option>
                            <option value="new">New</option>
                            <option value="excellent">Excellent</option>
                            <option value="good">Good</option>
                            <option value="fair">Fair</option>
                            <option value="needs_renovation">Needs Renovation</option>
                          </select>
                          {errors.buildingCondition && (
                            <p className="text-red-500 text-sm mt-1">{errors.buildingCondition}</p>
                          )}
                        </div>

                        {/* Year of Building */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Year of Building
                          </label>
                          <input
                            type="number"
                            name="yearBuilt"
                            value={formData.yearBuilt}
                            onChange={handleInputChange}
                            min="1800"
                            max={new Date().getFullYear()}
                            placeholder="Enter construction year"
                            className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px block w-full rounded-none"
                          />
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-calendar text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Additional Features */}
                        <div className="col-span-2">
                          <label className="block text-sm font-bold text-gray-700 mb-3">
                            Additional Features
                          </label>
                          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                            {/* Basement */}
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                name="basement"
                                checked={formData.basement}
                                onChange={(e) => setFormData(prev => ({ ...prev, basement: e.target.checked }))}
                                className="form-checkbox"
                              />
                              <span>Basement</span>
                            </label>

                            {/* Attic */}
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                name="attic"
                                checked={formData.attic}
                                onChange={(e) => setFormData(prev => ({ ...prev, attic: e.target.checked }))}
                                className="form-checkbox"
                              />
                              <span>Attic</span>
                            </label>

                            {/* Garden */}
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                name="garden"
                                checked={formData.garden}
                                onChange={(e) => setFormData(prev => ({ ...prev, garden: e.target.checked }))}
                                className="form-checkbox"
                              />
                              <span>Garden</span>
                            </label>

                            {/* Parking */}
                            <label className="flex items-center space-x-2">
                              <input
                                type="checkbox"
                                name="parking"
                                checked={formData.parking}
                                onChange={(e) => setFormData(prev => ({ ...prev, parking: e.target.checked }))}
                                className="form-checkbox"
                              />
                              <span>Parking Space</span>
                            </label>
                          </div>
                        </div>

                        {/* Garden Area - Conditional */}
                        {formData.garden && (
                          <div className="relative">
                            <label className="block text-sm font-bold text-gray-700 mb-1">
                              Garden Area (m²) <span className="text-red-500">*</span>
                            </label>
                            <input
                              type="number"
                              name="gardenArea"
                              value={formData.gardenArea}
                              onChange={handleInputChange}
                              placeholder="Garden Area in m²"
                              className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.gardenArea ? 'border-red-500' : 'border-border-color-9'
                                } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                            />
                            {errors.gardenArea && (
                              <p className="text-red-500 text-sm mt-1">{errors.gardenArea}</p>
                            )}
                            <span className="absolute top-1/2 -translate-y-1/2 right-4">
                              <i className="fas fa-tree text-sm lg:text-base text-secondary-color font-bold"></i>
                            </span>
                          </div>
                        )}

                        {/* Garage Count */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Number of Garages <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="number"
                            name="garage"
                            value={formData.garage}
                            onChange={handleInputChange}
                            placeholder="Number of Garages (0 if none)"
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.garage ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.garage && (
                            <p className="text-red-500 text-sm mt-1">{errors.garage}</p>
                          )}
                          <span className="absolute top-1/2 -translate-y-1/2 right-4">
                            <i className="fas fa-warehouse text-sm lg:text-base text-secondary-color font-bold"></i>
                          </span>
                        </div>

                        {/* Available From */}
                        <div className="relative">
                          <label className="block text-sm font-bold text-gray-700 mb-1">
                            Available From <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="date"
                            name="availableFrom"
                            value={formData.availableFrom}
                            onChange={handleInputChange}
                            className={`text-paragraph-color pl-5 pr-50px outline-none border-2 ${errors.availableFrom ? 'border-red-500' : 'border-border-color-9'
                              } focus:border focus:border-secondary-color h-65px block w-full rounded-none`}
                          />
                          {errors.availableFrom && (
                            <p className="text-red-500 text-sm mt-1">{errors.availableFrom}</p>
                          )}
                        </div>
                      </div>

                      {/* Navigation Buttons */}
                      <div className="flex gap-5 justify-start">
                        {/* Prev Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPrevStep();
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Prev Step
                          </button>
                        </h5>

                        {/* Next Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              if (validateStep4()) {
                                goToNextStep();
                              }
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Next Step
                          </button>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Step 5: Amenities */}
              <div className={currentStep === 5 ? '' : 'hidden'}>
                <div className="tab-content-item">
                  <div className="bg-white">
                    <div className="p-7">
                      {/* Interior Amenities */}
                      <div className="mb-35px">
                        <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                          <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                            Interior Amenities
                          </span>
                        </h5>
                        {/* Add Custom Amenity */}
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newInteriorAmenity}
                            onChange={(e) => setNewInteriorAmenity(e.target.value)}
                            placeholder="Add custom amenity"
                            className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px flex-grow rounded-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomAmenity();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomAmenity}
                            className="px-4 bg-secondary-color text-white hover:bg-black transition-colors duration-300"
                          >
                            Add
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-1 mb-35px">
                          {/* Existing Amenities */}
                          {interiorAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-interior`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-interior`}
                                  checked={formData.amenities.interior.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'interior',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.interior.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                              </label>
                            </div>
                          ))}
                          {/* Custom Amenities */}
                          {customInteriorAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-custom-interior`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-custom-interior`}
                                  checked={formData.amenities.interior.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'interior',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.interior.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                                {/* Delete button for custom amenities */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomInteriorAmenities(prev =>
                                      prev.filter(item => item !== amenity)
                                    );
                                    handleAmenityChange('interior', amenity, false);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Exterior Amenities */}
                      <div className="mb-35px">
                        <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                          <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                            Exterior Amenities
                          </span>
                        </h5>
                        {/* Add Custom Exterior Amenity */}
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newExteriorAmenity}
                            onChange={(e) => setNewExteriorAmenity(e.target.value)}
                            placeholder="Add custom exterior amenity"
                            className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px flex-grow rounded-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomExteriorAmenity();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomExteriorAmenity}
                            className="px-4 bg-secondary-color text-white hover:bg-black transition-colors duration-300"
                          >
                            Add
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-1 mb-35px">
                          {/* Existing Exterior Amenities */}
                          {exteriorAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-exterior`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-exterior`}
                                  checked={formData.amenities.exterior.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'exterior',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.exterior.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                              </label>
                            </div>
                          ))}
                          {/* Custom Exterior Amenities */}
                          {customExteriorAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-custom-exterior`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-custom-exterior`}
                                  checked={formData.amenities.exterior.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'exterior',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.exterior.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                                {/* Delete button for custom exterior amenities */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomExteriorAmenities(prev =>
                                      prev.filter(item => item !== amenity)
                                    );
                                    handleAmenityChange('exterior', amenity, false);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Other Amenities */}
                      <div className="mb-35px">
                        <h5 className="text-sm md:text-15px lg:text-base font-bold leading-1.3 text-heading-color mb-15px">
                          <span className="leading-1.3 md:leading-1.3 lg:leading-1.3">
                            Other Amenities
                          </span>
                        </h5>
                        {/* Add Custom Other Amenity */}
                        <div className="flex gap-2 mb-4">
                          <input
                            type="text"
                            value={newOtherAmenity}
                            onChange={(e) => setNewOtherAmenity(e.target.value)}
                            placeholder="Add custom amenity"
                            className="text-paragraph-color pl-5 pr-50px outline-none border-2 border-border-color-9 focus:border focus:border-secondary-color h-65px flex-grow rounded-none"
                            onKeyPress={(e) => {
                              if (e.key === 'Enter') {
                                e.preventDefault();
                                handleAddCustomOtherAmenity();
                              }
                            }}
                          />
                          <button
                            type="button"
                            onClick={handleAddCustomOtherAmenity}
                            className="px-4 bg-secondary-color text-white hover:bg-black transition-colors duration-300"
                          >
                            Add
                          </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-30px gap-y-1 mb-35px">
                          {/* Existing Other Amenities */}
                          {otherAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-other`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-other`}
                                  checked={formData.amenities.other.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'other',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.other.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                              </label>
                            </div>
                          ))}
                          {/* Custom Other Amenities */}
                          {customOtherAmenities.map((amenity) => (
                            <div key={amenity} className="relative">
                              <label
                                htmlFor={`${amenity
                                  .toLowerCase()
                                  .replace(/\s+/g, '-')}-custom-other`}
                                className="checkbox-item leading-1.8 group flex items-center cursor-pointer"
                              >
                                <input
                                  type="checkbox"
                                  id={`${amenity
                                    .toLowerCase()
                                    .replace(/\s+/g, '-')}-custom-other`}
                                  checked={formData.amenities.other.includes(
                                    amenity.toLowerCase()
                                  )}
                                  onChange={(e) =>
                                    handleAmenityChange(
                                      'other',
                                      amenity,
                                      e.target.checked
                                    )
                                  }
                                  className="hidden"
                                />
                                <span
                                  className={`checkmark w-4 h-4 bg-white group-hover:bg-secondary-color border border-border-color-16 transition-all duration-300 relative z-0 after:absolute after:left-1 after:top-0 after:w-[5px] after:h-10px after:rotate-[45deg] after:border after:border-t-0 after:border-l-0 after:border-white mr-15px inline-block leading-1 ${formData.amenities.other.includes(
                                    amenity.toLowerCase()
                                  )
                                    ? 'active after:opacity-100 bg-secondary-color'
                                    : 'after:opacity-0'
                                    }`}
                                ></span>
                                {amenity}
                                {/* Delete button for custom other amenities */}
                                <button
                                  type="button"
                                  onClick={() => {
                                    setCustomOtherAmenities(prev =>
                                      prev.filter(item => item !== amenity)
                                    );
                                    handleAmenityChange('other', amenity, false);
                                  }}
                                  className="ml-2 text-red-500 hover:text-red-700"
                                >
                                  <i className="fas fa-times"></i>
                                </button>
                              </label>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Navigation/Submit Buttons */}
                      <div className="flex gap-5 justify-start">
                        {/* Prev Step */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="button"
                            onClick={(e) => {
                              e.preventDefault();
                              goToPrevStep();
                            }}
                            className="relative z-1 px-5 md:px-25px lg:px-10 py-10px md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Prev Step
                          </button>
                        </h5>

                        {/* Submit Property */}
                        <h5 className="uppercase text-sm md:text-base text-white relative group whitespace-nowrap font-normal mb-0 transition-all duration-300 border border-secondary-color hover:border-heading-color inline-block z-0">
                          <span className="inline-block absolute top-0 right-0 w-full h-full bg-secondary-color group-hover:bg-black -z-1 group-hover:w-0 transition-all duration-300"></span>
                          <button
                            type="submit"
                            onClick={handleSubmit}
                            className="relative z-1 px-30px lg:px-10 py-3 md:py-15px lg:py-17px group-hover:text-heading-color leading-1.5 uppercase"
                          >
                            Submit Property
                          </button>
                        </h5>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              {/* Fin Step 5 */}
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
