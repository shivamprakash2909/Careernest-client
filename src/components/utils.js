/**
 * Converts a string to a URL-friendly slug.
 * e.g., "My Page" -> "my-page"
 * @param {string} str - The string to convert.
 * @returns {string} The slugified string.
 */
const toSlug = (str) => {
  if (!str) return '';
  return str
    .toLowerCase()
    .replace(/ /g, '-')      // Replace spaces with hyphens
    .replace(/[^\w-]+/g, ''); // Remove all non-word characters except hyphens
};

/**
 * Creates a URL path for a given page name, handling optional query parameters.
 * This is the standard way to generate links for navigation within the app.
 *
 * @param {string} pagePath - The name of the page, which can include a query string.
 *   Examples:
 *   - "Dashboard" -> "/p/dashboard"
 *   - "Jobs?id=123" -> "/p/jobs?id=123"
 *   - "Company Details?name=TechCorp" -> "/p/company-details?name=TechCorp"
 *
 * @returns {string} The full URL path for the page. Returns "/" as a fallback.
 */
export function createPageUrl(pagePath) {
  if (typeof pagePath !== 'string' || !pagePath) {
    console.error("`createPageUrl` expects a non-empty string. Received:", pagePath);
    return "/"; // Return a safe fallback URL for the home page.
  }

  // Split the page path into the page name and the query string
  const [pageName, queryString] = pagePath.split('?');

  // Convert the page name part to a URL-friendly slug
  const slug = toSlug(pageName);

  // Construct the base path for the page
  const baseUrl = `/p/${slug}`;

  // If a query string exists, append it to the base URL
  if (queryString) {
    return `${baseUrl}?${queryString}`;
  }

  // Otherwise, return just the base URL
  return baseUrl;
}

// JWT Token validation utility
export const validateJWT = (token) => {
  if (!token) return { valid: false, reason: "No token provided" };
  
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      return { valid: false, reason: "Invalid token format" };
    }
    
    // Decode the payload (second part)
    const payload = JSON.parse(atob(parts[1]));
    
    // Check if token is expired
    const currentTime = Math.floor(Date.now() / 1000);
    if (payload.exp && payload.exp < currentTime) {
      return { valid: false, reason: "Token expired", payload };
    }
    
    return { valid: true, payload };
  } catch (error) {
    return { valid: false, reason: "Invalid token", error: error.message };
  }
};

// Get user info from localStorage
export const getUserInfo = () => {
  const jwt = localStorage.getItem("jwt");
  const user = localStorage.getItem("user");
  
  if (!jwt || !user) {
    return null;
  }
  
  try {
    const userData = JSON.parse(user);
    const tokenValidation = validateJWT(jwt);
    
    return {
      ...userData,
      tokenValid: tokenValidation.valid,
      tokenReason: tokenValidation.reason
    };
  } catch (error) {
    console.error("Error parsing user data:", error);
    return null;
  }
};