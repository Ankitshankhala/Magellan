// HGV Driver Tools - Main JavaScript File
let currentLanguage = 'en';
let trackingActive = false;
let trackingId = null;
let loadedDocumentFile = null;
let placementCoordinates = { x: 70, y: 80 };
let documentScale = 1;
let placementMode = true; // Always enabled now

// Utility function to auto-populate date and time fields
function autoPopulateDateTimeFields() {
    const now = new Date();

    // Format date as YYYY-MM-DD
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const day = String(now.getDate()).padStart(2, '0');
    const dateString = `${year}-${month}-${day}`;

    // Format time as HH:MM
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const timeString = `${hours}:${minutes}`;

    // Auto-populate all date and time fields across all tools
    const dateFields = [
        'checkDate',           // Walkaround checklist
        'delivery-date',       // Delivery note
        'incident-date',       // Incident report
        'epod-delivery-date'   // E-POD details
    ];

    const timeFields = [
        'checkTime',           // Walkaround checklist
        'delivery-time',       // Delivery note
        'incident-time',       // Incident report
        'hoursStartTime'       // Drive/Work hours calculator
    ];

    // Set date fields
    dateFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) { // Only set if field is empty
            field.value = dateString;
        }
    });

    // Set time fields
    timeFields.forEach(fieldId => {
        const field = document.getElementById(fieldId);
        if (field && !field.value) { // Only set if field is empty
            field.value = timeString;
        }
    });

    // Set E-POD delivery date if empty
    const epodDateField = document.getElementById('epod-delivery-date');
    if (epodDateField && !epodDateField.value) {
        epodDateField.value = dateString;
    }
}

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    console.log('HGV Driver Tools loaded successfully');

    // Auto-populate all date and time fields
    autoPopulateDateTimeFields();

    // Initialize signature canvas
    initializeSignatureCanvas();

    // Initialize delivery form
    initializeDeliveryForm();

    // Initialize GPS tracking
    initializeGPSTracking();

    // Initialize geofencing
    initializeGeofencing();

    // Initialize document wallet
    initializeDocumentWallet();

    // Initialize E-POD
    initializeEPOD();

    // Initialize converter tabs
    initializeConverters();

    // Initialize AI Assistant
    initializeAIAssistant();

    // Initialize incident report
    initializeIncidentReport();

    // Initialize section image uploads
    initializeSectionImageUploads();

    // Load saved profile data
    loadProfile();

    // Initialize archive
    loadArchiveData();

    // Initialize weather widget
    initializeWeather();

    // Apply current language
    changeLanguage(currentLanguage);

    // Show home section by default
    showSection('home');
});

// Language translations
const translations = {
    en: {
        // Navigation
        "nav-converters": "Converters",
        "nav-checklist": "Walkaround Checklist",
        "nav-epod": "E-POD",
        "nav-delivery": "Delivery Note",
        "nav-gps": "GPS Tracking",
        "nav-document-wallet": "Document Wallet",
        "nav-moretools": "Get More Tools",
        "nav-home": "Home",
        "nav-profile": "Profile",
        "nav-archive": "Archive",
        "nav-language": "Language",

        // Common
        "back-btn": "← Back",
        "yes": "Yes",
        "no": "No",
        "save-btn": "Save",
        "clear-signature": "Clear Signature",
        "driver-signature": "Driver's Signature",
        "generate-pdf": "Generate PDF Report",
        "save-checklist": "Save Checklist",

        // Checklist
        "checklist-title": "HGV Driver Walk-Around Checklist",
        "vehicle-reg": "Vehicle Registration No:",
        "odo": "ODO:",
        "trailer-no": "Trailer No:",
        "driver-name": "Driver's Name:",
        "date": "Date:",
        "time": "Time:",
        "daily-check": "Daily Check",
        "checklist-item": "Checklist Item",
        "status": "Status",
        "defects": "Defects",
        "report-defects": "Report defects here:",
        "upload-defect": "Upload Defect Image:",

        // E-POD
        "epod-title": "Electronic Proof of Delivery",
        "upload": "Upload",
        "sign": "Sign",
        "details": "Details",
        "upload-pdf": "Upload Delivery Note (PDF)",
        "select-pdf": "Select PDF File:",
        "load-pdf": "Load PDF",

        // Delivery
        "delivery-title": "Delivery Note",

        // GPS Tracking
        "gps-title": "GPS Tracking",
        
        // Weather Details
        "weather-title": "Weather Details",
        "driver-tracking": "Driver Tracking Control",
        "not-tracking": "Not tracking",
        "tracking-id": "Tracking ID",
        "start-tracking": "Start Tracking",
        "stop-sharing": "Stop Sharing",
        "share-link": "Share Link",
        "current-location": "Current Location",
        "click-start": "Click \"Start Tracking\" to get your location",
        "driver-location-map": "Driver Location Map",
        "click-start-map": "Click \"Start Tracking\" to display map",

        // More Tools
        "tools-title": "Get More Tools",
        "hours-calculator": "Driver Hours Calculator",
        "start-time": "Start Time:",
        "end-time": "End Time:",

        // AI Assistant
        "ai-copilot": "AI Copilot",
        "ai-title": "AI Assistant",
        "ai-welcome": "HGV AI Assistant",
        "ai-description": "Ask me anything about HGV regulations, route planning, maintenance, or driving best practices. I'm here to help make your journey safer and more efficient!",
        "quick-questions": "Quick Questions:",
        "driving-time": "Driving Time Rules",
        "route-planning": "Route Planning",
        "walkaround-inspection": "Walkaround Inspection",
        "weight-limits": "Weight Limits",
        "rest-breaks": "Rest Breaks",
        "tacho-rules": "Tacho Rules",
        "ask-placeholder": "Ask me anything about HGV driving...",

        // Document Wallet
        "document-wallet-title": "Document Wallet",

        // Incident Report
        "incident-title": "Incident Report",
        "driver-vehicle-info": "Driver & Vehicle Information",
        "incident-date": "Incident Date:",
        "incident-time": "Incident Time:",
        "location-info": "Location Information",
        "incident-location": "Incident Location:",
        "weather-conditions": "Weather Conditions:",
        "select-weather": "Select weather...",
        "weather-clear": "Clear/Sunny",
        "weather-cloudy": "Cloudy",
        "weather-rain": "Rain",
        "weather-snow": "Snow",
        "weather-fog": "Fog",
        "weather-ice": "Ice",
        "road-conditions": "Road Conditions:",
        "select-road": "Select road condition...",
        "road-dry": "Dry",
        "road-wet": "Wet",
        "road-icy": "Icy",
        "road-construction": "Construction Zone",
        "incident-details": "Incident Details",
        "incident-type": "Type of Incident:",
        "select-incident": "Select incident type...",
        "incident-collision": "Collision/Accident",
        "incident-breakdown": "Vehicle Breakdown",
        "incident-cargo": "Cargo Damage/Loss",
        "incident-injury": "Personal Injury",
        "incident-property": "Property Damage",
        "incident-near-miss": "Near Miss",
        "incident-other": "Other",
        "incident-severity": "Severity Level:",
        "select-severity": "Select severity...",
        "severity-low": "Low",
        "severity-medium": "Medium",
        "severity-high": "High",
        "severity-critical": "Critical",
        "incident-description": "Detailed Description:",
        "third-parties": "Third Parties Involved",
        "other-parties": "Other Parties Involved:",
        "witnesses": "Witnesses:",
        "emergency-services": "Emergency Services",
        "police-attended": "Police Attended:",
        "police-ref": "Police Reference Number:",
        "ambulance-attended": "Ambulance Called:",
        "fire-service-attended": "Fire Service Called:",
        "photos-evidence": "Photos & Evidence",
        "actions-taken": "Actions Taken",
        "immediate-actions": "Immediate Actions Taken:",
        "follow-up-required": "Follow-up Required:",
        "driver-declaration": "Driver Declaration",
        "declaration-text": "I declare that the information provided above is true and accurate to the best of my knowledge.",
        "generate-report": "Generate Report",
        "save-report": "Save Report",
        "clear-form": "Clear Form"
    },
    pl: {
        // Navigation
        "nav-converters": "Konwertery",
        "nav-checklist": "Lista kontrolna",
        "nav-epod": "E-POD",
        "nav-delivery": "Protokół dostawy",
        "nav-gps": "Śledzenie GPS",
        "nav-document-wallet": "Portfel dokumentów",
        "nav-moretools": "Więcej narzędzi",
        "nav-home": "Główna",
        "nav-profile": "Profil",
        "nav-archive": "Archiwum",
        "nav-language": "Język",

        // Common
        "back-btn": "← Wstecz",
        "yes": "Tak",
        "no": "Nie",
        "save-btn": "Zapisz",
        "clear-signature": "Wyczyść podpis",
        "driver-signature": "Podpis kierowcy",
        "generate-pdf": "Generuj raport PDF",
        "save-checklist": "Zapisz listę kontrolną",

        // Checklist
        "checklist-title": "Lista kontrolna kierowcy HGV",
        "vehicle-reg": "Nr rejestracyjny pojazdu:",
        "odo": "Przebieg:",
        "trailer-no": "Nr przyczepy:",
        "driver-name": "Imię kierowcy:",
        "date": "Data:",
        "time": "Czas:",
        "daily-check": "Kontrola dzienna",
        "checklist-item": "Element listy kontrolnej",
        "status": "Status",
        "defects": "Usterki",
        "report-defects": "Zgłoś usterki tutaj:",
        "upload-defect": "Prześlij zdjęcie usterki:",

        // E-POD
        "epod-title": "Elektroniczny dowód dostawy",
        "upload": "Prześlij",
        "sign": "Podpisz",
        "details": "Szczegóły",
        "upload-pdf": "Prześlij protokół dostawy (PDF)",
        "select-pdf": "Wybierz plik PDF:",
        "load-pdf": "Załaduj PDF",

        // More tools
        "tools-title": "Więcej narzędzi",
        
        // Weather Details
        "weather-title": "Szczegóły pogody",
        "hours-calculator": "Kalkulator godzin kierowcy",
        "start-time": "Czas rozpoczęcia:",
        "end-time": "Czas zakończenia:"
    }
};

// Section management functions
function showSection(sectionId) {
    console.log('Showing section:', sectionId);

    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => {
        section.classList.remove('active');
    });

    // Update bottom navigation active state
    updateBottomNavActive(sectionId);

    // Show header container for home section
    const headerContainer = document.querySelector('.header-container');
    if (sectionId === 'home') {
        if (headerContainer) headerContainer.style.display = 'flex';
        document.body.classList.remove('tool-active');
        return;
    }

    // Update weather details when opening weather section
    if (sectionId === 'weather-details') {
        updateWeatherDetailsPage();
    }

    // Hide header container for tool sections
    if (headerContainer) headerContainer.style.display = 'none';
    document.body.classList.add('tool-active');

    // Scroll to top when opening any tool or subpage
    window.scrollTo(0, 0);

    // Show the requested section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.classList.add('active');

        // Auto-populate date/time fields when switching to tools that need them
        const toolsWithDateTime = ['checklist', 'delivery', 'incident-report', 'epod'];
        if (toolsWithDateTime.includes(sectionId)) {
            // Small delay to ensure DOM is ready
            setTimeout(() => {
                autoPopulateDateTimeFields();
            }, 100);
        }
    }
}

// Bottom navigation functions
function updateBottomNavActive(sectionId) {
    // Remove active class from all bottom nav items
    const bottomNavItems = document.querySelectorAll('.bottom-nav-item');
    bottomNavItems.forEach(item => {
        item.classList.remove('active');
    });

    // Add active class to current section
    // For home section, we want to highlight the home button
    const targetSectionId = sectionId === 'home' ? 'home' : sectionId;
    const activeNavItem = document.getElementById(`bottom-nav-${targetSectionId}`);
    if (activeNavItem) {
        activeNavItem.classList.add('active');
    }
}

function toggleLanguageMenuBottom() {
    const menu = document.getElementById('languageMenuBottom');
    if (menu) {
        menu.classList.toggle('show');
    }
    
    // Close the main language menu if it's open
    const mainMenu = document.getElementById('languageMenu');
    if (mainMenu) {
        mainMenu.classList.remove('show');
    }
}

// Language functions
function toggleLanguageMenu() {
    const menu = document.getElementById('languageMenu');
    if (menu) {
        menu.classList.toggle('show');
    }
}

function changeLanguage(lang) {
    currentLanguage = lang;

    // Update language menu
    const languageOptions = document.querySelectorAll('.language-option');
    languageOptions.forEach(option => {
        option.classList.remove('active');
        // Check if this option is for the selected language
        if (option.getAttribute('onclick') && option.getAttribute('onclick').includes(`'${lang}'`)) {
            option.classList.add('active');
        }
    });

    // Get language data
    const langData = translations[lang] || translations['en'];

    // Section title mappings
    const sectionTitles = {
        'checklist': 'checklist-title',
        'epod': 'epod-title',
        'delivery': 'delivery-title',
        'gps-tracking': 'gps-title',
        'document-wallet': 'document-wallet-title',
        'moretools': 'tools-title',
        'ai-assistant': 'ai-title',
        'incident-report': 'incident-title'
    };

    // Update elements with data-translate attribute
    document.querySelectorAll('[data-translate]').forEach(element => {
        const key = element.getAttribute('data-translate');
        if (langData && langData[key] && element) {
            try {
                if (element.tagName === 'INPUT' && (element.type === 'submit' || element.type === 'button')) {
                    element.value = langData[key];
                } else if (element.tagName === 'INPUT' && element.hasAttribute('placeholder')) {
                    element.placeholder = langData[key];
                } else if (element.textContent !== undefined) {
                    element.textContent = langData[key];
                }
            } catch (error) {
                console.error('Translation error for key:', key, error);
            }
        }
    });

    // Update section titles
    Object.entries(sectionTitles).forEach(([sectionId, key]) => {
        const section = document.getElementById(sectionId);
        if (section && langData && langData[key]) {
            const h2 = section.querySelector('h2');
            if (h2 && !h2.hasAttribute('data-translate')) {
                h2.textContent = langData[key];
            }
        }
    });

    // Close language menus
    const menu = document.getElementById('languageMenu');
    if (menu) {
        menu.classList.remove('show');
    }
    const bottomMenu = document.getElementById('languageMenuBottom');
    if (bottomMenu) {
        bottomMenu.classList.remove('show');
    }
}

// Initialize functions
function initializeSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                       e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

function clearSignature() {
    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function initializeDeliveryForm() {
    // Date and time are now auto-populated by autoPopulateDateTimeFields()

    // Initialize delivery signature canvas
    const deliveryCanvas = document.getElementById('deliverySignatureCanvas');
    if (deliveryCanvas) {
        const ctx = deliveryCanvas.getContext('2d');
        let isDrawing = false;

        deliveryCanvas.addEventListener('mousedown', (e) => {
            isDrawing = true;
            const rect = deliveryCanvas.getBoundingClientRect();
            ctx.beginPath();
            ctx.moveTo(e.clientX - rect.left, e.clientY - rect.top);
        });

        deliveryCanvas.addEventListener('mousemove', (e) => {
            if (!isDrawing) return;
            const rect = deliveryCanvas.getBoundingClientRect();
            ctx.lineTo(e.clientX - rect.left, e.clientY - rect.top);
            ctx.stroke();
        });

        deliveryCanvas.addEventListener('mouseup', () => {
            isDrawing = false;
        });
    }

    // Handle delivery status radio buttons
    const statusRadios = document.querySelectorAll('input[name="deliveryStatus"]');
    statusRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            const refusalGroup = document.getElementById('refusal-reason-group');
            if (refusalGroup) {
                refusalGroup.style.display = this.value === 'refused' ? 'block' : 'none';
            }
        });
    });

    // Handle photo upload preview
    const photoInput = document.getElementById('delivery-photo');
    if (photoInput) {
        photoInput.addEventListener('change', function(e) {
            const file = e.target.files[0];
            if (file) {
                const reader = new FileReader();
                reader.onload = function(e) {
                    const preview = document.getElementById('photo-preview');
                    const img = document.getElementById('preview-image');
                    if (preview && img) {
                        img.src = e.target.result;
                        preview.style.display = 'block';
                    }
                };
                reader.readAsDataURL(file);
            }
        });
    }
}

function clearDeliverySignature() {
    const canvas = document.getElementById('deliverySignatureCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function initializeGPSTracking() {
    console.log('GPS tracking initialized');
    // GPS tracking initialization code here
}

function initializeGeofencing() {
    console.log('Geofencing initialized');
    
    // Load saved geofences and events
    updateGeofencesList();
    updateGeofenceEventLog();
    updateGeofencingStatus();
    
    // Add event listener for geofencing checkbox
    const geofencingEnabled = document.getElementById('geofencingEnabled');
    if (geofencingEnabled) {
        geofencingEnabled.addEventListener('change', function() {
            updateGeofencingStatus();
        });
    }
}

function initializeDocumentWallet() {
    // Document wallet initialization
    updateDocumentStats();
}

function initializeEPOD() {
    // Initialize E-POD signature canvas
    const epodCanvas = document.getElementById('epod-signature-pad');
    if (epodCanvas) {
        const ctx = epodCanvas.getContext('2d');
        let isDrawing = false;

        // Mouse events
        epodCanvas.addEventListener('mousedown', startDrawing);
        epodCanvas.addEventListener('mousemove', draw);
        epodCanvas.addEventListener('mouseup', stopDrawing);
        epodCanvas.addEventListener('mouseout', stopDrawing);

        // Touch events
        epodCanvas.addEventListener('touchstart', handleTouch);
        epodCanvas.addEventListener('touchmove', handleTouch);
        epodCanvas.addEventListener('touchend', stopDrawing);

        function startDrawing(e) {
            isDrawing = true;
            const rect = epodCanvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.beginPath();
            ctx.moveTo(x, y);
        }

        function draw(e) {
            if (!isDrawing) return;
            const rect = epodCanvas.getBoundingClientRect();
            const x = (e.clientX || e.touches[0].clientX) - rect.left;
            const y = (e.clientY || e.touches[0].clientY) - rect.top;
            ctx.lineTo(x, y);
            ctx.stroke();
        }

        function stopDrawing() {
            isDrawing = false;
        }

        function handleTouch(e) {
            e.preventDefault();
            const touch = e.touches[0];
            const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                           e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
                clientX: touch.clientX,
                clientY: touch.clientY
            });
            epodCanvas.dispatchEvent(mouseEvent);
        }
    }
}

function initializeConverters() {
    // Converter initialization
}

function initializeAIAssistant() {
    // AI Assistant initialization
}

function initializeIncidentReport() {
    // Incident report initialization
}

function initializeSectionImageUploads() {
    // Initialize image upload handlers for all 10 sections
    for (let i = 1; i <= 10; i++) {
        const input = document.getElementById(`section${i}Images`);
        if (input) {
            input.addEventListener('change', function(e) {
                handleSectionImageUpload(e, i);
            });
        }
    }
}

function handleSectionImageUpload(event, sectionNumber) {
    const files = event.target.files;
    const previewContainer = document.getElementById(`section${sectionNumber}Preview`);
    
    if (!previewContainer) return;

    // Clear existing previews
    previewContainer.innerHTML = '';

    // Process each selected file
    Array.from(files).forEach((file, index) => {
        if (file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function(e) {
                const previewItem = document.createElement('div');
                previewItem.className = 'image-preview-item';
                previewItem.innerHTML = `
                    <img src="${e.target.result}" alt="Section ${sectionNumber} Image ${index + 1}" class="image-preview-thumbnail" data-section="${sectionNumber}" data-index="${index}">
                    <button type="button" class="image-preview-remove" onclick="removeSectionImage(${sectionNumber}, ${index})" title="Remove image">×</button>
                `;
                previewContainer.appendChild(previewItem);
            };
            reader.readAsDataURL(file);
        }
    });
}

function removeSectionImage(sectionNumber, imageIndex) {
    const input = document.getElementById(`section${sectionNumber}Images`);
    const previewContainer = document.getElementById(`section${sectionNumber}Preview`);
    
    if (!input || !previewContainer) return;

    // Remove the preview item
    const previewItems = previewContainer.querySelectorAll('.image-preview-item');
    if (previewItems[imageIndex]) {
        previewItems[imageIndex].remove();
    }

    // Create new FileList without the removed file
    const dt = new DataTransfer();
    const files = Array.from(input.files);
    files.forEach((file, index) => {
        if (index !== imageIndex) {
            dt.items.add(file);
        }
    });
    input.files = dt.files;

    // Re-index remaining images
    updateImagePreviews(sectionNumber);
}

function updateImagePreviews(sectionNumber) {
    const previewContainer = document.getElementById(`section${sectionNumber}Preview`);
    if (!previewContainer) return;

    const previewItems = previewContainer.querySelectorAll('.image-preview-item');
    previewItems.forEach((item, newIndex) => {
        const img = item.querySelector('img');
        const removeBtn = item.querySelector('.image-preview-remove');
        if (img) img.setAttribute('data-index', newIndex);
        if (removeBtn) removeBtn.setAttribute('onclick', `removeSectionImage(${sectionNumber}, ${newIndex})`);
    });
}

// Camera functionality for section image uploads
let cameraStreams = {};

async function startCamera(sectionNumber) {
    try {
        const video = document.getElementById(`cameraVideo${sectionNumber}`);
        const preview = document.getElementById(`cameraPreview${sectionNumber}`);
        const startBtn = document.querySelector(`button[onclick="startCamera(${sectionNumber})"]`);
        const stopBtn = document.getElementById(`stopCamera${sectionNumber}`);

        if (!video || !preview) {
            console.error('Camera elements not found for section', sectionNumber);
            return;
        }

        // Request camera access with rear camera preference
        const constraints = {
            video: {
                facingMode: { ideal: 'environment' }, // Prefer rear camera
                width: { ideal: 1280 },
                height: { ideal: 720 }
            }
        };

        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        
        video.srcObject = stream;
        cameraStreams[sectionNumber] = stream;
        
        preview.style.display = 'block';
        startBtn.style.display = 'none';
        stopBtn.style.display = 'inline-block';

        console.log(`Camera started for section ${sectionNumber}`);
        
    } catch (error) {
        console.error('Error accessing camera:', error);
        
        let errorMessage = 'Unable to access camera. ';
        if (error.name === 'NotAllowedError') {
            errorMessage += 'Please allow camera access in your browser settings.';
        } else if (error.name === 'NotFoundError') {
            errorMessage += 'No camera found on this device.';
        } else if (error.name === 'NotSupportedError') {
            errorMessage += 'Camera is not supported in this browser.';
        } else {
            errorMessage += 'Please check your camera permissions and try again.';
        }
        
        alert(errorMessage);
    }
}

function stopCamera(sectionNumber) {
    const video = document.getElementById(`cameraVideo${sectionNumber}`);
    const preview = document.getElementById(`cameraPreview${sectionNumber}`);
    const startBtn = document.querySelector(`button[onclick="startCamera(${sectionNumber})"]`);
    const stopBtn = document.getElementById(`stopCamera${sectionNumber}`);

    if (cameraStreams[sectionNumber]) {
        // Stop all tracks in the stream
        cameraStreams[sectionNumber].getTracks().forEach(track => {
            track.stop();
        });
        delete cameraStreams[sectionNumber];
    }

    if (video) {
        video.srcObject = null;
    }

    if (preview) {
        preview.style.display = 'none';
    }

    if (startBtn) {
        startBtn.style.display = 'inline-block';
    }

    if (stopBtn) {
        stopBtn.style.display = 'none';
    }

    console.log(`Camera stopped for section ${sectionNumber}`);
}

function capturePhoto(sectionNumber) {
    const video = document.getElementById(`cameraVideo${sectionNumber}`);
    const previewContainer = document.getElementById(`section${sectionNumber}Preview`);
    
    if (!video || !video.srcObject) {
        alert('Camera not active. Please start the camera first.');
        return;
    }

    try {
        // Create canvas to capture the image
        const canvas = document.createElement('canvas');
        const context = canvas.getContext('2d');
        
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw the video frame to canvas
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Convert canvas to blob
        canvas.toBlob((blob) => {
            if (blob) {
                // Create a file from the blob
                const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
                const filename = `camera_section${sectionNumber}_${timestamp}.jpg`;
                const file = new File([blob], filename, { type: 'image/jpeg' });
                
                // Add to file input and preview
                addCapturedImageToSection(sectionNumber, file, canvas.toDataURL('image/jpeg', 0.8));
                
                console.log(`Photo captured for section ${sectionNumber}`);
            }
        }, 'image/jpeg', 0.8);
        
    } catch (error) {
        console.error('Error capturing photo:', error);
        alert('Failed to capture photo. Please try again.');
    }
}

function addCapturedImageToSection(sectionNumber, file, dataURL) {
    const input = document.getElementById(`section${sectionNumber}Images`);
    const previewContainer = document.getElementById(`section${sectionNumber}Preview`);
    
    if (!input || !previewContainer) return;

    // Get current files and add the new one
    const dt = new DataTransfer();
    
    // Add existing files
    Array.from(input.files).forEach(existingFile => {
        dt.items.add(existingFile);
    });
    
    // Add new captured file
    dt.items.add(file);
    input.files = dt.files;

    // Create preview for the captured image
    const currentIndex = dt.files.length - 1;
    const previewItem = document.createElement('div');
    previewItem.className = 'image-preview-item';
    previewItem.innerHTML = `
        <img src="${dataURL}" alt="Section ${sectionNumber} Captured Image ${currentIndex + 1}" class="image-preview-thumbnail" data-section="${sectionNumber}" data-index="${currentIndex}">
        <button type="button" class="image-preview-remove" onclick="removeSectionImage(${sectionNumber}, ${currentIndex})" title="Remove image">×</button>
    `;
    previewContainer.appendChild(previewItem);

    // Stop camera after capture (optional - you can remove this if you want to keep camera running)
    // stopCamera(sectionNumber);
}

// Clean up camera streams when page is unloaded
window.addEventListener('beforeunload', () => {
    Object.keys(cameraStreams).forEach(sectionNumber => {
        stopCamera(parseInt(sectionNumber));
    });
});

function initializeWeather() {
    // Initialize weather widget with sample data
    updateWeatherWidget();
    
    // Update weather every 30 minutes
    setInterval(updateWeatherWidget, 30 * 60 * 1000);
}

function updateWeatherDetailsPage() {
    const savedWeather = localStorage.getItem('currentWeather');
    if (savedWeather) {
        const weatherData = JSON.parse(savedWeather);
        
        // Update current weather card
        const currentTemp = document.querySelector('.current-temp');
        const currentDesc = document.querySelector('.current-desc');
        const currentIcon = document.querySelector('.current-weather-icon');
        const currentLocation = document.querySelector('#currentLocation');
        
        if (currentTemp) currentTemp.textContent = `${weatherData.temperature}°C`;
        if (currentDesc) currentDesc.textContent = weatherData.condition;
        if (currentIcon) currentIcon.textContent = weatherData.icon;
        if (currentLocation) currentLocation.textContent = weatherData.location;
        
        // Update detail values with more realistic data
        updateWeatherDetails(weatherData);
    }
}

function updateWeatherDetails(weatherData) {
    // Generate additional weather details based on main condition
    const details = generateWeatherDetails(weatherData);
    
    const detailElements = {
        'feels-like': `${weatherData.temperature + Math.round(Math.random() * 4 - 2)}°C`,
        'wind-speed': `${details.windSpeed} kph`,
        'wind-direction': details.windDirection,
        'wind-gusts': `${details.windSpeed + Math.round(Math.random() * 10 + 5)} kph`,
        'precipitation': `${details.precipitation} mm/h`,
        'rain-probability': `${details.rainChance}%`,
        'humidity': `${details.humidity}%`,
        'pressure': `${details.pressure} hPa`,
        'visibility': `${details.visibility} km`,
        'uv-index': `${details.uvIndex} (${details.uvDescription})`
    };
    
    Object.entries(detailElements).forEach(([key, value]) => {
        const elements = document.querySelectorAll(`.detail-value`);
        elements.forEach(element => {
            const label = element.previousElementSibling;
            if (label && label.textContent.toLowerCase().includes(key.replace('-', ' '))) {
                element.textContent = value;
            }
        });
    });
}

function generateWeatherDetails(weatherData) {
    const condition = weatherData.condition.toLowerCase();
    
    let details = {
        windSpeed: Math.round(Math.random() * 20 + 5),
        windDirection: ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'][Math.floor(Math.random() * 8)],
        precipitation: 0,
        rainChance: 10,
        humidity: Math.round(Math.random() * 30 + 50),
        pressure: Math.round(Math.random() * 50 + 1000),
        visibility: Math.round(Math.random() * 5 + 8),
        uvIndex: Math.round(Math.random() * 8 + 1),
        uvDescription: 'Moderate'
    };
    
    // Adjust details based on weather condition
    if (condition.includes('rain')) {
        details.precipitation = Math.random() * 5 + 0.5;
        details.rainChance = Math.round(Math.random() * 40 + 60);
        details.humidity = Math.round(Math.random() * 20 + 70);
        details.visibility = Math.round(Math.random() * 3 + 5);
        details.uvIndex = Math.round(Math.random() * 3 + 1);
        details.uvDescription = 'Low';
    } else if (condition.includes('sunny')) {
        details.precipitation = 0;
        details.rainChance = Math.round(Math.random() * 15);
        details.humidity = Math.round(Math.random() * 25 + 40);
        details.visibility = 10;
        details.uvIndex = Math.round(Math.random() * 3 + 6);
        details.uvDescription = details.uvIndex > 7 ? 'High' : 'Moderate';
    } else if (condition.includes('cloudy')) {
        details.precipitation = Math.random() * 0.5;
        details.rainChance = Math.round(Math.random() * 30 + 20);
        details.humidity = Math.round(Math.random() * 25 + 60);
        details.visibility = Math.round(Math.random() * 2 + 7);
        details.uvIndex = Math.round(Math.random() * 4 + 3);
        details.uvDescription = 'Moderate';
    }
    
    // Add degree symbol to wind direction
    const directions = { N: 0, NE: 45, E: 90, SE: 135, S: 180, SW: 225, W: 270, NW: 315 };
    details.windDirection = `${details.windDirection} (${directions[details.windDirection]}°)`;
    
    return details;
}

function updateWeatherWidget() {
    // Try to get user's location for weather data
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            function(position) {
                fetchWeatherData(position.coords.latitude, position.coords.longitude);
            },
            function(error) {
                console.log('Location access denied, using default weather data');
                useDefaultWeatherData();
            },
            { timeout: 5000, maximumAge: 300000 } // 5 minute cache
        );
    } else {
        useDefaultWeatherData();
    }
}

function fetchWeatherData(lat, lon) {
    // For demo purposes, generate realistic weather data based on location
    // In production, you would call a real weather API like OpenWeatherMap
    const weatherConditions = [
        { condition: 'Sunny', temp: Math.round(Math.random() * 10 + 15), icon: '☀️' },
        { condition: 'Partly Cloudy', temp: Math.round(Math.random() * 8 + 12), icon: '⛅' },
        { condition: 'Cloudy', temp: Math.round(Math.random() * 6 + 10), icon: '☁️' },
        { condition: 'Light Rain', temp: Math.round(Math.random() * 5 + 8), icon: '🌧️' },
        { condition: 'Heavy Rain', temp: Math.round(Math.random() * 4 + 6), icon: '⛈️' }
    ];

    const randomWeather = weatherConditions[Math.floor(Math.random() * weatherConditions.length)];
    
    // Get approximate location name from coordinates (simplified)
    const locationName = getLocationName(lat, lon);
    
    updateWeatherDisplay(randomWeather.temp, randomWeather.condition, locationName, randomWeather.icon);
}

function useDefaultWeatherData() {
    const defaultWeather = {
        temperature: Math.round(Math.random() * 15 + 5), // 5-20°C
        condition: ['Sunny', 'Partly Cloudy', 'Cloudy', 'Light Rain'][Math.floor(Math.random() * 4)],
        location: ['LONDON', 'MANCHESTER', 'BIRMINGHAM', 'LEEDS', 'GLASGOW'][Math.floor(Math.random() * 5)]
    };

    const iconMap = {
        'Sunny': '☀️',
        'Partly Cloudy': '⛅',
        'Cloudy': '☁️',
        'Light Rain': '🌧️'
    };

    updateWeatherDisplay(
        defaultWeather.temperature, 
        defaultWeather.condition, 
        defaultWeather.location, 
        iconMap[defaultWeather.condition]
    );
}

function updateWeatherDisplay(temperature, condition, location, icon) {
    const weatherIcon = document.querySelector('.weather-icon-mini');
    const weatherTemp = document.querySelector('.weather-temp-mini');
    const weatherLocation = document.querySelector('.weather-location-mini');

    if (weatherIcon) weatherIcon.textContent = icon;
    if (weatherTemp) weatherTemp.textContent = `${temperature}°`;
    if (weatherLocation) weatherLocation.textContent = location.toUpperCase();

    // Store weather data for detailed view
    const weatherData = {
        temperature,
        condition,
        location,
        icon,
        timestamp: new Date().toISOString()
    };
    localStorage.setItem('currentWeather', JSON.stringify(weatherData));
}

function getLocationName(lat, lon) {
    // Simplified location detection based on coordinates
    // In production, use reverse geocoding API
    const locations = [
        { name: 'London', lat: 51.5074, lon: -0.1278 },
        { name: 'Manchester', lat: 53.4808, lon: -2.2426 },
        { name: 'Birmingham', lat: 52.4862, lon: -1.8904 },
        { name: 'Leeds', lat: 53.8008, lon: -1.5491 },
        { name: 'Glasgow', lat: 55.8642, lon: -4.2518 },
        { name: 'Edinburgh', lat: 55.9533, lon: -3.1883 },
        { name: 'Liverpool', lat: 53.4084, lon: -2.9916 },
        { name: 'Bristol', lat: 51.4545, lon: -2.5879 }
    ];

    let closest = locations[0];
    let minDistance = calculateDistance(lat, lon, closest.lat, closest.lon);

    locations.forEach(location => {
        const distance = calculateDistance(lat, lon, location.lat, location.lon);
        if (distance < minDistance) {
            minDistance = distance;
            closest = location;
        }
    });

    return closest.name;
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in kilometers
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

// Profile functions
function loadProfile() {
    // Load saved profile data from localStorage
    const savedData = localStorage.getItem('driverProfile');
    if (savedData) {
        const profileData = JSON.parse(savedData);

        // Populate form fields
        Object.keys(profileData).forEach(key => {
            const input = document.getElementById(key);
            if (input) {
                input.value = profileData[key];
            }
        });

        // Auto-fill delivery form fields
        const driverNameField = document.getElementById('delivery-driver-name');
        const vehicleRegField = document.getElementById('delivery-vehicle-reg');

        if (driverNameField && profileData.driverName) {
            driverNameField.value = profileData.driverName;
        }
        if (vehicleRegField && profileData.vehicleReg) {
            vehicleRegField.value = profileData.vehicleReg;
        }
    }
}

function saveProfile() {
    const form = document.getElementById('profileForm');
    if (!form) return;

    const formData = new FormData(form);
    const profileData = {};

    for (let [key, value] of formData.entries()) {
        profileData[key] = value;
    }

    localStorage.setItem('driverProfile', JSON.stringify(profileData));
    alert('Profile saved successfully!');

    // Update auto-fill fields
    loadProfile();
}

// Archive functions
function loadArchiveData() {
    // Load archive data from localStorage
}

// Document wallet functions
function updateDocumentStats() {
    // Document statistics removed as unnecessary
}

function showRecentDocuments() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection) {
        searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
    }
    // Set filter to recent documents
    const dateFilter = document.getElementById('dateFilter');
    if (dateFilter) {
        dateFilter.value = 'week';
        filterDocuments();
    }
}

function showExpiringDocs() {
    alert('Expiring documents feature - would show documents expiring within 30 days');
}

function toggleSearchSection() {
    const searchSection = document.getElementById('searchSection');
    if (searchSection) {
        searchSection.style.display = searchSection.style.display === 'none' ? 'block' : 'none';
    }
}

function handleFileUpload(event) {
    const files = event.target.files;
    console.log('Files uploaded:', files.length);
    // Handle file upload logic here
}

function filterDocuments() {
    const searchTerm = document.getElementById('documentSearch').value.toLowerCase();
    const documents = document.querySelectorAll('.document-item');

    documents.forEach(doc => {
        const name = doc.querySelector('.doc-name').textContent.toLowerCase();
        const preview = doc.querySelector('.doc-text-preview').textContent.toLowerCase();

        if (name.includes(searchTerm) || preview.includes(searchTerm)) {
            doc.style.display = 'flex';
        } else {
            doc.style.display = 'none';
        }
    });
}

function openFolder(folderId) {
    console.log('Opening folder:', folderId);
}

function openDocumentModal(docName) {
    console.log('Opening document:', docName);
}

function previewDocument(docName) {
    console.log('Previewing document:', docName);
}

function editDocument(docName) {
    console.log('Editing document:', docName);
}

function deleteDocument(docName) {
    if (confirm('Are you sure you want to delete this document?')) {
        console.log('Deleting document:', docName);
    }
}

// Tracking functions
function startTracking() {
    if (!navigator.geolocation) {
        alert('Geolocation is not supported by this browser.');
        return;
    }

    trackingActive = true;
    trackingId = 'track_' + Date.now();

    document.getElementById('trackingStatus').innerHTML = '<span data-translate="status">Status</span>: <span style="color: #27ae60;">Active</span>';
    document.getElementById('startTrackingBtn').style.display = 'none';
    document.getElementById('setSharingTimeBtn').style.display = 'inline-block';
    document.getElementById('stopTrackingBtn').style.display = 'inline-block';
    document.getElementById('shareTrackingBtn').style.display = 'inline-block';

    // Update location info with better error handling
    navigator.geolocation.getCurrentPosition(
        function(position) {
            currentPosition = position; // Store for geofencing
            
            const locationInfo = document.getElementById('locationInfo');
            if (locationInfo) {
                locationInfo.innerHTML = `
                    <p><strong>Latitude:</strong> ${position.coords.latitude.toFixed(6)}</p>
                    <p><strong>Longitude:</strong> ${position.coords.longitude.toFixed(6)}</p>
                    <p><strong>Accuracy:</strong> ±${position.coords.accuracy.toFixed(0)}m</p>
                `;
            }

            // Store location data for tracking
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString(),
                position: position
            };
            localStorage.setItem(`tracking_${trackingId}`, JSON.stringify(locationData));
            
            // Update geofencing status and start monitoring if enabled
            updateGeofencingStatus();
        },
        function(error) {
            console.error('GPS error:', error);
            let errorMessage = 'Unable to get GPS location. ';
            
            switch(error.code) {
                case error.PERMISSION_DENIED:
                    errorMessage += 'Location access denied by user.';
                    break;
                case error.POSITION_UNAVAILABLE:
                    errorMessage += 'Location information unavailable.';
                    break;
                case error.TIMEOUT:
                    errorMessage += 'Location request timed out.';
                    break;
                default:
                    errorMessage += 'Unknown GPS error occurred.';
                    break;
            }
            
            alert(errorMessage + ' Please check your location settings and try again.');
            
            const locationInfo = document.getElementById('locationInfo');
            if (locationInfo) {
                locationInfo.innerHTML = `<p style="color: #e74c3c;">${errorMessage}</p>`;
            }
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 60000
        }
    );
}

function stopTracking() {
    trackingActive = false;
    trackingId = null;
    currentPosition = null;

    // Stop geofence monitoring
    stopGeofenceMonitoring();

    // Clear countdown interval
    if (window.trackingCountdownInterval) {
        clearInterval(window.trackingCountdownInterval);
        window.trackingCountdownInterval = null;
    }

    // Clear stored end time
    localStorage.removeItem('trackingEndTime');

    // Update UI
    document.getElementById('trackingStatus').innerHTML = '<span data-translate="status">Status</span>: <span data-translate="not-tracking">Not tracking</span>';
    document.getElementById('startTrackingBtn').style.display = 'inline-block';
    document.getElementById('setSharingTimeBtn').style.display = 'none';
    document.getElementById('stopTrackingBtn').style.display = 'none';
    document.getElementById('shareTrackingBtn').style.display = 'none';

    // Hide countdown display and sharing time display
    const countdownDisplay = document.getElementById('countdownDisplay');
    const sharingTimeDisplay = document.getElementById('sharingTimeDisplay');
    if (countdownDisplay) countdownDisplay.style.display = 'none';
    if (sharingTimeDisplay) sharingTimeDisplay.style.display = 'none';

    // Clear sharing countdown
    const sharingCountdown = document.getElementById('sharingCountdown');
    if (sharingCountdown) sharingCountdown.remove();

    const locationInfo = document.getElementById('locationInfo');
    if (locationInfo) {
        locationInfo.innerHTML = '<p data-translate="click-start">Click "Start Tracking" to get your location</p>';
    }

    // Update geofencing status
    updateGeofencingStatus();
}

function setSharingTime() {
    const section = document.getElementById('timeLimitSection');
    if (section) {
        section.style.display = section.style.display === 'none' ? 'block' : 'none';
    }
}

function applySharingTime() {
    const dropdown = document.getElementById('timeLimitDropdown');
    const hours = parseInt(dropdown.value);
    console.log('Setting sharing time for', hours, 'hours');

    if (!trackingActive) {
        alert('Please start tracking first before setting a time limit.');
        return;
    }

    // Calculate end time
    const endTime = new Date();
    endTime.setHours(endTime.getHours() + hours);
    
    // Store the end time
    localStorage.setItem('trackingEndTime', endTime.toISOString());
    
    // Update display
    const sharingTimeDisplay = document.getElementById('sharingTimeDisplay');
    const sharingTimeText = document.getElementById('sharingTimeText');
    
    if (sharingTimeDisplay && sharingTimeText) {
        sharingTimeDisplay.style.display = 'block';
        sharingTimeText.innerHTML = `${endTime.toLocaleTimeString()}<br><div id="sharingCountdown" style="color: #3498db; font-weight: bold; margin-top: 0.5rem;">Time remaining: <span id="sharingCountdownText">--:--:--</span></div>`;
    }

    // Start countdown
    startSharingCountdown(endTime);

    const section = document.getElementById('timeLimitSection');
    if (section) {
        section.style.display = 'none';
    }

    alert(`Tracking will automatically stop at ${endTime.toLocaleTimeString()}`);
}

function startSharingCountdown(endTime) {
    const sharingCountdownText = document.getElementById('sharingCountdownText');
    
    if (!sharingCountdownText) return;
    
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            stopTracking();
            alert('Tracking time limit reached. Location sharing has been stopped.');
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        sharingCountdownText.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Store interval ID for cleanup
    window.trackingCountdownInterval = countdownInterval;
}

function startCountdown(endTime) {
    const countdownDisplay = document.getElementById('countdownDisplay');
    const countdownText = document.getElementById('countdownText');
    
    if (!countdownDisplay || !countdownText) return;
    
    countdownDisplay.style.display = 'block';
    
    const countdownInterval = setInterval(() => {
        const now = new Date();
        const timeLeft = endTime - now;
        
        if (timeLeft <= 0) {
            clearInterval(countdownInterval);
            countdownDisplay.style.display = 'none';
            stopTracking();
            alert('Tracking time limit reached. Location sharing has been stopped.');
            return;
        }
        
        const hours = Math.floor(timeLeft / (1000 * 60 * 60));
        const minutes = Math.floor((timeLeft % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeLeft % (1000 * 60)) / 1000);
        
        countdownText.textContent = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    }, 1000);
    
    // Store interval ID for cleanup
    window.trackingCountdownInterval = countdownInterval;
}

function cancelSharingTime() {
    const section = document.getElementById('timeLimitSection');
    if (section) {
        section.style.display = 'none';
    }
}

function shareTrackingLink() {
    if (trackingId) {
        const shareResult = document.getElementById('shareResult');
        const trackingUrl = `${window.location.origin}/track.html?id=${trackingId}`;

        if (shareResult) {
            shareResult.innerHTML = `
                <p><strong>Tracking Link:</strong></p>
                <p><a href="${trackingUrl}" target="_blank">${trackingUrl}</a></p>
                <button onclick="copyTrackingLink('${trackingUrl}')">Copy Link</button>
            `;
            shareResult.style.display = 'block';
        }
    }
}

function copyTrackingLink(url) {
    navigator.clipboard.writeText(url).then(() => {
        alert('Tracking link copied to clipboard!');
    }).catch(() => {
        alert('Failed to copy link. Please copy manually.');
    });
}

// More Tools functions
function calculateHours() {
    const startTime = document.getElementById('startTime').value;
    const endTime = document.getElementById('endTime').value;
    const breakTime = parseInt(document.getElementById('breakTime').value) || 0;

    if (!startTime || !endTime) {
        alert('Please enter both start and end times.');
        return;
    }

    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);

    let diffMs = end - start;
    if (diffMs < 0) diffMs += 24 * 60 * 60 * 1000; // Add 24 hours if end is next day

    const totalMinutes = Math.floor(diffMs / (1000 * 60)) - breakTime;
    const hours = Math.floor(totalMinutes / 60);
    const minutes = totalMinutes % 60;

    const resultDiv = document.getElementById('hoursResult');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Working Hours Summary</h4>
            <p><strong>Total Working Time:</strong> ${hours}h ${minutes}m</p>
            <p><strong>Break Time:</strong> ${breakTime}m</p>
            <p><strong>EU Compliance:</strong> ${hours <= 9 ? '✓ Within limits' : '⚠ Exceeds 9-hour limit'}</p>
        `;
    }
}

function logFuel() {
    const amount = parseFloat(document.getElementById('fuelAmount').value);
    const cost = parseFloat(document.getElementById('fuelCost').value);
    const mileage = parseInt(document.getElementById('mileage').value);

    if (!amount || !cost || !mileage) {
        alert('Please fill in all fields.');
        return;
    }

    const totalCost = (amount * cost).toFixed(2);
    const resultDiv = document.getElementById('fuelResult');

    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Fuel Entry Logged</h4>
            <p><strong>Amount:</strong> ${amount}L</p>
            <p><strong>Total Cost:</strong> £${totalCost}</p>
            <p><strong>Mileage:</strong> ${mileage}</p>
            <p><strong>Cost per mile:</strong> £${(totalCost / mileage).toFixed(3)}</p>
        `;
    }
}

function generateWeeklySummary() {
    const resultDiv = document.getElementById('weeklySummary');
    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Weekly Summary</h4>
            <p><strong>Total Working Hours:</strong> 45h 30m</p>
            <p><strong>Deliveries Completed:</strong> 28</p>
            <p><strong>Distance Covered:</strong> 1,250 miles</p>
            <p><strong>Fuel Consumed:</strong> 312L</p>
            <p><strong>Average MPG:</strong> 8.2</p>
        `;
    }
}

function checkWeather() {
    const location = document.getElementById('location').value;
    const resultDiv = document.getElementById('weatherResult');

    if (!location) {
        alert('Please enter a location.');
        return;
    }

    if (resultDiv) {
        resultDiv.innerHTML = `
            <h4>Weather for ${location}</h4>
            <p><strong>Current:</strong> 18°C, Partly Cloudy</p>
            <p><strong>Visibility:</strong> 10km</p>
            <p><strong>Wind Speed:</strong> 12 mph SW</p>
            <p><strong>Conditions:</strong> Good for driving</p>
        `;
    }
}

function editContacts() {
    alert('Contact editing functionality will be implemented.');
}

function saveLogEntry() {
    const entry = document.getElementById('logEntry').value;
    if (!entry) {
        alert('Please enter a log entry.');
        return;
    }

    const timestamp = new Date().toLocaleString();
    const logbook = document.getElementById('logbookEntries');

    if (logbook) {
        const entryDiv = document.createElement('div');
        entryDiv.innerHTML = `
            <div style="border-bottom: 1px solid #2A4A57; padding: 10px 0; margin-bottom: 10px;">
                <p><strong>${timestamp}</strong></p>
                <p>${entry}</p>
            </div>
        `;
        logbook.appendChild(entryDiv);

        // Clear the input
        document.getElementById('logEntry').value = '';
        alert('Log entry saved successfully!');
    }
}

function viewLogbook() {
    const logbook = document.getElementById('logbookEntries');
    if (logbook) {
        logbook.style.display = logbook.style.display === 'none' ? 'block' : 'none';
    }
}

// AI Assistant functions
function sendMessage() {
    const input = document.getElementById('chatInput');
    const message = input.value.trim();

    if (!message) return;

    addMessageToChat(message, 'user');
    input.value = '';

    // Simulate AI response
    setTimeout(() => {
        const response = generateAIResponse(message);
        addMessageToChat(response, 'ai');
    }, 1000);
}

function addMessageToChat(message, sender) {
    const chatMessages = document.getElementById('chatMessages');
    if (!chatMessages) return;

    const messageDiv = document.createElement('div');
    messageDiv.className = sender === 'user' ? 'user-message' : 'ai-message';
    messageDiv.textContent = message;

    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

function generateAIResponse(message) {
    const responses = {
        'driving time': 'According to EU regulations, you can drive for a maximum of 9 hours per day (extendable to 10 hours twice per week). You must take a 45-minute break after 4.5 hours of driving.',
        'route planning': 'For efficient route planning, consider traffic patterns, delivery time windows, fuel stops, and mandatory rest breaks. Use GPS systems with HGV-specific routing.',
        'walkaround': 'A proper walkaround inspection should include checking tyres, lights, brakes, mirrors, fluid levels, and load security. Document any defects found.',
        'weight limits': 'UK weight limits: Maximum gross vehicle weight is typically 44 tonnes for a standard 6-axle articulated vehicle. Always check your specific vehicle limits.',
        'rest breaks': 'You must take a 45-minute break after 4.5 hours of driving, or split it into 15 + 30 minutes. Daily rest period must be at least 11 hours.',
        'tachograph': 'Digital tachographs record driving time, rest periods, and other work. Ensure your driver card is inserted and functioning properly.'
    };

    const lowerMessage = message.toLowerCase();

    for (const [key, response] of Object.entries(responses)) {
        if (lowerMessage.includes(key)) {
            return response;
        }
    }

    return "I'm here to help with HGV-related questions. Ask me about driving regulations, safety procedures, route planning, or vehicle maintenance.";
}

function askQuickQuestion(question) {
    const input = document.getElementById('chatInput');
    if (input) {
        input.value = question;
        sendMessage();
    }
}

// Converter functions
function showConverterTab(tabName) {
    // Hide all tabs
    document.querySelectorAll('.converter-tab-content').forEach(tab => {
        tab.classList.remove('active');
    });

    // Remove active class from all buttons
    document.querySelectorAll('.tab-btn').forEach(btn => {
        btn.classList.remove('active');
    });

    // Show selected tab
    const selectedTab = document.getElementById(tabName + '-converter');
    if (selectedTab) {
        selectedTab.classList.add('active');
    }

    // Add active class to clicked button
    event.target.classList.add('active');
}

// Status button handling
document.addEventListener('click', function(e) {
    if (e.target.classList.contains('status-button')) {
        const buttons = e.target.parentElement.querySelectorAll('.status-button');
        buttons.forEach(btn => {
            btn.classList.remove('active-v', 'active-x');
        });

        const status = e.target.getAttribute('data-status');
        if (status === 'V') {
            e.target.classList.add('active-v');
        } else if (status === 'X') {
            e.target.classList.add('active-x');
        }
    }
});

// Form submission handling
document.addEventListener('submit', function(e) {
    if (e.target.id === 'walkaroundCheckForm') {
        e.preventDefault();
        generateWalkaroundPDF();
    }
});

// Generate Walkaround Checklist PDF
async function generateWalkaroundPDF() {
    if (typeof window.jsPDF === 'undefined') {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Header
    pdf.setFillColor(26, 55, 69);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.text('HGV DRIVER WALK-AROUND CHECKLIST', pageWidth / 2, 15, { align: 'center' });
    yPosition += 30;

    // Vehicle Information
    pdf.setFontSize(14);
    pdf.setTextColor(52, 152, 219);
    pdf.text('VEHICLE INFORMATION', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const vehicleInfo = [
        `Vehicle Registration: ${document.getElementById('vehicleReg')?.value || 'N/A'}`,
        `ODO: ${document.getElementById('odo')?.value || 'N/A'}`,
        `Trailer No: ${document.getElementById('trailerno')?.value || 'N/A'}`,
        `Driver Name: ${document.getElementById('driverName')?.value || 'N/A'}`,
        `Date: ${document.getElementById('checkDate')?.value || 'N/A'}`,
        `Time: ${document.getElementById('checkTime')?.value || 'N/A'}`
    ];

    vehicleInfo.forEach(info => {
        pdf.text(info, margin + 5, yPosition);
        yPosition += 6;
    });

    yPosition += 10;

    // Checklist Items
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(26, 55, 69);
    pdf.text('DAILY CHECK RESULTS', margin + 5, yPosition + 6);
    yPosition += 15;

    // Get all status buttons and compile results
    const checkResults = [];
    const sectionTitles = [
        '1. Document & Cabin Checks',
        '2. Engine Bay & Fluid Levels', 
        '3. Mirrors, Windows & Visibility',
        '4. Lights, Indicators & Reflectors',
        '5. Vehicle Body & Underside',
        '6. Wheels & Tyres',
        '7. Brakes System',
        '8. Steering',
        '9. Trailer Connections & Couplings',
        '10. Load & Safety'
    ];
    
    document.querySelectorAll('.checklist-section').forEach((section, sectionIndex) => {
        const sectionTitle = sectionTitles[sectionIndex] || `Section ${sectionIndex + 1}`;
        checkResults.push({ item: sectionTitle, status: 'SECTION', isSection: true });
        
        section.querySelectorAll('.checklist-table tbody tr').forEach((row) => {
            const itemText = row.querySelector('td:first-child')?.textContent || '';
            const statusContainer = row.querySelector('.status-buttons');
            let status = 'Not checked';
            
            if (statusContainer) {
                const activeButton = statusContainer.querySelector('.status-button.active-v, .status-button.active-x');
                if (activeButton) {
                    status = activeButton.classList.contains('active-v') ? '✓ OK' : '✗ DEFECT';
                }
            }
            
            checkResults.push({ item: itemText, status: status, sectionIndex: sectionIndex + 1 });
        });
    });

    pdf.setFontSize(9);
    pdf.setTextColor(0, 0, 0);

    checkResults.forEach(result => {
        // Check if we need a new page
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin + 10;
        }

        if (result.isSection) {
            // Section header
            pdf.setFontSize(11);
            pdf.setTextColor(26, 55, 69);
            pdf.text(result.item, margin + 5, yPosition);
            pdf.setFontSize(9);
            pdf.setTextColor(0, 0, 0);
            yPosition += 8;
        } else {
            const statusColor = result.status.includes('✓') ? [39, 174, 96] : 
                               result.status.includes('✗') ? [231, 76, 60] : [149, 165, 166];
            
            pdf.text('  • ' + result.item, margin + 5, yPosition);
            pdf.setTextColor(...statusColor);
            pdf.text(result.status, pageWidth - margin - 30, yPosition);
            pdf.setTextColor(0, 0, 0);
            yPosition += 6;
        }
    });

    // Add section images to PDF
    yPosition = await addSectionImagesToPDF(pdf, yPosition, pageWidth, pageHeight, margin);

    // Defects Section
    const defectsText = document.getElementById('defects')?.value;
    if (defectsText && defectsText.trim()) {
        yPosition += 10;
        
        if (yPosition > pageHeight - 30) {
            pdf.addPage();
            yPosition = margin + 10;
        }

        pdf.setFillColor(232, 239, 247);
        pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
        pdf.setFontSize(12);
        pdf.setTextColor(26, 55, 69);
        pdf.text('DEFECTS REPORTED', margin + 5, yPosition + 6);
        yPosition += 15;

        pdf.setFontSize(9);
        pdf.setTextColor(0, 0, 0);
        const defectLines = pdf.splitTextToSize(defectsText, pageWidth - 2 * margin - 10);
        defectLines.forEach(line => {
            if (yPosition > pageHeight - 15) {
                pdf.addPage();
                yPosition = margin + 10;
            }
            pdf.text(line, margin + 5, yPosition);
            yPosition += 5;
        });
    }

    // Signature
    const canvas = document.getElementById('signatureCanvas');
    if (canvas && yPosition < pageHeight - 40) {
        yPosition += 10;
        pdf.setFontSize(10);
        pdf.text('Driver Signature:', margin + 5, yPosition);
        
        const signatureData = canvas.toDataURL('image/png');
        if (signatureData && !signatureData.includes('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')) {
            pdf.addImage(signatureData, 'PNG', margin + 5, yPosition + 5, 60, 20);
        }
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
    pdf.text('HGV Driver Tools - Walkaround Checklist', pageWidth - margin - 60, pageHeight - 10);

    // Save PDF
    const fileName = `WalkAround_${document.getElementById('driverName')?.value || 'Checklist'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    alert('Walkaround checklist PDF generated successfully!');
}

async function addSectionImagesToPDF(pdf, startY, pageWidth, pageHeight, margin) {
    const sectionTitles = [
        'Document & Cabin Checks',
        'Engine Bay & Fluid Levels', 
        'Mirrors, Windows & Visibility',
        'Lights, Indicators & Reflectors',
        'Vehicle Body & Underside',
        'Wheels & Tyres',
        'Brakes System',
        'Steering',
        'Trailer Connections & Couplings',
        'Load & Safety'
    ];
    
    let yPosition = startY + 20;
    let hasImages = false;

    // Check if any section has images
    for (let i = 1; i <= 10; i++) {
        const input = document.getElementById(`section${i}Images`);
        if (input && input.files.length > 0) {
            hasImages = true;
            break;
        }
    }

    if (!hasImages) return yPosition;

    // Add Images section header
    if (yPosition > pageHeight - 30) {
        pdf.addPage();
        yPosition = margin + 10;
    }

    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(26, 55, 69);
    pdf.text('SECTION IMAGES', margin + 5, yPosition + 6);
    yPosition += 15;

    // Process each section's images
    for (let sectionNumber = 1; sectionNumber <= 10; sectionNumber++) {
        const input = document.getElementById(`section${sectionNumber}Images`);
        if (!input || input.files.length === 0) continue;

        // Section title
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin + 10;
        }

        pdf.setFontSize(11);
        pdf.setTextColor(26, 55, 69);
        pdf.text(`${sectionNumber}. ${sectionTitles[sectionNumber - 1]}`, margin + 5, yPosition);
        yPosition += 10;

        // Process images in this section
        const files = Array.from(input.files);
        let imagesInRow = 0;
        let rowStartY = yPosition;

        for (let fileIndex = 0; fileIndex < files.length; fileIndex++) {
            const file = files[fileIndex];
            if (!file.type.startsWith('image/')) continue;

            try {
                const imageData = await fileToDataURL(file);
                const imgWidth = 60;
                const imgHeight = 45;
                const imgSpacing = 5;

                // Calculate position
                const xPosition = margin + 5 + (imagesInRow * (imgWidth + imgSpacing));

                // Check if we need a new row or page
                if (imagesInRow >= 2 || xPosition + imgWidth > pageWidth - margin) {
                    yPosition = rowStartY + imgHeight + 10;
                    imagesInRow = 0;
                    rowStartY = yPosition;
                    
                    if (yPosition + imgHeight > pageHeight - margin) {
                        pdf.addPage();
                        yPosition = margin + 10;
                        rowStartY = yPosition;
                    }
                }

                const finalX = margin + 5 + (imagesInRow * (imgWidth + imgSpacing));
                
                // Add image to PDF
                pdf.addImage(imageData, 'JPEG', finalX, rowStartY, imgWidth, imgHeight);
                
                // Add image caption
                pdf.setFontSize(8);
                pdf.setTextColor(100, 100, 100);
                pdf.text(`Image ${fileIndex + 1}`, finalX, rowStartY + imgHeight + 5);
                pdf.setTextColor(0, 0, 0);

                imagesInRow++;
            } catch (error) {
                console.error('Error adding image to PDF:', error);
            }
        }

        yPosition = rowStartY + (imagesInRow > 0 ? 60 : 0);
    }

    return yPosition;
}

function fileToDataURL(file) {
    return new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result);
        reader.onerror = reject;
        reader.readAsDataURL(file);
    });
}

// Logout function
function logout() {
    // Clear all localStorage data
    localStorage.clear();

    // Clear session storage
    sessionStorage.clear();

    // Show logout message
    alert('You have been logged out successfully!');

    // Redirect to login page
    window.location.href = 'auth.html';
}

// Export data function
function exportData() {
    const profileData = localStorage.getItem('driverProfile');
    const emergencyContacts = localStorage.getItem('emergencyContacts');
    const isAuthenticated = localStorage.getItem('isAuthenticated');

    const exportData = {
        profile: profileData ? JSON.parse(profileData) : null,
        emergencyContacts: emergencyContacts ? JSON.parse(emergencyContacts) : null,
        isAuthenticated: isAuthenticated,
        exportDate: new Date().toISOString()
    };

    const dataStr = JSON.stringify(exportData, null, 2);
    const dataBlob = new Blob([dataStr], {type: 'application/json'});

    const link = document.createElement('a');
    link.href = URL.createObjectURL(dataBlob);
    link.download = `hgv_driver_data_${new Date().toISOString().split('T')[0]}.json`;
    link.click();

    alert('Data exported successfully!');
}

// Clear all data function
function clearAllData() {
    if (confirm('Are you sure you want to clear ALL data? This action cannot be undone.')) {
        // Clear localStorage
        localStorage.clear();

        // Clear sessionStorage
        sessionStorage.clear();

        // Clear form fields
        const forms = document.querySelectorAll('form');
        forms.forEach(form => {
            if (form.reset) {
                form.reset();
            }
        });

        // Clear signature canvases
        const canvases = document.querySelectorAll('canvas');
        canvases.forEach(canvas => {
            const ctx = canvas.getContext('2d');
            if (ctx) {
                ctx.clearRect(0, 0, canvas.width, canvas.height);
            }
        });

        // Reset document stats
        updateDocumentStats();

        alert('All data has been cleared successfully!');

        // Redirect to login page
        window.location.href = 'auth.html';
    }
}

// EPOD navigation functions
function navigateToEPODStep(stepNumber) {
    // Hide all step sections
    document.querySelectorAll('.epod-step-section').forEach(section => {
        section.style.display = 'none';
    });

    // Remove active class from all steps
    document.querySelectorAll('.epod-step').forEach(step => {
        step.classList.remove('epod-step-active');
        step.classList.add('epod-step-inactive');
    });

    // Show selected step
    const targetSection = document.getElementById(`epod-${getStepName(stepNumber)}-section`);
    if (targetSection) {
        targetSection.style.display = 'block';
    }

    // Activate current step
    const currentStep = document.getElementById(`epod-step${stepNumber}`);
    if (currentStep) {
        currentStep.classList.remove('epod-step-inactive');
        currentStep.classList.add('epod-step-active');
    }

    // Load document preview for step 4
    if (stepNumber === 4) {
        console.log('Navigating to step 4 - loading document preview');
        // Force reload of document preview with longer delay
        setTimeout(() => {
            // Ensure canvas exists and is visible
            const canvas = document.getElementById('epod-document-canvas');
            if (canvas) {
                canvas.style.display = 'block';
                canvas.style.visibility = 'visible';
                
                // Initialize placement indicators container if it doesn't exist
                let indicators = document.getElementById('placement-indicators');
                if (!indicators) {
                    indicators = document.createElement('div');
                    indicators.id = 'placement-indicators';
                    indicators.className = 'placement-indicators';
                    canvas.parentElement.appendChild(indicators);
                }
                
                // Ensure canvas container is visible
                const container = canvas.parentElement;
                if (container) {
                    container.style.display = 'flex';
                    container.style.alignItems = 'center';
                    container.style.justifyContent = 'center';
                }
            }
            
            loadDocumentPreview();
            // Also update the preview details
            updatePreviewDetails();
        }, 500);
    }
}

function getStepName(stepNumber) {
    const stepNames = {
        1: 'upload',
        2: 'sign',
        3: 'details',
        4: 'save'
    };
    return stepNames[stepNumber] || 'upload';
}

// EPOD functions
function loadEPODPDF() {
    const fileInput = document.getElementById('epod-pdf-upload');
    const cameraInput = document.getElementById('epod-camera-upload');
    
    // Check which input has a file
    let file = null;
    let inputUsed = null;
    
    if (fileInput.files.length > 0) {
        file = fileInput.files[0];
        inputUsed = 'upload';
        // Clear the camera input
        cameraInput.value = '';
    } else if (cameraInput.files.length > 0) {
        file = cameraInput.files[0];
        inputUsed = 'camera';
        // Clear the file input
        fileInput.value = '';
    }

    if (file) {
        const fileType = file.type;
        const fileSize = file.size;
        const maxSize = 10 * 1024 * 1024; // 10MB

        if (fileSize > maxSize) {
            alert('File size too large. Please select a file smaller than 10MB.');
            return;
        }

        if (fileType === 'application/pdf' || fileType.startsWith('image/')) {
            // Store the file globally for later use in preview
            window.loadedDocumentFile = file;
            loadedDocumentFile = file;

            const reader = new FileReader();
            reader.onload = function(e) {
                // Store the file data URL as well
                window.loadedDocumentDataURL = e.target.result;
                
                let preview = document.getElementById('file-preview');
                if (!preview) {
                    // Create preview element if it doesn't exist
                    preview = document.createElement('div');
                    preview.id = 'file-preview';
                    preview.style.cssText = `
                        margin-top: 1rem;
                        padding: 1rem;
                        background: #0F2A35;
                        border: 1px solid #2A4A57;
                        border-radius: 10px;
                    `;
                    document.getElementById('epod-upload-section').appendChild(preview);
                }

                if (fileType.startsWith('image/')) {
                    preview.innerHTML = `
                        <h4 style="color: #3498db; margin-bottom: 1rem;">File Preview</h4>
                        <img src="${e.target.result}" style="max-width: 100%; max-height: 300px; border-radius: 5px; border: 1px solid #2A4A57;">
                        <p style="color: #E0E6ED; margin-top: 0.5rem;">Image loaded: ${file.name}</p>
                        <p style="color: #B0B6BD; font-size: 0.9rem;">Size: ${(file.size / 1024).toFixed(1)} KB</p>
                    `;
                } else {
                    preview.innerHTML = `
                        <h4 style="color: #3498db; margin-bottom: 1rem;">File Preview</h4>
                        <div style="padding: 2rem; background: #1A3745; border-radius: 5px; text-align: center;">
                            <div style="font-size: 3rem; margin-bottom: 1rem;">📄</div>
                            <div style="color: #E0E6ED;">PDF Document Loaded</div>
                            <div style="color: #B0B6BD; font-size: 0.9rem; margin-top: 0.5rem;">
                                Ready for signature placement
                            </div>
                        </div>
                        <p style="color: #E0E6ED; margin-top: 0.5rem;">PDF loaded: ${file.name}</p>
                        <p style="color: #B0B6BD; font-size: 0.9rem;">Size: ${(file.size / 1024).toFixed(1)} KB</p>
                    `;
                }
            };
            reader.readAsDataURL(file);

            console.log('File loaded successfully:', file.name, 'Type:', fileType);
            alert(`${fileType.startsWith('image/') ? 'Image' : 'PDF'} loaded successfully! Moving to signature step.`);
            navigateToEPODStep(2);
        } else {
            alert('Please select a PDF or image file.');
        }
    } else {
        alert('Please select a file first.');
    }
}

// Document Preview Functions
function loadDocumentPreview() {
    console.log('Loading document preview...', window.loadedDocumentFile || loadedDocumentFile);
    
    // Get the file from either global or local variable
    const file = window.loadedDocumentFile || loadedDocumentFile;
    const dataURL = window.loadedDocumentDataURL;
    
    if (!file) {
        console.log('No document file loaded');
        const canvas = document.getElementById('epod-document-canvas');
        const ctx = canvas ? canvas.getContext('2d') : null;
        if (canvas && ctx) {
            showPlaceholder(canvas, ctx, 'No document loaded - Please upload a file first');
        }
        return;
    }

    const canvas = document.getElementById('epod-document-canvas');
    if (!canvas) {
        console.error('Canvas element not found');
        return;
    }

    const ctx = canvas.getContext('2d');
    
    // Ensure canvas is visible and properly styled
    canvas.style.display = 'block';
    canvas.style.cursor = 'crosshair';
    canvas.style.border = '2px solid #3498db';

    console.log('Processing file:', file.name, 'Type:', file.type, 'Size:', file.size);

    if (file.type.startsWith('image/')) {
        // Load image file
        const img = new Image();
        img.onload = function() {
            // Set canvas size to container width while maintaining aspect ratio
            const container = canvas.parentElement;
            const containerWidth = container.clientWidth - 40; // Account for padding
            const maxWidth = Math.min(containerWidth, 600);
            const maxHeight = 800;

            let { width, height } = img;
            const aspectRatio = width / height;

            // Scale to fit container while maintaining aspect ratio
            if (width > maxWidth) {
                width = maxWidth;
                height = width / aspectRatio;
            }
            if (height > maxHeight) {
                height = maxHeight;
                width = height * aspectRatio;
            }

            canvas.width = width;
            canvas.height = height;
            canvas.style.width = width + 'px';
            canvas.style.height = height + 'px';
            documentScale = width / img.width;

            // Clear canvas and draw image
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            ctx.drawImage(img, 0, 0, width, height);

            // Set default placement
            setDefaultPlacement();

            // Setup click handler
            setupCanvasClickHandler();

            console.log('Image loaded successfully:', file.name, 'Canvas size:', width, 'x', height);
        };
        img.onerror = function() {
            console.error('Failed to load image:', file.name);
            showPlaceholder(canvas, ctx, 'Failed to load image: ' + file.name);
        };
        
        // Use stored data URL if available, otherwise read the file
        if (dataURL) {
            img.src = dataURL;
        } else {
            const reader = new FileReader();
            reader.onload = function(e) {
                img.src = e.target.result;
            };
            reader.onerror = function() {
                console.error('Failed to read file:', file.name);
                showPlaceholder(canvas, ctx, 'Failed to read file: ' + file.name);
            };
            reader.readAsDataURL(file);
        }
    } else if (file.type === 'application/pdf') {
        // For PDF files, load the PDF.js library dynamically and render
        console.log('Loading PDF file...');
        loadPDFPreviewWithFallback(file, canvas, ctx);
    } else {
        // Unknown file type
        console.error('Unsupported file type:', file.type);
        showPlaceholder(canvas, ctx, 'Unsupported file type: ' + file.type);
    }
}

function showPlaceholder(canvas, ctx, message) {
    if (!canvas || !ctx) {
        console.error('Canvas or context not available');
        return;
    }

    canvas.width = 600;
    canvas.height = 400;
    canvas.style.width = '600px';
    canvas.style.height = '400px';

    ctx.fillStyle = '#1A3745';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    ctx.fillStyle = '#E0E6ED';
    ctx.font = '20px Arial';
    ctx.textAlign = 'center';
    ctx.fillText(message, canvas.width / 2, canvas.height / 2);

    // Add border
    ctx.strokeStyle = '#2A4A57';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    documentScale = 1;
    setDefaultPlacement();
    setupCanvasClickHandler();
}

function showPDFPlaceholder(canvas, ctx, fileName) {
    canvas.width = 600;
    canvas.height = 800;
    canvas.style.width = '600px';
    canvas.style.height = '800px';

    // Draw a document-like background
    ctx.fillStyle = '#ffffff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // Add border
    ctx.strokeStyle = '#cccccc';
    ctx.lineWidth = 2;
    ctx.strokeRect(0, 0, canvas.width, canvas.height);

    // Add some lines to simulate document content
    ctx.strokeStyle = '#e0e0e0';
    ctx.lineWidth = 1;
    for (let i = 50; i < canvas.height - 50; i += 30) {
        ctx.beginPath();
        ctx.moveTo(50, i);
        ctx.lineTo(canvas.width - 50, i);
        ctx.stroke();
    }

    // Add PDF icon and text
    ctx.fillStyle = '#d32f2f';
    ctx.font = '48px Arial';
    ctx.textAlign = 'center';
    ctx.fillText('📄', canvas.width / 2, canvas.height / 2 - 40);

    ctx.fillStyle = '#333333';
    ctx.font = '24px Arial';
    ctx.fillText('PDF Document', canvas.width / 2, canvas.height / 2 + 10);

    ctx.font = '16px Arial';
    ctx.fillStyle = '#666666';
    ctx.fillText(fileName, canvas.width / 2, canvas.height / 2 + 40);

    ctx.font = '14px Arial';
    ctx.fillText('Click to place signature & details', canvas.width / 2, canvas.height / 2 + 65);

    documentScale = 1;
    setDefaultPlacement();
    setupCanvasClickHandler();
}

function loadPDFPreviewWithFallback(file, canvas, ctx) {
    // Try to load PDF.js dynamically if not already loaded
    if (typeof window.pdfjsLib === 'undefined') {
        console.log('Loading PDF.js library...');
        const script = document.createElement('script');
        script.src = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.min.js';
        script.onload = function() {
            window.pdfjsLib.GlobalWorkerOptions.workerSrc = 'https://cdnjs.cloudflare.com/ajax/libs/pdf.js/3.11.174/pdf.worker.min.js';
            console.log('PDF.js loaded successfully');
            loadPDFPreview(file, canvas, ctx);
        };
        script.onerror = function() {
            console.error('Failed to load PDF.js library');
            showPDFPlaceholder(canvas, ctx, file.name);
        };
        document.head.appendChild(script);
    } else {
        loadPDFPreview(file, canvas, ctx);
    }
}

function loadPDFPreview(file, canvas, ctx) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const typedarray = new Uint8Array(e.target.result);

        window.pdfjsLib.getDocument(typedarray).promise.then(function(pdf) {
            console.log('PDF document loaded, pages:', pdf.numPages);
            
            // Get first page
            pdf.getPage(1).then(function(page) {
                console.log('Rendering PDF page 1');
                const viewport = page.getViewport({ scale: 1.0 });
                const containerWidth = canvas.parentElement.clientWidth - 40;
                const scale = Math.min(containerWidth / viewport.width, 800 / viewport.height, 1.5);
                const scaledViewport = page.getViewport({ scale: scale });

                canvas.width = scaledViewport.width;
                canvas.height = scaledViewport.height;
                canvas.style.width = scaledViewport.width + 'px';
                canvas.style.height = scaledViewport.height + 'px';

                // Clear canvas before rendering
                ctx.clearRect(0, 0, canvas.width, canvas.height);

                const renderContext = {
                    canvasContext: ctx,
                    viewport: scaledViewport
                };

                page.render(renderContext).promise.then(function() {
                    documentScale = scale;
                    setDefaultPlacement();
                    setupCanvasClickHandler();
                    console.log('PDF rendered successfully:', file.name);
                }).catch(function(renderError) {
                    console.error('Error rendering PDF page:', renderError);
                    showPDFPlaceholder(canvas, ctx, file.name);
                });
            }).catch(function(pageError) {
                console.error('Error getting PDF page:', pageError);
                showPDFPlaceholder(canvas, ctx, file.name);
            });
        }).catch(function(error) {
            console.error('Error loading PDF document:', error);
            showPDFPlaceholder(canvas, ctx, file.name);
        });
    };
    reader.onerror = function() {
        console.error('Error reading PDF file');
        showPDFPlaceholder(canvas, ctx, file.name);
    };
    reader.readAsArrayBuffer(file);
}

function setupCanvasClickHandler() {
    const canvas = document.getElementById('epod-document-canvas');
    
    if (!canvas) {
        console.error('Canvas not found for click handler setup');
        return;
    }

    // Remove existing click handlers
    canvas.removeEventListener('click', handleCanvasClick);
    
    // Add new click handler - placement mode is always active now
    canvas.addEventListener('click', handleCanvasClick);
    canvas.style.cursor = 'crosshair';
    
    console.log('Canvas click handler setup complete');
}

function handleCanvasClick(e) {
    e.preventDefault();
    e.stopPropagation();

    const canvas = e.target;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Convert to document coordinates (percentage)
    const docX = (x / canvas.offsetWidth) * 100;
    const docY = (y / canvas.offsetHeight) * 100;

    placementCoordinates = { x: docX, y: docY };
    updatePlacementIndicators();
    updatePreviewDetails();
    
    console.log('Placement updated:', placementCoordinates);
}

function updatePlacementIndicators() {
    const indicatorsContainer = document.getElementById('placement-indicators');
    const canvas = document.getElementById('epod-document-canvas');

    if (!canvas || !indicatorsContainer) {
        console.log('Missing canvas or indicators container');
        return;
    }

    // Clear existing indicators
    indicatorsContainer.innerHTML = '';

    // Get canvas position relative to its container
    const canvasRect = canvas.getBoundingClientRect();
    const containerRect = indicatorsContainer.parentElement.getBoundingClientRect();
    
    // Calculate pixel positions relative to the canvas display size
    const pixelX = (placementCoordinates.x / 100) * canvas.offsetWidth;
    const pixelY = (placementCoordinates.y / 100) * canvas.offsetHeight;
    
    // Adjust for container positioning
    const adjustedX = pixelX + (canvasRect.left - containerRect.left);
    const adjustedY = pixelY + (canvasRect.top - containerRect.top);

    // Create details indicator
    const detailsIndicator = document.createElement('div');
    detailsIndicator.className = 'placement-indicator details';
    detailsIndicator.textContent = 'DETAILS';
    detailsIndicator.style.position = 'absolute';
    detailsIndicator.style.left = `${adjustedX}px`;
    detailsIndicator.style.top = `${adjustedY}px`;
    detailsIndicator.style.transform = 'translate(-50%, -100%)';
    indicatorsContainer.appendChild(detailsIndicator);

    // Create signature indicator (below details)
    const signatureIndicator = document.createElement('div');
    signatureIndicator.className = 'placement-indicator signature';
    signatureIndicator.textContent = 'SIGNATURE';
    signatureIndicator.style.position = 'absolute';
    signatureIndicator.style.left = `${adjustedX}px`;
    signatureIndicator.style.top = `${adjustedY + 60}px`;
    signatureIndicator.style.transform = 'translate(-50%, -100%)';
    indicatorsContainer.appendChild(signatureIndicator);
    
    console.log('Indicators updated at:', { x: adjustedX, y: adjustedY });
}

function setDefaultPlacement() {
    // Set default placement to bottom-right area
    placementCoordinates = { x: 60, y: 70 };
    updatePlacementIndicators();
}

function resetPlacement() {
    setDefaultPlacement();
}

function togglePlacementMode() {
    placementMode = !placementMode;
    const btn = document.getElementById('placement-mode-btn');
    const canvas = document.getElementById('epod-document-canvas');

    if (placementMode) {
        btn.textContent = 'Disable Placement Mode';
        btn.classList.add('active');
        canvas.classList.add('placement-mode');
    } else {
        btn.textContent = 'Enable Placement Mode';
        btn.classList.remove('active');
        canvas.classList.remove('placement-mode');
    }
}

function clearEPODSignature() {
    const canvas = document.getElementById('epod-signature-pad');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

function applyEPODSignature() {
    alert('Signature applied! Moving to details step.');
    navigateToEPODStep(3);
}

function updatePreviewDetails() {
    // Update preview with current details
    const recipientName = document.getElementById('epod-recipient-name')?.value || 'Not specified';
    const deliveryDate = document.getElementById('epod-delivery-date')?.value || 'Not specified';
    const vehicleId = document.getElementById('epod-vehicle-id')?.value || 'Not specified';
    const notes = document.getElementById('epod-notes')?.value || 'None';

    const previewRecipient = document.getElementById('preview-recipient');
    const previewDate = document.getElementById('preview-date');
    const previewVehicle = document.getElementById('preview-vehicle');
    const previewNotes = document.getElementById('preview-notes');

    if (previewRecipient) previewRecipient.textContent = recipientName;
    if (previewDate) previewDate.textContent = deliveryDate;
    if (previewVehicle) previewVehicle.textContent = vehicleId;
    if (previewNotes) previewNotes.textContent = notes;

    // Copy signature to preview
    const originalCanvas = document.getElementById('epod-signature-pad');
    const previewCanvas = document.getElementById('epod-signature-preview');

    if (originalCanvas && previewCanvas) {
        const originalCtx = originalCanvas.getContext('2d');
        const previewCtx = previewCanvas.getContext('2d');

        // Clear preview canvas
        previewCtx.clearRect(0, 0, previewCanvas.width, previewCanvas.height);

        // Scale and copy signature
        previewCtx.drawImage(originalCanvas, 0, 0, originalCanvas.width, originalCanvas.height, 
                            0, 0, previewCanvas.width, previewCanvas.height);
    }
}

function applyEPODDetails() {
    updatePreviewDetails();
    alert('Details applied! Moving to save step.');
    navigateToEPODStep(4);
}

function saveEPODPDF() {
    const fileInput = document.getElementById('epod-pdf-upload');
    if (!fileInput || !fileInput.files.length) {
        alert('Please upload a PDF or image file first.');
        return;
    }

    const file = fileInput.files[0];
    const fileType = file.type;

    if (fileType.startsWith('image/')) {
        // Handle image files
        handleImageOverlay(file);
    } else if (fileType === 'application/pdf') {
        // Handle PDF files
        handlePDFOverlay(file);
    } else {
        alert('Please upload a PDF or image file.');
    }
}

function handleImageOverlay(imageFile) {
    const reader = new FileReader();
    reader.onload = function(e) {
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF({
            orientation: 'portrait',
            unit: 'mm',
            format: 'a4',
        });

        const pageWidth = pdf.internal.pageSize.getWidth();
        const pageHeight = pdf.internal.pageSize.getHeight();

        // Add the original image as background
        const imgData = e.target.result;
        pdf.addImage(imgData, 'JPEG', 0, 0, pageWidth, pageHeight);

        // Get delivery details
        const recipientName = document.getElementById('epod-recipient-name')?.value || '';
        const deliveryDate = document.getElementById('epod-delivery-date')?.value || '';
        const vehicleId = document.getElementById('epod-vehicle-id')?.value || '';
        const notes = document.getElementById('epod-notes')?.value || '';

        // Use the actual placement coordinates from user click
        const detailsStartX = (placementCoordinates.x / 100) * pageWidth;
        const detailsStartY = pageHeight - ((placementCoordinates.y / 100) * pageHeight);

        // Add delivery details without background - superimposed directly on document
        pdf.setTextColor(0, 0, 0);
        pdf.setFontSize(9);

        let yPos = detailsStartY - 35;
        if (recipientName) {
            pdf.text(`Recipient: ${recipientName}`, detailsStartX, yPos);
            yPos += 8;
        }
        if (deliveryDate) {
            pdf.text(`Date: ${deliveryDate}`, detailsStartX, yPos);
            yPos += 8;
        }
        if (vehicleId) {
            pdf.text(`Vehicle: ${vehicleId}`, detailsStartX, yPos);
            yPos += 8;
        }
        if (notes && notes.trim()) {
            pdf.setFontSize(8);
            pdf.text(`Notes: ${notes}`, detailsStartX, yPos);
            yPos += 8;
        }

        // Add signature close to details
        const epodCanvas = document.getElementById('epod-signature-pad');
        if (epodCanvas) {
            const signature = epodCanvas.toDataURL('image/png');

            // Add signature below details with adjusted width to fit
            pdf.addImage(signature, 'PNG', detailsStartX, yPos + 5, 80, 18);

            pdf.setFontSize(8);
            pdf.text('Received by:', detailsStartX, yPos + 28);
            yPos += 32; // Update position to be below signature
        }

        // Add processed timestamp below signature and details
        pdf.setFontSize(7);
        pdf.setTextColor(100, 100, 100);
        pdf.text(`Processed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, detailsStartX, yPos + 5);

        // Save PDF
        const fileName = `EPOD_${recipientName || 'Delivery'}_${new Date().toISOString().split('T')[0]}.pdf`;
        pdf.save(fileName);

        alert('E-POD with overlay generated and saved successfully!');
    };
    reader.readAsDataURL(imageFile);
}

async function handlePDFOverlay(pdfFile) {
    try {
        const arrayBuffer = await pdfFile.arrayBuffer();
        const { PDFDocument, rgb } = PDFLib;

        // Load the existing PDF
        const existingPdfDoc = await PDFDocument.load(arrayBuffer);
        const pages = existingPdfDoc.getPages();
        const firstPage = pages[0];
        const { width, height } = firstPage.getSize();

        const recipientName = document.getElementById('epod-recipient-name')?.value || '';
        const deliveryDate = document.getElementById('epod-delivery-date')?.value || '';
        const vehicleId = document.getElementById('epod-vehicle-id')?.value || '';
        const notes = document.getElementById('epod-notes')?.value || '';

        // Use the actual placement coordinates from user click
        const detailsStartX = (placementCoordinates.x / 100) * width;
        const detailsStartY = height - ((placementCoordinates.y / 100) * height);

        // Add delivery details close together without background - superimposed directly on document
        let yPos = detailsStartY - 15;
        if (recipientName) {
            firstPage.drawText(`Recipient: ${recipientName}`, {
                x: detailsStartX,
                y: yPos,
                size: 11,
                color: rgb(0, 0, 0),
            });
            yPos -= 12;
        }

        if (deliveryDate) {
            firstPage.drawText(`Date: ${deliveryDate}`, {
                x: detailsStartX,
                y: yPos,
                size: 11,
                color: rgb(0, 0, 0),
            });
            yPos -= 12;
        }

        if (vehicleId) {
            firstPage.drawText(`Vehicle: ${vehicleId}`, {
                x: detailsStartX,
                y: yPos,
                size: 11,
                color: rgb(0, 0, 0),
            });
            yPos -= 12;
        }

        if (notes && notes.trim()) {
            firstPage.drawText(`Notes: ${notes}`, {
                x: detailsStartX,
                y: yPos,
                size: 10,
                color: rgb(0, 0, 0),
            });
            yPos -= 12;
        }

        // Add signature close to details
        const epodCanvas = document.getElementById('epod-signature-pad');
        if (epodCanvas) {
            const signatureDataUrl = epodCanvas.toDataURL('image/png');
            const signatureImageBytes = await fetch(signatureDataUrl).then(res => res.arrayBuffer());
            const signatureImage = await existingPdfDoc.embedPng(signatureImageBytes);

            // Add signature below details with adjusted width to fit
            firstPage.drawImage(signatureImage, {
                x: detailsStartX,
                y: yPos - 22,
                width: 90,
                height: 16,
            });

            firstPage.drawText('Received by:', {
                x: detailsStartX,
                y: yPos - 30,
                size: 9,
                color: rgb(0, 0, 0),
            });

            yPos -= 35; // Update position to be below signature
        }

        // Add processed timestamp below signature and details
        firstPage.drawText(`Processed: ${new Date().toLocaleDateString()} ${new Date().toLocaleTimeString()}`, {
            x: detailsStartX,
            y: yPos - 10,
            size: 8,
            color: rgb(0.4, 0.4, 0.4),
        });

        // Save the modified PDF
        const pdfBytes = await existingPdfDoc.save();
        const blob = new Blob([pdfBytes], { type: 'application/pdf' });
        const url = URL.createObjectURL(blob);

        const link = document.createElement('a');
        link.href = url;
        link.download = `EPOD_${recipientName || 'Delivery'}_${new Date().toISOString().split('T')[0]}.pdf`;
        link.click();

        URL.revokeObjectURL(url);
        alert('E-POD with overlay generated and saved successfully!');

    } catch (error) {
        console.error('Error processing PDF:', error);
        alert('Error processing PDF. Please try with an image file instead.');
    }
}

function emailEPOD() {
    alert('E-POD email functionality will be implemented.');
}

function clearAllEPOD() {
    if (confirm('Are you sure you want to clear all E-POD data?')) {
        clearEPODSignature();
        document.getElementById('epod-pdf-upload').value = '';
        document.getElementById('epod-recipient-name').value = '';
        document.getElementById('epod-delivery-date').value = '';
        document.getElementById('epod-vehicle-id').value = '';
        document.getElementById('epod-notes').value = '';
        navigateToEPODStep(1);
        alert('E-POD data cleared.');
    }
}

function toggleEPODFullScreen() {
    const canvas = document.getElementById('epod-signature-pad');
    if (canvas) {
        if (!document.fullscreenElement) {
            // Create fullscreen container
            const fullscreenContainer = document.createElement('div');
            fullscreenContainer.id = 'fullscreen-signature-container';
            fullscreenContainer.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100vw;
                height: 100vh;
                background: #1A3745;
                z-index: 10000;
                display: flex;
                flex-direction: column;
                align-items: center;
                justify-content: center;
                padding: 20px;
            `;

            // Create fullscreen canvas
            const fullscreenCanvas = document.createElement('canvas');
            fullscreenCanvas.id = 'fullscreen-signature-canvas';
            fullscreenCanvas.width = Math.min(window.innerWidth - 100, 800);
            fullscreenCanvas.height = Math.min(window.innerHeight - 200, 400);
            fullscreenCanvas.style.cssText = `
                border: 3px solid #3498db;
                border-radius: 10px;
                background: white;
                cursor: crosshair;
                margin-bottom: 20px;
            `;

            // Create exit button
            const exitBtn = document.createElement('button');
            exitBtn.textContent = 'EXIT FULL SCREEN';
            exitBtn.style.cssText = `
                padding: 15px 30px;
                background: #e74c3c;
                color: white;
                border: none;
                border-radius: 25px;
                font-size: 18px;
                font-weight: bold;
                cursor: pointer;
                box-shadow: 0 4px 15px rgba(231, 76, 60, 0.4);
                margin-bottom: 10px;
            `;

            // Create clear button
            const clearBtn = document.createElement('button');
            clearBtn.textContent = 'CLEAR SIGNATURE';
            clearBtn.style.cssText = `
                padding: 10px 20px;
                background: #95a5a6;
                color: white;
                border: none;
                border-radius: 20px;
                font-size: 14px;
                cursor: pointer;
                margin-left: 10px;
            `;

            // Add elements to container
            fullscreenContainer.appendChild(exitBtn);
            fullscreenContainer.appendChild(fullscreenCanvas);
            fullscreenContainer.appendChild(clearBtn);
            document.body.appendChild(fullscreenContainer);

            // Copy existing signature to fullscreen canvas
            const ctx = fullscreenCanvas.getContext('2d');
            const originalCtx = canvas.getContext('2d');
            ctx.drawImage(canvas, 0, 0, canvas.width, canvas.height, 0, 0, fullscreenCanvas.width, fullscreenCanvas.height);

            // Set up drawing on fullscreen canvas
            setupCanvasDrawing(fullscreenCanvas);

            // Exit button functionality
            exitBtn.onclick = () => {
                // Copy signature back to original canvas
                const originalCtx = canvas.getContext('2d');
                originalCtx.clearRect(0, 0, canvas.width, canvas.height);
                originalCtx.drawImage(fullscreenCanvas, 0, 0, fullscreenCanvas.width, fullscreenCanvas.height, 0, 0, canvas.width, canvas.height);

                // Remove fullscreen container
                fullscreenContainer.remove();
            };

            // Clear button functionality
            clearBtn.onclick = () => {
                ctx.clearRect(0, 0, fullscreenCanvas.width, fullscreenCanvas.height);
            };
        }
    }
}

function setupCanvasDrawing(canvas) {
    const ctx = canvas.getContext('2d');
    let isDrawing = false;

    // Set drawing properties
    ctx.strokeStyle = '#000000';
    ctx.lineWidth = 3;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    // Mouse events
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);

    // Touch events
    canvas.addEventListener('touchstart', handleTouch);
    canvas.addEventListener('touchmove', handleTouch);
    canvas.addEventListener('touchend', stopDrawing);

    function startDrawing(e) {
        isDrawing = true;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.beginPath();
        ctx.moveTo(x, y);
    }

    function draw(e) {
        if (!isDrawing) return;
        const rect = canvas.getBoundingClientRect();
        const x = (e.clientX || e.touches[0].clientX) - rect.left;
        const y = (e.clientY || e.touches[0].clientY) - rect.top;
        ctx.lineTo(x, y);
        ctx.stroke();
    }

    function stopDrawing() {
        isDrawing = false;
    }

    function handleTouch(e) {
        e.preventDefault();
        const touch = e.touches[0];
        const mouseEvent = new MouseEvent(e.type === 'touchstart' ? 'mousedown' : 
                                       e.type === 'touchmove' ? 'mousemove' : 'mouseup', {
            clientX: touch.clientX,
            clientY: touch.clientY
        });
        canvas.dispatchEvent(mouseEvent);
    }
}

// Clear incident signature
function clearIncidentSignature() {
    const canvas = document.getElementById('incidentSignatureCanvas');
    if (canvas) {
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
    }
}

// Generate incident report
function generateIncidentReport() {
    if (typeof window.jsPDF === 'undefined') {
        alert('PDF library not loaded. Please refresh the page and try again.');
        return;
    }

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();
    const margin = 10;
    let yPosition = margin;

    // Header
    pdf.setFillColor(231, 76, 60);
    pdf.rect(0, 0, pageWidth, 25, 'F');
    pdf.setFontSize(18);
    pdf.setTextColor(255, 255, 255);
    pdf.text('INCIDENT REPORT', pageWidth / 2, 15, { align: 'center' });
    yPosition += 30;

    // Driver & Vehicle Information
    pdf.setFontSize(14);
    pdf.setTextColor(231, 76, 60);
    pdf.text('DRIVER & VEHICLE INFORMATION', margin, yPosition);
    yPosition += 8;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);
    
    const driverInfo = [
        `Driver Name: ${document.getElementById('incident-driver-name')?.value || 'N/A'}`,
        `Vehicle Registration: ${document.getElementById('incident-vehicle-reg')?.value || 'N/A'}`,
        `Incident Date: ${document.getElementById('incident-date')?.value || 'N/A'}`,
        `Incident Time: ${document.getElementById('incident-time')?.value || 'N/A'}`
    ];

    driverInfo.forEach(info => {
        pdf.text(info, margin + 5, yPosition);
        yPosition += 6;
    });

    yPosition += 5;

    // Location Information
    pdf.setFillColor(252, 243, 243);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(231, 76, 60);
    pdf.text('LOCATION INFORMATION', margin + 5, yPosition + 6);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const locationText = document.getElementById('incident-location')?.value || 'N/A';
    const locationLines = pdf.splitTextToSize(`Location: ${locationText}`, pageWidth - 2 * margin - 10);
    locationLines.forEach(line => {
        pdf.text(line, margin + 5, yPosition);
        yPosition += 5;
    });

    const conditions = [
        `Weather Conditions: ${document.getElementById('weather-conditions')?.value || 'N/A'}`,
        `Road Conditions: ${document.getElementById('road-conditions')?.value || 'N/A'}`
    ];

    conditions.forEach(condition => {
        pdf.text(condition, margin + 5, yPosition);
        yPosition += 6;
    });

    yPosition += 5;

    // Incident Details
    pdf.setFillColor(252, 243, 243);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(231, 76, 60);
    pdf.text('INCIDENT DETAILS', margin + 5, yPosition + 6);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const incidentInfo = [
        `Type: ${document.getElementById('incident-type')?.value || 'N/A'}`,
        `Severity: ${document.getElementById('incident-severity')?.value || 'N/A'}`
    ];

    incidentInfo.forEach(info => {
        pdf.text(info, margin + 5, yPosition);
        yPosition += 6;
    });

    const descriptionText = document.getElementById('incident-description')?.value || 'N/A';
    const descriptionLines = pdf.splitTextToSize(`Description: ${descriptionText}`, pageWidth - 2 * margin - 10);
    descriptionLines.forEach(line => {
        if (yPosition > pageHeight - 20) {
            pdf.addPage();
            yPosition = margin + 10;
        }
        pdf.text(line, margin + 5, yPosition);
        yPosition += 5;
    });

    // Emergency Services
    yPosition += 10;
    if (yPosition > pageHeight - 40) {
        pdf.addPage();
        yPosition = margin + 10;
    }

    pdf.setFillColor(252, 243, 243);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.setFontSize(12);
    pdf.setTextColor(231, 76, 60);
    pdf.text('EMERGENCY SERVICES', margin + 5, yPosition + 6);
    yPosition += 15;

    pdf.setFontSize(10);
    pdf.setTextColor(0, 0, 0);

    const policeAttended = document.querySelector('input[name="policeAttended"]:checked')?.value || 'N/A';
    const policeRef = document.getElementById('police-ref')?.value || 'N/A';
    
    pdf.text(`Police Attended: ${policeAttended}`, margin + 5, yPosition);
    yPosition += 6;
    pdf.text(`Police Reference: ${policeRef}`, margin + 5, yPosition);
    yPosition += 10;

    // Signature
    const canvas = document.getElementById('incidentSignatureCanvas');
    if (canvas) {
        pdf.text('Driver Signature:', margin + 5, yPosition);
        
        const signatureData = canvas.toDataURL('image/png');
        if (signatureData && !signatureData.includes('data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mP8/5+hHgAHggJ/PchI7wAAAABJRU5ErkJggg==')) {
            pdf.addImage(signatureData, 'PNG', margin + 5, yPosition + 5, 60, 20);
        }
        yPosition += 25;
    }

    // Footer
    pdf.setFontSize(8);
    pdf.setTextColor(100, 100, 100);
    pdf.text(`Generated: ${new Date().toLocaleString()}`, margin, pageHeight - 10);
    pdf.text('HGV Driver Tools - Incident Report', pageWidth - margin - 60, pageHeight - 10);

    // Save PDF
    const driverName = document.getElementById('incident-driver-name')?.value || 'Driver';
    const fileName = `Incident_Report_${driverName}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
    
    alert('Incident report PDF generated successfully!');
}

// Save incident report
function saveIncidentReport() {
    alert('Incident report saved successfully!');
}

// Clear incident form
function clearIncidentForm() {
    if (confirm('Are you sure you want to clear the incident form?')) {
        document.getElementById('incidentReportForm').reset();
        clearIncidentSignature();
        alert('Incident form cleared.');
    }
}

// Delivery functions
function generateDeliveryPDF() {
    const form = document.getElementById('deliveryForm');
    if (!form) return;

    const formData = new FormData(form);
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = margin;

    // Header
    pdf.setFillColor(40, 58, 91);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text('DELIVERY NOTE', pageWidth / 2, 15, { align: 'center' });
    yPosition += 25;

    // Driver & Vehicle Info
    pdf.setFontSize(12);
    pdf.setTextColor(40, 58, 91);
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text('DRIVER & VEHICLE INFORMATION', margin + 2, yPosition + 6);
    yPosition += 12;

    pdf.setFontSize(10);
    const driverInfo = [
        `Driver Name: ${formData.get('driverName') || ''}`,
        `Vehicle Registration: ${formData.get('vehicleReg') || ''}`,
        `Date: ${formData.get('deliveryDate') || ''}    Time: ${formData.get('deliveryTime') || ''}`
    ];
    driverInfo.forEach((line, index) => {
        pdf.text(line, margin + 5, yPosition + (index * 6) + 2);
    });
    pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 20, 'S');
    yPosition += 25;

    // Client Info
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text('CLIENT / DELIVERY LOCATION', margin + 2, yPosition + 6);
    yPosition += 12;

    const clientInfo = [
        `Client Name: ${formData.get('clientName') || ''}`,
        `Address: ${formData.get('deliveryAddress') || ''}`
    ];
    clientInfo.forEach((line, index) => {
        const lines = pdf.splitTextToSize(line, pageWidth - 2 * margin - 10);
        lines.forEach((splitLine, splitIndex) => {
            pdf.text(splitLine, margin + 5, yPosition + ((index * 2 + splitIndex) * 6) + 2);
        });
        yPosition += lines.length * 6;
    });
    pdf.rect(margin, yPosition - clientInfo.length * 6 - 2, pageWidth - 2 * margin, clientInfo.length * 6 + 4, 'S');
    yPosition += 10;

    // Goods Description
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text('GOODS DESCRIPTION', margin + 2, yPosition + 6);
    yPosition += 12;

    const goodsInfo = [
        `Description: ${formData.get('goodsDescription') || ''}`,
        `Quantity: ${formData.get('goodsQuantity') || 'N/A'}`,
        `Type: ${formData.get('goodsType') || 'N/A'}`,
        `Condition: ${formData.get('loadCondition') || 'N/A'}`
    ];
    goodsInfo.forEach((line, index) => {
        const lines = pdf.splitTextToSize(line, pageWidth - 2 * margin - 10);
        lines.forEach((splitLine, splitIndex) => {
            pdf.text(splitLine, margin + 5, yPosition + ((index * 2 + splitIndex) * 6) + 2);
        });
        if (lines.length > 1) yPosition += (lines.length - 1) * 6;
    });
    yPosition += goodsInfo.length * 6;
    pdf.rect(margin, yPosition - goodsInfo.length * 6 - 2, pageWidth - 2 * margin, goodsInfo.length * 6 + 4, 'S');
    yPosition += 10;

    // Recipient Confirmation
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text('RECIPIENT CONFIRMATION', margin + 2, yPosition + 6);
    yPosition += 15;

    const recipientInfo = [
        `Recipient Name: ${formData.get('recipientName') || ''}`,
        `Delivery Status: ${formData.get('deliveryStatus') || 'Not specified'}`,
        `Notes: ${formData.get('deliveryNotes') || 'None'}`
    ];
    recipientInfo.forEach((line, index) => {
        const lines = pdf.splitTextToSize(line, pageWidth - 2 * margin - 10);
        lines.forEach((splitLine, splitIndex) => {
            pdf.text(splitLine, margin + 5, yPosition + ((index * 2 + splitIndex) * 6) + 2);
        });
        if (lines.length > 1) yPosition += (lines.length - 1) * 6;
    });
    yPosition += recipientInfo.length * 6 + 10;

        // Signature
    const canvas = document.getElementById('deliverySignatureCanvas');
    if (canvas) {
        const signature = canvas.toDataURL('image/png');
        pdf.text('Recipient Signature:', margin + 5, yPosition);
        yPosition += 5;
        pdf.addImage(signature, 'PNG', margin + 5, yPosition, 60, 20);
        yPosition += 25;
    }

    // GPS Location
    const gpsElement = document.getElementById('current-gps');
    if (gpsElement && gpsElement.textContent !== "Click \"Get GPS Location\" to capture current position") {
        pdf.text(`GPS Location: ${gpsElement.textContent}`, margin + 5, yPosition);
    }

    // Save PDF
    const fileName = `Delivery_Note_${formData.get('clientName') || 'DN'}_${new Date().toISOString().split('T')[0]}.pdf`;
    pdf.save(fileName);
}

function emailDeliveryNote() {
    alert('Email delivery note functionality will be implemented.');
}

function saveDeliveryNote() {
    alert('Delivery note saved successfully!');
}

function captureGPSLocation() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(function(position) {
            const lat = position.coords.latitude.toFixed(6);
            const lng = position.coords.longitude.toFixed(6);
            document.getElementById('current-gps').textContent = `${lat}, ${lng}`;
        }, function(error) {
            alert('Unable to get GPS location: ' + error.message);
        });
    } else {
        alert('Geolocation is not supported by this browser.');
    }
}

// Converter functions
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currencyAmount').value);
    const fromCurrency = document.getElementById('fromCurrency').value;

    if (!amount || amount <= 0) {
        alert('Please enter a valid amount');
        return;
    }

    // Exchange rates (approximate)
    const rates = {
        EUR: { GBP: 0.85, USD: 1.10, PLN: 4.30, RON: 4.95, RUB: 100.50 },
        GBP: { EUR: 1.18, USD: 1.30, PLN: 5.05, RON: 5.82, RUB: 118.20 },
        USD: { EUR: 0.91, GBP: 0.77, PLN: 3.90, RON: 4.50, RUB: 91.30 },
        PLN: { EUR: 0.23, GBP: 0.20, USD: 0.26, RON: 1.15, RUB: 23.40 },
        RON: { EUR: 0.20, GBP: 0.17, USD: 0.22, PLN: 0.87, RUB: 20.30 },
        RUB: { EUR: 0.01, GBP: 0.008, USD: 0.011, PLN: 0.043, RON: 0.049 }
    };

    const resultDiv = document.getElementById('currencyResult');
    let html = `<h4>Converting ${amount} ${fromCurrency}</h4>`;

    Object.keys(rates[fromCurrency]).forEach(toCurrency => {
        const converted = (amount * rates[fromCurrency][toCurrency]).toFixed(2);
        html += `<div class="result-item"><span class="unit-name">${toCurrency}</span><span class="unit-value">${converted}</span></div>`;
    });

    resultDiv.innerHTML = html;
}

function convertLength() {
    const value = parseFloat(document.getElementById('lengthInput').value);
    const fromUnit = document.getElementById('lengthFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid value');
        return;
    }

    // Convert to meters first
    const toMeters = {
        mm: 0.001, cm: 0.01, in: 0.0254, ft: 0.3048, yd: 0.9144,
        m: 1, km: 1000, mi: 1609.34, nmi: 1852,
        ff: 100, moon: 768000000000, eo: 940000000000
    };

    const fromMeters = {
        mm: 1000, cm: 100, in: 39.37, ft: 3.281, yd: 1.094,
        m: 1, km: 0.001, mi: 0.000621, nmi: 0.00054,
        ff: 0.01, moon: 0.0000000000013, eo: 0.0000000000011
    };

    const meters = value * toMeters[fromUnit];
    const resultDiv = document.getElementById('lengthResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromMeters).forEach(unit => {
        if (unit !== fromUnit) {
            const converted = (meters * fromMeters[unit]).toFixed(6);
            html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${converted}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertWeight() {
    const value = parseFloat(document.getElementById('weightInput').value);
    const fromUnit = document.getElementById('weightFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid value');
        return;
    }

    // Convert to grams first
    const toGrams = {
        mg: 0.001, g: 1, kg: 1000, oz: 28.35, lb: 453.59, st: 6350.29, t: 1000000
    };

    const fromGrams = {
        mg: 1000, g: 1, kg: 0.001, oz: 0.035, lb: 0.0022, st: 0.000157, t: 0.000001
    };

    const grams = value * toGrams[fromUnit];
    const resultDiv = document.getElementById('weightResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromGrams).forEach(unit => {
        if (unit !== fromUnit) {
            const converted = (grams * fromGrams[unit]).toFixed(6);
            html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${converted}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertVolume() {
    const value = parseFloat(document.getElementById('volumeInput').value);
    const fromUnit = document.getElementById('volumeFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid value');
        return;
    }

    // Convert to liters first
    const toLiters = {
        ml: 0.001, l: 1, gal_uk: 4.546, gal_us: 3.785, pt_uk: 0.568, pt_us: 0.473,
        fl_oz_uk: 0.0284, fl_oz_us: 0.0296, ft3: 28.317, m3: 1000
    };

    const fromLiters = {
        ml: 1000, l: 1, gal_uk: 0.22, gal_us: 0.264, pt_uk: 1.76, pt_us: 2.113,
        fl_oz_uk: 35.195, fl_oz_us: 33.814, ft3: 0.0353, m3: 0.001
    };

    const liters = value * toLiters[fromUnit];
    const resultDiv = document.getElementById('volumeResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromLiters).forEach(unit => {
        if (unit !== fromUnit) {
            const converted = (liters * fromLiters[unit]).toFixed(6);
            html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${converted}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertTemperature() {
    const value = parseFloat(document.getElementById('temperatureInput').value);
    const fromUnit = document.getElementById('temperatureFromUnit').value;

    if (isNaN(value)) {
        alert('Please enter a valid temperature');
        return;
    }

    let celsius = value;

    // Convert to Celsius first
    switch(fromUnit) {
        case 'f': celsius = (value - 32) * 5/9; break;
        case 'k': celsius = value - 273.15; break;
        case 'r': celsius = (value - 491.67) * 5/9; break;
    }

    const resultDiv = document.getElementById('temperatureResults');
    let html = `<h4>Converting ${value}°${fromUnit.toUpperCase()}</h4>`;

    const conversions = {
        c: celsius,
        f: (celsius * 9/5) + 32,
        k: celsius + 273.15,
        r: (celsius + 273.15) * 9/5
    };

    Object.keys(conversions).forEach(unit => {
        if (unit !== fromUnit) {
            html += `<div class="result-item"><span class="unit-name">${unit.toUpperCase()}</span><span class="unit-value">${conversions[unit].toFixed(2)}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertSpeed() {
    const value = parseFloat(document.getElementById('speedInput').value);
    const fromUnit = document.getElementById('speedFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid speed');
        return;
    }

    // Convert to m/s first
    const toMps = {
        mps: 1, kph: 0.278, mph: 0.447, kts: 0.514, fpm: 0.00508,
        mach: 343, cosmic1: 7900, cosmic2: 11200, cosmic3: 16700, lightspeed: 299792458
    };

    const fromMps = {
        mps: 1, kph: 3.6, mph: 2.237, kts: 1.944, fpm: 196.85,
        mach: 0.00291, cosmic1: 0.000127, cosmic2: 0.0000893, cosmic3: 0.0000599, lightspeed: 3.336e-9
    };

    const mps = value * toMps[fromUnit];
    const resultDiv = document.getElementById('speedResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromMps).forEach(unit => {
        if (unit !== fromUnit) {
            let converted = (mps * fromMps[unit]).toFixed(6);
            let displayValue = converted;
            
            if (unit === 'lightspeed') {
                const actualPercent = (mps / toMps['lightspeed'] * 100);
                displayValue = actualPercent.toFixed(12);
            }

            html += `<div class="result-item"><span class="unit-name">${unit.replace('cosmic1', '1st Cosmic Speed').replace('cosmic2', '2nd Cosmic Speed').replace('cosmic3', '3rd Cosmic Speed')}</span><span class="unit-value">${displayValue}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertPressure() {
    const value = parseFloat(document.getElementById('pressureInput').value);
    const fromUnit = document.getElementById('pressureFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid pressure');
        return;
    }

    // Convert to Pascal first
    const toPascal = {
        pa: 1, hpa: 100, kpa: 1000, bar: 100000, psi: 6895, atm: 101325, mmhg: 133.3, inhg: 3386
    };

    const fromPascal = {
        pa: 1, hpa: 0.01, kpa: 0.001, bar: 0.00001, psi: 0.000145, atm: 0.00000987, mmhg: 0.0075, inhg: 0.000295
    };

    const pascal = value * toPascal[fromUnit];
    const resultDiv = document.getElementById('pressureResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromPascal).forEach(unit => {
        if (unit !== fromUnit) {
            const converted = (pascal * fromPascal[unit]).toFixed(6);
            html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${converted}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertArea() {
    const value = parseFloat(document.getElementById('areaInput').value);
    const fromUnit = document.getElementById('areaFromUnit').value;

    if (!value || value < 0) {
        alert('Please enter a valid area');
        return;
    }

    // Convert to square meters first
    const toSqMeters = {
        mm2: 0.000001, cm2: 0.0001, m2: 1, km2: 1000000, in2: 0.000645,
        ft2: 0.0929, yd2: 0.836, ac: 4047, ha: 10000, mi2: 2590000
    };

    const fromSqMeters = {
        mm2: 1000000, cm2: 10000, m2: 1, km2: 0.000001, in2: 1550,
        ft2: 10.76, yd2: 1.196, ac: 0.000247, ha: 0.0001, mi2: 3.861e-7
    };

    const sqMeters = value * toSqMeters[fromUnit];
    const resultDiv = document.getElementById('areaResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    Object.keys(fromSqMeters).forEach(unit => {
        if (unit !== fromUnit) {
            const converted = (sqMeters * fromSqMeters[unit]).toFixed(6);
            html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${converted}</span></div>`;
        }
    });

    resultDiv.innerHTML = html;
}

function convertFuel() {
    const value = parseFloat(document.getElementById('fuelInput').value);
    const fromUnit = document.getElementById('fuelFromUnit').value;

    if (!value || value <= 0) {
        alert('Please enter a valid fuel consumption');
        return;
    }

    const resultDiv = document.getElementById('fuelResults');
    let html = `<h4>Converting ${value} ${fromUnit}</h4>`;

    // Convert based on input unit
    let conversions = {};

    switch(fromUnit) {
        case 'mpg_uk':
            conversions = {
                'mpg_us': (value * 0.833),
                'l100km': (282.5 / value),
                'kmpl': (value * 0.354),
                'gal100mi_uk': (100 / value),
                'gal100mi_us': (100 / (value * 0.833))
            };
            break;
        case 'mpg_us':
            conversions = {
                'mpg_uk': (value / 0.833),
                'l100km': (235.2 / value),
                'kmpl': (value * 0.425),
                'gal100mi_uk': (100 / (value / 0.833)),
                'gal100mi_us': (100 / value)
            };
            break;
        case 'l100km':
            conversions = {
                'mpg_uk': (282.5 / value),
                'mpg_us': (235.2 / value),
                'kmpl': (100 / value),
                'gal100mi_uk': (value * 0.621371 / 4.54609),
                'gal100mi_us': (value * 0.621371 / 3.78541)
            };
            break;
        case 'kmpl':
            conversions = {
                'mpg_uk': (value / 0.354),
                'mpg_us': (value / 0.425),
                'l100km': (100 / value),
                'gal100mi_uk': (62.1371 / (value * 4.54609)),
                'gal100mi_us': (62.1371 / (value * 3.78541))
            };
            break;
        case 'gal100mi_uk':
            conversions = {
                'mpg_uk': (100 / value),
                'mpg_us': (100 / value * 0.833),
                'l100km': (value * 4.54609 / 0.621371),
                'kmpl': (62.1371 / (value * 4.54609)),
                'gal100mi_us': (value * 3.78541 / 4.54609)
            };
            break;
        case 'gal100mi_us':
            conversions = {
                'mpg_uk': (100 / (value / 0.833)),
                'mpg_us': (100 / value),
                'l100km': (value * 3.78541 / 0.621371),
                'kmpl': (62.1371 / (value * 3.78541)),
                'gal100mi_uk': (value * 3.78541 / 4.54609)
            };
            break;
    }

    Object.keys(conversions).forEach(unit => {
        html += `<div class="result-item"><span class="unit-name">${unit}</span><span class="unit-value">${conversions[unit].toFixed(2)}</span></div>`;
    });

    resultDiv.innerHTML = html;
}

function convertHours() {
    let startTime = document.getElementById('hoursStartTime').value;
    const calcType = document.getElementById('hoursCalcType').value;

    // Auto-populate current time if empty
    if (!startTime) {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        startTime = `${hours}:${minutes}`;
        document.getElementById('hoursStartTime').value = startTime;
    }

    const resultDiv = document.getElementById('hoursResults');
    let html = `<h4>Daily Drive Hours Calculator</h4>`;

    const start = new Date(`2000-01-01T${startTime}`);

    switch(calcType) {
        case 'driving':
            const maxDrive9h = new Date(start.getTime() + 9 * 60 * 60 * 1000);
            const maxDrive10h = new Date(start.getTime() + 10 * 60 * 60 * 1000);
            const breakNeeded = new Date(start.getTime() + 4.5 * 60 * 60 * 1000);
            html += `<div class="result-item"><span class="unit-name">Break needed at</span><span class="unit-value">${breakNeeded.toTimeString().substr(0,5)}</span></div>`;
            html += `<div class="result-item"><span class="unit-name">Max driving until (9hrs)</span><span class="unit-value">${maxDrive9h.toTimeString().substr(0,5)}</span></div>`;
            html += `<div class="result-item"><span class="unit-name">10hrs calculation</span><span class="unit-value">${maxDrive10h.toTimeString().substr(0,5)}</span></div>`;
            html += `<div class="result-item"><span class="unit-name">10hrs notice</span><span class="unit-value">Can only be used twice per week</span></div>`;
            break;
        case 'working':
            const maxWork = new Date(start.getTime() + 13 * 60 * 60 * 1000);
            html += `<div class="result-item"><span class="unit-name">Max working until</span><span class="unit-value">${maxWork.toTimeString().substr(0,5)}</span></div>`;
            break;
        case 'rest':
            const minRest = new Date(start.getTime() + 11 * 60 * 60 * 1000);
            html += `<div class="result-item"><span class="unit-name">Min 11h rest until</span><span class="unit-value">${minRest.toTimeString().substr(0,5)}</span></div>`;
            break;
    }

    resultDiv.innerHTML = html;
}

// Calculator memory functions
let memoryStore = 0;

function memoryAdd() {
    const display = document.getElementById('calculatorDisplay');
    const value = parseFloat(display.value) || 0;
    memoryStore += value;
    updateCalculatorResult('Memory', `Added ${value} to memory (Total: ${memoryStore})`);
}

function memorySubtract() {
    const display = document.getElementById('calculatorDisplay');
    const value = parseFloat(display.value) || 0;
    memoryStore -= value;
    updateCalculatorResult('Memory', `Subtracted ${value} from memory (Total: ${memoryStore})`);
}

function memoryClear() {
    memoryStore = 0;
    updateCalculatorResult('Memory', 'Memory cleared');
}

function memoryRecall() {
    const display = document.getElementById('calculatorDisplay');
    display.value = memoryStore.toString();
    updateCalculatorResult('Memory', `Recalled: ${memoryStore}`);
}

function memorySet() {
    const display = document.getElementById('calculatorDisplay');
    const value = parseFloat(display.value) || 0;
    memoryStore = value;
    updateCalculatorResult('Memory', `Stored: ${value}`);
}

function updateCalculatorResult(operation, description) {
    const resultDiv = document.querySelector('.calculator-container .result-display');
    if (resultDiv) {
        const existingContent = resultDiv.innerHTML;
        resultDiv.innerHTML = `
            <h4>${operation}</h4>
            <div class="result-item">
                <span class="unit-name">Operation</span>
                <span class="unit-value">${description}</span>
            </div>
            ${existingContent}
        `;
    }
}

function appendToDisplay(value) {
    const display = document.getElementById('calculatorDisplay');
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearCalculator() {
    const display = document.getElementById('calculatorDisplay');
    display.value = '0';
    const resultDiv = document.querySelector('.calculator-container .result-display');
    if (resultDiv) {
        resultDiv.innerHTML = '';
    }
}

function calculate() {
    const display = document.getElementById('calculatorDisplay');
    try {
        // Replace display symbols with actual operators
        let expression = display.value.replace(/×/g, '*').replace(/÷/g, '/');
        const result = eval(expression);
        display.value = result.toString();
        updateCalculatorResult('Calculation', `${expression} = ${result}`);
    } catch (error) {
        display.value = 'Error';
        updateCalculatorResult('Error', 'Invalid expression');
    }
}

function convertLoad() {
    const pallets = parseInt(document.getElementById('loadInput').value);
    const palletType = document.getElementById('loadPalletType').value;
    const weight = parseFloat(document.getElementById('loadWeight').value);
    const axles = parseInt(document.getElementById('loadAxles').value);

    if (!pallets || pallets <= 0) {
        alert('Please enter number of pallets');
        return;
    }

    const palletSizes = {
        euro: { width: 1.2, length: 0.8, area: 0.96 },
        uk: { width: 1.2, length: 1.0, area: 1.2 },
        industrial: { width: 1.2, length: 1.0, area: 1.2 },
        dusseldorf: { width: 0.8, length: 0.6, area: 0.48 }
    };

    const weightLimits = { 2: 18000, 3: 25000, 4: 32000, 5: 40000, 6: 44000 };

    // Calculate loading metrics
    const pallet = palletSizes[palletType];
    const totalArea = pallets * pallet.area;
    const trailerWidth = 2.4; // Standard trailer width in meters
    const loadingMeters = (pallet.length * pallets) / trailerWidth;

    // Container and trailer specifications (floor areas in m²)
    const containerSpecs = {
        trailer: { area: 33.2, name: 'Standard Trailer (13.6m)' },
        container20: { area: 13.9, name: '20ft Container' },
        container40: { area: 28.0, name: '40ft Container' },
        container45: { area: 31.5, name: '45ft Container/Trailer' }
    };

    const resultDiv = document.getElementById('loadResults');
    let html = `<h4>📦 Load Planning Results</h4>`;

    // Basic metrics
    html += `<div class="result-item"><span class="unit-name">Total Pallets</span><span class="unit-value">${pallets}</span></div>`;
    html += `<div class="result-item"><span class="unit-name">Loading Meters Required</span><span class="unit-value">${loadingMeters.toFixed(2)} LDM</span></div>`;
    html += `<div class="result-item"><span class="unit-name">Floor Area Used</span><span class="unit-value">${totalArea.toFixed(2)} m²</span></div>`;

    // Container loading percentages
    html += `<div style="margin: 1rem 0; padding: 1rem; background: #0F2A35; border-radius: 8px; border: 1px solid #2A4A57;">`;
    html += `<h5 style="color: #3498db; margin-bottom: 0.8rem;">🚛 Space Usage Breakdown:</h5>`;

    Object.entries(containerSpecs).forEach(([key, spec]) => {
        const percentage = ((totalArea / spec.area) * 100).toFixed(1);
        const status = percentage <= 100 ? 'within-limit' : 'over-limit';
        const statusColor = percentage <= 100 ? '#27ae60' : '#e74c3c';

        html += `<div style="display: flex; justify-content: space-between; margin: 0.5rem 0; color: ${statusColor};">`;
        html += `<span>• ${spec.name}:</span>`;
        html += `<span style="font-weight: bold;">${percentage}%</span>`;
        html += `</div>`;
    });
    html += `</div>`;

    // Weight analysis
    html += `<div class="result-item"><span class="unit-name">Weight limit (${axles} axles)</span><span class="unit-value">${weightLimits[axles].toLocaleString()}kg</span></div>`;

    if (weight) {
        const compliance = weight <= weightLimits[axles] ? 'LEGAL' : 'OVERWEIGHT';
        const complianceColor = weight <= weightLimits[axles] ? '#27ae60' : '#e74c3c';
        html += `<div class="result-item"><span class="unit-name">Weight status</span><span class="unit-value" style="color: ${complianceColor};">${compliance}</span></div>`;

        if (weight > weightLimits[axles]) {
            const excess = weight - weightLimits[axles];
            html += `<div class="result-item"><span class="unit-name">Excess weight</span><span class="unit-value" style="color: #e74c3c;">+${excess.toLocaleString()}kg</span></div>`;
        }
    }

    // Loading efficiency recommendations
    html += `<div style="margin: 1rem 0; padding: 1rem; background: #0F2A35; border-radius: 8px; border: 1px solid #2A4A57;">`;
    html += `<h5 style="color: #3498db; margin-bottom: 0.8rem;">💡 Loading Recommendations:</h5>`;

    const trailerPercentage = ((totalArea / containerSpecs.trailer.area) * 100);
    if (trailerPercentage <= 75) {
        html += `<p style="color: #27ae60; margin: 0.3rem 0;">✅ Good space utilization - consider consolidating more cargo</p>`;
    } else if (trailerPercentage <= 90) {
        html += `<p style="color: #f39c12; margin: 0.3rem 0;">⚠️ Efficient loading - monitor weight distribution</p>`;
    } else if (trailerPercentage <= 100) {
        html += `<p style="color: #e67e22; margin: 0.3rem 0;">🔶 High utilization - ensure proper securing</p>`;
    } else {
        html += `<p style="color: #e74c3c; margin: 0.3rem 0;">❌ Over capacity - reduce load or use larger vehicle</p>`;
    }

    html += `</div>`;

    resultDiv.innerHTML = html;
}

// Calculator functionality based on provided code
let calculationHistory = [];

function appendToDisplay(value) {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    if (display.value === '0' && value !== '.') {
        display.value = value;
    } else {
        display.value += value;
    }
}

function clearCalculator() {
    const display = document.getElementById('calculatorDisplay');
    if (display) {
        display.value = '0';
    }
    calculationHistory = [];
    updateHistory();
}

function clearEntry() {
    const display = document.getElementById('calculatorDisplay');
    if (display) {
        display.value = '0';
    }
}

function deleteLast() {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    if (display.value.length > 1) {
        display.value = display.value.slice(0, -1);
    } else {
        display.value = '0';
    }
}

function calculate() {
    const display = document.getElementById('calculatorDisplay');
    if (!display) return;
    
    try {
        const expression = display.value;
        const result = eval(expression);
        
        // Add to calculation history
        calculationHistory.push({
            calculation: expression,
            result: result.toString()
        });
        
        display.value = result;
        updateHistory();
    } catch (error) {
        display.value = 'Error';
        setTimeout(() => {
            display.value = '0';
        }, 1000);
    }
}

function updateHistory() {
    const resultDiv = document.querySelector('.calculator-container .result-display');
    if (resultDiv && calculationHistory.length > 0) {
        let historyHTML = '<h4>Calculation History</h4>';
        calculationHistory.slice(-5).forEach(entry => {
            historyHTML += `<div class="result-item"><span class="unit-name">${entry.calculation}</span><span class="unit-value">${entry.result}</span></div>`;
        });
        resultDiv.innerHTML = historyHTML;
    }
}

// Legacy function names for compatibility with existing buttons
function inputNumber(num) {
    appendToDisplay(num);
}

function inputOperator(op) {
    appendToDisplay(op);
}

function inputDecimal() {
    appendToDisplay('.');
}

// Function to refresh current date and time
function refreshDateTime() {
    autoPopulateDateTimeFields();
    // Show confirmation
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #27ae60;
        color: white;
        padding: 10px 20px;
        border-radius: 5px;
        z-index: 10000;
        font-size: 14px;
        opacity: 0;
        transition: opacity 0.3s ease;
    `;
    notification.textContent = 'Date and time refreshed to current values';
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => notification.style.opacity = '1', 10);

    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// Global functions that might be called from HTML
window.showSection = showSection;
window.refreshDateTime = refreshDateTime;
window.toggleLanguageMenu = toggleLanguageMenu;
window.changeLanguage = changeLanguage;
window.clearSignature = clearSignature;
window.clearDeliverySignature = clearDeliverySignature;
window.startTracking = startTracking;
window.stopTracking = stopTracking;
window.setSharingTime = setSharingTime;
window.applySharingTime = applySharingTime;
window.cancelSharingTime = cancelSharingTime;
window.shareTrackingLink = shareTrackingLink;
window.copyTrackingLink = copyTrackingLink;
window.calculateHours = calculateHours;
window.logFuel = logFuel;
window.generateWeeklySummary = generateWeeklySummary;
window.checkWeather = checkWeather;
window.editContacts = editContacts;
window.saveLogEntry = saveLogEntry;
window.viewLogbook = viewLogbook;
window.sendMessage = sendMessage;
window.askQuickQuestion = askQuickQuestion;
window.showConverterTab = showConverterTab;
window.saveProfile = saveProfile;
window.handleFileUpload = handleFileUpload;
window.filterDocuments = filterDocuments;
window.openFolder = openFolder;
window.openDocumentModal = openDocumentModal;
window.previewDocument = previewDocument;
window.editDocument = editDocument;
window.deleteDocument = deleteDocument;
window.logout = logout;
window.exportData = exportData;
window.clearAllData = clearAllData;
window.navigateToEPODStep = navigateToEPODStep;
window.loadEPODPDF = loadEPODPDF;
window.clearEPODSignature = clearEPODSignature;
window.applyEPODSignature = applyEPODSignature;
window.applyEPODDetails = applyEPODDetails;
window.saveEPODPDF = saveEPODPDF;
window.emailEPOD = emailEPOD;
window.clearAllEPOD = clearAllEPOD;
window.toggleEPODFullScreen = toggleEPODFullScreen;
window.clearIncidentSignature = clearIncidentSignature;
window.generateIncidentReport = generateIncidentReport;
window.saveIncidentReport = saveIncidentReport;
window.clearIncidentForm = clearIncidentForm;
window.generateDeliveryPDF = generateDeliveryPDF;
window.emailDeliveryNote = emailDeliveryNote;
window.saveDeliveryNote = saveDeliveryNote;
window.captureGPSLocation = captureGPSLocation;
window.loadDocumentPreview = loadDocumentPreview;
window.resetPlacement = resetPlacement;
window.togglePlacementMode = togglePlacementMode;

// Analyze compliance function for Weekly Driver / Work Hours Calculator
function analyzeCompliance() {
    const resultDiv = document.getElementById('complianceResults');
    
    // Count extended drive days and long work days for the week
    let weekDriveCount = 0;
    let weekWorkCount = 0;
    
    const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
    
    // Count the week
    days.forEach(day => {
        if (document.getElementById(`w1_${day}_drive`)?.checked) weekDriveCount++;
        if (document.getElementById(`w1_${day}_work`)?.checked) weekWorkCount++;
    });
    
    // Calculate excess above limits
    const weekDriveExcess = Math.max(0, weekDriveCount - 2);
    const weekWorkExcess = Math.max(0, weekWorkCount - 3);
    
    // Overall compliance status
    const isCompliant = weekDriveExcess === 0 && weekWorkExcess === 0;
    
    // Generate report
    let html = `<h4>📊 Weekly Hours Compliance Check</h4>`;
    
    // Overall Status
    html += `<div class="result-item">`;
    html += `<span class="unit-name">Overall Status</span>`;
    if (isCompliant) {
        html += `<span class="unit-value" style="color: #27ae60;">✅ COMPLIANT</span>`;
    } else {
        html += `<span class="unit-value" style="color: #e74c3c;">❌ EXCESS DETECTED</span>`;
    }
    html += `</div>`;
    
    // Weekly Results
    html += `<div style="margin: 1rem 0; padding: 1rem; background: #0F2A35; border-radius: 8px; border: 1px solid #2A4A57;">`;
    html += `<h5 style="color: #3498db; margin-bottom: 0.8rem;">📅 Weekly Analysis:</h5>`;
    
    html += `<div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">`;
    html += `<span>Extended drive days (>9h):</span>`;
    html += `<span style="color: ${weekDriveCount > 2 ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${weekDriveCount} / 2 allowed</span>`;
    html += `</div>`;
    
    if (weekDriveExcess > 0) {
        html += `<div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">`;
        html += `<span>Drive days excess:</span>`;
        html += `<span style="color: #e74c3c; font-weight: bold;">+${weekDriveExcess} days over limit</span>`;
        html += `</div>`;
    }
    
    html += `<div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">`;
    html += `<span>Long work days (>13h):</span>`;
    html += `<span style="color: ${weekWorkCount > 3 ? '#e74c3c' : '#27ae60'}; font-weight: bold;">${weekWorkCount} / 3 allowed</span>`;
    html += `</div>`;
    
    if (weekWorkExcess > 0) {
        html += `<div style="display: flex; justify-content: space-between; margin: 0.5rem 0;">`;
        html += `<span>Work days excess:</span>`;
        html += `<span style="color: #e74c3c; font-weight: bold;">+${weekWorkExcess} days over limit</span>`;
        html += `</div>`;
    }
    html += `</div>`;
    
    // Summary Section
    if (weekDriveExcess > 0 || weekWorkExcess > 0) {
        html += `<div style="margin: 1rem 0; padding: 1rem; background: #0F2A35; border-radius: 8px; border: 1px solid #e74c3c;">`;
        html += `<h5 style="color: #e74c3c; margin-bottom: 0.8rem;">⚠️ Excess Summary:</h5>`;
        
        if (weekDriveExcess > 0) {
            html += `<p style="color: #E0E6ED; margin: 0.3rem 0;">• Excess drive days: <strong style="color: #e74c3c;">${weekDriveExcess} days</strong></p>`;
        }
        
        if (weekWorkExcess > 0) {
            html += `<p style="color: #E0E6ED; margin: 0.3rem 0;">• Excess work days: <strong style="color: #e74c3c;">${weekWorkExcess} days</strong></p>`;
        }
        
        html += `<p style="color: #f39c12; margin: 0.5rem 0 0 0;"><strong>Action needed:</strong> Reduce excess days to maintain compliance</p>`;
        html += `</div>`;
    } else {
        html += `<div style="margin: 1rem 0; padding: 1rem; background: #0F2A35; border-radius: 8px; border: 1px solid #27ae60;">`;
        html += `<h5 style="color: #27ae60; margin-bottom: 0.8rem;">✅ Perfect Compliance:</h5>`;
        html += `<p style="color: #E0E6ED; margin: 0.3rem 0;">• All extended drive days are within the 2-day weekly limit</p>`;
        html += `<p style="color: #E0E6ED; margin: 0.3rem 0;">• All long work days are within the 3-day weekly limit</p>`;
        html += `<p style="color: #27ae60; margin: 0.5rem 0 0 0;"><strong>Great job!</strong> Your schedule follows the regulations</p>`;
        html += `</div>`;
    }
    
    resultDiv.innerHTML = html;
}

function clearAllTracking() {
    if (confirm('Are you sure you want to clear all tracking data?')) {
        const days = ['mon', 'tue', 'wed', 'thu', 'fri', 'sat', 'sun'];
        const types = ['drive', 'work'];
        
        days.forEach(day => {
            types.forEach(type => {
                const checkbox = document.getElementById(`w1_${day}_${type}`);
                if (checkbox) checkbox.checked = false;
            });
        });
        
        // Clear results
        const resultDiv = document.getElementById('complianceResults');
        if (resultDiv) resultDiv.innerHTML = '';
        
        alert('All tracking data cleared successfully!');
    }
}

// Geofencing Variables
let geofences = JSON.parse(localStorage.getItem('geofences') || '[]');
let geofenceEvents = JSON.parse(localStorage.getItem('geofenceEvents') || '[]');
let currentPosition = null;
let geofenceWatchId = null;
let notificationTimers = new Map();

// Geofencing Functions
function createGeofence() {
    if (!trackingActive || !currentPosition) {
        alert('GPS tracking must be active to create a geofence at current location.');
        return;
    }

    const name = document.getElementById('geofenceName').value.trim();
    const type = document.getElementById('geofenceType').value;
    const radius = parseInt(document.getElementById('geofenceRadius').value);

    if (!name) {
        alert('Please enter a zone name.');
        return;
    }

    if (!radius || radius < 10 || radius > 5000) {
        alert('Please enter a radius between 10 and 5000 meters.');
        return;
    }

    const geofence = {
        id: 'geo_' + Date.now(),
        name: name,
        type: type,
        latitude: currentPosition.coords.latitude,
        longitude: currentPosition.coords.longitude,
        radius: radius,
        enabled: true,
        created: new Date().toISOString(),
        autoNotify: false,
        notifyMinutesBefore: 5,
        notificationMethod: 'alert',
        notifyParty: {
            name: '',
            phone: '',
            email: '',
            details: ''
        }
    };

    geofences.push(geofence);
    localStorage.setItem('geofences', JSON.stringify(geofences));
    
    updateGeofencesList();
    clearGeofenceForm();
    alert(`Geofence "${name}" created successfully!`);
}

function clearGeofenceForm() {
    document.getElementById('geofenceName').value = '';
    document.getElementById('geofenceRadius').value = '';
}

function updateGeofencesList() {
    const listContainer = document.getElementById('geofencesList');
    
    if (geofences.length === 0) {
        listContainer.innerHTML = '<p style="color: #B0B6BD;">No geofences created yet.</p>';
        return;
    }

    let html = '';
    geofences.forEach(fence => {
        const typeEmoji = getTypeEmoji(fence.type);
        const statusColor = fence.enabled ? '#27ae60' : '#95a5a6';
        const notifyStatus = fence.autoNotify ? '🔔 Auto-notify ON' : '🔕 Auto-notify OFF';
        
        html += `
            <div class="geofence-item" style="background: #1A3745; border: 1px solid #2A4A57; border-radius: 8px; padding: 1rem; margin-bottom: 1rem;">
                <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 0.5rem;">
                    <div>
                        <h5 style="margin: 0; color: #E0E6ED; font-size: 1.1rem;">${typeEmoji} ${fence.name}</h5>
                        <p style="margin: 0.2rem 0; color: #B0B6BD; font-size: 0.9rem;">
                            ${fence.type.replace('_', ' ')} • ${fence.radius}m radius
                        </p>
                        <p style="margin: 0.2rem 0; color: #3498db; font-size: 0.8rem;">${notifyStatus}</p>
                    </div>
                    <div style="display: flex; gap: 0.5rem;">
                        <button onclick="toggleGeofence('${fence.id}')" 
                                style="padding: 0.3rem 0.8rem; background: ${statusColor}; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            ${fence.enabled ? 'ON' : 'OFF'}
                        </button>
                        <button onclick="editGeofence('${fence.id}')" 
                                style="padding: 0.3rem 0.8rem; background: #f39c12; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            Edit
                        </button>
                        <button onclick="deleteGeofence('${fence.id}')" 
                                style="padding: 0.3rem 0.8rem; background: #e74c3c; color: white; border: none; border-radius: 4px; cursor: pointer; font-size: 0.8rem;">
                            Delete
                        </button>
                    </div>
                </div>
                ${fence.autoNotify ? `
                    <div style="background: #0F2A35; padding: 0.8rem; border-radius: 4px; margin-top: 0.5rem;">
                        <p style="margin: 0; color: #3498db; font-size: 0.85rem; font-weight: bold;">Auto-Notification Settings:</p>
                        <p style="margin: 0.2rem 0; color: #E0E6ED; font-size: 0.8rem;">• Notify ${fence.notifyMinutesBefore} minutes before reaching</p>
                        <p style="margin: 0.2rem 0; color: #E0E6ED; font-size: 0.8rem;">• Method: ${fence.notificationMethod}</p>
                        ${fence.notifyParty.name ? `<p style="margin: 0.2rem 0; color: #E0E6ED; font-size: 0.8rem;">• Contact: ${fence.notifyParty.name}</p>` : ''}
                    </div>
                ` : ''}
            </div>
        `;
    });

    listContainer.innerHTML = html;
}

function getTypeEmoji(type) {
    const emojis = {
        delivery: '📦',
        pickup: '📋',
        depot: '🏢',
        customer: '🏪',
        rest_area: '🛌',
        restricted: '⚠️',
        other: '📍'
    };
    return emojis[type] || '📍';
}

function toggleGeofence(id) {
    const fence = geofences.find(f => f.id === id);
    if (fence) {
        fence.enabled = !fence.enabled;
        localStorage.setItem('geofences', JSON.stringify(geofences));
        updateGeofencesList();
        logGeofenceEvent(fence.enabled ? 'enabled' : 'disabled', fence);
    }
}

function editGeofence(id) {
    const fence = geofences.find(f => f.id === id);
    if (!fence) return;

    // Create edit modal
    const modal = document.createElement('div');
    modal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.8);
        z-index: 10000;
        display: flex;
        align-items: center;
        justify-content: center;
        padding: 1rem;
    `;

    modal.innerHTML = `
        <div style="background: #1A3745; border: 2px solid #2A4A57; border-radius: 15px; padding: 2rem; max-width: 500px; width: 100%; max-height: 90vh; overflow-y: auto;">
            <h3 style="color: #3498db; margin-bottom: 1.5rem;">Edit Geofence: ${fence.name}</h3>
            
            <div style="margin-bottom: 1rem;">
                <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Zone Name:</label>
                <input type="text" id="editGeofenceName" value="${fence.name}" style="width: 100%; padding: 0.8rem; background: #0F2A35; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
            </div>

            <div style="margin-bottom: 1rem;">
                <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Radius (meters):</label>
                <input type="number" id="editGeofenceRadius" value="${fence.radius}" min="10" max="5000" style="width: 100%; padding: 0.8rem; background: #0F2A35; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
            </div>

            <div style="margin-bottom: 1.5rem;">
                <label style="display: flex; align-items: center; gap: 0.5rem; cursor: pointer; color: #E0E6ED; font-size: 1.1rem;">
                    <input type="checkbox" id="editAutoNotify" ${fence.autoNotify ? 'checked' : ''} style="transform: scale(1.2);">
                    Enable Auto-Notification
                </label>
            </div>

            <div id="editNotificationSettings" style="background: #0F2A35; border: 1px solid #2A4A57; border-radius: 8px; padding: 1rem; margin-bottom: 1.5rem; ${fence.autoNotify ? '' : 'display: none;'}">
                <h4 style="color: #3498db; margin-top: 0;">Notification Settings</h4>
                
                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Notify when:</label>
                    <select id="editNotifyTiming" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                        <option value="reached" ${!fence.notifyMinutesBefore ? 'selected' : ''}>When reached</option>
                        <option value="before" ${fence.notifyMinutesBefore ? 'selected' : ''}>Minutes before reaching</option>
                    </select>
                </div>

                <div id="editMinutesBeforeSection" style="margin-bottom: 1rem; ${fence.notifyMinutesBefore ? '' : 'display: none;'}">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Minutes before:</label>
                    <input type="number" id="editMinutesBefore" value="${fence.notifyMinutesBefore || 5}" min="1" max="60" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Notification Method:</label>
                    <select id="editNotificationMethod" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                        <option value="alert" ${fence.notificationMethod === 'alert' ? 'selected' : ''}>Browser Alert</option>
                        <option value="sound" ${fence.notificationMethod === 'sound' ? 'selected' : ''}>Sound Notification</option>
                        <option value="both" ${fence.notificationMethod === 'both' ? 'selected' : ''}>Alert + Sound</option>
                        <option value="sms" ${fence.notificationMethod === 'sms' ? 'selected' : ''}>SMS (Manual)</option>
                        <option value="email" ${fence.notificationMethod === 'email' ? 'selected' : ''}>Email (Manual)</option>
                    </select>
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Contact Name:</label>
                    <input type="text" id="editContactName" value="${fence.notifyParty.name || ''}" placeholder="Contact person name" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Phone Number:</label>
                    <input type="tel" id="editContactPhone" value="${fence.notifyParty.phone || ''}" placeholder="+44 7XXX XXXXXX" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Email:</label>
                    <input type="email" id="editContactEmail" value="${fence.notifyParty.email || ''}" placeholder="contact@example.com" style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED;">
                </div>

                <div style="margin-bottom: 1rem;">
                    <label style="color: #E0E6ED; display: block; margin-bottom: 0.5rem;">Additional Details:</label>
                    <textarea id="editContactDetails" placeholder="Special instructions, delivery details, etc." style="width: 100%; padding: 0.8rem; background: #1A3745; border: 1px solid #2A4A57; border-radius: 5px; color: #E0E6ED; resize: vertical; height: 80px;">${fence.notifyParty.details || ''}</textarea>
                </div>
            </div>

            <div style="display: flex; gap: 1rem; justify-content: flex-end;">
                <button onclick="this.closest('div').parentElement.remove()" style="padding: 0.8rem 1.5rem; background: #95a5a6; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Cancel
                </button>
                <button onclick="saveGeofenceEdit('${fence.id}', this)" style="padding: 0.8rem 1.5rem; background: #27ae60; color: white; border: none; border-radius: 5px; cursor: pointer;">
                    Save Changes
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(modal);

    // Add event listeners for the modal
    const autoNotifyCheckbox = modal.querySelector('#editAutoNotify');
    const notificationSettings = modal.querySelector('#editNotificationSettings');
    const notifyTiming = modal.querySelector('#editNotifyTiming');
    const minutesBeforeSection = modal.querySelector('#editMinutesBeforeSection');

    autoNotifyCheckbox.addEventListener('change', function() {
        notificationSettings.style.display = this.checked ? 'block' : 'none';
    });

    notifyTiming.addEventListener('change', function() {
        minutesBeforeSection.style.display = this.value === 'before' ? 'block' : 'none';
    });
}

function saveGeofenceEdit(id, button) {
    const modal = button.closest('div').parentElement;
    const fence = geofences.find(f => f.id === id);
    
    if (!fence) return;

    // Update fence properties
    fence.name = modal.querySelector('#editGeofenceName').value.trim();
    fence.radius = parseInt(modal.querySelector('#editGeofenceRadius').value);
    fence.autoNotify = modal.querySelector('#editAutoNotify').checked;
    
    if (fence.autoNotify) {
        const timing = modal.querySelector('#editNotifyTiming').value;
        fence.notifyMinutesBefore = timing === 'before' ? parseInt(modal.querySelector('#editMinutesBefore').value) : 0;
        fence.notificationMethod = modal.querySelector('#editNotificationMethod').value;
        fence.notifyParty = {
            name: modal.querySelector('#editContactName').value.trim(),
            phone: modal.querySelector('#editContactPhone').value.trim(),
            email: modal.querySelector('#editContactEmail').value.trim(),
            details: modal.querySelector('#editContactDetails').value.trim()
        };
    }

    localStorage.setItem('geofences', JSON.stringify(geofences));
    updateGeofencesList();
    modal.remove();
    alert('Geofence updated successfully!');
}

function deleteGeofence(id) {
    const fence = geofences.find(f => f.id === id);
    if (fence && confirm(`Are you sure you want to delete "${fence.name}"?`)) {
        geofences = geofences.filter(f => f.id !== id);
        localStorage.setItem('geofences', JSON.stringify(geofences));
        updateGeofencesList();
        logGeofenceEvent('deleted', fence);
    }
}

function startGeofenceMonitoring() {
    if (!trackingActive) return;

    if (geofenceWatchId) {
        navigator.geolocation.clearWatch(geofenceWatchId);
    }

    geofenceWatchId = navigator.geolocation.watchPosition(
        function(position) {
            currentPosition = position;
            checkGeofences(position);
        },
        function(error) {
            console.error('Geofence monitoring error:', error);
        },
        {
            enableHighAccuracy: true,
            timeout: 10000,
            maximumAge: 5000
        }
    );
}

function stopGeofenceMonitoring() {
    if (geofenceWatchId) {
        navigator.geolocation.clearWatch(geofenceWatchId);
        geofenceWatchId = null;
    }
    
    // Clear all notification timers
    notificationTimers.forEach(timer => clearTimeout(timer));
    notificationTimers.clear();
}

function checkGeofences(position) {
    const geofencingEnabled = document.getElementById('geofencingEnabled').checked;
    if (!geofencingEnabled || geofences.length === 0) return;

    geofences.forEach(fence => {
        if (!fence.enabled) return;

        const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            fence.latitude,
            fence.longitude
        );

        const isInside = distance <= fence.radius;
        const wasInside = fence.lastStatus === 'inside';

        if (isInside && !wasInside) {
            // Entering geofence
            fence.lastStatus = 'inside';
            logGeofenceEvent('entered', fence, distance);
            triggerGeofenceNotification('entered', fence);
        } else if (!isInside && wasInside) {
            // Leaving geofence
            fence.lastStatus = 'outside';
            logGeofenceEvent('exited', fence, distance);
            triggerGeofenceNotification('exited', fence);
        }

        // Check for advance notifications
        if (fence.autoNotify && fence.notifyMinutesBefore > 0 && !isInside) {
            checkAdvanceNotification(fence, distance, position.coords.speed || 0);
        }
    });
}

function checkAdvanceNotification(fence, distance, speed) {
    if (speed <= 0) return; // No speed data

    const timeToReach = distance / (speed * 0.00027778); // Convert m/s to km/h
    const minutesToReach = timeToReach / 60;

    if (minutesToReach <= fence.notifyMinutesBefore && minutesToReach > (fence.notifyMinutesBefore - 1)) {
        const timerId = `${fence.id}_advance`;
        if (!notificationTimers.has(timerId)) {
            triggerAdvanceNotification(fence, Math.round(minutesToReach));
            notificationTimers.set(timerId, setTimeout(() => {
                notificationTimers.delete(timerId);
            }, 60000)); // Clear timer after 1 minute
        }
    }
}

function triggerGeofenceNotification(type, fence) {
    const message = `${type === 'entered' ? 'Entered' : 'Left'} ${getTypeEmoji(fence.type)} ${fence.name}`;
    
    if (fence.autoNotify) {
        sendNotification(fence.notificationMethod, message, fence);
    } else {
        // Default notification
        showGeofenceAlert(message, fence.type);
    }
}

function triggerAdvanceNotification(fence, minutes) {
    const message = `Approaching ${getTypeEmoji(fence.type)} ${fence.name} in ${minutes} minute${minutes !== 1 ? 's' : ''}`;
    sendNotification(fence.notificationMethod, message, fence);
}

function sendNotification(method, message, fence) {
    switch (method) {
        case 'alert':
            showGeofenceAlert(message, fence.type);
            break;
        case 'sound':
            playNotificationSound();
            break;
        case 'both':
            showGeofenceAlert(message, fence.type);
            playNotificationSound();
            break;
        case 'sms':
            showGeofenceAlert(message + '\n\nSMS notification: Please manually send to ' + fence.notifyParty.phone, fence.type);
            break;
        case 'email':
            showGeofenceAlert(message + '\n\nEmail notification: Please manually send to ' + fence.notifyParty.email, fence.type);
            break;
        default:
            showGeofenceAlert(message, fence.type);
    }
}

function showGeofenceAlert(message, type) {
    // Create notification popup
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: ${type === 'restricted' ? '#e74c3c' : '#27ae60'};
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        z-index: 10000;
        max-width: 300px;
        font-size: 1rem;
        font-weight: bold;
        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.3);
        opacity: 0;
        transform: translateX(100px);
        transition: all 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    // Animate in
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateX(0)';
    }, 10);

    // Remove after 5 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateX(100px)';
        setTimeout(() => notification.remove(), 300);
    }, 5000);
}

function playNotificationSound() {
    try {
        const audio = new Audio('data:audio/wav;base64,UklGRnoGAABXQVZFZm10IBAAAAABAAEAQB8AAEAfAAABAAgAZGF0YQoGAACBhYqFbF1fdJivrJBhNjVgodDbq2EcBj+a2/LDciUFLIHO8tiJNwgZaLvt559NEAxQp+PwtmMcBjiR1/LMeSwFJHfH8N2QQAoUXrTp66hVFApGn+DyvmQeCSWE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnODzwGQdCSaE0fPTgjMGHm3A7eSQQgkXYrLu77JSEwxFnOD');
        audio.play();
    } catch (error) {
        console.log('Could not play notification sound');
    }
}

function calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371000; // Earth's radius in meters
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
}

function logGeofenceEvent(type, fence, distance = null) {
    const event = {
        id: 'event_' + Date.now(),
        type: type,
        fenceName: fence.name,
        fenceType: fence.type,
        timestamp: new Date().toISOString(),
        distance: distance ? Math.round(distance) : null
    };

    geofenceEvents.unshift(event);
    
    // Keep only last 50 events
    if (geofenceEvents.length > 50) {
        geofenceEvents = geofenceEvents.slice(0, 50);
    }
    
    localStorage.setItem('geofenceEvents', JSON.stringify(geofenceEvents));
    updateGeofenceEventLog();
}

function updateGeofenceEventLog() {
    const logContainer = document.getElementById('geofenceEventLog');
    
    if (geofenceEvents.length === 0) {
        logContainer.innerHTML = '<p style="color: #B0B6BD;">No geofence events yet.</p>';
        return;
    }

    let html = '';
    geofenceEvents.slice(0, 10).forEach(event => {
        const time = new Date(event.timestamp).toLocaleTimeString();
        const typeColor = event.type === 'entered' ? '#27ae60' : 
                         event.type === 'exited' ? '#f39c12' : '#95a5a6';
        const typeEmoji = event.type === 'entered' ? '🟢' : 
                         event.type === 'exited' ? '🟡' : '⚪';
        
        html += `
            <div style="display: flex; justify-content: space-between; align-items: center; padding: 0.5rem; margin-bottom: 0.5rem; background: #1A3745; border-radius: 5px; border-left: 3px solid ${typeColor};">
                <div>
                    <span style="color: ${typeColor}; font-weight: bold;">${typeEmoji} ${event.type.charAt(0).toUpperCase() + event.type.slice(1)}</span>
                    <span style="color: #E0E6ED; margin-left: 0.5rem;">${getTypeEmoji(event.fenceType)} ${event.fenceName}</span>
                    ${event.distance ? `<span style="color: #B0B6BD; font-size: 0.8rem; margin-left: 0.5rem;">(${event.distance}m)</span>` : ''}
                </div>
                <span style="color: #B0B6BD; font-size: 0.8rem;">${time}</span>
            </div>
        `;
    });

    logContainer.innerHTML = html;
}

function clearGeofenceEvents() {
    if (confirm('Are you sure you want to clear all geofence events?')) {
        geofenceEvents = [];
        localStorage.setItem('geofenceEvents', JSON.stringify(geofenceEvents));
        updateGeofenceEventLog();
    }
}

function updateGeofencingStatus() {
    const statusDiv = document.getElementById('geofencingStatus');
    const enabled = document.getElementById('geofencingEnabled').checked;
    
    if (enabled && trackingActive) {
        statusDiv.innerHTML = '<div style="color: #27ae60;">✅ Geofencing Active - Monitoring ' + geofences.filter(f => f.enabled).length + ' zones</div>';
        startGeofenceMonitoring();
    } else if (enabled && !trackingActive) {
        statusDiv.innerHTML = '<div style="color: #f39c12;">⚠️ Geofencing Enabled - Start GPS tracking to activate</div>';
        stopGeofenceMonitoring();
    } else {
        statusDiv.innerHTML = '<div style="color: #95a5a6;">⏹️ Geofencing Disabled</div>';
        stopGeofenceMonitoring();
    }
}

// Add converter functions to window object
window.convertCurrency = convertCurrency;
window.convertLength = convertLength;
window.convertWeight = convertWeight;
window.convertVolume = convertVolume;
window.convertTemperature = convertTemperature;
window.convertSpeed = convertSpeed;
window.convertPressure = convertPressure;
window.convertArea = convertArea;
window.convertFuel = convertFuel;
window.convertHours = convertHours;
window.convertLoad = convertLoad;
window.inputNumber = inputNumber;
window.inputOperator = inputOperator;
window.inputDecimal = inputDecimal;
window.calculate = calculate;
window.clearCalculator = clearCalculator;
window.clearEntry = clearEntry;
window.deleteLast = deleteLast;
window.memoryStore = memoryStore;
window.memoryRecall = memoryRecall;
window.memoryClear = memoryClear;
window.memoryAdd = memoryAdd;
window.memorySubtract = memorySubtract;
window.analyzeCompliance = analyzeCompliance;
window.clearAllTracking = clearAllTracking;

// Add geofencing functions to window object
window.createGeofence = createGeofence;
window.toggleGeofence = toggleGeofence;
window.editGeofence = editGeofence;
window.saveGeofenceEdit = saveGeofenceEdit;
window.deleteGeofence = deleteGeofence;
window.clearGeofenceEvents = clearGeofenceEvents;
window.updateGeofencingStatus = updateGeofencingStatus;
window.startGeofenceMonitoring = startGeofenceMonitoring;
window.stopGeofenceMonitoring = stopGeofenceMonitoring;

// Load saved data on page load
document.addEventListener('DOMContentLoaded', function() {
    // Check authentication first
    // Load emergency contacts if saved
    const savedContacts = JSON.parse(localStorage.getItem('emergencyContacts') || '{}');
    if (savedContacts.breakdown || savedContacts.dispatch) {
        const contactsDiv = document.querySelector('.emergency-contacts');
        if (contactsDiv) {
            contactsDiv.innerHTML = `
                <p><strong>Breakdown:</strong> ${savedContacts.breakdown || '0800 XXX XXXX'}</p>
                <p><strong>Police:</strong> 999</p>
                <p><strong>DVSA:</strong> 0300 123 9000</p>
                <p><strong>Company Dispatch:</strong> ${savedContacts.dispatch || '[Add your number]'}</p>
            `;
        }
    }

    // Load profile data
    loadProfile();

    // Apply saved language
    changeLanguage(currentLanguage);

    // Show home section by default
    showSection('home');

    // Add form submit handler for checklist PDF generation
    const checklistForm = document.getElementById('walkaroundCheckForm');
    if (checklistForm) {
        checklistForm.addEventListener('submit', generateChecklistPDF);
    }

    // Initialize other components
    console.log('GPS tracking initialized');
});

function generateChecklistPDF(event) {
    event.preventDefault();
    // Check for unchecked items
    // Generate English PDF first
    generatePDFInLanguage('en');
    // Generate PDF in current language if not English
    if (currentLanguage !== 'en') {
        setTimeout(() => generatePDFInLanguage(currentLanguage), 1000);
    }
}

function generatePDFInLanguage(language) {
    const form = document.getElementById('walkaroundCheckForm');
    const formData = new FormData(form);
    const { jsPDF } = window.jspdf;

    const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
    });

    const pageWidth = pdf.internal.pageSize.getWidth();
    const margin = 10;
    let yPosition = margin;

    // Translation data for PDF headers
    const pdfTranslations = {
        en: {
            title: "HGV DRIVER WALK-AROUND CHECKLIST",
            vehicleInfo: "VEHICLE INFORMATION",
            dailyCheck: "DAILY CHECK",
            defectsReported: "DEFECTS REPORTED",
            driverSignature: "DRIVER'S SIGNATURE",
            defectImage: "DEFECT IMAGE",
            vehicleReg: "Vehicle Registration",
            odo: "Odometer Reading",
            trailerNo: "Trailer No",
            driverName: "Driver's Name",
            date: "Date",
            time: "Time",
            checklistItem: "CHECKLIST ITEM",
            status: "STATUS"
        },
        pl: {
            title: "LISTA KONTROLNA OGLĘDZIN KIEROWCY HGV",
            vehicleInfo: "INFORMACJE O POJEŹDZIE",
            dailyCheck: "KONTROLA DZIENNA",
            defectsReported: "ZGŁOSZONE USTERKI",
            driverSignature: "PODPIS KIEROWCY",
            defectImage: "ZDJĘCIE USTERKI",
            vehicleReg: "Numer Rejestracyjny",
            odo: "Odczyt Licznika",
            trailerNo: "Nr Przyczepy",
            driverName: "Imię Kierowcy",
            date: "Data",
            time: "Czas",
            checklistItem: "ELEMENT KONTROLI",
            status: "STATUS"
        }
    };

    const texts = pdfTranslations[language];

    // Header
    pdf.setFillColor(40, 58, 91);
    pdf.rect(0, 0, pageWidth, 20, 'F');
    pdf.setFontSize(16);
    pdf.setTextColor(255, 255, 255);
    pdf.text(texts.title, pageWidth / 2, 15, { align: 'center' });
    yPosition += 25;

    // Vehicle Information Section
    pdf.setFontSize(12);
    pdf.setTextColor(40, 58, 91);
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text(texts.vehicleInfo, margin + 2, yPosition + 6);
    yPosition += 12;

    pdf.setFontSize(10);
    const vehicleInfo = [
        `${texts.vehicleReg}: ${(formData.get('vehicleReg') || '').replace(/[Ø=Þ›]/g, '').trim()}`,
        `${texts.odo}: ${(formData.get('odo') || '').replace(/[Ø=Þ›]/g, '').trim()}`,
        `${texts.trailerNo}: ${(formData.get('trailerno') || '').replace(/[Ø=Þ›]/g, '').trim()}`,
        `${texts.driverName}: ${(formData.get('driverName') || '').replace(/[Ø=Þ›]/g, '').trim()}`,
        `${texts.date}: ${(formData.get('checkDate') || '').replace(/[Ø=Þ›]/g, '').trim()}    ${texts.time}: ${(formData.get('checkTime') || '').replace(/[Ø=Þ›]/g, '').trim()}`
    ];
    vehicleInfo.forEach((line, index) => {
        pdf.text(line, margin + 5, yPosition + (index * 6) + 2);
    });
    pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, 32, 'S');
    yPosition += 37;

    // Daily Check Table
    pdf.setFontSize(12);
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text(texts.dailyCheck, margin + 2, yPosition + 6);
    yPosition += 10;

    const tableWidth = pageWidth - 2 * margin;
    const col1Width = tableWidth * 0.75;
    const rowHeight = 6;

    // Table Header
    pdf.setFillColor(40, 58, 91);
    pdf.rect(margin, yPosition, tableWidth, rowHeight, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(10);
    pdf.text(texts.checklistItem, margin + 2, yPosition + 4);
    pdf.text(texts.status, margin + col1Width + 2, yPosition + 4);
    yPosition += rowHeight;

    // Table Content
    pdf.setTextColor(40, 58, 91);
    const checklistRows = document.querySelectorAll('.checklist-table tbody tr');
    checklistRows.forEach((row, index) => {
        const checklistItem = row.querySelector('td:first-child').textContent
            .replace(/[Ø=Þ›]/g, '') // Remove unwanted characters
            .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '') // Remove non-printable characters
            .trim();
        const buttons = row.querySelectorAll('.status-button');
        let status = 'NOT CHECKED';

        buttons.forEach(button => {
            if (button.classList.contains('active-v')) status = 'PASS';
            else if (button.classList.contains('active-x')) status = 'FAULT';
        });

        // Alternating row colors
        if (index % 2 === 0) {
            pdf.setFillColor(245, 245, 245);
            pdf.rect(margin, yPosition, tableWidth, rowHeight, 'F');
        }

pdf.setTextColor(40, 58, 91);

        // Handle long text by wrapping
        const maxWidth = col1Width - 4;
        const itemLines = pdf.splitTextToSize(checklistItem, maxWidth);
        itemLines.forEach((line, lineIndex) => {
            pdf.text(line, margin + 2, yPosition + 4 + (lineIndex * 4));
        });

        if (status === 'PASS') {
            pdf.setTextColor(0, 128, 0);
        } else if (status === 'FAULT') {
            pdf.setTextColor(255, 0, 0);
        } else if (status === 'NOT CHECKED') {
            pdf.setTextColor(255, 165, 0); // Orange color for not checked
        }
        pdf.text(status, margin + col1Width + 2, yPosition + 4);
        pdf.setTextColor(40, 58, 91);

        // Draw table lines
        const actualRowHeight = Math.max(rowHeight, itemLines.length * 4 + 2);
        pdf.rect(margin, yPosition, tableWidth, actualRowHeight, 'S');
        pdf.line(margin + col1Width, yPosition, margin + col1Width, yPosition + actualRowHeight);

        yPosition += actualRowHeight;

        if (yPosition > 260) {
            pdf.addPage();
            yPosition = margin;
        }
    });

    yPosition += 10;

    // Defects Section
    if (yPosition > 240) {
        pdf.addPage();
        yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text(texts.defectsReported, margin + 2, yPosition + 6);
    yPosition += 12;

    pdf.setFontSize(10);
    const defects = (formData.get('defects') || 'None reported')
        .replace(/[Ø=Þ›]/g, '') // Remove unwanted characters
        .replace(/[^\x20-\x7E\u00A0-\u00FF]/g, '') // Remove non-printable characters
        .trim();
    const defectLines = pdf.splitTextToSize(defects, pageWidth - 2 * margin - 10);
    defectLines.forEach((line, index) => {
        pdf.text(line, margin + 5, yPosition + (index * 6) + 2);
    });
    pdf.rect(margin, yPosition - 2, pageWidth - 2 * margin, defectLines.length * 6 + 6, 'S');
    yPosition += defectLines.length * 6 + 12;

    // Signature Section
    if (yPosition > 220) {
        pdf.addPage();
        yPosition = margin;
    }

    pdf.setFontSize(12);
    pdf.setFillColor(232, 239, 247);
    pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
    pdf.text(texts.driverSignature, margin + 2, yPosition + 6);
    yPosition += 15;

    const canvas = document.getElementById('signatureCanvas');
    if (canvas) {
        const signature = canvas.toDataURL('image/png');
        pdf.addImage(signature, 'PNG', margin + 5, yPosition, 60, 20);
    }
    pdf.rect(margin, yPosition - 5, pageWidth - 2 * margin, 30, 'S');

    // Handle defect image
    const fileInput = document.getElementById('defectImage');
    if (fileInput && fileInput.files.length > 0) {
        const file = fileInput.files[0];
        const reader = new FileReader();

        reader.onload = function(e) {
            pdf.addPage();
            yPosition = margin;

            pdf.setFontSize(12);
            pdf.setFillColor(232, 239, 247);
            pdf.rect(margin, yPosition, pageWidth - 2 * margin, 8, 'F');
            pdf.text(texts.defectImage, margin + 2, yPosition + 6);
            yPosition += 15;

            const imgData = e.target.result;
            const imgProps = pdf.getImageProperties(imgData);
            const maxWidth = pageWidth - 2 * margin;
            const maxHeight = pdf.internal.pageSize.getHeight() - yPosition - margin;
            let imgWidth = imgProps.width;
            let imgHeight = imgProps.height;

            // Scale image to fit
            if (imgWidth > maxWidth) {
                imgHeight = (imgHeight * maxWidth) / imgWidth;
                imgWidth = maxWidth;
            }
            if (imgHeight > maxHeight) {
                imgWidth = (imgWidth * maxHeight) / imgHeight;
                imgHeight = maxHeight;
            }

            pdf.addImage(imgData, 'JPEG', margin, yPosition, imgWidth, imgHeight);
            addFooterAndSave();
        };
        reader.readAsDataURL(file);
    } else {
        addFooterAndSave();
    }

    function addFooterAndSave() {
        // Add footer
        const pageCount = pdf.internal.getNumberOfPages();
        for (let i = 1; i <= pageCount; i++) {
            pdf.setPage(i);
            pdf.setFontSize(8);
            pdf.setTextColor(100, 100, 100);
            pdf.text(`Page ${i} of ${pageCount}`, pageWidth - margin - 20, pdf.internal.pageSize.getHeight() - 5);
        }

        // Save PDF
        const languageSuffix = language === 'en' ? '' : `_${language.toUpperCase()}`;
        const fileName = `WalkAround_${formData.get('vehicleReg') || 'Checklist'}_${new Date().toISOString().split('T')[0]}${languageSuffix}.pdf`;
        pdf.save(fileName);
    }
}