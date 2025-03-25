export type LoginBodyType = {
    email: string;
    password: string;
};

export type RegisterBodyType = {
    email: string;
    password: string;
    referral_code?: string;
};
export type JoinCompanyType = {
    email: string;
};

export type ForgetPasswordBodyType = {
    email: string;
};

export type VerifyForgotPasswordBodyType = {
    email: string;
    forget_password_code: string;
};

export type ResetPasswordBodyType = {
    email: string;
    code: number;
    password: string;
};

export type AccountVerificationBodyType = {
    email: string;
    code: string;
};

export type VerifyTokenBodyType = {
    resfresh: string;
};

export type CreateUserBodyType = {
    first_name: string;
    last_name: string;
    zip_code: string;
    state: string;
    street_address: string;
    mobile_phone: string;
    user_principal_name: string;
    password: string;
};



