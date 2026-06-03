/**
 * @typedef {Object} Submission
 * @property {string} name
 * @property {string} email
 * @property {string} phone
 * @property {string} position
 * @property {string} message
 * @property {string} submittedAt
 */

const STORAGE_KEY = 'hh_candidates';

/**
 * Safely parse JSON, fallback to defaultValue on error.
 * @param {string} str
 * @param {any} defaultValue
 * @returns {any}
 */
function safeParse(str, defaultValue) {
  try {
    return JSON.parse(str);
  } catch (e) {
    return defaultValue;
  }
}

/**
 * Get all submissions from localStorage.
 * @returns {Submission[]}
 */
export function getSubmissions() {
  try {
    const data = localStorage.getItem(STORAGE_KEY);
    if (!data) return [];
    const parsed = safeParse(data, []);
    if (Array.isArray(parsed)) return parsed;
    return [];
  } catch (e) {
    return [];
  }
}

/**
 * Save all submissions to localStorage.
 * @param {Submission[]} submissions
 * @returns {boolean} success
 */
export function saveSubmissions(submissions) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(submissions));
    return true;
  } catch (e) {
    return false;
  }
}

/**
 * Add a new submission to localStorage.
 * @param {Submission} submission
 * @returns {boolean} success
 */
export function addSubmission(submission) {
  try {
    const submissions = getSubmissions();
    submissions.push(submission);
    return saveSubmissions(submissions);
  } catch (e) {
    return false;
  }
}

/**
 * Update a submission at a given index.
 * @param {number} index
 * @param {Submission} updatedSubmission
 * @returns {boolean} success
 */
export function updateSubmission(index, updatedSubmission) {
  try {
    const submissions = getSubmissions();
    if (index < 0 || index >= submissions.length) return false;
    submissions[index] = { ...submissions[index], ...updatedSubmission };
    return saveSubmissions(submissions);
  } catch (e) {
    return false;
  }
}

/**
 * Delete a submission at a given index.
 * @param {number} index
 * @returns {boolean} success
 */
export function deleteSubmission(index) {
  try {
    const submissions = getSubmissions();
    if (index < 0 || index >= submissions.length) return false;
    submissions.splice(index, 1);
    return saveSubmissions(submissions);
  } catch (e) {
    return false;
  }
}

/**
 * Check if an email already exists in submissions.
 * @param {string} email
 * @returns {boolean}
 */
export function isEmailDuplicate(email) {
  try {
    const submissions = getSubmissions();
    const lower = email.trim().toLowerCase();
    return submissions.some(
      s => (s.email || '').trim().toLowerCase() === lower
    );
  } catch (e) {
    return false;
  }
}