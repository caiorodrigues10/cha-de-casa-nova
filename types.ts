
export interface User {
  name: string;
  phone: string;
  isAdmin: boolean;
}

export interface Gift {
  id: string;
  name: string;
  description: string;
  imageUrl: string;
  link?: string; 
  priceEstimate?: number;
  reservedBy?: string; 
  isReserved: boolean;
}

export interface Presenca {
  name: string;
  phone: string;
  attending: boolean;
  adultsCount: number;
  childrenCount: number;
  guestsCount: number; 
  date: string;
}

export interface EventConfig {
  eventDate: string;
  eventTime: string;
  location: string;
  locationLink?: string; 
  rsvpDeadline: string;
  googleCalendarLink: string;
}
