"use strict";
// NFC Business Profile services
// Business logic for NFC business card operations
Object.defineProperty(exports, "__esModule", { value: true });
exports.createNfcBusinessProfile = createNfcBusinessProfile;
exports.getNfcProfileBySlug = getNfcProfileBySlug;
exports.getUserNfcProfile = getUserNfcProfile;
exports.updateNfcProfile = updateNfcProfile;
exports.getNfcProfileById = getNfcProfileById;
exports.deleteNfcProfile = deleteNfcProfile;
exports.isSlugAvailable = isSlugAvailable;
const db_1 = require("../config/db");
// Create NFC business profile
async function createNfcBusinessProfile(userId, input) {
    try {
        // Check if slug is already taken
        const existing = await db_1.db.nfcBusinessProfiles.findBySlug(input.slug);
        if (existing) {
            return { success: false, error: "Business slug already exists" };
        }
        // Check if user already has an NFC profile
        const userProfile = await db_1.db.nfcBusinessProfiles.findByUserId(userId);
        if (userProfile) {
            return {
                success: false,
                error: "User already has an NFC business profile",
            };
        }
        const profile = await db_1.db.nfcBusinessProfiles.create({
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
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to create NFC profile",
        };
    }
}
// Get NFC profile by slug
async function getNfcProfileBySlug(slug) {
    try {
        return await db_1.db.nfcBusinessProfiles.findBySlug(slug);
    }
    catch (error) {
        console.error("Error fetching NFC profile:", error);
        return null;
    }
}
// Get user's NFC profile
async function getUserNfcProfile(userId) {
    try {
        return await db_1.db.nfcBusinessProfiles.findByUserId(userId);
    }
    catch (error) {
        console.error("Error fetching user NFC profile:", error);
        return null;
    }
}
// Update NFC profile
async function updateNfcProfile(userId, profileId, data) {
    try {
        const existing = await db_1.db.nfcBusinessProfiles.findById(profileId);
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
            const conflict = await db_1.db.nfcBusinessProfiles.findBySlug(data.slug);
            if (conflict) {
                return { success: false, error: "Business slug already exists" };
            }
        }
        const updates = {};
        if (data.slug !== undefined)
            updates.slug = data.slug;
        if (data.name !== undefined)
            updates.name = data.name;
        if (data.title !== undefined)
            updates.title = data.title;
        if (data.phone !== undefined)
            updates.phone = data.phone;
        if (data.email !== undefined)
            updates.email = data.email;
        if (data.website !== undefined)
            updates.website = data.website;
        if (data.bio !== undefined)
            updates.bio = data.bio;
        const updated = Object.keys(updates).length > 0
            ? await db_1.db.nfcBusinessProfiles.update(profileId, updates)
            : existing;
        if (!updated) {
            return { success: false, error: "Profile not found" };
        }
        return { success: true, data: updated };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to update profile",
        };
    }
}
// Get NFC profile by ID
async function getNfcProfileById(profileId) {
    try {
        return await db_1.db.nfcBusinessProfiles.findById(profileId);
    }
    catch (error) {
        console.error("Error fetching NFC profile:", error);
        return null;
    }
}
// Delete NFC profile
async function deleteNfcProfile(userId, profileId) {
    try {
        const profile = await db_1.db.nfcBusinessProfiles.findById(profileId);
        if (!profile) {
            return { success: false, error: "Profile not found" };
        }
        if (profile.userId !== userId) {
            return {
                success: false,
                error: "You do not have permission to delete this profile",
            };
        }
        const deleted = await db_1.db.nfcBusinessProfiles.delete(profileId);
        if (!deleted) {
            return { success: false, error: "Profile not found" };
        }
        return { success: true };
    }
    catch (error) {
        return {
            success: false,
            error: error instanceof Error ? error.message : "Failed to delete profile",
        };
    }
}
// Check if slug is available
async function isSlugAvailable(slug) {
    try {
        return !(await db_1.db.nfcBusinessProfiles.slugExists(slug));
    }
    catch (error) {
        console.error("Error checking slug availability:", error);
        return false;
    }
}
//# sourceMappingURL=nfcBusinessService.js.map