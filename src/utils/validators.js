/**
 * Validation functions for form fields.
 */

/**
 * Validate full name.
 * @param {string} name
 * @returns {string} Error message or empty string.
 */
export function validateName(name) {
  if (!name || !name.trim()) return 'Name is required.';
  if (name.trim().length < 2) return 'Name must be at least 2 characters.';
  return '';
}

/**
 * Validate email address.
 * @param {string} email
 * @returns {string} Error message or empty string.
 */
export function validateEmail(email) {
  if (!email || !email.trim()) return 'Email is required.';
  // Simple email regex
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!re.test(email.trim())) return 'Invalid email address.';
  return '';
}

/**
 * Validate mobile/phone number.
 * @param {string} phone
 * @returns {string} Error message or empty string.
 */
export function validateMobile(phone) {
  if (!phone || !phone.trim()) return 'Phone is required.';
  // Accepts 10-15 digits, optional +, spaces, dashes
  const re = /^(\+?\d[\d\s-]{8,14}\d)$/;
  if (!re.test(phone.trim())) return 'Invalid phone number.';
  return '';
}

/**
 * Validate department/position.
 * @param {string} department
 * @returns {string} Error message or empty string.
 */
export function validateDepartment(department) {
  if (!department || !department.trim()) return 'Position is required.';
  if (department.trim().length < 2) return 'Position must be at least 2 characters.';
  return '';
}