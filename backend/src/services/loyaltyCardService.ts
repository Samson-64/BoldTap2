// Loyalty Card services
// Business logic for loyalty card operations

import { db } from "../config/db";
import type { LoyaltyCard, LoyaltyBusiness } from "../types/index";

interface CreateLoyaltyBusinessInput {
  slug: string;
  name: string;
  description?: string;
  maxPoints?: number;
}

interface CreateLoyaltyCardInput {
  businessId: string;
  userId: string;
}

// Create loyalty business
export async function createLoyaltyBusiness(
  userId: string,
  input: CreateLoyaltyBusinessInput,
): Promise<{ success: boolean; data?: LoyaltyBusiness; error?: string }> {
  try {
    if (
      input.maxPoints !== undefined &&
      (!Number.isFinite(input.maxPoints) || input.maxPoints <= 0)
    ) {
      return { success: false, error: "Max points must be a positive number" };
    }

    // Check if slug is already taken
    const existing = await db.loyaltyBusinesses.findBySlug(input.slug);
    if (existing) {
      return { success: false, error: "Business slug already exists" };
    }

    const business = await db.loyaltyBusinesses.create({
      userId,
      slug: input.slug,
      name: input.name,
      description: input.description,
      maxPoints: input.maxPoints || 100,
    });

    return { success: true, data: business };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create loyalty business",
    };
  }
}

// Get loyalty business by slug
export async function getLoyaltyBusinessBySlug(
  slug: string,
): Promise<LoyaltyBusiness | null> {
  try {
    return await db.loyaltyBusinesses.findBySlug(slug);
  } catch (error) {
    console.error("Error fetching loyalty business:", error);
    return null;
  }
}

// Get user's loyalty businesses
export async function getUserLoyaltyBusinesses(
  userId: string,
): Promise<LoyaltyBusiness[]> {
  try {
    return await db.loyaltyBusinesses.findByUserId(userId);
  } catch (error) {
    console.error("Error fetching user loyalty businesses:", error);
    return [];
  }
}

// Create loyalty card
export async function createLoyaltyCard(
  input: CreateLoyaltyCardInput,
): Promise<{ success: boolean; data?: LoyaltyCard; error?: string }> {
  try {
    // Check if business exists
    const business = await db.loyaltyBusinesses.findById(input.businessId);
    if (!business) {
      return { success: false, error: "Business not found" };
    }

    // Check if card already exists for this user-business combination
    const existing = await db.loyaltyCards.findByBusinessAndUser(
      input.businessId,
      input.userId,
    );
    if (existing) {
      return { data: existing, success: true }; // Return existing card instead of error
    }

    const card = await db.loyaltyCards.create({
      businessId: input.businessId,
      userId: input.userId,
      points: 0,
    });

    return { success: true, data: card };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error
          ? error.message
          : "Failed to create loyalty card",
    };
  }
}

// Get loyalty card
export async function getLoyaltyCard(
  cardId: string,
): Promise<LoyaltyCard | null> {
  try {
    return await db.loyaltyCards.findById(cardId);
  } catch (error) {
    console.error("Error fetching loyalty card:", error);
    return null;
  }
}

// Get user's loyalty cards
export async function getUserLoyaltyCards(
  userId: string,
): Promise<LoyaltyCard[]> {
  try {
    return await db.loyaltyCards.findByUserId(userId);
  } catch (error) {
    console.error("Error fetching user loyalty cards:", error);
    return [];
  }
}

// Add points to loyalty card
export async function addPointsToCard(
  userId: string,
  cardId: string,
  points: number,
): Promise<{ success: boolean; data?: LoyaltyCard; error?: string }> {
  try {
    if (!Number.isFinite(points) || points <= 0) {
      return { success: false, error: "Points must be a positive number" };
    }

    const card = await db.loyaltyCards.findById(cardId);
    if (!card) {
      return { success: false, error: "Card not found" };
    }

    const business = await db.loyaltyBusinesses.findById(card.businessId);
    if (!business || business.userId !== userId) {
      return {
        success: false,
        error: "You do not have permission to update this card",
      };
    }

    const updatedCard = await db.loyaltyCards.addPoints(cardId, points);
    if (!updatedCard) {
      return { success: false, error: "Card not found" };
    }

    return { success: true, data: updatedCard };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to add points",
    };
  }
}

// Get business loyalty cards (admin view)
export async function getBusinessLoyaltyCards(
  userId: string,
  businessId: string,
): Promise<LoyaltyCard[]> {
  try {
    const business = await db.loyaltyBusinesses.findById(businessId);
    if (!business || business.userId !== userId) {
      return [];
    }

    return await db.loyaltyCards.findByBusinessId(businessId);
  } catch (error) {
    console.error("Error fetching business loyalty cards:", error);
    return [];
  }
}

// Delete loyalty card
export async function deleteLoyaltyCard(
  userId: string,
  cardId: string,
): Promise<{ success: boolean; error?: string }> {
  try {
    const card = await db.loyaltyCards.findById(cardId);
    if (!card) {
      return { success: false, error: "Card not found" };
    }

    const business = await db.loyaltyBusinesses.findById(card.businessId);
    const isOwner =
      card.userId === userId || (!!business && business.userId === userId);
    if (!isOwner) {
      return {
        success: false,
        error: "You do not have permission to delete this card",
      };
    }

    const deleted = await db.loyaltyCards.delete(cardId);
    if (!deleted) {
      return { success: false, error: "Card not found" };
    }
    return { success: true };
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to delete card",
    };
  }
}

// Update loyalty business
export async function updateLoyaltyBusiness(
  userId: string,
  businessId: string,
  data: Partial<CreateLoyaltyBusinessInput>,
): Promise<{ success: boolean; data?: LoyaltyBusiness; error?: string }> {
  try {
    const existing = await db.loyaltyBusinesses.findById(businessId);
    if (!existing) {
      return { success: false, error: "Business not found" };
    }
    if (existing.userId !== userId) {
      return {
        success: false,
        error: "You do not have permission to update this business",
      };
    }

    if (
      data.maxPoints !== undefined &&
      (!Number.isFinite(data.maxPoints) || data.maxPoints <= 0)
    ) {
      return { success: false, error: "Max points must be a positive number" };
    }

    if (data.slug && data.slug !== existing.slug) {
      const conflict = await db.loyaltyBusinesses.findBySlug(data.slug);
      if (conflict) {
        return { success: false, error: "Business slug already exists" };
      }
    }

    const updates: Partial<CreateLoyaltyBusinessInput> = {};
    if (data.slug !== undefined) updates.slug = data.slug;
    if (data.name !== undefined) updates.name = data.name;
    if (data.description !== undefined) updates.description = data.description;
    if (data.maxPoints !== undefined) updates.maxPoints = data.maxPoints;

    const updated =
      Object.keys(updates).length > 0
        ? await db.loyaltyBusinesses.update(businessId, updates)
        : existing;

    if (!updated) {
      return { success: false, error: "Business not found" };
    }

    return { success: true, data: updated };
  } catch (error) {
    return {
      success: false,
      error:
        error instanceof Error ? error.message : "Failed to update business",
    };
  }
}
