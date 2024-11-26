// components/ThumbnailGenerator.tsx
'use client';
import Layout from '@/components/Layout';
import React, { useState } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router'; // Import useRouter

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';

const PRESET_PROMPTS = {
    gaming: [
        "Gaming setup with dramatic neon blue lighting, rule of thirds composition, dark background with bright accent lights. Add floating text 'GAME ON' in futuristic font. Include gaming icons (controller, headset) subtly in corners. Ultra sharp, 8k quality.",

        "Excited gamer reaction face positioned on right third, dramatic side lighting, neon purple and blue glow, blurred gaming setup background. Overlay text 'EPIC WIN' in bold, edgy font. Add small victory cup icon. High contrast, space for channel name on left.",

        "Epic gaming moment with explosive effects, positioned slightly off-center, vibrant orange and blue color scheme, cinematic lighting. Include text 'LEVEL UP' in 3D perspective. Add health bar and XP icons. Clean empty space for game title, 8k quality."
    ],

    tech: [
        "Latest smartphone floating in space, dramatic product lighting, dark background with tech blue accents. Add text 'TECH REVEAL' in sleek, minimalist font. Include floating tech spec icons (5G, camera, battery). Clean minimal design, strong depth of field, 8k commercial quality.",

        "Tech review setup with bokeh background, product positioned on right third, dramatic rim lighting. Add text 'UNBOXED' in modern sans-serif font. Include star rating and price tag graphics. Clean desk setup, vibrant but professional colors, ultra sharp.",

        "Futuristic tech comparison, split screen composition, deep contrast, subtle neon accents. Add 'VS' text in center with sci-fi style. Include spec comparison infographics. Clean gradient background, emphasized empty space for product names, professional lighting."
    ],

    vlog: [
        "Cinematic travel moment, sunset lighting, vibrant colors, person looking at vista positioned on right third. Add text 'WANDERLUST' in brush script font. Include small airplane and map pin icons. Dramatic landscape, clean sky space for channel name, movie poster quality.",

        "Lifestyle moment with bokeh background, subject on right third with genuine expression. Add text 'DAILY VIBES' in trendy handwritten font. Include social media icon buttons. Soft glamour lighting, pastel color palette, minimal composition, 8k quality.",

        "Food photography with professional lighting, positioned slightly off-center. Add text 'TASTY BITES' in appetizing font. Include fork and knife icons, and a small calorie count graphic. Shallow depth of field, vibrant appetizing colors, clean black background, commercial quality."
    ],

    educational: [
        "Clean minimalist educational setup, subtle gradient background. Add text 'LEARN NOW' in clear, authoritative font. Include floating subject icons (math symbols, atom, book). Geometric abstract elements, professional lighting, organized composition, high key lighting, 8k quality.",

        "Science experiment with dramatic lighting, positioned off-center. Add text 'DISCOVERY' in periodic table style font. Include molecular structure and beaker icons. Dark background with colored accent lighting, smoke effects, ultra sharp details.",

        "Professional desk setup with blurred bookshelf background. Add text 'STUDY SMART' in neat handwriting font. Include clock icon and productivity chart. Warm lighting, organized elements positioned on thirds, clean minimal style, emphasized empty space for course title, 8k quality."
    ],

    business: [
        "Professional business setting, modern office background slightly blurred. Add text 'SUCCESS STRATEGY' in bold corporate font. Include growth chart and briefcase icons. Confident person on right third, professional lighting, clean corporate colors, space for company name on left, 8k quality.",

        "Minimal business concept with floating elements, dark mode style. Add text 'INNOVATE' in futuristic font. Include network nodes and light bulb icons. Subtle gradient background, professional product lighting, organized composition with text space, ultra sharp.",

        "Executive desk setup with shallow depth of field. Add text 'LEAD & INSPIRE' in elegant serif font. Include small leadership pyramid and target icons. Warm professional lighting, modern minimal style, positioned on thirds, clean space for executive title, commercial quality."
    ]
};

const MODEL_OPTIONS = [
    { id: 'stable-diffusion-xl', name: 'Stable Diffusion XL' },
    { id: 'stable-diffusion-v1-5', name: 'Stable Diffusion v1.5' },
    { id: 'stable-diffusion-v1-4', name: 'Stable Diffusion v1.4' },
];

const ThumbnailGenerator: React.FC = () => {

    const { data: session, status } = useSession(); // Get session data
    const router = useRouter(); // Initialize useRouter
    const [prompt, setPrompt] = useState<string>('');
    const [imageUrl, setImageUrl] = useState<string | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const [error, setError] = useState<string | null>(null);
    const [modelId, setModelId] = useState<string>('stable-diffusion-xl'); // default model



    const generateThumbnail = async () => {
        if (!prompt.trim()) {
            setError('Please enter a prompt');
            return;
        }

         // Check if the user is authenticated
    if (status === "loading") {
        return; // Optionally show a loading indicator
      }
  
      if (status === "unauthenticated") {
        router.push("/login"); // Redirect to login if not authenticated
        return;
      }

        setLoading(true);
        setError(null);



        try {
            const response = await fetch('/api/generate-thumbnail', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ prompt, modelId, setModelId }),
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.details || 'Failed to generate image');
            }

            const data = await response.json();
            setImageUrl(data.imageUrl);
        } catch (err) {
            setError((err as Error).message || 'Failed to generate thumbnail. Please try again.');
        } finally {
            setLoading(false);
        }
    };

    const downloadImage = async () => {
        if (!imageUrl) return;

        try {
            // Create a temporary link element
            const link = document.createElement('a');
            link.href = imageUrl;
            link.download = `thumbnail-${Date.now()}.png`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        } catch (err) {
            setError('Failed to download image');
        }
    };

    const exampleThumbnails = [
        '/images/thumbnail1.png',
        '/images/thumbnail2.png',
        '/images/thumbnail3.png',
        '/images/thumbnail4.png',
    ];

    if (!session?.user?.id) {
        console.log('User email:', session?.user.email);
        // ... other code that uses session data
      }

    return (
        <Layout title="Omni YouTube Thumbnail Generator" onLogout={() => {/* Handle logout */ }}>

            <Card className="max-w-4xl mx-auto p-6">
                <CardHeader>
                    <CardTitle className="text-3xl font-bold mb-6 text-center">YouTube Thumbnail Generator</CardTitle>
                    <CardDescription>Enter a prompt to generate a YouTube thumbnail.</CardDescription>
                </CardHeader>
                <CardContent>





                    {/* Prompt Input Section */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Enter your prompt:
                        </label>
                        <Input
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={prompt}
                            onChange={(e) => setPrompt(e.target.value)}
                            placeholder="Describe your thumbnail (e.g., 'A futuristic city skyline with neon lights, cinematic style')"
                        />
                    </div>

                    {/* Preset Prompts */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">
                            Or try a preset prompt:
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {Object.entries(PRESET_PROMPTS).map(([category, prompts]) => (
                                <React.Fragment key={category}>
                                    {prompts.map((presetPrompt, index) => (
                                        <Button
                                            key={index}
                                            onClick={() => setPrompt(presetPrompt)}
                                            className="bg-gradient-to-br from-[#89CFF0] via-[#A3A1F7] to-[#C488F0] text-foreground px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {presetPrompt.slice(0, 30)}...
                                        </Button>
                                    ))}
                                </React.Fragment>
                            ))}
                        </div>
                    </div>

                    {/* Generate Button */}
                    <div className="flex justify-center mb-6">
                        <Button
                            className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
                            onClick={generateThumbnail}
                            disabled={!prompt.trim() || loading}
                        >
                            {loading ? (
                                <span className="flex items-center">
                                    <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                    Generating...
                                </span>
                            ) : 'Generate Thumbnail'}
                        </Button>
                    </div>

                    {/* Model Selection */}
                    <div className="mb-6">
                        <label className="block text-sm font-medium mb-2">Choose a model:</label>
                        <select
                            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                            value={modelId}
                            onChange={(e) => setModelId(e.target.value)}
                        >
                            {MODEL_OPTIONS.map((model) => (
                                <option key={model.id} value={model.id}>
                                    {model.name}
                                </option>
                            ))}
                        </select>
                    </div>

                    {/* Error Message */}
                    {error && (
                        <div className="text-red-500 text-center mb-6">{error}</div>
                    )}

                    {/* Generated Image */}
                    {imageUrl && (
                        <div className="space-y-4">
                            <h2 className="text-xl font-semibold">Generated Thumbnail</h2>
                            <div className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                                <img
                                    src={imageUrl}
                                    alt="Generated thumbnail"
                                    className="w-full h-full object-cover"
                                />
                            </div>
                            <div className="flex justify-between items-center">
                                <div className="text-sm text-gray-600">
                                    Dimensions: 1280x720px (YouTube recommended)
                                </div>
                                <Button
                                    onClick={downloadImage}
                                    className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg transition-colors"
                                >
                                    Download Thumbnail
                                </Button>
                            </div>


                        </div>
                    )}
                </CardContent>

            </Card>
            {/* Gallery Grid for Example Thumbnails */}
            <div className="mt-8">
                <h3 className="text-lg font-semibold mb-4">Example Thumbnails</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {exampleThumbnails.map((imageUrl, index) => (
                        <div key={index} className="aspect-video relative bg-gray-100 rounded-lg overflow-hidden">
                            <img
                                src={imageUrl}
                                alt={`Example thumbnail ${index + 1}`}
                                className="w-full h-full object-cover"
                            />
                        </div>
                    ))}
                </div>
            </div>
        </Layout>  // End of Layout component
    );
};

export default ThumbnailGenerator;
