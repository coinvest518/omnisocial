export type TemplateInput = {
    id: string;
    label: string;
    placeholder: string;
    type: "text" | "textarea" | "select";
    options?: string[];
};

export type Template = {
    id: string;
    title: string;
    description: string;
    command: string;
    inputs: TemplateInput[];
    icon: any;
    categories: string[];
    content?: string;
    createdAt?: Date;
};

export const TEMPLATES: Template[] = [
    {
        "id": "a6dc-0f21-c102-6c22",
        "title": "Amazon Product Description (paragraph)",
        "description": "Create compelling product descriptions for Amazon listings.",
        "command": "Create compelling product descriptions for Amazon listings.",
        "icon": `<i class="fab fa-aws text-primary"></i>`,
        "categories": ["ecommerce", "ads"],
        inputs: [
            {
                id: "product-name",
                label: "Product Name",
                placeholder: "A red t-shirt",
                type: "text",
            },
            {
                id: "key-features",
                label: "Key Features/Benefits",
                placeholder: "Stretching, pleasant",
                type: "textarea",
            },
            {
                id: "tone-of-voice",
                label: "Tone of Voice",
                placeholder: "Select a tone. For example: Witty, Friendly, Disappointed, Polite, Creative, Professional or a known person such as Michael Jordan",
                type: "text",
            },
        ]
    },
    {
        "id": "3b9e-c357-63fb-f7cb",
        "title": "Amazon Product Features (bullets)",
        "description": "Create key feature and benefit bullet points for Amazon listings under the 'about this item' section.",
        "command": "Create key feature and benefit bullet points for Amazon listings under the 'about this item' section.",
        "icon": `<i class="fab fa-aws text-primary"></i>`,
        "categories": ["ecommerce", "ads"],
        "inputs": [
            {
                "id": "product-name",
                "label": "Product Name",
                "placeholder": "EcoBoost Portable Solar Charger",
                "type": "text"
            },
            {
                "id": "product-info",
                "label": "Product Info",
                "placeholder": "EcoBoost Portable Solar Charger - Compact, Lightweight, and Waterproof - Perfect for Camping, Hiking, and Emergency Preparedness - Compatible with Smartphones, Tablets, and USB Devices",
                "type": "textarea"
            },
            {
                "id": "product-benefits",
                "label": "Key Benefits/Features",
                "placeholder": "Lightweight design. Waterproof & Durable. Fast charging. Universal compatibility. Environmentally friendly.",
                "type": "text"
            },
            {
                "id": "tone-of-voice",
                "label": "Tone of Voice",
                "placeholder": "Professional. Friendly. Funny.",
                "type": "text"
            }
        ]
    },
    {
        "id": "a1e2-3f4g-5h6i-7j8k",
        "title": "Product Titles",
        "description": "Generate catchy and relevant product titles for your listings.",
        "command": "Generate a catchy product title.",
        "icon": `<i class="fab fa-aws text-primary"></i>`,
        "categories": ["ecommerce"],
        "inputs": [
            {
                id: "product-description",
                label: "Product Description",
                placeholder: "A high-quality, eco-friendly backpack.",
                type: "text",
            },
            {
                id: "target-audience",
                label: "Target Audience",
                placeholder: "Outdoor enthusiasts, students, travelers",
                type: "text",
            },
        ]
    },
    {
        "id": "b2e3-4f5g-6h7i-8j9k",
        "title": "Product Benefits",
        "description": "Outline the key benefits of your product.",
        "command": "List the benefits of the product.",
        "icon": `<i class="fab fa-aws text-primary"></i>`,
        "categories": ["ecommerce"],
        "inputs": [
            {
                id: "product-name",
                label: "Product Name",
                placeholder: "Eco-Friendly Backpack",
                type: "text",
            },
            {
                id: "benefits",
                label: "Key Benefits",
                placeholder: "Durable, Lightweight, Water-resistant",
                type: "textarea",
            },
        ]
    },

    {
        "id": "5df5-5b3a-d3a7-1610",
        "title": "Blog Post Conclusion Paragraph",
        "description": "Wrap up your blog posts with an engaging conclusion paragraph.",
        "command": "Wrap up your blog posts with an engaging conclusion paragraph.",
        "icon": `<i class="fas fa-fire text-primary"></i>`,
        "categories": ["blog", "seo"],
        "inputs": [
            {
                "id": "blogPostMainPoints",
                "label": "What are the main points or outline of your blog post?",
                "placeholder": "The importance of time management. Tips for better time management. Benefits of effective time management.",
                "type": "textarea"
            },
            {
                "id": "cta",
                "label": "Call to action",
                "placeholder": "Share your time management tips with us in the comments below!",
                "type": "text"
            },
            {
                "id": "tone",
                "label": "Tone of voice",
                "placeholder": "Motivational",
                "type": "text"
            }
        ]
    },
    {
        "id": "c3e4-5f6g-7h8i-9j0k",
        "title": "SEO-Optimized Headings",
        "description": "Create SEO-friendly headings for your blog posts.",
        "command": "Generate SEO-optimized headings.",
        "icon": `<i class="fas fa-fire text-primary"></i>`,
        "categories": ["blog", "seo"],
        "inputs": [
            {
                id: "blog-topic",
                label: "Blog Topic",
                placeholder: "The benefits of remote work",
                type: "text",
            },
            {
                id: "keywords",
                label: "Keywords",
                placeholder: "remote work, productivity, flexibility",
                type: "textarea",
            },
        ]
    },
    {
        "id": "8d27-85d1-d2bb-f6d8",
        "title": "Blog Post Intro Paragraph",
        "description": "Write an engaging opening paragraph for your blog post.",
        "command": "Write an engaging opening paragraph for your blog post.",
        "icon": `<i class="fas fa-fire text-primary"></i>`,
        "categories": ["blog", "seo"],
        "inputs": [
            {
                "id": "blogPostTitle",
                "label": "Blog post title",
                "placeholder": "Creative Ways to Save Money on a Tight Budget",
                "type": "text"
            },
            {
                "id": "audience",
                "label": "Audience",
                "placeholder": "Young professionals, Students, Budget-conscious individuals",
                "type": "text"
            },
            {
                "id": "tone",
                "label": "Tone of voice",
                "placeholder": "Informative, Friendly, Encouraging",
                "type": "text"
            }
        ]
    },
    {
        "id": "d4e5-6f7g-8h9i-0j1k",
        "title": "Content Research Framework",
        "description": "Outline a framework for conducting content research.",
        "command": "Create a content research framework.",
        "icon": `<i class="fas fa-book-open text-primary"></i>`,
        "categories": ["blog", "content"],
        "inputs": [
            {
                id: "research-topic",
                label: "Research Topic",
                placeholder: "Sustainable living practices",
                type: "text",
            },
            {
                id: "sources",
                label: "Sources to Explore",
                placeholder: "Blogs, Academic Journals, News Articles",
                type: "textarea",
            },
        ]
    },
    {
        "id": "eb38-d6a3-3b3c-d790",
        "title": "Blog Post Outline",
        "description": "Create lists and outlines for articles, for example for 'How to' style blog posts and articles.",
        "command": "Create lists and outlines for an article: ",
        "icon": `<i class="fas fa-fire text-primary"></i>`,
        "categories": ["blog", "seo"],
        "inputs": [
            {
                "id": "title",
                "label": "Blog post title/topic",
                "placeholder": "Top 10 Remote Work Tools for Increased Productivity",
                "type": "text"
            },
            {
                "id": "tone",
                "label": "Tone of voice",
                "placeholder": "Informative, Relaxed, Helpful",
                "type": "text"
            }
        ]
    },

    {
        "id": "f4b4-4dc9-38e4-4714",
        "title": "Blog Post Topic Ideas",
        "description": "Generate new blog post topics that will engage readers and rank well on Google.",
        "command": "Generate new blog post topics that will engage readers and rank well on Google.",
        "icon": `<i class="fas fa-fire text-primary"></i>`,
        "categories": ["blog", "seo", "google"],
        "inputs": [
            {
                "id": "brandName",
                "label": "Brand name",
                "placeholder": "Eco Warrior",
                "type": "text"
            },
            {
                "id": "productDescription",
                "label": "Product description",
                "placeholder": "Eco-friendly products for a sustainable lifestyle, including reusable bags, water bottles, and home cleaning solutions.",
                "type": "textarea"
            },
            {
                "id": "audience",
                "label": "Audience",
                "placeholder": "Eco-conscious consumers, Sustainability advocates, Homeowners",
                "type": "text"
            },
            {
                "id": "tone",
                "label": "Tone of voice",
                "placeholder": "Informative, Friendly, Encouraging",
                "type": "text"
            }
        ]
    },
    {
        "id": "a0c6-7112-e2d8-07e9",
        "title": "Business or Product Name",
        "description": "Generate a winning name for your business or product.",
        "command": "Generate a winning name for your business or product.",
        "icon": "<i class='fas fa-lightbulb text-primary' ></i>",
        "categories": ["marketing"],
        "inputs": [
            {
                "id": "form-field-description",
                "type": "textarea",
                "label": "Tell us about your business or product",
                "placeholder": "Innovative online marketplace connecting local service providers and customers.",
            },
            {
                "id": "form-field-keywords",
                "type": "text",
                "label": "Keywords to include",
                "placeholder": "ninja",
            }
        ]
    },

    {
        "id": "e5f6-7g8h-9i0j-1k2l",
        "title": "Unique Value Proposition",
        "description": "Define your unique value proposition clearly.",
        "command": "Create a unique value proposition.",
        "icon": `<i class="fas fa-bullseye text-primary"></i>`,
        "categories": ["marketing"],
        "inputs": [
            {
                id: "product-name",
                label: "Product Name",
                placeholder: "Eco-Friendly Cleaning Products",
                type: "text",
            },
            {
                id: "value-proposition",
                label: "Value Proposition",
                placeholder: "Safe for the environment, effective cleaning.",
                type: "textarea",
            },
        ]
    },
    {
        "id": "ab91-6218-4ed4-4374",
        "title": "Commands",
        "description": "Tell Jema.ai exactly what to write with a command.",
        "command": "Please do the following: ",
        "icon": "<i class='fas fa-terminal  text-primary'></i>",
        "categories": ["all", "google"],
        "inputs": [
            {
                "id": "form-field-command",
                "type": "textarea",
                "label": "Your command",
                "placeholder": "Write a creative story about Tobby flying to the moon in Matthew McConaughey's tone of voice",
            },
            {
                "id": "form-field-content",
                "type": "textarea",
                "label": "Background information",
                "placeholder": "Tobby was a happy dog that loved to sneak around eating people's food",
            }
        ]
    },
    {
        "id": "2f67-d52f-fc58-383d",
        "title": "Creative Story",
        "description": "Write creative stories to engage readers.",
        "command": "Write a creative story ",
        "icon": "<i class='fas fa-book-open text-primary'></i>",
        "categories": ["blog", "website"],
        "inputs": [
            {
                "id": "storyPlot",
                "type": "textarea",
                "label": "Plot",
                "placeholder": "A magical kingdom faces a drought that threatens its existence. The king sends a brave knight on a quest to find a legendary water source.",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Whimsical",
            }
        ]
    },

    {
        "id": "f6g7-8h9i-0j1k-2l3m",
        "title": "Email Body Template",
        "description": "Craft a professional email body for outreach.",
        "command": "Write an email body for outreach.",
        "icon": `<i class="fas fa-envelope text-primary"></i>`,
        "categories": ["marketing", "email"],
        "inputs": [
            {
                id: "recipient-name",
                label: "Recipient Name",
                placeholder: "John Doe",
                type: "text",
            },
            {
                id: "email-content",
                label: "Email Content",
                placeholder: "I hope this message finds you well...",
                type: "textarea",
            },
        ]
    },
    {
        "id": "1a79-8d7e-cc88-1e61",
        "title": "Email Subject Lines",
        "description": "Get your emails opened with irresistible subject lines.",
        "command": "Write Email Subject Lines. use the following : ",
        "icon": "<i class='fas fa-envelope text-primary'></i>",
        "categories": ["email", "marketing"],
        "inputs": [
            {
                "id": "companyName",
                "type": "text",
                "label": "Company/Product Name",
                "placeholder": "SmartMailer",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Friendly",
            },
            {
                "id": "emailContent",
                "type": "textarea",
                "label": "What is your email about?",
                "placeholder": "Introducing our latest online course on email marketing strategies. Early bird sign-ups get a 25% discount.",
            }
        ]
    },
    {
        "id": "72e8-66f6-1009-9e54",
        "title": "Company Bio",
        "description": "Share your company's story with a compelling bio.",
        "command": "Create a compelling bio for the following company. ",
        "icon": "<i class='fas fa-building text-primary'></i>",
        "categories": ["marketing", "website"],
        "inputs": [
            {
                "id": "companyName",
                "type": "text",
                "label": "Company Name",
                "placeholder": "InnovateTech",
            },
            {
                "id": "companyInformation",
                "type": "textarea",
                "label": "Company information",
                "placeholder": "InnovateTech is a cutting-edge technology firm that specializes in developing software solutions for businesses. Founded in 2018 and based in New York City, we focus on helping companies streamline their processes and improve customer engagement.",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Professional",
            }
        ]
    },
    {
        "id": "e7b3-458e-62df-17c8",
        "title": "Content Improver",
        "description": "Enhance a piece of content by rewriting it to be more engaging, creative, and captivating.",
        "command": "Rewrite the following content to be more engaging, creative, and captivating: ",
        "icon": "<i class='fas fa-pencil-alt text-primary'></i>",
        "categories": ["blog", "seo", "email"],
        "inputs": [
            {
                "id": "blandContent",
                "type": "textarea",
                "label": "Content",
                "placeholder": "We help agencies automate their daily tasks so they can scale better and faster with less effort.",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Funny",
            }
        ]
    },

    {
        "id": "g7h8-9i0j-1k2l-3m4n",
        "title": "Twitter/X Thread Framework",
        "description": "Create a framework for a Twitter thread.",
        "command": "Outline a Twitter thread.",
        "icon": `<i class="fab fa-twitter text-primary"></i>`,
        "categories": ["social-media"],
        "inputs": [
            {
                id: "thread-topic",
                label: "Thread Topic",
                placeholder: "The impact of climate change",
                type: "text",
            },
            {
                id: "key-points",
                label: "Key Points",
                placeholder: "1. Definition, 2. Causes, 3. Effects...",
                type: "textarea",
            },
        ]
    },
    {
        "id": "h8i9-0j1k-2l3m-4n5o",
        "title": "TikTok Script Template",
        "description": "Draft a script for a TikTok video.",
        "command": "Create a TikTok video script.",
        "icon": `<i class="fab fa-tiktok text-primary"></i>`,
        "categories": ["social-media"],
        "inputs": [
            {
                id: "video-topic",
                label: "Video Topic",
                placeholder: "Quick healthy recipes",
                type: "text",
            },
            {
                id: "script",
                label: "Script",
                placeholder: "Intro, Ingredients, Cooking Steps...",
                type: "textarea",
            },
        ]
    },
    {
        "id": "9e9d-7d1f-1ed1-1910",
        "title": "Instagram Post Captions",
        "description": "Create engaging captions for your Instagram posts.",
        "command": "Create engaging captions for your Instagram posts and make content to be more engaging, creative, and captivating: ",
        "icon": "<i class='fas fa-pencil-alt text-primary'></i>",
        "categories": ["social-media", "marketing"],
        "inputs": [
            {
                "id": "blandContent",
                "type": "textarea",
                "label": "Content",
                "placeholder": "We help agencies automate their daily tasks so they can scale better and faster with less effort.",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Funny",
            }
        ]
    },
    {
        "id": "23e7-687f-0df7-1e47",
        "title": "Facebook Ad Primary Text",
        "description": "Craft compelling primary text for Facebook ads that attract users.",
        "command": "Create compelling primary text for Facebook ad.",
        "icon": "<i class='fab fa-facebook text-primary'></i>",
        "categories": ["ads", "social-media"],
        "inputs": [
            {
                "id": "companyName",
                "type": "text",
                "label": "Company/Product Name",
                "placeholder": "Pushpress",
            },
            {
                "id": "productDescription",
                "type": "textarea",
                "label": "Product description",
                "placeholder": "Gym software that helps gym owners manage their gym with less stress and make more money.",
            },
            {
                "id": "tone",
                "type": "text",
                "label": "Tone of voice",
                "placeholder": "Excited",
            }
        ]
    },
    {
        "id": "87a3-56d9-3182-2a01",
        "title": "Job Description",
        "description": "Create a clear and concise job description to attract suitable candidates.",
        "command": "Write a compelling and a clear and concise job description for the following company:",
        "icon": "<i class='fas fab fa-linkedin text-primary'></i>",
        "categories": ["linkedin", "social-media"],
        "inputs": [
            {
                "id": "jobTitle",
                "type": "text",
                "label": "Job Title",
                "placeholder": "Software Engineer",
            },
            {
                "id": "companyName",
                "type": "text",
                "label": "Company Name",
                "placeholder": "InnovateTech",
            },
            {
                "id": "companyDescription",
                "type": "textarea",
                "label": "Company Description",
                "placeholder": "InnovateTech is a cutting-edge technology firm that specializes in developing software solutions for businesses.",
            },
            {
                "id": "jobOverview",
                "type": "textarea",
                "label": "Job Overview",
                "placeholder": "We are looking for a skilled Software Engineer to join our team and help us develop high-quality software solutions.",
            },
            {
                "id": "responsibilities",
                "type": "textarea",
                "label": "Responsibilities",
                "placeholder": "Design, develop, and maintain software solutions. Collaborate with cross-functional teams to deliver high-quality products.",
            },
            {
                "id": "requirements",
                "type": "textarea",
                "label": "Requirements",
                "placeholder": "Bachelor's degree in Computer Science or related field. Proficient in JavaScript, Python, or Java.",
            },
            {
                "id": "benefits",
                "type": "textarea",
                "label": "Benefits",
                "placeholder": "Competitive salary, flexible working hours, and a comprehensive benefits package.",
            },
            {
                "id": "location",
                "type": "text",
                "label": "Location",
                "placeholder": "New York City, NY",
            },
            {
                "id": "employmentType",
                "type": "text",
                "label": "Employment Type",
                "placeholder": "Full-time",
            }
        ]
    },
    {
        "id": "j0k1-2l3m-4n5o-6p7q",
        "title": "Non-Disclosure Agreement",
        "description": "Draft a non-disclosure agreement template.",
        "command": "Create a non-disclosure agreement.",
        "icon": `<i class="fas fa-gavel text-primary"></i>`,
        "categories": ["legal"],
        "inputs": [
            {
                id: "disclosing-party",
                label: "Disclosing Party Name",
                placeholder: "ABC Corp",
                type: "text",
            },
            {
                id: "receiving-party",
                label: "Receiving Party Name",
                placeholder: "XYZ LLC",
                type: "text",
            },
            {
                id: "confidential-information",
                label: "Confidential Information Description",
                placeholder: "Trade secrets, business plans...",
                type: "textarea",
            },
        ]
    },
    {
        "id": "l2m3-4n5o-6p7q-8r9s",
        "title": "Client Onboarding Document",
        "description": "Outline the onboarding process for new clients.",
        "command": "Create a client onboarding document.",
        "icon": `<i class="fas fa-handshake text-primary"></i>`,
        "categories": ["professional"],
        "inputs": [
            {
                id: "client-name",
                label: "Client Name",
                placeholder: "Acme Corp",
                type: "text",
            },
            {
                id: "services-offered",
                label: "Services Offered",
                placeholder: "Consulting, Support, etc.",
                type: "textarea",
            },
            {
                id: "onboarding-steps",
                label: "Onboarding Steps",
                placeholder: "Initial meeting, Documentation, etc.",
                type: "textarea",
            },
        ]
    },

    {
        "id": "m3n4-5o6p-7q8r-9s0t",
        "title": "Goal-Setting Template",
        "description": "Outline your personal and professional goals.",
        "command": "Create a goal-setting framework.",
        "icon": `<i class="fas fa-bullseye text-primary"></i>`,
        "categories": ["personal-development"],
        "inputs": [
            {
                id: "goal",
                label: "Goal",
                placeholder: "Become a certified project manager",
                type: "text",
            },
            {
                id: "deadline",
                label: "Deadline",
                placeholder: "By December 2023",
                type: "text",
            },
            {
                id: "action-steps",
                label: "Action Steps",
                placeholder: "Enroll in a course, study materials...",
                type: "textarea",
            },
        ]
    },

    {
        "id": "n4o5-6p7q-8r9s-0t1u",
        "title": "Journaling Prompts",
        "description": "Provide prompts for daily journaling.",
        "command": "Generate journaling prompts.",
        "icon": `<i class="fas fa-pencil-alt text-primary"></i>`,
        "categories": ["personal-development"],
        "inputs": [
            {
                id: "prompt",
                label: "Journaling Prompt",
                placeholder: "What am I grateful for today?",
                type: "textarea",
            },
            {
                id: "reflection",
                label: "Reflection",
                placeholder: "How did I feel about today?",
                type: "textarea",
            },
        ]
    },

    {
        "id": "i9j0-1k2l-3m4n-5o6p",
        "title": "Loan Application Template",
        "description": "Create a comprehensive loan application.",
        "command": "Draft a loan application.",
        "icon": `<i class="fas fa-file-alt text-primary"></i>`,
        "categories": ["financial"],
        "inputs": [
            {
                id: "applicant-name",
                label: "Applicant Name",
                placeholder: "Jane Smith",
                type: "text",
            },
            {
                id: "loan-amount",
                label: "Loan Amount Requested",
                placeholder: "$10,000",
                type: "text",
            },
            {
                id: "purpose",
                label: "Purpose of Loan",
                placeholder: "Home renovation",
                type: "textarea",
            },
        ]
    },
    {
        "id": "a1b2-34c5-678d-90ef",
        "title": "LinkedIn Topic Ideas",
        "description": "Get inspired with LinkedIn topic ideas to share with your network.",
        "command": "Suggest LinkedIn topic ideas to share with my network.",
        "icon": "<i class='fas fab fa-linkedin text-primary'></i>",
        "categories": ["linkedin", "social-media"],
        "inputs": [
            {
                "id": "topic",
                "type": "text",
                "label": "Topic",
                "placeholder": "Marketing",
            },            {
                "id": "audience",
                "type": "text",
                "label": "Audience",
                "placeholder": "Marketers, companies, business owners",
            },
        ]
    },
    {
        "id": "o5p6-7q8r-9s0t-1u2v",
        "title": "Research Paper Outline",
        "description": "Create an outline for a research paper.",
        "command": "Draft a research paper outline.",
        "icon": `<i class="fas fa-file-alt text-primary"></i>`,
        "categories": ["research"],
        "inputs": [
            {
                id: "topic",
                label: "Research Topic",
                placeholder: "The effects of climate change on biodiversity",
                type: "text",
            },
            {
                id: "sections",
                label: "Outline Sections",
                placeholder: "Introduction, Literature Review, Methodology...",
                type: "textarea",
            },
        ]
    },
    {
        "id": "3456-7890-pqrs-tuvw",
        "title": "Personalized Credit Dispute Letter",
        "description": "Generate a debt validation dispute letter under FDCPA guidelines, emphasizing no acknowledgment of the debt and requesting validation.",
        "command": "Create a debt validation letter that disputes the alleged debt under FDCPA (15 USC 1692g Sec. 809). State that the sender does not acknowledge or have any obligation to the alleged debt, nor are they agreeing to pay any claimed amount. The letter should request competent evidence of the debt, and include a cease and desist notice unless validation is provided. Warn of consequences under FCRA if the debt is inaccurately reported to credit bureaus.",
        "icon": "<i class='fas fa-file-alt text-primary'></i>",
        "categories": ["credit"],
        "inputs": [
        {
            "id": "debtor-name",
            "label": "Your Name",
            "placeholder": "John Doe",
            "type": "text"
        },
        {
            "id": "debtor-address",
            "label": "Your Address",
            "placeholder": "1234 Main St, Anytown, USA",
            "type": "textarea"
        },
        {
            "id": "creditor-name",
            "label": "Creditor/Collector Name",
            "placeholder": "ABC Collections",
            "type": "text"
        },
        {
            "id": "debt-account-number",
            "label": "Account Number or Reference Number",
            "placeholder": "123456789",
            "type": "text"
        },
        {
            "id": "cease-communication",
            "label": "Request Cease and Desist",
            "placeholder": "Yes",
            "type": "text",
        },
        {
            "id": "response-deadline",
            "label": "Requested Response Deadline",
            "placeholder": "30 days",
            "type": "text"
        },
        {
            "id": "additional-notes",
            "label": "Additional Notes",
            "placeholder": "Include any specific points or requests",
            "type": "textarea"
        }
    ]
},
{
    "id": "p6q7-8r9s-0t1u-2v3w",
    "title": "Customer Persona Profile",
    "description": "Develop a profile for a customer persona.",
    "command": "Create a customer persona profile.",
    "icon": `<i class="fas fa-user-circle text-primary"></i>`,
    "categories": ["research", "marketing"],
    "inputs": [
        {
            id: "persona-name",
            label: "Persona Name",
            placeholder: "Eco-Conscious Emma",
            type: "text",
        },
        {
            id: "demographics",
            label: "Demographics",
            placeholder: "Age, Gender, Location...",
            type: "textarea",
        },
        {
            id: "goals",
            label: "Goals",
            placeholder: "What does this persona want to achieve?",
            type: "textarea",
        },
    ]
},

// New Creative & Artistic Templates
{
    "id": "q7r8-9s0t-1u2v-3w4x",
    "title": "Fiction Story Outline",
    "description": "Outline a fiction story.",
    "command": "Create a fiction story outline.",
    "icon": `<i class="fas fa-book text-primary"></i>`,
    "categories": ["creative"],
    "inputs": [
        {
            id: "story-title",
            label: "Story Title",
            placeholder: "The Lost Kingdom",
            type: "text",
        },
        {
            id: "main-characters",
            label: "Main Characters",
            placeholder: "Hero, Villain, Sidekick...",
            type: "textarea",
        },
        {
            id: "plot-summary",
            label: "Plot Summary",
            placeholder: "A brief summary of the story...",
            type: "textarea",
        },
    ]
},
{
    "id": "r8s9-0t1u-2v3w-4x5y",
    "title": "Creative Brief Template",
    "description": "Draft a creative brief for a project.",
    "command": "Create a creative brief.",
    "icon": `<i class="fas fa-pencil-alt text-primary"></i>`,
    "categories": ["creative"],
    "inputs": [
        {
            id: "project-name",
            label: "Project Name",
            placeholder: "New Marketing Campaign",
            type: "text",
        },
        {
            id: "objectives",
            label: "Objectives",
            placeholder: "Increase brand awareness, drive sales...",
            type: "textarea",
        },
        {
            id: "target-audience",
            label: "Target Audience",
            placeholder: "Young adults, Eco-conscious consumers...",
            type: "textarea",
        },
    ]
},

// New Technical & Specialized Templates
{
    "id": "s9t0-1u2v-3w4x-5y6z",
    "title": "API Documentation Template",
    "description": "Create documentation for an API.",
    "command": "Draft API documentation.",
    "icon": `<i class="fas fa-code text-primary"></i>`,
    "categories": ["technical"],
    "inputs": [
        {
            id: "api-name",
            label: "API Name",
            placeholder: "Weather API",
            type: "text",
        },
        {
            id: "endpoints",
            label: "Endpoints",
            placeholder: "GET /weather, POST /weather",
            type: "textarea",
        },
        {
            id: "authentication",
            label: "Authentication Method",
            placeholder: "API Key, OAuth...",
            type: "text",
        },
    ]
},
{
    "id": "t0u1-2v3w-4x5y-6z7a",
    "title": "User Manual Template",
    "description": "Draft a user manual for a your product.",
    "command": "Create a user manual.",
    "icon": `<i class="fas fa-book text-primary"></i>`,
    "categories": ["technical"],
    "inputs": [
        {
            id: "product-name",
            label: "Product Name",
            placeholder: "Smart Home Device",
            type: "text",
        },
        {
            id: "usage-instructions",
            label: "Usage Instructions",
            placeholder: "How to set up and use the device...",
            type: "textarea",
        },
        {
            id: "troubleshooting",
            label: "Troubleshooting Tips",
            placeholder: "Common issues and solutions...",
            type: "textarea",
        },
    ]
}

]
