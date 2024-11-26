// components/Layout.tsx
import React, { Fragment, useState } from "react";
import Sidebar from "./Sidebar";
import GoProPopup from "./GoproPopup";
import { FaCog } from 'react-icons/fa';

interface Props {
  children: React.ReactNode;
  title: string;
  onLogout: () => void; // Add onLogout prop
}

export const SIDEBAR_ITEMS: any = [
  { label: "Templates", url: "/" },
  { label: "Hashtags Generator", url: "/hashtag" },
  { label: "Thumbnail Generator", url: "/thumbnailgenerator" },
   { label: "AI Web Data Scraper", url: "/webscraper" },

  {
    label: "Settings",
    icon: <FaCog />,
    submenu: [
      {
        label: "Join Our Discord",
        url: "https://discord.gg/NTNszcwE",
        target: "blank",
      },
      {
        label: "Leverage your business. Talk to me.",
        url: "https://www.picktime.com/omniai",
        target: "blank",
      },
      {
        label: "Contact",
        url: "https://linktr.ee/omniai",
        target: "blank",
      },
    ],
  },
];

const Layout: React.FC<Props> = ({ children, title, onLogout }) => {

  const [showPopup, setShowPopup] = useState(false);

  const handlePopup = () => {
    setShowPopup(!showPopup);
  };



  return (
    <Fragment>
      <div className="min-h-screen flex w-full ">
        <div className="fixed z-10 top-0 left-0 h-full w-64 bg-white shadow-md">
          <Sidebar
            onShowPopup={handlePopup}
            items={SIDEBAR_ITEMS}
             // Pass the user object here
            onLogout={onLogout} // Pass the onLogout function as a prop
          />
        </div>

        <main className="flex-grow ml-64 p-4">
          {title && (
            <h1 className="text-black text-2xl font-bold mb-4 mt-10">{title}</h1>
          )}
          {children}
        </main>

        {/* Popup Container */}
        {showPopup && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
            <GoProPopup onClose={() => setShowPopup(false)} />
          </div>
        )}
      </div>
    </Fragment>
  );
};

export default Layout;
