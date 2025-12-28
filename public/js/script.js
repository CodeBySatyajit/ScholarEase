document.addEventListener("DOMContentLoaded", function () {
    const applyBtns = document.querySelectorAll(".apply-now-btn");
    const popup = document.getElementById("popupBox");
    const overlay = document.getElementById("popupOverlay");
    const closeBtn = document.getElementById("closePopup");
    const confirmBtn = document.getElementById("confirmApply");
    const cancelBtn = document.getElementById("cancelApply");

    let currentScholarshipLink = "";

    // Ensure popup is hidden on initial load
    if (popup && overlay) {
        popup.style.display = "none";
        overlay.style.display = "none";
    }

    applyBtns.forEach((btn) => {
        btn.addEventListener("click", () => {
            // Get all scholarship details from data attributes
            currentScholarshipLink = btn.getAttribute("data-link");
            const title = btn.getAttribute("data-title");
            const type = btn.getAttribute("data-type");
            const amount = btn.getAttribute("data-amount");
            const about = btn.getAttribute("data-about");
            const eligibility = btn.getAttribute("data-eligibility");
            const deadline = btn.getAttribute("data-deadline");
            const benefits = btn.getAttribute("data-benefits");
            const education = btn.getAttribute("data-education");
            const region = btn.getAttribute("data-region");
            const documents = btn.getAttribute("data-documents");
            const gender = btn.getAttribute("data-gender");
            const category = btn.getAttribute("data-category");
            const courseCategory = btn.getAttribute("data-coursecategory");
            const state = btn.getAttribute("data-state");
            const note = btn.getAttribute("data-note");

            // Helper function to convert text to list format
            const formatAsList = (text) => {
                if (!text) return '';
                
                // Split by numbers followed by period (1. 2. 3.) or by newlines
                let items = text.split(/\d+\.\s+|[\n\r]+/).filter(item => item.trim());
                
                // If no numbered items found, try splitting by periods or semicolons
                if (items.length <= 1) {
                    items = text.split(/[.;]/).filter(item => item.trim() && item.length > 10);
                }
                
                if (items.length > 1) {
                    return '<ul>' + items.map(item => `<li>${item.trim()}</li>`).join('') + '</ul>';
                }
                return text;
            };

            // Populate popup with scholarship details
            document.getElementById("popupTitle").textContent = title;
            document.getElementById("popupType").textContent = type;
            document.getElementById("popupAmount").textContent = amount;
            document.getElementById("popupDeadline").textContent = deadline;
            document.getElementById("popupRegion").textContent = region;
            document.getElementById("popupAbout").innerHTML = formatAsList(about);
            document.getElementById("popupEligibility").innerHTML = formatAsList(eligibility);
            document.getElementById("popupBenefits").innerHTML = formatAsList(benefits);
            document.getElementById("popupDocuments").innerHTML = formatAsList(documents);
            document.getElementById("popupGender").textContent = gender || 'N/A';
            document.getElementById("popupCategory").textContent = category || 'N/A';
            document.getElementById("popupCourseCategory").textContent = courseCategory || 'N/A';
            document.getElementById("popupState").textContent = state || 'N/A';
            document.getElementById("popupEducation").textContent = education || 'N/A';
            document.getElementById("popupNote").innerHTML = formatAsList(note);

            // Show popup
            if (popup && overlay) {
                popup.style.display = "block";
                overlay.style.display = "block";
            }
        });
    });

    if (confirmBtn) {
        confirmBtn.addEventListener("click", () => {
            if (currentScholarshipLink) {
                window.open(currentScholarshipLink, "_blank");
            }
            if (popup && overlay) {
                popup.style.display = "none";
                overlay.style.display = "none";
            }
        });
    }

    if (closeBtn) {
        closeBtn.addEventListener("click", () => {
            if (popup && overlay) {
                popup.style.display = "none";
                overlay.style.display = "none";
            }
        });
    }

    if (cancelBtn) {
        cancelBtn.addEventListener("click", () => {
            if (popup && overlay) {
                popup.style.display = "none";
                overlay.style.display = "none";
            }
        });
    }

    if (overlay) {
        overlay.addEventListener("click", () => {
            popup.style.display = "none";
            overlay.style.display = "none";
        });
    }

    // Close popup when navigating via any regular link
    document.querySelectorAll('a[href]')
        .forEach(a => a.addEventListener('click', () => {
            if (popup && overlay) {
                popup.style.display = "none";
                overlay.style.display = "none";
            }
        }));

    // Close popup on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && popup && overlay) {
            popup.style.display = "none";
            overlay.style.display = "none";
        }
    });

    // Bookmark functionality
    const bookmarkBtns = document.querySelectorAll('.bookmark-btn');
    
    bookmarkBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            e.stopPropagation();
            
            const scholarshipId = this.getAttribute('data-scholarship-id');
            
            try {
                const response = await fetch(`/bookmark/${scholarshipId}`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    }
                });
                
                const data = await response.json();
                
                if (data.success) {
                    const icon = this.querySelector('i');
                    if (data.bookmarked) {
                        icon.classList.remove('fa-regular');
                        icon.classList.add('fa-solid');
                        this.classList.add('bookmarked');
                        this.title = 'Remove from saved';
                    } else {
                        icon.classList.remove('fa-solid');
                        icon.classList.add('fa-regular');
                        this.classList.remove('bookmarked');
                        this.title = 'Save scholarship';
                    }
                    
                    // Optional: Show a brief notification
                    showNotification(data.message);
                } else {
                    alert('Error: ' + data.message);
                }
            } catch (error) {
                console.error('Error:', error);
                alert('Failed to save scholarship. Please try again.');
            }
        });
    });

    // Show notification function
    function showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'bookmark-notification';
        notification.textContent = message;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, #4f46e5 0%, #7c3aed 50%, #ec4899 100%);
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 12px;
            box-shadow: 0 10px 30px rgba(79, 70, 229, 0.3);
            z-index: 10000;
            animation: slideIn 0.3s ease;
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
});

