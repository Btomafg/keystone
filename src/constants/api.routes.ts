export const API_ROUTES = {
  // Auth Routes
  SIGN_IN: '/api/auth/signin/',
  SIGN_UP: '/api/auth/signup/',
  SIGN_OUT: '/api/auth/signout/',
  GET_SESSION: '/api/auth/session/',
  VERIFY_OTP: '/api/auth/verify-otp/',
  RESEND_OTP: '/api/auth/resend-otp/',
  FORGOT_PASSWORD: '/api/auth/forgot-password/',
  RESET_PASSWORD: '/api/auth/reset-password/',

  // Admin Routes
  ADMIN: {
    LEADS: {
      GET: '/api/admin/leads/',
      DELETE: '/api/admin/leads/',
      UPDATE: '/api/admin/leads/',
      CREATE: '/api/admin/leads/',
    },
    NOTES: {
      GET: '/api/admin/notes/',
      DELETE: '/api/admin/notes/',
      UPDATE: '/api/admin/notes/',
      CREATE: '/api/admin/notes/',
    },
    VALIDATE_ADMIN: '/api/admin/validate/',

    GET_USERS: '/api/admin/users/',
    GET_USER: '/api/admin/users/[id]/',
    UPDATE_USER: '/api/admin/users/[id]/',
    DELETE_USER: '/api/admin/users/[id]/',
    CREATE_USER: '/api/admin/users/',
  },

  // User Routes
  GET_USER: '/api/user/',
  CREATE_USER: '/api/user/',
  UPDATE_USER: '/api/user/',

  // project routes
  GET_PROJECTS: '/api/projects/',
  UPDATE_PROJECT: '/api/projects/',
  GET_PROJECT: '/api/projects/[id]/',
  CREATE_PROJECT: '/api/projects/create/',
  REVIEW_PROJECT: '/api/projects/review/',

  // room routes
  GET_ROOMS: '/api/projects/rooms/',
  UPDATE_ROOM: '/api/projects/rooms/',
  CREATE_ROOM: '/api/projects/rooms/create/',
  DELETE_ROOM: '/api/projects/rooms/',
  ROOM_OPTIONS: '/api/projects/rooms/options/',

  //Wall routes
  GET_WALLS: '/api/projects/walls/',
  UPDATE_WALL: '/api/projects/walls/',
  CREATE_WALL: '/api/projects/walls/create/',

  // cabinet routes
  GET_CABINETS: '/api/projects/cabinets/',
  GET_CABINET_OPTIONS: '/api/projects/cabinets/options/',
  UPDATE_CABINET: '/api/projects/cabinets/',
  CREATE_CABINET: '/api/projects/cabinets/create/',
  DELETE_CABINET: '/api/projects/cabinets/',
  CABINET_OPTIONS: '/api/projects/cabinets/options/',

  //FAQ routes
  GET_ALL_FAQS: '/api/faqs/',
  GET_MY_FAQ_FEEDBACK: '/api/faqs/feedback?',
  INCREASE_SEARCH_COUNT: '/api/faqs/searchcount/',
  FAQ_CREATE_FEEDBACK: '/api/faqs/feedback/',
};
