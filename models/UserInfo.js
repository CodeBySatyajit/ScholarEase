const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userInfoSchema = new Schema({
    userID: {
        type: Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    dateOfBirth: {
        type: Date,
    },
    gender: {
        type: String,
        enum: ['Male', 'Female', 'Other', ''],
        default: ''
    },
    educationLevel: {
        type: String,
        enum: ['High School', 'Undergraduate', 'Graduate', 'Postgraduate', 'PhD', ''],
        default: ''
    },
    // Detailed Education Information
    education: {
        class: {
            type: String,
            enum: ['', 'Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12', 'Diploma', 'Graduation', 'Post Graduation'],
            default: ''
        },
        stream: {
            type: String,
            default: ''
        },
        board: {
            type: String,
            default: ''
        },
        institution: {
            type: String,
            default: ''
        },
        passingYear: {
            type: String,
            default: ''
        },
        percentage: {
            type: String,
            default: ''
        },
        academicStatus: {
            type: String,
            enum: ['', 'Studying', 'Passed'],
            default: ''
        },
        category: {
            type: String,
            enum: [
                '',
                'General',
                'Open',
                'EWS',
                'OBC',
                'OBC-NCL',
                'OBC-CL',
                'SEBC',
                'SC',
                'ST',
                'VJNT',
                'NT-A',
                'NT-B',
                'NT-C',
                'NT-D',
                'SBC',
                'Minority',
                'Other'
            ],
            default: ''
        },
        incomeRange: {
            type: String,
            default: ''
        }
    },
    state: {
        type: String,
        default: ''
    },
    city: {
        type: String,
        default: ''
    },
    profilePicture: {
        type: String,
        default: ''
    },
    savedScholarships: [{
        type: Schema.Types.ObjectId,
        ref: 'Scholarship'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    },
    updatedAt: {
        type: Date,
        default: Date.now
    }
});

// Update the updatedAt field before saving
userInfoSchema.pre('save', function() {
    this.updatedAt = Date.now();
});

const UserInfo = mongoose.model('UserInfo', userInfoSchema);

module.exports = UserInfo;