import { VALIDATION_RULES, FILE_UPLOAD } from './constants';

/**
 * Validate candidate name
 * @param {string} name - Name to validate
 * @returns {object} Validation result
 */
export const validateName = (name) => {
  if (!name || typeof name !== 'string') {
    return { isValid: false, error: 'Name is required' };
  }

  const trimmedName = name.trim();
  
  if (trimmedName.length < VALIDATION_RULES.NAME.MIN_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be at least ${VALIDATION_RULES.NAME.MIN_LENGTH} characters long` 
    };
  }

  if (trimmedName.length > VALIDATION_RULES.NAME.MAX_LENGTH) {
    return { 
      isValid: false, 
      error: `Name must be less than ${VALIDATION_RULES.NAME.MAX_LENGTH} characters long` 
    };
  }

  if (!VALIDATION_RULES.NAME.PATTERN.test(trimmedName)) {
    return { 
      isValid: false, 
      error: 'Name can only contain letters and spaces' 
    };
  }

  return { isValid: true };
};

/**
 * Validate email address
 * @param {string} email - Email to validate
 * @returns {object} Validation result
 */
export const validateEmail = (email) => {
  if (!email || typeof email !== 'string') {
    return { isValid: false, error: 'Email is required' };
  }

  const trimmedEmail = email.trim().toLowerCase();
  
  if (!VALIDATION_RULES.EMAIL.PATTERN.test(trimmedEmail)) {
    return { isValid: false, error: 'Please enter a valid email address' };
  }

  // Additional email validation
  const parts = trimmedEmail.split('@');
  if (parts.length !== 2) {
    return { isValid: false, error: 'Invalid email format' };
  }

  const [localPart, domain] = parts;
  
  if (localPart.length === 0 || localPart.length > 64) {
    return { isValid: false, error: 'Invalid email format' };
  }

  if (domain.length === 0 || domain.length > 255) {
    return { isValid: false, error: 'Invalid email domain' };
  }

  // Check for consecutive dots
  if (domain.includes('..') || localPart.includes('..')) {
    return { isValid: false, error: 'Invalid email format' };
  }

  return { isValid: true, value: trimmedEmail };
};

/**
 * Validate phone number
 * @param {string} phone - Phone number to validate
 * @returns {object} Validation result
 */
export const validatePhone = (phone) => {
  if (!phone || typeof phone !== 'string') {
    return { isValid: false, error: 'Phone number is required' };
  }

  const trimmedPhone = phone.trim();
  
  if (!VALIDATION_RULES.PHONE.PATTERN.test(trimmedPhone)) {
    return { 
      isValid: false, 
      error: 'Please enter a valid phone number (minimum 10 digits)' 
    };
  }

  // Extract digits only
  const digitsOnly = trimmedPhone.replace(/\D/g, '');
  
  if (digitsOnly.length < 10) {
    return { 
      isValid: false, 
      error: 'Phone number must contain at least 10 digits' 
    };
  }

  if (digitsOnly.length > 15) {
    return { 
      isValid: false, 
      error: 'Phone number cannot exceed 15 digits' 
    };
  }

  return { isValid: true, value: digitsOnly };
};

/**
 * Validate file upload
 * @param {File} file - File to validate
 * @returns {object} Validation result
 */
export const validateFile = (file) => {
  if (!file) {
    return { isValid: false, error: 'No file selected' };
  }

  // Check file size
  if (file.size > FILE_UPLOAD.MAX_SIZE) {
    const maxSizeMB = Math.round(FILE_UPLOAD.MAX_SIZE / (1024 * 1024));
    return { 
      isValid: false, 
      error: `File size must be less than ${maxSizeMB}MB` 
    };
  }

  // Check file type
  const fileName = file.name.toLowerCase();
  const hasValidExtension = FILE_UPLOAD.ALLOWED_EXTENSIONS.some(ext => 
    fileName.endsWith(ext)
  );
  
  const hasValidMimeType = FILE_UPLOAD.ALLOWED_TYPES.includes(file.type);

  if (!hasValidExtension && !hasValidMimeType) {
    return { 
      isValid: false, 
      error: 'Please upload a PDF or DOCX file only' 
    };
  }

  // Additional file validation
  if (file.size === 0) {
    return { isValid: false, error: 'File appears to be empty' };
  }

  return { isValid: true };
};

/**
 * Validate answer text
 * @param {string} answer - Answer to validate
 * @param {number} minLength - Minimum required length
 * @param {number} maxLength - Maximum allowed length
 * @returns {object} Validation result
 */
export const validateAnswer = (answer, minLength = 1, maxLength = 5000) => {
  if (!answer || typeof answer !== 'string') {
    return { isValid: false, error: 'Answer is required' };
  }

  const trimmedAnswer = answer.trim();
  
 if (trimmedAnswer.length < minLength) {
    return { 
      isValid: false, 
      error: `Answer must be at least ${minLength} characters long` 
    };
  }

  if (trimmedAnswer.length > maxLength) {
    return { 
      isValid: false, 
      error: `Answer must be less than ${maxLength} characters long` 
    };
  }

  return { isValid: true, value: trimmedAnswer };
};