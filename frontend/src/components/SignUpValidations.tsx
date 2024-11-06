import * as Yup from 'yup';

const ValidationSchema = Yup.object({
    displayName: Yup.string().required('Display name is required').max(100, 'Cannot exceed 100 characters'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    password: Yup.string()
        .min(8, 'Password must be at least 8 characters')
        .matches(/[a-z]/, 'Password must contain at least one lowercase letter')
        .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
        .matches(/\d/, 'Password must contain at least one digit')
        .matches(/[@$!%*?&]/, 'Password must contain at least one special character')
        .required('Password is required'),
});

export default ValidationSchema;