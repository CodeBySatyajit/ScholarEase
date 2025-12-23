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
                    { State: { $regex: escapedWord, $options: 'i' } },
                    { type: { $regex: escapedWord, $options: 'i' } },
                    { Gender: { $regex: escapedWord, $options: 'i' } },
                    { Category: { $regex: escapedWord, $options: 'i' } },
                    { Education: { $regex: escapedWord, $options: 'i' } }
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
            savedScholarshipIds: savedScholarshipIds  // Pass saved scholarship IDs
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


