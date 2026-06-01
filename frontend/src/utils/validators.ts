export const validators = {
  name: (val: string) => {
    if (!val) return 'Name is required';
    if (val.length < 2) return 'Name must be at least 2 characters';
    if (val.length > 60) return 'Name must not exceed 60 characters';
    return '';
  },
  email: (val: string) => {
    if (!val) return 'Email is required';
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!re.test(val)) return 'Please enter a valid email address';
    return '';
  },
  password: (val: string) => {
    if (!val) return 'Password is required';
    if (val.length < 8) return 'Password must be at least 8 characters';
    if (val.length > 16) return 'Password must not exceed 16 characters';
    if (!/[A-Z]/.test(val)) return 'Password must contain at least one uppercase letter';
    if (!/[!@#$%^&*()_+\-=[\]{};':"\\|,.<>/?]/.test(val))
      return 'Password must contain at least one special character';
    return '';
  },
  address: (val: string) => {
    if (val && val.length > 400) return 'Address must not exceed 400 characters';
    return '';
  },
};

export const getErrorMessage = (error: unknown): string => {
  if (!error) return 'An unexpected error occurred';
  if (typeof error === 'string') return error;

  const apiError = error as {
    response?: { data?: { message?: string | string[] } };
    message?: string;
  };
  const message = apiError.response?.data?.message;

  if (Array.isArray(message)) return message.join(', ');
  if (typeof message === 'string') return message;
  return apiError.message || 'An unexpected error occurred';
};
