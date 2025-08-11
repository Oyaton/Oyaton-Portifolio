const { app } = require('@azure/functions');

// Contact form submission handler
app.http('contactForm', {
    methods: ['POST'],
    authLevel: 'anonymous',
    handler: async (request, context) => {
        context.log('Contact form submission received');
        
        try {
            const body = await request.json();
            const { name, email, subject, message } = body;
            
            // Validate required fields
            if (!name || !email || !message) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Name, email, and message are required fields.'
                    })
                };
            }
            
            // Validate email format
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            if (!emailRegex.test(email)) {
                return {
                    status: 400,
                    headers: {
                        'Content-Type': 'application/json',
                        'Access-Control-Allow-Origin': '*',
                        'Access-Control-Allow-Methods': 'POST, OPTIONS',
                        'Access-Control-Allow-Headers': 'Content-Type'
                    },
                    body: JSON.stringify({
                        success: false,
                        error: 'Please provide a valid email address.'
                    })
                };
            }
            
            // Log the contact form data (in production, you'd save to database or send email)
            context.log('Contact form data:', {
                name,
                email,
                subject: subject || 'No subject',
                message,
                timestamp: new Date().toISOString()
            });
            
            // Return success response
            return {
                status: 200,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    success: true,
                    message: 'Thank you for your message! I will get back to you soon.'
                })
            };
            
        } catch (error) {
            context.log('Error processing contact form:', error);
            return {
                status: 500,
                headers: {
                    'Content-Type': 'application/json',
                    'Access-Control-Allow-Origin': '*',
                    'Access-Control-Allow-Methods': 'POST, OPTIONS',
                    'Access-Control-Allow-Headers': 'Content-Type'
                },
                body: JSON.stringify({
                    success: false,
                    error: 'An error occurred while processing your message. Please try again.'
                })
            };
        }
    }
});

// Handle CORS preflight requests
app.http('contactFormOptions', {
    methods: ['OPTIONS'],
    authLevel: 'anonymous',
    route: 'contactForm',
    handler: async (request, context) => {
        return {
            status: 200,
            headers: {
                'Access-Control-Allow-Origin': '*',
                'Access-Control-Allow-Methods': 'POST, OPTIONS',
                'Access-Control-Allow-Headers': 'Content-Type'
            }
        };
    }
});
