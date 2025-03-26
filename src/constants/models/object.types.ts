import { ProjectStatus, ProjectType, RoomType } from "../enums/project.enums";

export type User = {
  id: string;
  id: string;
  created_at: string;
  title: string;
  date_of_birth: string | null;
  email: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  phone: string;
  profile_picture_url: string;
  mfa: boolean;
  receive_email: boolean;
  receive_promotional: boolean;
  receive_push: boolean;
  receive_sms: boolean;
  updated_at: string;
};

export type FAQ = {
  answer: string;
  category: string;
  created_at: string;
  id: string;
  is_active: boolean;
  keywords: string[];
  question: string;
  search_count: number;
  version: number;
};

export type FAQFeedback = {
  created_at: string;
  faq_version: number;
  faq_id: string;
  id: string;
  result: string;
  user: string;
};

export type BillingAddress = {
  id: string;
  street: string;
  suite: string | null;
  city: string;
  state: string;
  zip: string;
  created_at: string;
};

export type BankDetails = {
  bank_name: string;
  bank_account: string;
  bank_routing: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
} | null;

export type CreditCardDetails = {
  cc_last4: string;
  cc_expiration: string;
  cc_code: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
} | null;

export type PaymentMethod = [
  {
    id: string;
    name: string;
    advertiser: string;
    default: boolean;
    type: 'CC' | 'ACH';
    billing_address: BillingAddress;
    verification_status: 'pending' | 'verified' | 'failed';
    verified_at: string;
    last_used_at: string;
    created_at: string;
    updated_at: string;
    bank_details: BankDetails;
    credit_card_details: CreditCardDetails;
  },
];

export type Room {
  id: string;
  name: string;
  type: RoomType;
  project: string;
  cabinets: Cabinet[];
  status?: string;
}

export type Cabinet {
  id: string;
  name: string;
  status: string;
  quote: number;
  ceilingHeight?: string;
  constructionMethod?: string;
  crown?: string;
  doorMaterial?: string;
  lightRail?: string;
  subMaterial?: string;
  toeStyle?: string;
  length?: number;
  width?: number;
  height?: number;
  sqft?: number;
  cuft?: number;
  room?: string;

}

export type Project {
  id: string;
  name: string;
  description: string;
  step: number;
  type: ProjectType;
  status: ProjectStatus ;
  rooms: Room[];
}

type CabinetCalculatorInput = {
  ceilingHeight: string;
  doorMaterial: string;
  subMaterial: string;
  constructionMethod: string;
  toeStyle: string;
  crown: string;
  lightRail: string;
  linearFootage: string;
};
