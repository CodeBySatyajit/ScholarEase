const Admin = require("../models/Admin.js");

module.exports.renderAdminLoginForm = (req, res) => {
  res.render("admin/login.ejs");
};

module.exports.adminLogin = async (req, res) => {
  const { username, password } = req.body;

  try {
    const admin = await Admin.findOne({ username });

    if (!admin) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/admin/login");
    }


    const isPasswordValid = await admin.comparePassword(password);


    if (!isPasswordValid) {
      req.flash("error", "Invalid username or password");
      return res.redirect("/admin/login");
    }

    // Set admin session
    req.session.admin = {
      id: admin._id,
      username: admin.username,
      email: admin.email,
    };

    req.flash("success", "Admin logged in successfully");
    res.redirect("/admin/dashboard");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/login");
  }
};

module.exports.renderAdminDashboard = async (req, res) => {
  try {
    const scholarships = require("../models/scholarship.js");
    const allScholarships = await scholarships.find({});
    res.render("admin/dashboard.ejs", { scholarships: allScholarships });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/login");
  }
};

module.exports.adminLogout = (req, res) => {
  req.session.admin = null;
  req.flash("success", "Admin logged out");
  res.redirect("/admin/login");
};

module.exports.renderAdminAddForm = (req, res) => {
  res.render("admin/add-scholarship.ejs");
};

module.exports.addScholarshipByAdmin = async (req, res) => {
  const scholarships = require("../models/scholarship.js");
  const { title, type, Amount, About, Eligibility, Deadline, Region, Benefits, Documents, ApplyLink, Gender, Religion, CourseCategory, State , Education} = req.body;

  try {
    const newScholarship = new scholarships({
      title,
      type,
      Amount,
      About,
      Eligibility,
      Deadline,
      Benefits,
      Region,
      Documents,
      ApplyLink,
      Gender,
      Religion,
      CourseCategory,
      State,
      Education
    });

    await newScholarship.save();
    req.flash("success", "Scholarship added successfully");
    res.redirect("/admin/dashboard");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/add-scholarship");
  }
};

module.exports.deleteScholarship = async (req, res) => {
  const scholarships = require("../models/scholarship.js");
  const { id } = req.params;

  try {
    await scholarships.findByIdAndDelete(id);
    req.flash("success", "Scholarship deleted successfully");
    res.redirect("/admin/dashboard");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/dashboard");
  }
};

module.exports.renderAdminEditForm = async (req, res) => {
  const scholarships = require("../models/scholarship.js");
  const { id } = req.params;

  try {
    const scholarship = await scholarships.findById(id);
    if (!scholarship) {
      req.flash("error", "Scholarship not found");
      return res.redirect("/admin/dashboard");
    }
    res.render("admin/edit-scholarship.ejs", { scholarship });
  } catch (e) {
    req.flash("error", e.message);
    res.redirect("/admin/dashboard");
  }
};

module.exports.editScholarshipByAdmin = async (req, res) => {
  const scholarships = require("../models/scholarship.js");
  const { id } = req.params;
  const { title, type, Amount, About, Eligibility, Deadline, Region, Benefits, Documents, ApplyLink, Gender, Religion, CourseCategory, State, Education } = req.body;

  try {
    await scholarships.findByIdAndUpdate(
      id,
      {
        title,
        type,
        Amount,
        About,
        Eligibility,
        Deadline,
        Benefits,
        Region,
        Documents,
        ApplyLink,
        Gender,
        Religion,
        CourseCategory,
        State,
        Education
      },
      { new: true, runValidators: true }
    );
    req.flash("success", "Scholarship updated successfully");
    res.redirect("/admin/dashboard");
  } catch (e) {
    req.flash("error", e.message);
    res.redirect(`/admin/edit-scholarship/${id}`);
  }
};
