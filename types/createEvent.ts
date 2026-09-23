/**
 * Data model for creating a new event in Lab 9.
 */
export type CreateEventForm = {
  title: string;
  category: string;
  locationName: string;
  latitude: number;
  longitude: number;
  description: string;
  imageUri: string | null;
};

export type CreateEventErrors = Partial<Record<keyof CreateEventForm, string>>;
