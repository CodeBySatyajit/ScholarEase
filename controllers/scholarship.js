const scholarships = require("../models/scholarship.js");
const Review = require("../models/review.js");

module.exports.renderScholarshipForm = async (req, res) => {
    try {
        // Get user's saved scholarships if logged in
        const UserInfo = require("../models/UserInfo.js");
        let savedScholarshipIds = [];
        
        if (req.session.user) {
            const userInfo = await UserInfo.findOne({ userID: req.session.user.id });
            if (userInfo && userInfo.savedScholarships) {
                savedScholarshipIds = userInfo.savedScholarships.map(id => id.toString());
            }
        }

        // Extract query parameters for filters and search
        const { classLevel, gender, state, category, courseCategory, type, keyword } = req.query;
        
        // Build dynamic MongoDB query object
        const query = {};
        
        // Apply filters only if they exist (case-insensitive matching)
        if (classLevel && classLevel.trim() !== '') {
            query.Education = { $regex: new RegExp(`^${classLevel}$`, 'i') };
        }
        
        if (gender && gender.trim() !== '') {
            query.Gender = { $regex: new RegExp(`^${gender}$`, 'i') };
        }
        
        if (state && state.trim() !== '') {
            query.State = { $regex: new RegExp(`^${state}$`, 'i') };
        }
        
        if (category && category.trim() !== '') {
            query.Category = { $regex: new RegExp(`^${category}$`, 'i') };
        }
        
        if (courseCategory && courseCategory.trim() !== '') {
            query.CourseCategory = { $regex: new RegExp(`^${courseCategory}$`, 'i') };
        }
        
        if (type && type.trim() !== '') {
            query.type = { $regex: new RegExp(`^${type}$`, 'i') };
        }
        
        // Keyword search: if ANY word matches ANY field, include the scholarship
        if (keyword && keyword.trim() !== '') {
            // Split the keyword into individual words and remove empty strings
            const keywords = keyword.trim().split(/\s+/).filter(word => word.length > 0);
            
            // Create $or condition: ANY keyword matching ANY field
            const orConditions = [];
            
            keywords.forEach(word => {
                // Escape special regex characters to prevent regex injection
                const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
                
                orConditions.push(
                    { title: { $regex: escapedWord, $options: 'i' } },
                    { Eligibility: { $regex: escapedWord, $options: 'i' } },
                    { About: { $regex: escapedWord, $options: 'i' } },
                    { Benefits: { $regex: escapedWord, $options: 'i' } },
                    { Documents: { $regex: escapedWord, $options: 'i' } },
                    { Region: { $regex: escapedWord, $options: 'i' } },
                    { CourseCategory: { $regex: escapedWord, $options: 'i' } },
                    { type: { $regex: escapedWord, $options: 'i' } },
                    { Gender: { $regex: escapedWord, $options: 'i' } },
                    { Note: { $regex: escapedWord, $options: 'i' } }
                );
            });
            
            // Add $or condition to query
            if (orConditions.length > 0) {
                query.$or = orConditions;
            }
        }
        
        // Execute the query with all filters applied, sorted by latest updates first
        const scholarshipsList = await scholarships.find(query).sort({ updatedAt: -1 });
        
        // Render the template with filtered scholarships and applied filters
        res.render("scholarships/scholarships.ejs", { 
            scholarships: scholarshipsList,
            filters: req.query,  // Pass the query params to preserve UI selections
            savedScholarshipIds: savedScholarshipIds,  // Pass saved scholarship IDs
            isRecommendedView: false,  // Not a recommended view
            userProfile: null  // No user profile in normal view
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/");
    }
};

module.exports.homePage =  async (req, res) => {
    try {
        const scholarshipsList = await scholarships.find({}).sort({ updatedAt: -1 });
        const reviews = await Review.find({}).limit(4);
        res.render("scholarships/home.ejs", { 
            scholarships: scholarshipsList,
            reviews: reviews,
            filters: {}, // Pass empty filters object for consistency
            newsApiKey: process.env.NEWS_API_KEY
        });
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/");
    }
};

// ====================================================================
// AI SCHOLARSHIP RECOMMENDATION ROUTE
// Route: GET /scholarships/recommended
// Purpose: Show personalized scholarship recommendations based on user profile
// Access: ONLY for logged-in users with AI Recommendation enabled
// ====================================================================
module.exports.renderRecommendedScholarships = async (req, res) => {
    try {
        const UserInfo = require("../models/UserInfo.js");
        
        // ====================================================================
        // STEP 1: CHECK IF USER IS LOGGED IN
        // Only logged-in users can access AI recommendations
        // ====================================================================
        if (!req.session.user) {
            req.flash("error", "Please login to access AI Scholarship Recommendations");
            return res.redirect("/login");
        }
        
        // ====================================================================
        // STEP 2: FETCH USER PROFILE DATA
        // ====================================================================
        const userInfo = await UserInfo.findOne({ userID: req.session.user.id });
        
        if (!userInfo) {
            req.flash("error", "Please complete your profile to get AI recommendations");
            return res.redirect("/profile");
        }
        
        // ====================================================================
        // STEP 3: CHECK IF AI RECOMMENDATION IS ENABLED
        // If disabled, redirect to normal scholarship list
        // ====================================================================
        if (!userInfo.enableAIRecommendation) {
            req.flash("info", "AI Recommendation is disabled. Enable it in your profile to get personalized suggestions.");
            return res.redirect("/scholarships");
        }
        
        // ====================================================================
        // STEP 4: BUILD RECOMMENDATION QUERY
        // Match scholarships based on user profile using rule-based logic
        // ====================================================================
        const recommendationQuery = {};
        const andConditions = [];
        
        // Match Education Level (class)
        // Scholarship must match user's class OR be marked as "all"
        if (userInfo.education?.class) {
            andConditions.push({
                $or: [
                    { Education: { $regex: new RegExp(`^${userInfo.education.class}$`, 'i') } },
                    { Education: { $regex: new RegExp('^all$', 'i') } },
                    { Education: null }
                ]
            });
        }
        
        // Match Caste Category
        // Scholarship must match user's category OR be marked as "All"
        if (userInfo.education?.category) {
            andConditions.push({
                $or: [
                    { Category: { $regex: new RegExp(`^${userInfo.education.category}$`, 'i') } },
                    { Category: { $regex: new RegExp('^All$', 'i') } },
                    { Category: null }
                ]
            });
        }
        
        // Match State
        // Scholarship must be for user's state OR "All India"
        if (userInfo.state) {
            andConditions.push({
                $or: [
                    { State: { $regex: new RegExp(`^${userInfo.state}$`, 'i') } },
                    { State: { $regex: new RegExp('^all$', 'i') } },
                    { State: null }
                ]
            });
        }
        
        // Match Gender
        // Scholarship must match user's gender OR be "both"
        if (userInfo.gender) {
            andConditions.push({
                $or: [
                    { Gender: { $regex: new RegExp(`^${userInfo.gender}$`, 'i') } },
                    { Gender: { $regex: new RegExp('^both$', 'i') } },
                    { Gender: null }
                ]
            });
        }
        
        // Apply all matching conditions
        if (andConditions.length > 0) {
            recommendationQuery.$and = andConditions;
        }
        
        // ====================================================================
        // STEP 5: FETCH RECOMMENDED SCHOLARSHIPS
        // Sort by nearest deadline first (most urgent scholarships on top)
        // ====================================================================
        const recommendedScholarships = await scholarships.find(recommendationQuery)
            .sort({ 
                Deadline: 1,      // Sort by nearest deadline first
                updatedAt: -1     // Then by latest updates
            });
        
        // Get user's saved scholarships
        let savedScholarshipIds = [];
        if (userInfo.savedScholarships) {
            savedScholarshipIds = userInfo.savedScholarships.map(id => id.toString());
        }
        
        // Store user profile for rendering
        const userProfile = {
            educationLevel: userInfo.education?.class || 'Not specified',
            courseCategory: userInfo.education?.category || 'Not specified',
            state: userInfo.state || 'Not specified',
            familyIncome: userInfo.education?.incomeRange || 'Not specified',
            casteCategory: userInfo.education?.category || 'Not specified',
            gender: userInfo.gender || 'Not specified'
        };
        
        // ====================================================================
        // STEP 6: RENDER SCHOLARSHIPS PAGE WITH RECOMMENDATIONS
        // Set isRecommendedView flag to show "AI Recommended for You" badge
        // ====================================================================
        res.render("scholarships/scholarships.ejs", { 
            scholarships: recommendedScholarships,
            filters: {},  // No filters applied in recommendation view
            savedScholarshipIds: savedScholarshipIds,
            isRecommendedView: true,  // Flag to show AI badge
            userProfile: userProfile  // User profile data for display
        });
        
    } catch (e) {
        req.flash("error", e.message);
        res.redirect("/scholarships");
    }
};


