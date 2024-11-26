import React from 'react';
import Layout from '../components/Layout';
import CardGrid from "../components/CardGrid";
import {TEMPLATES} from "../constants/templates";
import { signOut } from "next-auth/react"; // Import signOut for logout functionality
import { useRouter } from "next/router"; // Import useRouter for navigation


const HomePage: React.FC = () => {
    const router = useRouter();



    const onLogout = async () => {
        await signOut(); // Sign out the user
        router.push('/'); // Redirect to the home page after logout
    };

    return (
        <Layout title="" onLogout={onLogout}> {/* Pass the onLogout function here */}
            <h1 className="text-4xl font-bold mt-10 ml-10">
                Welcome to <span className="text-blue-600">Omni Social</span>
                <div>
                    <a href="https://www.producthunt.com/products/omni-ai-multi-ai-chat-interface/reviews?utm_source=badge-product_review&utm_medium=badge&utm_souce=badge-omni&#0045;ai&#0045;multi&#0045;ai&#0045;chat&#0045;interface" 
                       target="_blank"><img
                        src="https://api.producthunt.com/widgets/embed-image/v1/product_review.svg?product_id=606335&theme=light"
                         alt="Omni&#0045;AI&#0032;&#0124;&#0032;Multi&#0032;Ai&#0032;Chat&#0032;Interface - Chat&#0032;with&#0032;multiple&#0032;Ai&#0039;s&#0032;in&#0032;one | Product Hunt"
                        style={{width: '250px', height: '54px', marginTop: '10px'}}
                        width="250" height="54"/>
                        </a>
                </div>
              

                
            </h1>
            <h2 className="text-2xl font-light mt-5 ml-10">
                Create amazing <strong className="text-blue-600">blog posts, marketing copy, SEO content</strong> and a
                lot more with AI.
            </h2>
            <CardGrid cards={TEMPLATES}/>
            <a href="https://www.linkedin.com/in/coinvest518/" target="_blank">
                <img
                    style={{ maxWidth: '800px', margin: '0 auto'}}
                    height="auto"
                    width="15%"
                    src="/images/logo.svg" alt=""/>
            </a>
        </Layout>
    );
};

export default HomePage;
