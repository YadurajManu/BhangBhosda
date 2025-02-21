// Initialize Gemini API with healthcare context
const GEMINI_API_KEY = 'AIzaSyCb_r1ACnT40Goh_f4WmmdU8r7WKj2dHm8';

// Healthcare-specific context and responses
const HEALTHCARE_CONTEXT = {
    greeting: "Hello! I'm AIयुष's medical assistant. How can I help you with your healthcare needs today?",
    topics: {
        symptoms: "I can help you understand your symptoms and suggest when to see a doctor.",
        appointments: "I can assist you with booking appointments and finding specialists.",
        services: "I can provide information about our medical services and AI-powered diagnostics.",
        emergency: "For medical emergencies, please call emergency services immediately at 100 or contact our helpline."
    }
};

// Chat UI Elements
let chatContainer = null;
let chatMessages = null;
let chatInput = null;

// Initialize Chat UI with healthcare focus
function initializeChatbot() {
    const chatHTML = `
        <div id="chat-container" class="chat-container">
            <div class="chat-header">
                <h3><i class="bi bi-heart-pulse"></i> AIयुष Medical Assistant</h3>
                <button class="close-chat" onclick="toggleChat()">×</button>
            </div>
            <div id="chat-messages" class="chat-messages"></div>
            <div class="chat-input-container">
                <input type="text" id="chat-input" placeholder="Ask about your health concerns...">
                <button onclick="sendMessage()">
                    <i class="bi bi-send"></i>
                </button>
            </div>
        </div>
        <button id="chat-trigger" class="chat-trigger" onclick="toggleChat()">
            <i class="bi bi-heart-pulse"></i>
        </button>
    `;

    document.body.insertAdjacentHTML('beforeend', chatHTML);
    
    chatContainer = document.getElementById('chat-container');
    chatMessages = document.getElementById('chat-messages');
    chatInput = document.getElementById('chat-input');

    chatInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Add initial healthcare greeting
    addMessage('bot', HEALTHCARE_CONTEXT.greeting);
}

// Toggle chat visibility
function toggleChat() {
    chatContainer.classList.toggle('active');
}

// Enhanced message processing for healthcare context
async function processHealthcareQuery(message) {
    // Prepare healthcare-specific context for the API
    const context = `
        You are AIयुष's medical assistant, an AI designed to help with healthcare queries.
        Key capabilities:
        - Understand symptoms and provide general health guidance
        - Help schedule medical appointments
        - Provide information about AIयुष's medical services
        - Direct emergency cases to proper medical authorities
        - Explain AI-powered diagnostic services
        
        Important rules:
        1. Never provide specific medical diagnosis
        2. Always recommend consulting a doctor for serious concerns
        3. Direct emergencies to emergency services
        4. Keep responses focused on healthcare
        5. Be empathetic and professional
        
        User query: ${message}
    `;

    try {
        const response = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: context
                    }]
                }]
            })
        });

        const data = await response.json();
        return data.candidates[0].content.parts[0].text;
    } catch (error) {
        console.error('Error:', error);
        return "I apologize, but I'm having trouble processing your request. For immediate medical concerns, please contact our helpline at +91 9639585170.";
    }
}

// Enhanced message sending with healthcare focus
async function sendMessage() {
    const message = chatInput.value.trim();
    if (!message) return;

    // Add user message to chat
    addMessage('user', message);
    chatInput.value = '';

    // Show typing indicator
    const typingDiv = document.createElement('div');
    typingDiv.className = 'typing-indicator';
    typingDiv.innerHTML = 'AI Assistant is thinking...';
    chatMessages.appendChild(typingDiv);

    try {
        // Process message with healthcare context
        const response = await processHealthcareQuery(message);
        
        // Remove typing indicator
        typingDiv.remove();

        // Add bot response to chat
        addMessage('bot', response);
    } catch (error) {
        console.error('Error:', error);
        typingDiv.remove();
        addMessage('bot', 'I apologize, but I encountered an error. For immediate assistance, please contact our helpline.');
    }
}

// Enhanced message display with healthcare styling
function addMessage(sender, text) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `chat-message ${sender}-message`;
    
    // Add appropriate icon based on sender
    const icon = sender === 'bot' ? 'bi-heart-pulse' : 'bi-person';
    
    messageDiv.innerHTML = `
        <div class="message-content">
            <i class="bi ${icon} message-icon"></i>
            <div class="message-text">${text}</div>
        </div>
    `;
    
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;
}

// Initialize chatbot when DOM is loaded
document.addEventListener('DOMContentLoaded', initializeChatbot);

// Contact Form Handling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize FAQ accordion
    const faqs = [
        {
            question: "How can I schedule an appointment?",
            answer: "You can schedule an appointment through our online booking system, mobile app, or by calling our helpline at +91 9639585170."
        },
        {
            question: "What services do you offer?",
            answer: "We offer various AI-powered medical services including brain tumor detection, retinal analysis, lung cancer detection, and comprehensive patient management."
        },
        {
            question: "How accurate are your AI diagnostics?",
            answer: "Our AI models achieve 98% accuracy in medical diagnostics, backed by extensive testing and validation by medical professionals."
        },
        {
            question: "Is my medical data secure?",
            answer: "Yes, we implement state-of-the-art security measures and comply with healthcare data protection regulations to ensure your information is safe."
        }
    ];

    // Populate FAQ accordion
    const faqAccordion = document.getElementById('faqAccordion');
    faqs.forEach((faq, index) => {
        faqAccordion.innerHTML += `
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button ${index === 0 ? '' : 'collapsed'}" type="button" data-bs-toggle="collapse" data-bs-target="#faq${index}">
                        ${faq.question}
                    </button>
                </h2>
                <div id="faq${index}" class="accordion-collapse collapse ${index === 0 ? 'show' : ''}" data-bs-parent="#faqAccordion">
                    <div class="accordion-body">
                        ${faq.answer}
                    </div>
                </div>
            </div>
        `;
    });

    // Form validation and submission
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', async function(e) {
            e.preventDefault();

            const submitBtn = this.querySelector('.btn-submit');
            const originalBtnText = submitBtn.innerHTML;
            
            // Show loading state
            submitBtn.innerHTML = `
                <span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span>
                Sending...
            `;
            submitBtn.disabled = true;

            try {
                // Simulate form submission
                await new Promise(resolve => setTimeout(resolve, 2000));

                // Show success message
                Swal.fire({
                    icon: 'success',
                    title: 'Message Sent!',
                    text: 'We will get back to you soon.',
                    confirmButtonColor: '#0d6efd'
                });

                // Reset form
                contactForm.reset();
            } catch (error) {
                Swal.fire({
                    icon: 'error',
                    title: 'Oops...',
                    text: 'Something went wrong! Please try again.',
                    confirmButtonColor: '#0d6efd'
                });
            } finally {
                // Restore button state
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            }
        });
    }

    // Add floating labels animation
    const formControls = document.querySelectorAll('.form-control, .form-select');
    formControls.forEach(control => {
        control.addEventListener('focus', () => {
            control.parentElement.classList.add('focused');
        });
        control.addEventListener('blur', () => {
            if (!control.value) {
                control.parentElement.classList.remove('focused');
            }
        });
    });
}); 