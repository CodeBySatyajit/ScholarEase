/**
 * Dashboard JavaScript
 * Handles sidebar toggle for mobile/tablet
 */

document.addEventListener('DOMContentLoaded', function() {
    const sidebar = document.getElementById('sidebar');
    const sidebarOverlay = document.getElementById('sidebarOverlay');
    const toggleSidebarBtn = document.getElementById('toggleSidebar');
    const closeSidebarBtn = document.getElementById('closeSidebar');

    // Toggle sidebar on mobile
    if (toggleSidebarBtn) {
        toggleSidebarBtn.addEventListener('click', function() {
            sidebar.classList.add('show');
            sidebarOverlay.classList.add('show');
            document.body.style.overflow = 'hidden';
        });
    }

    // Close sidebar
    function closeSidebar() {
        sidebar.classList.remove('show');
        sidebarOverlay.classList.remove('show');
        document.body.style.overflow = '';
    }

    if (closeSidebarBtn) {
        closeSidebarBtn.addEventListener('click', closeSidebar);
    }

    if (sidebarOverlay) {
        sidebarOverlay.addEventListener('click', closeSidebar);
    }

    // Close sidebar when clicking on a nav link (mobile)
    const navLinks = document.querySelectorAll('.sidebar-nav .nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                closeSidebar();
            }
        });
    });

    // Handle window resize
    window.addEventListener('resize', function() {
        if (window.innerWidth >= 992) {
            closeSidebar();
        }
    });

    // Form validation for profile update
    const profileForm = document.querySelector('form[action="/profile"]');
    if (profileForm) {
        profileForm.addEventListener('submit', function(e) {
            const mobile = document.getElementById('Mobile');
            if (mobile && mobile.value) {
                // Validate mobile number (10 digits)
                const mobilePattern = /^[0-9]{10}$/;
                if (!mobilePattern.test(mobile.value)) {
                    e.preventDefault();
                    alert('Please enter a valid 10-digit mobile number');
                    mobile.focus();
                    return false;
                }
            }
        });
    }

    // Auto-dismiss alerts after 5 seconds
    const alerts = document.querySelectorAll('.alert');
    alerts.forEach(alert => {
        setTimeout(() => {
            const bsAlert = new bootstrap.Alert(alert);
            bsAlert.close();
        }, 5000);
    });

    // Handle removing bookmarks from saved scholarships page
    const removeBookmarkBtns = document.querySelectorAll('.remove-bookmark');
    removeBookmarkBtns.forEach(btn => {
        btn.addEventListener('click', async function(e) {
            e.preventDefault();
            
            const scholarshipId = this.getAttribute('data-scholarship-id');
            const card = this.closest('.col-md-6');
            
            if (confirm('Are you sure you want to remove this scholarship from your saved list?')) {
                try {
                    const response = await fetch(`/bookmark/${scholarshipId}`, {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json'
                        }
                    });
                    
                    const data = await response.json();
                    
                    if (data.success) {
                        // Remove the card with animation
                        card.style.transition = 'opacity 0.3s ease';
                        card.style.opacity = '0';
                        
                        setTimeout(() => {
                            card.remove();
                            
                            // Check if no more scholarships, show empty state
                            const remainingCards = document.querySelectorAll('.scholarship-card').length;
                            if (remainingCards === 0) {
                                location.reload();
                            }
                        }, 300);
                        
                        showNotification('Scholarship removed from saved list');
                    } else {
                        alert('Error: ' + data.message);
                    }
                } catch (error) {
                    console.error('Error:', error);
                    alert('Failed to remove scholarship. Please try again.');
                }
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
            font-weight: 600;
        `;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transition = 'opacity 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 2000);
    }
});
