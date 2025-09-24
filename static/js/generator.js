// Generator Page JavaScript
// Global variable to store current job details for PDF generation
let currentJobDetails = null;

document.addEventListener('DOMContentLoaded', function() {
    initializeFormAnimations();
    initializeJobGenerator();
    initializeTooltips();
    initializeInputEffects();
    // Don't initialize mobile menu here - it will be called after navbar loads
});

// Form animations and interactions
function initializeFormAnimations() {
    const formElements = document.querySelectorAll('.slide-up');
    const slideInElements = document.querySelectorAll('.form-slide-in');
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }, index * 100);
            }
        });
    }, { threshold: 0.1 });

    formElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
        observer.observe(element);
    });
    
    // Animate form elements with staggered delay
    slideInElements.forEach((element, index) => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        setTimeout(() => {
            element.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }, 200 + (index * 100));
    });
}

// Input focus effects
function initializeInputEffects() {
    const inputs = document.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Focus effects with enhanced animations
        input.addEventListener('focus', function() {
            this.style.transform = 'scale(1.02)';
            this.style.boxShadow = '0 0 0 4px rgba(142, 22, 22, 0.1), 0 0 20px rgba(142, 22, 22, 0.3)';
            
            // Add glow effect to parent container
            this.parentElement.style.transform = 'scale(1.01)';
            this.parentElement.style.filter = 'drop-shadow(0 4px 20px rgba(142, 22, 22, 0.2))';
        });
        
        input.addEventListener('blur', function() {
            this.style.transform = 'scale(1)';
            this.style.boxShadow = 'none';
            this.parentElement.style.transform = 'scale(1)';
            this.parentElement.style.filter = 'none';
        });
        
        // Enhanced typing animation with color transitions
        input.addEventListener('input', function() {
            this.style.borderColor = '#8E1616';
            this.style.background = 'rgba(142, 22, 22, 0.1)';
            
            // Create ripple effect
            const ripple = document.createElement('div');
            ripple.style.position = 'absolute';
            ripple.style.top = '50%';
            ripple.style.left = '50%';
            ripple.style.width = '0';
            ripple.style.height = '0';
            ripple.style.background = 'rgba(142, 22, 22, 0.3)';
            ripple.style.borderRadius = '50%';
            ripple.style.transform = 'translate(-50%, -50%)';
            ripple.style.pointerEvents = 'none';
            ripple.style.transition = 'all 0.6s ease';
            
            this.parentElement.style.position = 'relative';
            this.parentElement.appendChild(ripple);
            
            setTimeout(() => {
                ripple.style.width = '100px';
                ripple.style.height = '100px';
                ripple.style.opacity = '0';
            }, 10);
            
            setTimeout(() => {
                if (ripple.parentNode) {
                    ripple.parentNode.removeChild(ripple);
                }
                this.style.borderColor = 'rgba(232, 201, 153, 0.3)';
                this.style.background = 'rgba(248, 238, 223, 0.2)';
            }, 600);
        });
        
        // Hover effects
        input.addEventListener('mouseenter', function() {
            if (this !== document.activeElement) {
                this.style.borderColor = 'rgba(142, 22, 22, 0.3)';
                this.style.background = 'rgba(248, 238, 223, 0.25)';
            }
        });
        
        input.addEventListener('mouseleave', function() {
            if (this !== document.activeElement) {
                this.style.borderColor = 'rgba(232, 201, 153, 0.3)';
                this.style.background = 'rgba(248, 238, 223, 0.2)';
            }
        });
    });
}

// Mobile menu functionality
function initializeMobileMenu() {
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    
    if (mobileMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenu.classList.toggle('hidden');
            
            const icon = mobileMenuBtn.querySelector('i');
            if (mobileMenu.classList.contains('hidden')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            } else {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            }
        });
    }
}

// Job Description Generator Logic
function initializeJobGenerator() {
    const form = document.getElementById('job-form');
    const generateBtn = document.getElementById('generateBtn');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    const outputContainer = document.getElementById('job-description-output');
    
    form.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(form);
        const jobData = Object.fromEntries(formData);
        
        // Validate required fields
        if (!validateForm(jobData)) {
            showToast('Please fill in all required fields', 'error');
            return;
        }
        
        // Start generation process
        startGeneration();
        
        try {
            // Generate AI-powered job description
            const formattedJobDescription = await generateJobDescription(jobData);
            
            // Show results with enhanced formatting
            showResults(formattedJobDescription);
            
        } catch (error) {
            console.error('Error generating job description:', error);
            
            // Show specific error message
            const errorMessage = error.message || 'Error generating job description. Please try again.';
            showToast(errorMessage, 'error');
            resetGenerationState();
            
            // Show fallback content if needed
            if (error.message.includes('API') || error.message.includes('network')) {
                showFallbackTemplate(jobData);
            }
        }
    });
    

    
    // Download functionality
    document.getElementById('download-btn').addEventListener('click', function() {
        downloadAsPDF();
        animateButton(this);
    });
    
    // Preview functionality
    document.getElementById('preview-btn').addEventListener('click', function() {
        showPDFPreview();
        animateButton(this);
    });
    
    // Preview modal event listeners
    document.getElementById('close-preview').addEventListener('click', closePDFPreview);
    document.getElementById('preview-close').addEventListener('click', closePDFPreview);
    document.getElementById('preview-download').addEventListener('click', function() {
        downloadAsPDF();
        closePDFPreview();
    });
    
    // Close modal when clicking outside
    document.getElementById('pdf-preview-modal').addEventListener('click', function(e) {
        if (e.target === this) {
            closePDFPreview();
        }
    });
    
    // Regenerate functionality
    document.getElementById('regenerate-btn').addEventListener('click', function() {
        const formData = new FormData(form);
        const jobData = Object.fromEntries(formData);
        
        startGeneration();
        generateJobDescription(jobData).then(showResults);
        animateButton(this);
    });
}

// Form validation
function validateForm(data) {
    const required = ['jobTitle', 'degree', 'skillsKnown', 'companyName', 'companyEmail', 'state', 'city', 'experienceLevel', 'jobType'];
    return required.every(field => data[field] && data[field].trim() !== '');
}

// Start generation animation
function startGeneration() {
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    
    // Update button state
    generateBtn.disabled = true;
    btnText.classList.add('hidden');
    btnLoading.classList.remove('hidden');
    
    // Show loading state
    resultsSection.classList.add('hidden');
    loadingState.classList.remove('hidden');
    loadingState.classList.add('fade-in');
    
    // Scroll to loading area
    loadingState.scrollIntoView({ behavior: 'smooth', block: 'center' });
}

// Reset generation state
function resetGenerationState() {
    const generateBtn = document.getElementById('generateBtn');
    const btnText = document.getElementById('btn-text');
    const btnLoading = document.getElementById('btn-loading');
    const loadingState = document.getElementById('loading-state');
    
    generateBtn.disabled = false;
    btnText.classList.remove('hidden');
    btnLoading.classList.add('hidden');
    loadingState.classList.add('hidden');
}

// AI job description generation
// async function generateJobDescription(jobData) {
//     // Simulate API processing delay
//     await new Promise(resolve => setTimeout(resolve, 2000));
    
//     // Return formatted empty template for user to customize
//     return formatJobDescriptionTemplate(jobData);
// }

// Format job description template
function formatJobDescriptionTemplate(jobData) {
    return `
        <div class="space-y-6">
            <div>
                <h3 class="text-2xl font-bold text-primary-red mb-3">${jobData.jobTitle}</h3>
                <p class="text-gray-700 mb-2"><strong>Company:</strong> ${jobData.companyName}</p>
                <p class="text-gray-700 mb-2"><strong>Location:</strong> ${jobData.city}, ${jobData.state}</p>
                <p class="text-gray-700 mb-2"><strong>Job Type:</strong> ${jobData.jobType.replace('-', ' ').replace(/\b\w/g, l => l.toUpperCase())}</p>
                <p class="text-gray-700"><strong>Experience Level:</strong> ${getExperienceLabel(jobData.experienceLevel)}</p>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-dark-text mb-3">Job Overview</h4>
                <p class="text-gray-700 leading-relaxed">
                    [Job description will be generated based on your requirements]
                </p>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-dark-text mb-3">Key Responsibilities</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-2">
                    <li>[Responsibility 1]</li>
                    <li>[Responsibility 2]</li>
                    <li>[Responsibility 3]</li>
                </ul>
            </div>
            
            <div>
                <h4 class="text-xl font-semibold text-dark-text mb-3">Required Skills & Qualifications</h4>
                <ul class="list-disc list-inside text-gray-700 space-y-2">
                    <li>${getExperienceRequirement(jobData.experienceLevel)}</li>
                    <li>Skills: ${jobData.skillsKnown}</li>
                    <li>Education: ${jobData.degree}</li>
                    <li>[Additional qualification]</li>
                </ul>
            </div>
            
            ${jobData.additionalDetails ? `
            <div>
                <h4 class="text-xl font-semibold text-dark-text mb-3">Additional Information</h4>
                <p class="text-gray-700 leading-relaxed">${jobData.additionalDetails}</p>
            </div>
            ` : ''}
            
            <div>
                <h4 class="text-xl font-semibold text-dark-text mb-3">How to Apply</h4>
                <p class="text-gray-700">Please send your application to <a href="mailto:${jobData.companyEmail}" class="text-primary-red hover:underline">${jobData.companyEmail}</a></p>
            </div>
        </div>
    `;
}



// Helper functions
function getExperienceLabel(level) {
    const labels = {
        'entry': 'Entry Level (0-2 years)',
        'mid': 'Mid Level (3-5 years)',
        'senior': 'Senior Level (5-8 years)',
        'lead': 'Lead/Principal (8+ years)'
    };
    return labels[level] || level;
}

function getExperienceRequirement(level) {
    const requirements = {
        'entry': '0-2 years of experience',
        'mid': '3-5 years of experience',
        'senior': '5-8 years of experience',
        'lead': '8+ years of experience'
    };
    return requirements[level] || 'Relevant experience';
}

// Show results with animation
function showResults(content) {
    const loadingState = document.getElementById('loading-state');
    const resultsSection = document.getElementById('results-section');
    const outputContainer = document.getElementById('job-description-output');
    
    // Hide loading
    loadingState.classList.add('hidden');
    
    // Show results with animation
    resultsSection.classList.remove('hidden');
    resultsSection.classList.add('slide-up');
    
    // Set content with enhanced formatting
    outputContainer.innerHTML = content;
    outputContainer.style.opacity = '0';
    outputContainer.style.transform = 'translateY(20px)';
    
    // Animate each section with staggered delay
    setTimeout(() => {
        outputContainer.style.transition = 'all 0.6s ease';
        outputContainer.style.opacity = '1';
        outputContainer.style.transform = 'translateY(0)';
        
        // Animate content elements with stagger
        const elements = outputContainer.querySelectorAll('div > div, h2, h3, p, ul');
        elements.forEach((element, index) => {
            element.style.opacity = '0';
            element.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                element.style.transition = 'all 0.4s ease';
                element.style.opacity = '1';
                element.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }, 100);
    
    // Reset button state
    resetGenerationState();
    
    // Scroll to results with better timing
    setTimeout(() => {
        resultsSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        
        // Show success message
        showToast('Job description generated successfully!', 'success');
    }, 500);
}

// Toast notification system
function showToast(message, type = 'success') {
    const toast = document.getElementById('success-toast');
    const toastMessage = document.getElementById('toast-message');
    const toastContainer = toast.querySelector('div');
    const iconElement = toastContainer.querySelector('i');
    
    toastMessage.textContent = message;
    toast.classList.remove('hidden');
    
    // Update icon and color based on type
    if (type === 'error') {
        toastContainer.style.background = 'rgba(220, 38, 38, 0.9)';
        toastContainer.style.borderColor = '#dc2626';
        iconElement.className = 'fas fa-exclamation-circle text-white text-xl';
    } else if (type === 'warning') {
        toastContainer.style.background = 'rgba(245, 158, 11, 0.9)';
        toastContainer.style.borderColor = '#f59e0b';
        iconElement.className = 'fas fa-exclamation-triangle text-white text-xl';
    } else if (type === 'info') {
        toastContainer.style.background = 'rgba(59, 130, 246, 0.9)';
        toastContainer.style.borderColor = '#3b82f6';
        iconElement.className = 'fas fa-info-circle text-white text-xl';
    } else {
        toastContainer.style.background = 'rgba(34, 197, 94, 0.9)';
        toastContainer.style.borderColor = '#22c55e';
        iconElement.className = 'fas fa-check-circle text-white text-xl';
    }
    
    // Animate in
    setTimeout(() => {
        toastContainer.style.transform = 'translateX(0)';
    }, 10);
    
    // Auto hide (longer for errors)
    const hideDelay = type === 'error' ? 5000 : 3000;
    setTimeout(() => {
        toastContainer.style.transform = 'translateX(100%)';
        setTimeout(() => {
            toast.classList.add('hidden');
        }, 500);
    }, hideDelay);
}

// Button animation
function animateButton(button) {
    button.style.transform = 'scale(0.95)';
    setTimeout(() => {
        button.style.transform = 'scale(1)';
    }, 150);
}

// Download as PDF functionality
function downloadAsPDF() {
    const outputContainer = document.getElementById('job-description-output');
    if (!outputContainer || !outputContainer.innerHTML.trim()) {
        showToast('No job description to download. Please generate one first.', 'warning');
        return;
    }

    try {
        // Initialize jsPDF
        const { jsPDF } = window.jspdf;
        const doc = new jsPDF('p', 'mm', 'a4');
        
        // Get job details from the displayed content
        const jobDetails = extractJobDetails();
        
        // Set up formal PDF styling with proper spacing and borders
        const pageWidth = doc.internal.pageSize.getWidth();
        const pageHeight = doc.internal.pageSize.getHeight();
        const margin = 20; // Increased margin for more formal look
        const maxWidth = pageWidth - (margin * 2);
        let yPosition = margin;

        // Add formal double border
        doc.setDrawColor(0, 0, 0); // Black border for formal look
        doc.setLineWidth(1.5);
        doc.rect(8, 8, pageWidth - 16, pageHeight - 16); // Outer border
        doc.setLineWidth(0.5);
        doc.rect(12, 12, pageWidth - 24, pageHeight - 24); // Inner border
        
        // Add formal header section with just title (no separate section as requested)
        doc.setTextColor(0, 0, 0);
        doc.setFontSize(16); // Heading font size as specified
        doc.setFont('helvetica', 'bold');
        yPosition = margin + 15;
        
        // Center-align the main title for formal appearance
        const titleWidth = doc.getTextWidth(jobDetails.title);
        const titleX = (pageWidth - titleWidth) / 2;
        doc.text(jobDetails.title, titleX, yPosition);
        
        // Add company and location info as subheader
        doc.setFontSize(12); // Content font size as specified
        doc.setFont('helvetica', 'normal');
        yPosition += 8; // Line spacing 1.2 equivalent
        
        const headerInfo = `${jobDetails.company} - ${jobDetails.location}`;
        const headerWidth = doc.getTextWidth(headerInfo);
        const headerX = (pageWidth - headerWidth) / 2;
        doc.text(headerInfo, headerX, yPosition);
        
        // Add a formal separator line
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.8);
        yPosition += 12;
        doc.line(margin + 10, yPosition, pageWidth - margin - 10, yPosition);
        
        // Add job details section with labels and values
        yPosition += 15;
        doc.setFontSize(14);
        doc.setFont('helvetica', 'bold');
        doc.setTextColor(0, 0, 0);
        doc.text('Job Details', margin + 8, yPosition);
        
        yPosition += 10;
        doc.setFontSize(12);
        doc.setFont('helvetica', 'normal');
        
        // Add job details with proper formatting
        const jobDetailsInfo = [
            { label: 'Job Title:', value: jobDetails.title },
            { label: 'Company:', value: jobDetails.company },
            { label: 'Location:', value: jobDetails.location },
            { label: 'Job Type:', value: jobDetails.jobType },
            { label: 'Experience Level:', value: jobDetails.experienceLevel || 'Not specified' }
        ];
        
        jobDetailsInfo.forEach(item => {
            if (item.value && item.value.trim()) {
                doc.setFont('helvetica', 'bold');
                doc.text(item.label, margin + 8, yPosition);
                
                doc.setFont('helvetica', 'normal');
                const labelWidth = doc.getTextWidth(item.label + ' ');
                doc.text(item.value, margin + 8 + labelWidth, yPosition);
                
                yPosition += 6;
            }
        });
        
        // Add another separator line after job details
        yPosition += 8;
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(margin + 10, yPosition, pageWidth - margin - 10, yPosition);
        
        // Reset for body content with formal spacing
        yPosition += 15;
        
        // Get the content and clean it
        const contentHtml = outputContainer.innerHTML;
        const cleanedContent = cleanHtmlForPDF(contentHtml);
        
        // Add content sections with formal formatting
        yPosition = addFormalPDFContent(doc, cleanedContent, margin, yPosition, maxWidth, pageHeight);
        
        // Add formal footer
        const currentDate = new Date().toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
        
        doc.setFontSize(10);
        doc.setTextColor(80, 80, 80);
        doc.setFont('helvetica', 'italic');
        
        // Add formal separator line above footer
        doc.setDrawColor(0, 0, 0);
        doc.setLineWidth(0.3);
        doc.line(margin + 10, pageHeight - 25, pageWidth - margin - 10, pageHeight - 25);
        
        // Center-align footer
        const footerText = `Document generated on ${currentDate}`;
        const footerWidth = doc.getTextWidth(footerText);
        const footerX = (pageWidth - footerWidth) / 2;
        doc.text(footerText, footerX, pageHeight - 15);
        
        // Save the PDF with formal naming
        const fileName = `${jobDetails.title.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_position_description.pdf`;
        doc.save(fileName);
        
        showToast('Formal job description downloaded as PDF successfully!', 'success');
        
    } catch (error) {
        console.error('PDF generation error:', error);
        showToast('Error generating PDF. Please try again.', 'error');
    }
}

// Helper function to extract text content from selectors
function extractTextContent(selector) {
    const outputContainer = document.getElementById('job-description-output');
    if (!outputContainer) return '';
    
    const element = outputContainer.querySelector(selector);
    if (!element) return '';
    
    // Get the text, handling different content structures
    let text = element.textContent || element.innerText || '';
    
    // Clean up the text (remove icons and extra whitespace)
    text = text.replace(/[\u{1F300}-\u{1F9FF}]|[\u{2600}-\u{26FF}]|[\u{2700}-\u{27BF}]/gu, ''); // Remove emojis
    text = text.replace(/[^\w\s\-.,()]/g, ''); // Remove special characters except common punctuation
    text = text.trim();
    
    return text;
}

// Helper function to extract job details from the header
function extractJobDetails() {
    // Use the globally stored job details if available
    if (currentJobDetails) {
        console.log('Using stored job details:', currentJobDetails); // Debug log
        return {
            title: currentJobDetails.title || 'Job Description',
            company: currentJobDetails.company || 'Company',
            location: currentJobDetails.location || 'Location',
            salary: currentJobDetails.salary || '',
            jobType: currentJobDetails.jobType || '',
            experienceLevel: currentJobDetails.experienceLevel || ''
        };
    }
    
    // Fallback to DOM extraction if no stored details
    const outputContainer = document.getElementById('job-description-output');
    if (!outputContainer) return {
        title: 'Job Description',
        company: 'Company',
        location: 'Location',
        salary: '',
        jobType: '',
        experienceLevel: ''
    };
    
    // Extract from the structured HTML we create
    const jobTitle = outputContainer.querySelector('h2.text-3xl.font-bold')?.textContent?.trim() || 'Job Description';
    
    // Extract company name (text after building icon)
    const companyElement = outputContainer.querySelector('.fa-building')?.parentNode;
    let company = 'Company';
    if (companyElement) {
        const companyText = companyElement.textContent.trim();
        company = companyText.replace(/[^\w\s\-.,()]/g, '').trim() || 'Company';
    }
    
    // Extract location (text after map icon)
    const locationElement = outputContainer.querySelector('.fa-map-marker-alt')?.parentNode;
    let location = 'Location';
    if (locationElement) {
        const locationText = locationElement.textContent.trim();
        location = locationText.replace(/[^\w\s\-.,()]/g, '').trim() || 'Location';
    }
    
    // Extract salary (text after dollar icon)
    const salaryElement = outputContainer.querySelector('.fa-dollar-sign')?.parentNode;
    let salary = '';
    if (salaryElement) {
        const salaryText = salaryElement.textContent.trim();
        salary = salaryText.replace(/[^\w\s\-.,()$]/g, '').trim();
    }
    
    // Extract job type (text after briefcase icon)
    const jobTypeElement = outputContainer.querySelector('.fa-briefcase')?.parentNode;
    let jobType = '';
    if (jobTypeElement) {
        const jobTypeText = jobTypeElement.textContent.trim();
        jobType = jobTypeText.replace(/[^\w\s\-.,()]/g, '').trim();
    }
    
    console.log('Extracted job details from DOM:', { jobTitle, company, location, salary, jobType }); // Debug log
    
    return {
        title: jobTitle,
        company: company,
        location: location,
        salary: salary,
        jobType: jobType
    };
}

// Helper function to clean HTML and extract meaningful content
function cleanHtmlForPDF(html) {
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Remove script and style elements
    const scripts = tempDiv.querySelectorAll('script, style');
    scripts.forEach(el => el.remove());
    
    // Get sections and format them
    const sections = [];
    
    // Find headers and content
    const headers = tempDiv.querySelectorAll('h3, h2');
    headers.forEach(header => {
        const headerText = header.textContent.trim();
        if (headerText && !headerText.includes('How to Apply')) {
            sections.push({
                type: 'header',
                text: headerText.replace(/^\d+\.\s*/, '').replace(/^\s*[►▶]\s*/, '')
            });
            
            // Find following content
            let nextElement = header.nextElementSibling;
            while (nextElement && !nextElement.matches('h2, h3')) {
                if (nextElement.matches('p')) {
                    const pText = nextElement.textContent.trim();
                    if (pText) {
                        sections.push({
                            type: 'paragraph',
                            text: pText
                        });
                    }
                } else if (nextElement.matches('ul')) {
                    const listItems = nextElement.querySelectorAll('li');
                    listItems.forEach(li => {
                        const liText = li.textContent.trim();
                        if (liText) {
                            sections.push({
                                type: 'bullet',
                                text: liText
                            });
                        }
                    });
                }
                nextElement = nextElement.nextElementSibling;
            }
        }
    });
    
    return sections;
}

// Helper function to add content to PDF with formal formatting
function addFormalPDFContent(doc, sections, margin, startY, maxWidth, pageHeight) {
    let yPosition = startY;
    const lineHeight = 6; // Normal line spacing (removed 1.2 multiplier)
    const bottomMargin = 40;
    const contentMargin = margin + 8; // Padding from border
    const contentWidth = maxWidth - 16; // Account for padding
    
    sections.forEach(section => {
        // Check if we need a new page
        if (yPosition > pageHeight - bottomMargin) {
            doc.addPage();
            
            // Add formal double border to new page
            doc.setDrawColor(0, 0, 0);
            doc.setLineWidth(1.5);
            doc.rect(8, 8, doc.internal.pageSize.getWidth() - 16, doc.internal.pageSize.getHeight() - 16);
            doc.setLineWidth(0.5);
            doc.rect(12, 12, doc.internal.pageSize.getWidth() - 24, doc.internal.pageSize.getHeight() - 24);
            
            yPosition = margin + 15;
        }
        
        switch (section.type) {
            case 'header':
                yPosition += 12; // Extra space before headers for formal layout
                doc.setFontSize(16); // Heading font size as specified
                doc.setFont('helvetica', 'bold');
                doc.setTextColor(0, 0, 0); // Black for formal look
                
                const headerLines = doc.splitTextToSize(section.text, contentWidth);
                headerLines.forEach(line => {
                    doc.text(line, contentMargin, yPosition);
                    yPosition += lineHeight; // Normal spacing for headers
                });
                yPosition += 6;
                break;
                
            case 'paragraph':
                doc.setFontSize(12); // Content font size as specified
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0); // Pure black for formal documents
                
                const paraLines = doc.splitTextToSize(section.text, contentWidth);
                paraLines.forEach(line => {
                    if (yPosition > pageHeight - bottomMargin) {
                        doc.addPage();
                        
                        // Add formal double border to new page
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(1.5);
                        doc.rect(8, 8, doc.internal.pageSize.getWidth() - 16, doc.internal.pageSize.getHeight() - 16);
                        doc.setLineWidth(0.5);
                        doc.rect(12, 12, doc.internal.pageSize.getWidth() - 24, doc.internal.pageSize.getHeight() - 24);
                        
                        yPosition = margin + 15;
                    }
                    doc.text(line, contentMargin, yPosition);
                    yPosition += lineHeight; // Normal line spacing
                });
                yPosition += 8; // Paragraph spacing
                break;
                
            case 'bullet':
                doc.setFontSize(12); // Content font size as specified
                doc.setFont('helvetica', 'normal');
                doc.setTextColor(0, 0, 0);
                
                // Add formal bullet point (•)
                doc.text('•', contentMargin, yPosition);
                
                const bulletLines = doc.splitTextToSize(section.text, contentWidth - 12);
                bulletLines.forEach((line, index) => {
                    if (yPosition > pageHeight - bottomMargin) {
                        doc.addPage();
                        
                        // Add formal double border to new page
                        doc.setDrawColor(0, 0, 0);
                        doc.setLineWidth(1.5);
                        doc.rect(8, 8, doc.internal.pageSize.getWidth() - 16, doc.internal.pageSize.getHeight() - 16);
                        doc.setLineWidth(0.5);
                        doc.rect(12, 12, doc.internal.pageSize.getWidth() - 24, doc.internal.pageSize.getHeight() - 24);
                        
                        yPosition = margin + 15;
                    }
                    doc.text(line, contentMargin + 10, yPosition);
                    if (index < bulletLines.length - 1) {
                        yPosition += lineHeight; // Normal line spacing
                    }
                });
                yPosition += lineHeight + 4; // Bullet item spacing
                break;
        }
    });
    
    return yPosition;
}

// Helper function to add content to PDF with proper formatting (original function kept for compatibility)
function addPDFContent(doc, sections, margin, startY, maxWidth, pageHeight) {
    let yPosition = startY;
    const lineHeight = 6;
    const bottomMargin = 35;
    const contentMargin = margin + 5; // Add some padding from the border
    const contentWidth = maxWidth - 10; // Account for padding
    
    sections.forEach(section => {
        // Check if we need a new page
        if (yPosition > pageHeight - bottomMargin) {
            doc.addPage();
            
            // Add border to new page
            doc.setDrawColor(142, 22, 22);
            doc.setLineWidth(1);
            doc.rect(margin - 5, margin - 5, maxWidth + 10, pageHeight - (margin * 2) + 10);
            
            yPosition = margin + 10; // Start content lower on new pages
        }
        
        switch (section.type) {
            case 'header':
                yPosition += 10; // Extra space before headers
                doc.setFontSize(14);
                doc.setFont(undefined, 'bold');
                doc.setTextColor(142, 22, 22); // primary-red
                
                // Add a subtle background for headers
                doc.setFillColor(248, 238, 223, 0.3); // light cream background
                const headerHeight = 8;
                doc.rect(contentMargin - 2, yPosition - 6, contentWidth + 4, headerHeight, 'F');
                
                const headerLines = doc.splitTextToSize(section.text, contentWidth);
                headerLines.forEach(line => {
                    doc.text(line, contentMargin, yPosition);
                    yPosition += lineHeight + 2;
                });
                yPosition += 4;
                break;
                
            case 'paragraph':
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(50, 50, 50); // Slightly softer black
                
                const paraLines = doc.splitTextToSize(section.text, contentWidth);
                paraLines.forEach(line => {
                    if (yPosition > pageHeight - bottomMargin) {
                        doc.addPage();
                        
                        // Add border to new page
                        doc.setDrawColor(142, 22, 22);
                        doc.setLineWidth(1);
                        doc.rect(margin - 5, margin - 5, maxWidth + 10, pageHeight - (margin * 2) + 10);
                        
                        yPosition = margin + 10;
                    }
                    doc.text(line, contentMargin, yPosition);
                    yPosition += lineHeight;
                });
                yPosition += 4;
                break;
                
            case 'bullet':
                doc.setFontSize(11);
                doc.setFont(undefined, 'normal');
                doc.setTextColor(50, 50, 50);
                
                // Add colored bullet point
                doc.setTextColor(142, 22, 22);
                doc.text('•', contentMargin, yPosition);
                doc.setTextColor(50, 50, 50);
                
                const bulletLines = doc.splitTextToSize(section.text, contentWidth - 10);
                bulletLines.forEach((line, index) => {
                    if (yPosition > pageHeight - bottomMargin) {
                        doc.addPage();
                        
                        // Add border to new page
                        doc.setDrawColor(142, 22, 22);
                        doc.setLineWidth(1);
                        doc.rect(margin - 5, margin - 5, maxWidth + 10, pageHeight - (margin * 2) + 10);
                        
                        yPosition = margin + 10;
                    }
                    doc.text(line, contentMargin + 8, yPosition);
                    if (index < bulletLines.length - 1) {
                        yPosition += lineHeight;
                    }
                });
                yPosition += lineHeight + 2;
                break;
        }
    });
    
    return yPosition;
}

// Initialize tooltips
function initializeTooltips() {
    const tooltipElements = document.querySelectorAll('[title]');
    
    tooltipElements.forEach(element => {
        element.addEventListener('mouseenter', function() {
            const tooltip = document.createElement('div');
            tooltip.className = 'absolute z-50 px-3 py-2 text-sm text-white bg-gray-900 rounded-lg shadow-lg';
            tooltip.textContent = this.getAttribute('title');
            tooltip.style.bottom = '100%';
            tooltip.style.left = '50%';
            tooltip.style.transform = 'translateX(-50%)';
            tooltip.style.marginBottom = '8px';
            
            this.style.position = 'relative';
            this.appendChild(tooltip);
            this.removeAttribute('title');
            this.dataset.originalTitle = tooltip.textContent;
        });
        
        element.addEventListener('mouseleave', function() {
            const tooltip = this.querySelector('.absolute');
            if (tooltip) {
                this.removeChild(tooltip);
                this.setAttribute('title', this.dataset.originalTitle);
            }
        });
    });
}

async function generateJobDescription(jobData) {
    try {
        const response = await fetch("/generate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(jobData)
        });
        
        // Check if the response is ok
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const result = await response.json();
        
        if (result.success && result.jobDescription) {
            return formatJobDescriptionDisplay(result);
        } else {
            throw new Error(result.message || result.error || "Failed to generate job description. Please try again.");
        }
    } catch (error) {
        console.error("Error in generateJobDescription:", error);
        
        // Provide more specific error messages
        if (error.name === 'TypeError' && error.message.includes('fetch')) {
            throw new Error("Network error - please check your connection and try again.");
        } else if (error.message.includes('HTTP error')) {
            throw new Error("Server error - please try again in a moment.");
        } else {
            throw new Error(error.message || "Failed to generate job description. Please try again.");
        }
    }
}

// Format the job description for structured display
function formatJobDescriptionDisplay(result) {
    const { jobDescription, jobDetails, metadata } = result;
    
    // Store job details globally for PDF generation
    currentJobDetails = jobDetails;
    
    // Process the job description text to add HTML formatting
    let formattedContent = jobDescription;
    
    // Format headers (lines starting with numbers or **text**)
    formattedContent = formattedContent.replace(/^\*\*(.*?)\*\*/gm, '<h3 class="text-xl font-bold text-primary-red mt-6 mb-3 flex items-center"><i class="fas fa-chevron-right text-sm mr-2"></i>$1</h3>');
    
    // Format numbered sections
    formattedContent = formattedContent.replace(/^(\d+\.\s*\*\*.*?\*\*)/gm, '<h3 class="text-xl font-bold text-primary-red mt-6 mb-3 flex items-center"><i class="fas fa-list-ol text-sm mr-2"></i>$1</h3>');
    
    // Format bullet points
    formattedContent = formattedContent.replace(/^[-•]\s*(.*)/gm, '<li class="flex items-start mb-2"><i class="fas fa-check-circle text-primary-red text-sm mt-1 mr-3 flex-shrink-0"></i><span>$1</span></li>');
    
    // Wrap consecutive bullet points in ul tags
    formattedContent = formattedContent.replace(/(<li[^>]*>.*?<\/li>\s*)+/gs, '<ul class="space-y-1 mb-4">$&</ul>');
    
    // Format paragraphs
    formattedContent = formattedContent.replace(/^(?!<[hul]|<li)(.+)$/gm, '<p class="text-gray-700 leading-relaxed mb-4">$1</p>');
    
    // Remove empty paragraphs
    formattedContent = formattedContent.replace(/<p[^>]*>\s*<\/p>/g, '');
    
    return `
        <div class="space-y-6">
            <!-- Job Header -->
            <div class="bg-gradient-to-r from-primary-red to-soft-gold p-6 rounded-2xl text-white">
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <h2 class="text-3xl font-bold mb-2">${jobDetails.title}</h2>
                        <p class="text-lg opacity-90"><i class="fas fa-building mr-2"></i>${jobDetails.company}</p>
                        <p class="opacity-90"><i class="fas fa-map-marker-alt mr-2"></i>${jobDetails.location}</p>
                    </div>
                    <div class="space-y-2 text-right md:text-left">
                        <div class="bg-white/20 backdrop-blur-sm rounded-lg p-3">
                            <p class="font-semibold"><i class="fas fa-briefcase mr-2"></i>${jobDetails.jobType}</p>
                            <p><i class="fas fa-chart-line mr-2"></i>${jobDetails.experienceLevel}</p>
                            <p><i class="fas fa-dollar-sign mr-2"></i>${jobDetails.salary}</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <!-- Job Description Content -->
            <div class="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-soft-gold/20">
                <div class="prose prose-lg max-w-none">
                    ${formattedContent}
                </div>
            </div>
            
            <!-- Application Section -->
            <div class="bg-light-cream/30 backdrop-blur-sm rounded-2xl p-6 border border-soft-gold/30">
                <h3 class="text-xl font-bold text-primary-red mb-4 flex items-center">
                    <i class="fas fa-paper-plane mr-3"></i>How to Apply
                </h3>
                <p class="text-gray-700 mb-4">Ready to join our team? Send your application to:</p>
                <div class="flex flex-col sm:flex-row items-start sm:items-center gap-4">
                    <a href="mailto:${jobDetails.email}" 
                       class="bg-gradient-to-r from-primary-red to-soft-gold text-white px-6 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-300 flex items-center">
                        <i class="fas fa-envelope mr-2"></i>
                        Apply Now - ${jobDetails.email}
                    </a>
                    <div class="text-sm text-gray-600 flex items-center">
                        <i class="fas fa-clock mr-2"></i>
                        Generated with ${metadata.wordCount} words
                    </div>
                </div>
            </div>
        </div>
    `;
}

// Fallback template if AI generation fails
function showFallbackTemplate(jobData) {
    const fallbackContent = formatJobDescriptionTemplate(jobData);
    showResults(fallbackContent);
    showToast('Generated a template for you to customize', 'info');
}

// PDF Preview Functions
function showPDFPreview() {
    const outputContainer = document.getElementById('job-description-output');
    if (!outputContainer || !outputContainer.innerHTML.trim()) {
        showToast('No job description to preview. Please generate one first.', 'warning');
        return;
    }

    try {
        // Get job details
        const jobDetails = extractJobDetails();
        
        // Get and clean content
        const contentHtml = outputContainer.innerHTML;
        const cleanedContent = cleanHtmlForPDF(contentHtml);
        
        // Generate preview content
        const previewContent = generatePreviewContent(jobDetails, cleanedContent);
        
        // Show modal
        const modal = document.getElementById('pdf-preview-modal');
        const previewContainer = document.getElementById('pdf-preview-content');
        previewContainer.innerHTML = previewContent;
        
        modal.classList.remove('hidden');
        document.body.style.overflow = 'hidden'; // Prevent background scrolling
        
        showToast('PDF preview loaded successfully!', 'success');
        
    } catch (error) {
        console.error('Preview generation error:', error);
        showToast('Error generating preview. Please try again.', 'error');
    }
}

function closePDFPreview() {
    const modal = document.getElementById('pdf-preview-modal');
    modal.classList.add('hidden');
    document.body.style.overflow = 'auto'; // Restore scrolling
}

function generatePreviewContent(jobDetails, sections) {
    // Generate header
    const headerContent = `
        <div style="text-align: center; margin-bottom: 30px;">
            <h1 style="font-size: 16pt; font-weight: bold; margin-bottom: 8px; color: #000;">${jobDetails.title}</h1>
            <p style="font-size: 12pt; color: #000; margin: 0;">${jobDetails.company} - ${jobDetails.location}</p>
        </div>
        <hr style="border: none; border-top: 0.8px solid #000; margin: 15px 10px;">
        
        <div style="margin: 15px 0;">
            <h3 style="font-size: 14pt; font-weight: bold; color: #000; margin-bottom: 10px;">Job Details</h3>
            <div style="font-size: 12pt; color: #000;">
                ${jobDetails.title ? `<div style="margin-bottom: 6px;"><strong>Job Title:</strong> ${jobDetails.title}</div>` : ''}
                ${jobDetails.company ? `<div style="margin-bottom: 6px;"><strong>Company:</strong> ${jobDetails.company}</div>` : ''}
                ${jobDetails.location ? `<div style="margin-bottom: 6px;"><strong>Location:</strong> ${jobDetails.location}</div>` : ''}
                ${jobDetails.jobType ? `<div style="margin-bottom: 6px;"><strong>Job Type:</strong> ${jobDetails.jobType}</div>` : ''}
                ${jobDetails.experienceLevel ? `<div style="margin-bottom: 6px;"><strong>Experience Level:</strong> ${jobDetails.experienceLevel}</div>` : ''}
            </div>
        </div>
        <hr style="border: none; border-top: 0.3px solid #000; margin: 8px 10px 15px 10px;">
    `;
    
    // Generate body content
    let bodyContent = '';
    sections.forEach(section => {
        switch (section.type) {
            case 'header':
                bodyContent += `<h3 style="font-size: 16pt; font-weight: bold; color: #000; margin: 20px 0 10px 0;">${section.text}</h3>`;
                break;
            case 'paragraph':
                bodyContent += `<p style="font-size: 12pt; color: #000; margin: 0 0 12px 0; text-align: justify;">${section.text}</p>`;
                break;
            case 'bullet':
                bodyContent += `<div style="font-size: 12pt; color: #000; margin: 0 0 8px 0; padding-left: 15px;">• ${section.text}</div>`;
                break;
        }
    });
    
    // Generate footer
    const currentDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    });
    const footerContent = `
        <div style="position: absolute; bottom: 20px; left: 0; right: 0; text-align: center;">
            <hr style="border: none; border-top: 0.3px solid #000; margin: 0 10px 10px 10px;">
            <p style="font-size: 10pt; color: #505050; font-style: italic; margin: 0;">Document generated on ${currentDate}</p>
        </div>
    `;
    
    return `
        <div style="position: relative; min-height: 277mm;">
            <!-- Double border effect -->
            <div style="position: absolute; inset: 8px; border: 1.5px solid #000;"></div>
            <div style="position: absolute; inset: 12px; border: 0.5px solid #000;"></div>
            
            <!-- Content with proper padding -->
            <div style="padding: 20mm; position: relative; z-index: 1;">
                ${headerContent}
                <div style="margin-top: 15px;">
                    ${bodyContent}
                </div>
            </div>
            ${footerContent}
        </div>
    `;
}
