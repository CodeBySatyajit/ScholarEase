# Educational Details - Dynamic Form Implementation

## Overview
This document describes the implementation of dynamic form behavior for the Educational Details section in the user profile page.

## Implementation Date
December 24, 2025

## Features Implemented

### 1. Class/Qualification Dropdown
- **Location**: User Profile Page ([views/users/profile.ejs](views/users/profile.ejs))
- **Options Available**:
  - Select Class (default)
  - Class 10
  - Class 12
  - Diploma
  - Graduation
  - Post-Graduation

### 2. Conditional Display Logic
- Academic detail fields are **hidden by default**
- Fields appear smoothly when a class is selected
- Fields hide when "Select Class" is chosen
- **Animation**: 300ms fade-in/fade-out with transform effect
- Helper text changes dynamically to guide users

### 3. Academic Detail Fields (Shown After Selection)
The following fields appear after class selection:

1. **Stream / Course Name**
   - Text input
   - Placeholder: e.g., Science, Commerce, Arts, Computer Science

2. **Board / University**
   - Text input
   - Placeholder: e.g., CBSE, State Board, University Name

3. **School / College Name**
   - Text input
   - Stores institution name

4. **Passing Year**
   - Text input with pattern validation (4 digits)
   - Placeholder: e.g., 2024

5. **Percentage / CGPA**
   - Text input
   - Placeholder: e.g., 85% or 8.5 CGPA

6. **Academic Status**
   - Dropdown: Studying / Passed

7. **Category**
   - Dropdown: General, OBC, SC, ST, EWS

8. **Income Range** (Optional)
   - Dropdown with ranges:
     - Below ₹1 Lakh
     - ₹1-3 Lakhs
     - ₹3-5 Lakhs
     - ₹5-8 Lakhs
     - Above ₹8 Lakhs

### 4. Data Storage Structure

**MongoDB Schema (UserInfo Model)**:
```javascript
education: {
    class: String,           // Selected class/qualification
    stream: String,          // Stream or course name
    board: String,           // Board or university
    institution: String,     // School/college name
    passingYear: String,     // Year of passing
    percentage: String,      // Marks in percentage or CGPA
    academicStatus: String,  // Studying or Passed
    category: String,        // General, OBC, SC, ST, EWS
    incomeRange: String      // Annual income range
}
```

### 5. Data Prefill Functionality
- **Auto-detection**: If user has saved education data, the class dropdown is auto-selected
- **Auto-display**: Academic detail section shows automatically with saved data
- **Auto-fill**: All fields are prefilled with existing values using EJS templates
- **Example**: `<%= userInfo && userInfo.education && userInfo.education.stream ? userInfo.education.stream : '' %>`

### 6. JavaScript Behavior

**File Location**: Embedded in [views/users/profile.ejs](views/users/profile.ejs)

**Key Functions**:
- `toggleAcademicDetails()`: Shows/hides academic fields based on selection
- Event listener on `educationClass` dropdown
- Runs on page load to handle prefilled data
- Smooth CSS transitions (opacity + transform)

**Animation Details**:
```javascript
transition: 'opacity 0.3s ease, transform 0.3s ease'
transform: translateY(-10px) // Hidden state
transform: translateY(0)     // Visible state
```

### 7. UI/UX Enhancements

#### Layout
- Bootstrap 5 grid system (responsive)
- Organized into sections with clear headings
- Icons for visual clarity (bi-mortarboard, bi-geo-alt)

#### Helper Text
- **Before selection**: "Select class to enter marks details" (muted)
- **After selection**: "Fill in your academic details below" (success color)

#### Sections
1. **Personal Information** - Basic user details
2. **Educational Details** - Dynamic class-based form
3. **Location Details** - State and city

#### Responsive Design
- Mobile-friendly grid layout (col-md-6)
- Large form controls (form-control-lg)
- Touch-friendly spacing

### 8. Backend Integration

**Controller**: [controllers/user.js](controllers/user.js)

**Function**: `updateProfile()`

**Processing**:
```javascript
// Extract education object from request body
const { education } = req.body;

// Update userInfo.education fields
if (education) {
    userInfo.education.class = education.class || '';
    userInfo.education.stream = education.stream || '';
    // ... other fields
}
```

**Validation**:
- Empty strings are saved when fields are not filled
- Mongoose schema validates enum values
- Pattern validation on frontend for year field

### 9. Form Submission
- **Method**: POST
- **Action**: `/profile`
- **Field Names**: Nested structure using `education[fieldName]`
- **Example**: `name="education[class]"`
- **Processing**: Express body-parser handles nested objects automatically

### 10. Profile Strength Calculation

**Updated Formula**:
- Base (Name, Email, Mobile): 40%
- Date of Birth: +8%
- Gender: +7%
- Education Level: +10%
- **Class Selected**: +15%
- **Percentage/CGPA**: +10%
- State: +5%
- City: +5%
- **Total Possible**: 100%

## Files Modified

### 1. Model: UserInfo.js
**Changes**:
- Added `education` object with 9 fields
- Defined enum constraints for class, academicStatus, and category

### 2. View: profile.ejs
**Changes**:
- Added Educational Details section with heading
- Added class dropdown with helper text
- Added academicDetailsContainer with 8 fields
- Added inline JavaScript for dynamic behavior
- Updated profile strength calculation
- Updated profile tips

### 3. Controller: user.js
**Changes**:
- Modified `updateProfile()` function
- Added education object extraction from req.body
- Added education field updates to userInfo

## Testing Checklist

- [ ] Empty form: Class dropdown shows "Select Class"
- [ ] Academic fields are hidden initially
- [ ] Selecting a class shows academic fields smoothly
- [ ] Changing back to "Select Class" hides fields
- [ ] Helper text updates correctly
- [ ] Form submission saves data correctly
- [ ] Page reload shows prefilled data
- [ ] Academic fields auto-display when data exists
- [ ] Mobile responsive layout works
- [ ] Profile strength percentage updates
- [ ] All validations work (year pattern, enums)

## Browser Compatibility
- Modern browsers (Chrome, Firefox, Edge, Safari)
- ES6 JavaScript (addEventListener, arrow functions)
- CSS3 transitions
- Bootstrap 5 components

## Future Enhancements (Optional)
1. Add multiple education entries (array of education objects)
2. Document upload for certificates
3. Auto-calculate age from DOB
4. State/city dropdown with predefined options
5. CGPA to percentage converter
6. Scholarship matching based on education details

## Code Quality
✅ Clean, commented JavaScript  
✅ No inline event handlers  
✅ Semantic HTML  
✅ Bootstrap styling  
✅ EJS templating for prefill  
✅ Proper form validation  
✅ Mobile responsive  
✅ Smooth animations  

## Notes
- The JavaScript is embedded in the EJS file for simplicity
- Can be extracted to a separate file if needed ([public/js/profile.js](public/js/profile.js))
- All form fields use Bootstrap form-control classes
- Education data is optional but encouraged for better scholarship matching

## Support
For issues or questions, refer to:
- [User Model](models/User.js)
- [UserInfo Model](models/UserInfo.js)
- [User Controller](controllers/user.js)
- [Profile View](views/users/profile.ejs)
