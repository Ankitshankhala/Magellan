# HGV Driver Tools - Detailed Component Breakdown

## File Structure Overview

```
Magellan/
├── index.html              # Main application entry point
├── script.js               # Core application logic (5209 lines)
├── style.css               # Application styling (5785 lines)
├── vite.config.js          # Vite build configuration
├── package.json            # Project dependencies
├── auth.html               # Authentication page
├── login.html              # Login interface
├── landing.html            # Landing page
├── superadmin.html         # Admin interface
├── track.html              # GPS tracking interface
└── attached_assets/        # Static assets (images, documents)
```

## Core Application Components

### 1. Main Application Entry (`index.html`)

**Purpose**: Single Page Application container with modular section-based navigation

**Key Sections**:
```html
<!-- Navigation Header -->
<nav>
    <button class="nav-btn" onclick="showSection('converters')">Converters</button>
    <button class="nav-btn" onclick="showSection('checklist')">Walkaround Checklist</button>
    <button class="nav-btn" onclick="showSection('epod')">E-POD</button>
    <button class="nav-btn" onclick="showSection('delivery')">Delivery Note</button>
    <button class="nav-btn" onclick="showSection('gps-tracking')">GPS Tracking</button>
    <button class="nav-btn" onclick="showSection('document-wallet')">Document Wallet</button>
    <button class="nav-btn" onclick="showSection('moretools')">Get More Tools</button>
</nav>

<!-- Feature Sections -->
<section id="checklist" class="section tool-section">...</section>
<section id="epod" class="section tool-section">...</section>
<section id="gps-tracking" class="section tool-section">...</section>
<!-- Additional sections... -->
```

**External Dependencies**:
- jsPDF v2.5.1 (PDF generation)
- PDF-lib v1.17.1 (PDF manipulation)
- Google Fonts (Sora font family)

### 2. Core Application Logic (`script.js`)

**File Size**: 5209 lines of JavaScript
**Architecture**: Modular function-based organization

#### 2.1 Application Initialization

```javascript
// Global state variables
let currentLanguage = 'en';
let trackingActive = false;
let trackingId = null;
let loadedDocumentFile = null;
let placementCoordinates = { x: 70, y: 80 };
let documentScale = 1;
let placementMode = true;

// Main initialization
document.addEventListener('DOMContentLoaded', function() {
    console.log('HGV Driver Tools loaded successfully');
    
    // Initialize all modules
    autoPopulateDateTimeFields();
    initializeSignatureCanvas();
    initializeDeliveryForm();
    initializeGPSTracking();
    initializeGeofencing();
    initializeDocumentWallet();
    initializeEPOD();
    initializeConverters();
    initializeAIAssistant();
    initializeIncidentReport();
    initializeSectionImageUploads();
    
    // Load saved data
    loadProfile();
    loadArchiveData();
    initializeWeather();
    
    // Apply settings
    changeLanguage(currentLanguage);
    showSection('home');
});
```

#### 2.2 Navigation System

```javascript
function showSection(sectionId) {
    // Hide all sections
    const sections = document.querySelectorAll('.section');
    sections.forEach(section => section.style.display = 'none');
    
    // Show target section
    const targetSection = document.getElementById(sectionId);
    if (targetSection) {
        targetSection.style.display = 'block';
    }
    
    // Update navigation state
    updateBottomNavActive(sectionId);
}
```

#### 2.3 Internationalization (i18n)

```javascript
const translations = {
    en: {
        "nav-converters": "Converters",
        "nav-checklist": "Walkaround Checklist",
        "nav-epod": "E-POD",
        // ... 200+ translation keys
    },
    // Additional languages...
};

function changeLanguage(lang) {
    currentLanguage = lang;
    const elements = document.querySelectorAll('[data-translate]');
    elements.forEach(element => {
        const key = element.getAttribute('data-translate');
        if (translations[lang] && translations[lang][key]) {
            element.textContent = translations[lang][key];
        }
    });
}
```

## Feature Module Breakdown

### 3. Vehicle Inspection Checklist Module

**Purpose**: Digital walkaround inspection system with photo documentation

**Key Functions**:

#### 3.1 Checklist Form Management
```javascript
function generateChecklistPDF(event) {
    event.preventDefault();
    
    // Collect form data
    const formData = new FormData(event.target);
    const checklistData = {
        date: formData.get('checkDate'),
        vehicleReg: formData.get('vehicleReg'),
        driverName: formData.get('driverName'),
        sections: collectChecklistSections(),
        signature: getSignatureData(),
        timestamp: new Date().toISOString()
    };
    
    // Generate PDF report
    generateWalkaroundPDF(checklistData);
}
```

#### 3.2 Photo Capture System
```javascript
function handleSectionImageUpload(event, sectionNumber) {
    const file = event.target.files[0];
    if (file && file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(e) {
            addCapturedImageToSection(sectionNumber, file, e.target.result);
        };
        reader.readAsDataURL(file);
    }
}

function capturePhoto(sectionNumber) {
    const video = document.getElementById(`camera-${sectionNumber}`);
    const canvas = document.getElementById(`canvas-${sectionNumber}`);
    const context = canvas.getContext('2d');
    
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    context.drawImage(video, 0, 0);
    
    const dataURL = canvas.toDataURL('image/jpeg');
    const file = dataURLToFile(dataURL, `photo_${Date.now()}.jpg`);
    
    addCapturedImageToSection(sectionNumber, file, dataURL);
    stopCamera(sectionNumber);
}
```

#### 3.3 Signature Capture
```javascript
function initializeSignatureCanvas() {
    const canvas = document.getElementById('signatureCanvas');
    const ctx = canvas.getContext('2d');
    let isDrawing = false;
    
    function startDrawing(e) {
        isDrawing = true;
        draw(e);
    }
    
    function draw(e) {
        if (!isDrawing) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ctx.lineWidth = 2;
        ctx.lineCap = 'round';
        ctx.strokeStyle = '#000';
        
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(x, y);
    }
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', () => isDrawing = false);
    canvas.addEventListener('mouseout', () => isDrawing = false);
}
```

### 4. E-POD (Electronic Proof of Delivery) Module

**Purpose**: Digital delivery confirmation with document overlay capabilities

**Key Functions**:

#### 4.1 PDF Document Processing
```javascript
async function loadEPODPDF() {
    const fileInput = document.getElementById('epod-pdf-upload');
    const file = fileInput.files[0];
    
    if (file && file.type === 'application/pdf') {
        try {
            const arrayBuffer = await file.arrayBuffer();
            const pdfDoc = await PDFLib.PDFDocument.load(arrayBuffer);
            const pages = pdfDoc.getPages();
            
            // Display first page preview
            const canvas = document.getElementById('epod-preview-canvas');
            const ctx = canvas.getContext('2d');
            
            // Render PDF page to canvas
            const page = pages[0];
            const viewport = page.getSize();
            
            canvas.width = viewport.width;
            canvas.height = viewport.height;
            
            // Store PDF for later processing
            loadedDocumentFile = {
                doc: pdfDoc,
                file: file,
                pages: pages
            };
            
        } catch (error) {
            console.error('Error loading PDF:', error);
            alert('Error loading PDF file');
        }
    }
}
```

#### 4.2 Signature Placement System
```javascript
function setupCanvasClickHandler() {
    const canvas = document.getElementById('epod-preview-canvas');
    const ctx = canvas.getContext('2d');
    
    canvas.addEventListener('click', function(e) {
        if (!placementMode) return;
        
        const rect = canvas.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        placementCoordinates = { x, y };
        updatePlacementIndicators();
    });
}

function applyEPODSignature() {
    if (!loadedDocumentFile || !signatureData) {
        alert('Please load a PDF and capture a signature first');
        return;
    }
    
    const { doc, pages } = loadedDocumentFile;
    const page = pages[0];
    
    // Convert signature to PDF image
    const signatureImage = await PDFLib.PDFImage.fromDataUrl(signatureData);
    
    // Calculate placement coordinates
    const { width, height } = page.getSize();
    const x = (placementCoordinates.x / canvas.width) * width;
    const y = height - (placementCoordinates.y / canvas.height) * height;
    
    // Add signature to PDF
    page.drawImage(signatureImage, {
        x: x - 50,
        y: y - 25,
        width: 100,
        height: 50
    });
    
    // Save modified PDF
    const pdfBytes = await doc.save();
    downloadPDF(pdfBytes, 'signed_epod.pdf');
}
```

### 5. GPS Tracking & Geofencing Module

**Purpose**: Real-time location tracking with geofence monitoring

**Key Functions**:

#### 5.1 GPS Tracking System
```javascript
function startTracking() {
    if (!navigator.geolocation) {
        alert('GPS not available on this device');
        return;
    }
    
    trackingId = 'track_' + Date.now();
    trackingActive = true;
    
    const options = {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
    };
    
    navigator.geolocation.watchPosition(
        function(position) {
            currentPosition = position;
            
            const locationData = {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude,
                accuracy: position.coords.accuracy,
                timestamp: new Date().toISOString(),
                position: position
            };
            
            // Store location data
            localStorage.setItem(`tracking_${trackingId}`, JSON.stringify(locationData));
            
            // Update display
            updateLocationDisplay(locationData);
            
            // Check geofences
            checkGeofences(position);
        },
        function(error) {
            console.error('GPS Error:', error);
            alert('GPS tracking error: ' + error.message);
        },
        options
    );
}
```

#### 5.2 Geofencing System
```javascript
// Geofence data structure
let geofences = JSON.parse(localStorage.getItem('geofences') || '[]');
let geofenceEvents = JSON.parse(localStorage.getItem('geofenceEvents') || '[]');

function createGeofence() {
    if (!trackingActive || !currentPosition) {
        alert('GPS tracking must be active to create a geofence');
        return;
    }
    
    const name = document.getElementById('geofenceName').value.trim();
    const type = document.getElementById('geofenceType').value;
    const radius = parseInt(document.getElementById('geofenceRadius').value);
    
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
        notifyMinutesBefore: 5
    };
    
    geofences.push(geofence);
    localStorage.setItem('geofences', JSON.stringify(geofences));
    
    updateGeofencesList();
    alert(`Geofence "${name}" created successfully!`);
}

function checkGeofences(position) {
    geofences.forEach(fence => {
        if (!fence.enabled) return;
        
        const distance = calculateDistance(
            position.coords.latitude,
            position.coords.longitude,
            fence.latitude,
            fence.longitude
        );
        
        if (distance <= fence.radius) {
            // Inside geofence
            triggerGeofenceNotification('enter', fence);
            logGeofenceEvent('enter', fence, distance);
        } else if (distance > fence.radius + 50) {
            // Outside geofence (with buffer)
            triggerGeofenceNotification('exit', fence);
            logGeofenceEvent('exit', fence, distance);
        }
    });
}
```

### 6. Document Wallet Module

**Purpose**: Centralized document management system

**Key Functions**:

#### 6.1 Document Upload & Storage
```javascript
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    
    const reader = new FileReader();
    reader.onload = function(e) {
        const documentData = {
            name: file.name,
            type: file.type,
            size: file.size,
            uploadDate: new Date().toISOString(),
            data: e.target.result,
            category: getSelectedCategory(),
            tags: getDocumentTags()
        };
        
        // Store in localStorage
        const documents = JSON.parse(localStorage.getItem('documents') || '[]');
        documents.push(documentData);
        localStorage.setItem('documents', JSON.stringify(documents));
        
        updateDocumentList();
    };
    
    reader.readAsDataURL(file);
}
```

#### 6.2 Document Search & Filtering
```javascript
function filterDocuments() {
    const searchTerm = document.getElementById('documentSearch').value.toLowerCase();
    const categoryFilter = document.getElementById('categoryFilter').value;
    const documents = JSON.parse(localStorage.getItem('documents') || '[]');
    
    const filtered = documents.filter(doc => {
        const matchesSearch = doc.name.toLowerCase().includes(searchTerm) ||
                             doc.tags.some(tag => tag.toLowerCase().includes(searchTerm));
        const matchesCategory = categoryFilter === 'all' || doc.category === categoryFilter;
        
        return matchesSearch && matchesCategory;
    });
    
    displayFilteredDocuments(filtered);
}
```

### 7. Unit Converters Module

**Purpose**: Comprehensive unit conversion tools for logistics operations

**Key Functions**:

#### 7.1 Currency Conversion
```javascript
function convertCurrency() {
    const amount = parseFloat(document.getElementById('currency-amount').value);
    const fromCurrency = document.getElementById('currency-from').value;
    const toCurrency = document.getElementById('currency-to').value;
    
    // Exchange rates (mock data - would use real API in production)
    const rates = {
        'GBP': { 'EUR': 1.17, 'USD': 1.35 },
        'EUR': { 'GBP': 0.85, 'USD': 1.15 },
        'USD': { 'GBP': 0.74, 'EUR': 0.87 }
    };
    
    let result;
    if (fromCurrency === toCurrency) {
        result = amount;
    } else if (rates[fromCurrency] && rates[fromCurrency][toCurrency]) {
        result = amount * rates[fromCurrency][toCurrency];
    } else {
        result = amount * (1 / rates[toCurrency][fromCurrency]);
    }
    
    document.getElementById('currency-result').textContent = 
        `${amount} ${fromCurrency} = ${result.toFixed(2)} ${toCurrency}`;
}
```

#### 7.2 Load Calculator (HGV Specific)
```javascript
function convertLoad() {
    const weight = parseFloat(document.getElementById('load-weight').value);
    const unit = document.getElementById('load-unit').value;
    const vehicleType = document.getElementById('vehicle-type').value;
    
    // HGV weight limits (UK regulations)
    const limits = {
        'rigid': { maxWeight: 32, unit: 'tonnes' },
        'articulated': { maxWeight: 44, unit: 'tonnes' },
        'drawbar': { maxWeight: 44, unit: 'tonnes' }
    };
    
    const limit = limits[vehicleType];
    const weightInTonnes = convertToTonnes(weight, unit);
    
    const percentage = (weightInTonnes / limit.maxWeight) * 100;
    const remaining = limit.maxWeight - weightInTonnes;
    
    document.getElementById('load-result').innerHTML = `
        <p>Current Load: ${weightInTonnes.toFixed(2)} tonnes</p>
        <p>Maximum Allowable: ${limit.maxWeight} tonnes</p>
        <p>Load Percentage: ${percentage.toFixed(1)}%</p>
        <p>Remaining Capacity: ${remaining.toFixed(2)} tonnes</p>
        <p class="${percentage > 90 ? 'warning' : ''}">${percentage > 100 ? 'OVERLOADED!' : ''}</p>
    `;
}
```

### 8. AI Assistant Module

**Purpose**: Mock AI assistant for driver support and guidance

**Key Functions**:

#### 8.1 Response Generation
```javascript
function generateAIResponse(message) {
    const lowerMessage = message.toLowerCase();
    
    // Context-aware response patterns
    const responses = {
        'breakdown': [
            'For vehicle breakdowns, please contact your breakdown service immediately.',
            'Ensure you\'re in a safe location and use hazard lights.',
            'Document the incident with photos and notes.'
        ],
        'hours': [
            'EU driving regulations: Maximum 9 hours driving per day, 56 hours per week.',
            'You must take a 45-minute break after 4.5 hours of driving.',
            'Weekly rest: 45 hours minimum, can be reduced to 24 hours once per week.'
        ],
        'weather': [
            'Check current weather conditions before starting your journey.',
            'Reduce speed in adverse weather conditions.',
            'Consider route alternatives if weather is severe.'
        ],
        'maintenance': [
            'Perform daily walkaround checks before each journey.',
            'Report any defects immediately to your transport manager.',
            'Keep maintenance records up to date.'
        ]
    };
    
    // Find matching response category
    for (const [category, responseList] of Object.entries(responses)) {
        if (lowerMessage.includes(category)) {
            return responseList[Math.floor(Math.random() * responseList.length)];
        }
    }
    
    // Default response
    return 'I\'m here to help with HGV-related questions. Ask me about breakdowns, driving hours, weather, or maintenance.';
}
```

### 9. Weather Widget Module

**Purpose**: Real-time weather information for route planning

**Key Functions**:

#### 9.1 Weather Data Fetching
```javascript
async function fetchWeatherData(lat, lon) {
    try {
        // OpenWeatherMap API (mock implementation)
        const apiKey = 'your_api_key_here';
        const url = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}&units=metric`;
        
        const response = await fetch(url);
        const data = await response.json();
        
        return {
            temperature: Math.round(data.main.temp),
            condition: data.weather[0].main,
            description: data.weather[0].description,
            humidity: data.main.humidity,
            windSpeed: data.wind.speed,
            location: await getLocationName(lat, lon)
        };
    } catch (error) {
        console.error('Weather API error:', error);
        return useDefaultWeatherData();
    }
}
```

#### 9.2 Weather Display Updates
```javascript
function updateWeatherWidget() {
    if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
            async function(position) {
                const weatherData = await fetchWeatherData(
                    position.coords.latitude,
                    position.coords.longitude
                );
                
                updateWeatherDisplay(
                    weatherData.temperature,
                    weatherData.condition,
                    weatherData.location,
                    getWeatherIcon(weatherData.condition)
                );
            },
            function(error) {
                console.error('Location error:', error);
                updateWeatherDisplay('--', 'Unknown', 'Location unavailable', '❓');
            }
        );
    }
}
```

## Data Flow Patterns

### 1. Form Data Processing
```
User Input → Form Validation → Data Collection → localStorage Storage → PDF Generation → Export
```

### 2. GPS Data Flow
```
GPS API → Location Processing → Geofence Checking → Event Logging → Display Update → Data Storage
```

### 3. Document Management
```
File Upload → Type Validation → Data Conversion → Metadata Extraction → Storage → Search Indexing
```

### 4. PDF Generation Pipeline
```
Form Data + Images + Signatures → PDF Assembly → Layout Processing → Final PDF → Download/Email
```

## Performance Optimizations

### 1. Memory Management
- Efficient localStorage operations with data compression
- Image optimization before storage
- Cleanup of temporary data

### 2. GPS Optimization
- Debounced location updates (60-second intervals)
- Battery-efficient tracking modes
- Intelligent geofence monitoring

### 3. PDF Processing
- Asynchronous PDF generation
- Progressive loading for large documents
- Memory cleanup after processing

## Error Handling

### 1. GPS Errors
```javascript
function handleGPSError(error) {
    switch(error.code) {
        case error.PERMISSION_DENIED:
            alert('GPS permission denied. Please enable location services.');
            break;
        case error.POSITION_UNAVAILABLE:
            alert('Location information unavailable.');
            break;
        case error.TIMEOUT:
            alert('GPS request timed out.');
            break;
        default:
            alert('GPS error occurred.');
    }
}
```

### 2. File Upload Errors
```javascript
function handleFileUploadError(error, file) {
    if (file.size > 10 * 1024 * 1024) { // 10MB limit
        alert('File too large. Maximum size is 10MB.');
        return;
    }
    
    if (!file.type.match(/^(image\/|application\/pdf)/)) {
        alert('Invalid file type. Please upload images or PDFs only.');
        return;
    }
    
    console.error('File upload error:', error);
    alert('Error uploading file. Please try again.');
}
```

## Security Considerations

### 1. Data Privacy
- Local storage only (no external data transmission)
- User consent for GPS and camera access
- Secure file handling

### 2. Input Validation
- File type and size validation
- GPS coordinate validation
- Form data sanitization

### 3. Session Management
- Automatic logout after 24 hours
- Secure data export/import
- Local data encryption (planned)

This comprehensive component breakdown provides a detailed view of how each module functions within the HGV Driver Tools application, showing the specific implementation details, data flows, and integration points between different components.

