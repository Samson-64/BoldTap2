"use strict";
// Loyalty Card services
// Business logic for loyalty card operations
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLoyaltyBusiness = createLoyaltyBusiness;
exports.getLoyaltyBusinessBySlug = getLoyaltyBusinessBySlug;
exports.getUserLoyaltyBusinesses = getUserLoyaltyBusinesses;
exports.createLoyaltyCard = createLoyaltyCard;
exports.getLoyaltyCard = getLoyaltyCard;
exports.getUserLoyaltyCards = getUserLoyaltyCards;
exports.addPointsToCard = addPointsToCard;
exports.getBusinessLoyaltyCards = getBusinessLoyaltyCards;
exports.deleteLoyaltyCard = deleteLoyaltyCard;
exports.updateLoyaltyBusiness = updateLoyaltyBusiness;
const db_1 = require("../config/db");
// Create loyalty business
async function createLoyaltyBusiness(userId, input) {
    try {
        if (input.maxPoints !== undefined &&
            (!Number.isFinite(input.maxPoints) || input.maxPoints <= 0)) {
            return { success: false, error: "Max points must be a positive number" };
        }
        // Check if slug is already taken
        const existing = await db_1.db.loyaltyBusinesses.findBySlug(input.slug);
        if (existing) {
            return { success: false, error: "Business slug already exists" };
        }
        const business = await db_1.db.loyaltyBusinesses.create({
            userId,
            slug: input.slug,
            name: input.name,
            description: input.description,
            maxPoints: input.maxPoints || 100,
        });
        return { success: true, data: business };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to create loyalty business",
        };
    }
}
// Get loyalty business by slug
async function getLoyaltyBusinessBySlug(slug) {
    try {
        return await db_1.db.loyaltyBusinesses.findBySlug(slug);
    }
    catch (error) {
        console.error("Error fetching loyalty business:", error);
        return null;
    }
}
// Get user's loyalty businesses
async function getUserLoyaltyBusinesses(userId) {
    try {
        return await db_1.db.loyaltyBusinesses.findByUserId(userId);
    }
    catch (error) {
        console.error("Error fetching user loyalty businesses:", error);
        return [];
    }
}
// Create loyalty card
async function createLoyaltyCard(input) {
    try {
        // Check if business exists and if card already exists in parallel
        const [business, existing] = await Promise.all([
            db_1.db.loyaltyBusinesses.findById(input.businessId),
            db_1.db.loyaltyCards.findByBusinessAndUser(input.businessId, input.userId),
        ]);
        if (!business) {
            return { success: false, error: "Business not found" };
        }
        if (existing) {
            return { data: existing, success: true }; // Return existing card instead of error
        }
        const card = await db_1.db.loyaltyCards.create({
            businessId: input.businessId,
            userId: input.userId,
            points: 0,
        });
        return { success: true, data: card };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error
                ? error.message
                : "Failed to create loyalty card",
        };
    }
}
// Get loyalty card
async function getLoyaltyCard(cardId) {
    try {
        return await db_1.db.loyaltyCards.findById(cardId);
    }
    catch (error) {
        console.error("Error fetching loyalty card:", error);
        return null;
    }
}
// Get user's loyalty cards
async function getUserLoyaltyCards(userId) {
    try {
        return await db_1.db.loyaltyCards.findByUserId(userId);
    }
    catch (error) {
        console.error("Error fetching user loyalty cards:", error);
        return [];
    }
}
// Add points to loyalty card
async function addPointsToCard(userId, cardId, points) {
    try {
        if (!Number.isFinite(points) || points <= 0) {
            return { success: false, error: "Points must be a positive number" };
        }
        const card = await db_1.db.loyaltyCards.findById(cardId);
        if (!card) {
            return { success: false, error: "Card not found" };
        }
        const business = await db_1.db.loyaltyBusinesses.findById(card.businessId);
        if (!business || business.userId !== userId) {
            return {
                success: false,
                error: "You do not have permission to update this card",
            };
        }
        const updatedCard = await db_1.db.loyaltyCards.addPoints(cardId, points);
        if (!updatedCard) {
            return { success: false, error: "Card not found" };
        }
        return { success: true, data: updatedCard };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to add points",
        };
    }
}
// Get business loyalty cards (admin view)
async function getBusinessLoyaltyCards(userId, businessId) {
    try {
        const business = await db_1.db.loyaltyBusinesses.findById(businessId);
        if (!business || business.userId !== userId) {
            return [];
        }
        return await db_1.db.loyaltyCards.findByBusinessId(businessId);
    }
    catch (error) {
        console.error("Error fetching business loyalty cards:", error);
        return [];
    }
}
// Delete loyalty card
async function deleteLoyaltyCard(userId, cardId) {
    try {
        const card = await db_1.db.loyaltyCards.findById(cardId);
        if (!card) {
            return { success: false, error: "Card not found" };
        }
        const business = await db_1.db.loyaltyBusinesses.findById(card.businessId);
        const isOwner = card.userId === userId || (!!business && business.userId === userId);
        if (!isOwner) {
            return {
                success: false,
                error: "You do not have permission to delete this card",
            };
        }
        const deleted = await db_1.db.loyaltyCards.delete(cardId);
        if (!deleted) {
            return { success: false, error: "Card not found" };
        }
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete card",
        };
    }
}
// Update loyalty business
async function updateLoyaltyBusiness(userId, businessId, data) {
    try {
        const existing = await db_1.db.loyaltyBusinesses.findById(businessId);
        if (!existing) {
            return { success: false, error: "Business not found" };
        }
        if (existing.userId !== userId) {
            return {
                success: false,
                error: "You do not have permission to update this business",
            };
        }
        if (data.maxPoints !== undefined &&
            (!Number.isFinite(data.maxPoints) || data.maxPoints <= 0)) {
            return { success: false, error: "Max points must be a positive number" };
        }
        if (data.slug && data.slug !== existing.slug) {
            const conflict = await db_1.db.loyaltyBusinesses.findBySlug(data.slug);
            if (conflict) {
                return { success: false, error: "Business slug already exists" };
            }
        }
        const updates = {};
        if (data.slug !== undefined)
            updates.slug = data.slug;
        if (data.name !== undefined)
            updates.name = data.name;
        if (data.description !== undefined)
            updates.description = data.description;
        if (data.maxPoints !== undefined)
            updates.maxPoints = data.maxPoints;
        const updated = Object.keys(updates).length > 0
            ? await db_1.db.loyaltyBusinesses.update(businessId, updates)
            : existing;
        if (!updated) {
            return { success: false, error: "Business not found" };
        }
        return { success: true, data: updated };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update business",
        };
    }
}
//# sourceMappingURL=loyaltyCardService.js.map