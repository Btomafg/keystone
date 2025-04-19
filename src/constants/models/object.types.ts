import { ProjectStatus, ProjectType, RoomType } from "../enums/project?.enums";

export type User = {
  id: string;
  created_at: string;
  is_admin: boolean;
  admin_pin: string | null;
  
  title: string;
  date_of_birth: string | null;
  email: string;
  first_name: string;
  is_active: boolean;
  last_name: string;
  phone: string;
  profile_img_url: string;
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
  id: number;
  name: string;
  length: number;
  type: RoomType;
  height: number;
  project: string;
  walls: Wall[];
  layout: number;
  estimate: number;
  status?: string;
  construction_method?: number;
  crown?: number;
  door_material?: number;
  light_rail?: number;
  sub_material?: number;
  toe_style?: number;
}

export type Wall {
  id: number;
  name: string;
  wall_number: number;
  length: number;
  room_id: number;
  estimate: number;
  cabinets: Cabinet[];
}



export type Cabinet {
  id: number;
  name: string;
  status: number;
  quote: number;
  length?: number;
  width?: number;
  height?: number;
  sqft?: number;
  estimate: number;
  room?: number;
  createStep?: number;
  type?: number;
  wall_id?: number;
  grid_start_x?: number;
  grid_start_y?: number;
  grid_end_x?: number;
  grid_end_y?: number;
}
export type CabinetType = {
  id: number;
  name: string;
  description: string;
  min_height: number;
  max_height: number;
  min_width: number;
  max_width: number | null;
  base_y_lock: number;
  color: string;
  active: boolean;
  img_url: string;
};

export type Files = {
  id: number;
  name: string;
  url: string;
  type: number;
};
export type Appointment = {
  id: number;
  type: 0 | 1 | 2;
  status: string;
  start_time: string;
  end_time: string;
  created_at: string;
  updated_at: string;
};
export type Drawing = {
  id: number;
  name: string;
  file: Files;
  revision_notes: string;
  status: 'pending' | 'revisions_requested' | 'approved';
  project_id: number;
  updated_at: string;
  updated_by: string;
  created_at: string;
}
export type Project ={
  id: number;
  qualification: number;
  name: string;
  estimate: number;
  description: string;
  step: number;
  first_custom: boolean;
  street: string;
  city: string;
  state: string;
  zip: string;
  type: ProjectType;
  status: ProjectStatus ;
  rooms: Room[];
  drawings: Drawing[];
  files: Files[];
  appointments: Appointment[];
}

type CabinetCalculatorInput = {
  ceilingHeight: number;
  doorMaterial: number;
  subMaterial: number;
  constructionMethod: number;
  toeStyle: number;
  crown: number;
  lightRail: number;
  linearFootage: number;
};

export type BugReport = {
  id: string;
  user: string;
  type: string;
  description: string;
  created_at: string;
  updated_at: string;
};


export type Lead = {
  id: string;
  created_at: string;
  updated_at: string;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  nessage: string;
  status: string;
  agent: string;
}
