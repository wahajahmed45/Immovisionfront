import { PropertyDTO } from './PropertyDTO';

export interface UpdatePropertyDTO extends PropertyDTO {
  propertyId: string;
  imagesToDelete: string[];
  existingImages: string[];
}
