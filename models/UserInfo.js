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