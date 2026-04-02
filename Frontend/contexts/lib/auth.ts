// Authentication utility functions
import {
  apiRegister as apiRegisterUser,
  apiLogin as apiLoginUser,
  apiLogout as apiLogoutUser,
  apiGetCurrentUser,
  setAuthToken,
  clearAuthToken,
  getAuthToken as getStoredToken,
} from "@/contexts/api";

export interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  userId?: string;
}

export interface AuthResponse {
  success: boolean;
  user?: User;
  token?: string;
  error?: string;
}

interface ApiUserShape {
  id?: string;
  userId?: string;
  email: string;
  name: string;
  phone?: string;
}

const CURRENT_USER_KEY = "currentUser";
const TOKEN_LIFETIME_MS = 24 * 60 * 60 * 1000; // 24 hours

function getPreferredStorage(remember: boolean): Storage | null {
  if (typeof window === "undefined") return null;
  return remember ? localStorage : sessionStorage;
}

function getActiveAuthStorage(): Storage | null {
  if (typeof window === "undefined") return null;
  if (localStorage.getItem("authToken")) return localStorage;
  if (sessionStorage.getItem("authToken")) return sessionStorage;
  return null;
}

function persistCurrentUser(user: User, remember: boolean): void {
  const storage = getPreferredStorage(remember);
  if (!storage) return;

  // Store with timestamp for security validation
  const userData = {
    ...user,
    _timestamp: Date.now(),
  };
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
  storage.setItem(CURRENT_USER_KEY, JSON.stringify(userData));
}

function clearStoredCurrentUser(): void {
  if (typeof window === "undefined") return;
  localStorage.removeItem(CURRENT_USER_KEY);
  sessionStorage.removeItem(CURRENT_USER_KEY);
}

function normalizeUser(user: ApiUserShape): User | null {
  const id = user.id || user.userId;
  if (!id) return null;

  return {
    id,
    email: user.email,
    name: user.name,
    phone: user.phone,
  };
}

// Validate password strength (OWASP recommendations)
export function validatePassword(password: string): {
  valid: boolean;
  error?: string;
} {
  if (password.length < 8) {
    return {
      valid: false,
      error: "Password must be at least 8 characters long",
    };
  }

  if (password.length > 128) {
    return {
      valid: false,
      error: "Password must not exceed 128 characters",
    };
  }

  // Check for at least one letter
  if (!/[a-zA-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one letter",
    };
  }

  // Check for at least one uppercase letter
  if (!/[A-Z]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one uppercase letter",
    };
  }

  // Check for at least one number or special character
  if (!/[0-9!@#$%^&*(),.?":{}|<>]/.test(password)) {
    return {
      valid: false,
      error: "Password must contain at least one number or special character",
    };
  }

  return { valid: true };
}

// Sanitize email input
function sanitizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

// Register a new user
export async function register(
  name: string,
  email: string,
  phone: string,
  password: string,
): Promise<AuthResponse> {
  // Validate password strength
  const passwordValidation = validatePassword(password);
  if (!passwordValidation.valid) {
    return {
      success: false,
      error: passwordValidation.error,
    };
  }

  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Call backend API
  const response = await apiRegisterUser(name, sanitizedEmail, phone, password);

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  const { user, token } = response.data || {};
  const normalizedUser = user ? normalizeUser(user) : null;
  if (!normalizedUser || !token) {
    return {
      success: false,
      error: "Invalid response from server",
    };
  }

  // Save token (remember by default for registration flow)
  setAuthToken(token, true);

  // Save user to localStorage for faster local access
  if (typeof window !== "undefined") {
    persistCurrentUser(normalizedUser, true);
  }

  return {
    success: true,
    user: normalizedUser,
    token,
  };
}

// Login user with rate limiting awareness
export async function login(
  email: string,
  password: string,
  rememberMe: boolean = false,
): Promise<AuthResponse> {
  // Sanitize email
  const sanitizedEmail = sanitizeEmail(email);

  // Call backend API
  const response = await apiLoginUser(sanitizedEmail, password);

  if (!response.success) {
    return {
      success: false,
      error: response.error,
    };
  }

  const { user, token } = response.data || {};
  const normalizedUser = user ? normalizeUser(user) : null;
  if (!normalizedUser || !token) {
    return {
      success: false,
      error: "Invalid response from server",
    };
  }

  // Save token
  setAuthToken(token, rememberMe);

  // Save user to localStorage for faster local access
  if (typeof window !== "undefined") {
    persistCurrentUser(normalizedUser, rememberMe);
  }

  return {
    success: true,
    user: normalizedUser,
    token,
  };
}

// Logout user
export async function logout(): Promise<void> {
  // Call backend API to logout
  try {
    await apiLogoutUser();
  } catch {
    // Continue with local cleanup even if backend fails
  }

  clearAuthToken();
  clearStoredCurrentUser();
}

// Get current user from server
export async function getCurrentUserFromServer(): Promise<User | null> {
  const response = await apiGetCurrentUser();

  if (!response.success || !response.data?.user) {
    return null;
  }

  return normalizeUser(response.data.user) ?? null;
}

// Get current user from local storage with validation
export function getCurrentUser(): User | null {
  if (typeof window === "undefined") return null;
  if (!getStoredToken()) {
    clearStoredCurrentUser();
    return null;
  }

  const storage = getActiveAuthStorage();
  const userStr =
    storage?.getItem(CURRENT_USER_KEY) ||
    localStorage.getItem(CURRENT_USER_KEY) ||
    sessionStorage.getItem(CURRENT_USER_KEY);
  if (!userStr) return null;

  try {
    const userData = JSON.parse(userStr) as User & { _timestamp?: number };

    // Validate user data age (optional: force refresh after 24h)
    if (userData._timestamp) {
      const age = Date.now() - userData._timestamp;
      if (age > TOKEN_LIFETIME_MS) {
        // Data is stale, clear it
        clearStoredCurrentUser();
        return null;
      }
    }

    // Return clean user object without internal fields
    delete userData._timestamp;
    return userData;
  } catch {
    clearStoredCurrentUser();
    return null;
  }
}

// Check if user is authenticated
export function isAuthenticated(): boolean {
  if (typeof window === "undefined") return false;

  const token = getStoredToken();
  return !!token;
}

// Get auth token
export function getAuthToken(): string | null {
  if (typeof window === "undefined") return null;

  return getStoredToken();
}
