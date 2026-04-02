// NFC Business Profile services
// Business logic for NFC business card operations

import { db } from "../config/db";
import type { NfcBusinessProfile } from "../types/index";

interface CreateNfcBusinessInput {
  slug: string;
  name: string;
  title: string;
  phone?: string;
  email?: string;
  website?: string;
  bio?: string;
}

// Create NFC business profile
export async function createNfcBusinessProfile(
  userId: string,
  input: CreateNfcBusinessInput,
): Promise<{ success: boolean; data?: NfcBusinessProfile; error?: string }> {
  try {
    // Check if slug is already taken
    const existing = await db.nfcBusinessProfiles.findBySlug(input.slug);
    if (existing) {
      return { success: false, error: "Business slug already exists" };
    }

    // Check if user already has an NFC profile
    const userProfile = await db.nfcBusinessProfiles.findByUserId(userId);
    if (userProfile) {
      return {
        success: false,
        error: "User already has an NFC business profile",
      };
    }

    const profile = await db.nfcBusinessProfiles.create({
      userId,
      slug: input.slug,
      name: input.name,
      title: input.title,
      phone: input.phone,
      email: input.email,
      website: input.website,
      bio: input.bio,
    });

    return { success: true, data: profile };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to create NFC profile",
    };
  }
}

// Get NFC profile by slug
export async function getNfcProfileBySlug(
  slug: string,
): Promise<NfcBusinessProfile | null> {
  try {
    return await db.nfcBusinessProfiles.findBySlug(slug);
  } catch (error) {
    console.error("Error fetching NFC profile:", error);
    return null;
  }
}

// Get user's NFC profile
export async function getUserNfcProfile(
  userId: string,
): Promise<NfcBusinessProfile | null> {
  try {
    return await db.nfcBusinessProfiles.findByUserId(userId);
  } catch (error) {
    console.error("Error fetching user NFC profile:", error);
    return null;
  }
}

// Update NFC profile
export async function updateNfcProfile(
  userId: string,
  profileId: string,
  data: Partial<CreateNfcBusinessInput>,
): Promise<{ success: boolean; data?: NfcBusinessProfile; error?: string }> {
  try {
    const existing = await db.nfcBusinessProfiles.findById(profileId);
    if (!existing) {
      return { success: false, error: "Profile not found" };
    }
    if (existing.userId !== userId) {
      return {
        success: false,
        error: "You do not have permission to update this profile",
      };
    }

    if (data.slug && data.slug !== existing.slug) {
      const conflict = await db.nfcBusinessProfiles.findBySlug(data.slug);
      if (conflict) {
        return { success: false, error: "Business slug already exists" };
      }
    }

    const updates: Partial<CreateNfcBusinessInput> = {};
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.name !== undefined) updates.name = data.name;
    if (data.title !== undefined) updates.title = data.title;
    if (data.phone !== undefined) updates.phone = data.phone;
    if (data.email !== undefined) updates.email = data.email;
    if (data.website !== undefined) updates.website = data.website;
    if (data.bio !== undefined) updates.bio = data.bio;

    const updated =
      Object.keys(updates).length > 0
        ? await db.nfcBusinessProfiles.update(profileId, updates)
        : existing;

    if (!updated) {
      return { success: false, error: "Profile not found" };
    }

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update profile",
    };
  }
}

// Get NFC profile by ID
export async function getNfcProfileById(
  profileId: string,
): Promise<NfcBusinessProfile | null> {
  try {
    return await db.nfcBusinessProfiles.findById(profileId);
  } catch (error) {
    console.error("Error fetching NFC profile:", error);
    return null;
  }
}

// Delete NFC profile
export async function deleteNfcProfile(
  userId: string,
  profileId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const profile = await db.nfcBusinessProfiles.findById(profileId);
    if (!profile) {
      return { success: false, error: "Profile not found" };
    }
    if (profile.userId !== userId) {
      return {
        success: false,
        error: "You do not have permission to delete this profile",
      };
    }

    const deleted = await db.nfcBusinessProfiles.delete(profileId);
    if (!deleted) {
      return { success: false, error: "Profile not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to delete profile",
    };
  }
}

// Check if slug is available
export async function isSlugAvailable(slug: string): Promise<boolean> {
  try {
    return !(await db.nfcBusinessProfiles.slugExists(slug));
  } catch (error) {
    console.error("Error checking slug availability:", error);
    return false;
  }
}
