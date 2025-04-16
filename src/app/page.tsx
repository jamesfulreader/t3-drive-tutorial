"use client"

import React, { useState } from "react";
import { FaFolder, FaFileAlt, FaUpload, FaArrowLeft } from "react-icons/fa"

type DriveItem = {
  id: string;
  name: string;
  type: "folder" | "file";
  url?: string; // Only for files
}

// Mock Data
const rootItems: DriveItem[] = [
  { id: "1", name: "Documents", type: "folder" },
  { id: "2", name: "Photos", type: "folder" },
  { id: "3", name: "Project Proposal.pdf", type: "file", url: "#" }, // Use '#' or actual mock links
  { id: "4", name: "Meeting Notes.docx", type: "file", url: "#" },
];

const documentsFolderItems: DriveItem[] = [
  { id: "doc1", name: "Report Q1.pdf", type: "file", url: "#" },
  { id: "doc2", name: "Presentation.pptx", type: "file", url: "#" },
];

const photosFolderItems: DriveItem[] = [
  { id: "pho1", name: "Vacation 2024", type: "folder" },
  { id: "pho2", name: "cat.jpg", type: "file", url: "#" },
  { id: "pho3", name: "dog.png", type: "file", url: "#" },
];

// Mock data for nested folder (Vacation 2024 inside Photos)
const vacationFolderItems: DriveItem[] = [
  { id: "vac1", name: "beach.jpg", type: "file", url: "#" },
  { id: "vac2", name: "mountains.png", type: "file", url: "#" },
];

export default function HomePage() {
  // State to hold the current list of items being displayed
  const [currentItems, setCurrentItems] = useState<DriveItem[]>(rootItems);
  // State to track the current path (for the back button logic)
  const [currentPath, setCurrentPath] = useState<string>("root"); // 'root', 'Documents', 'Photos', 'Photos/Vacation 2024'

  const handleFolderClick = (folderName: string) => {
    // Simple navigation logic based on folder name
    if (currentPath === "root" && folderName === "Documents") {
      setCurrentItems(documentsFolderItems);
      setCurrentPath("Documents");
    } else if (currentPath === "root" && folderName === "Photos") {
      setCurrentItems(photosFolderItems);
      setCurrentPath("Photos");
    } else if (currentPath === "Photos" && folderName === "Vacation 2024") {
      setCurrentItems(vacationFolderItems);
      setCurrentPath("Photos/Vacation 2024");
    }
    // Add more conditions for deeper navigation if needed
  };

  const handleBackClick = () => {
    // Navigate back up the hierarchy
    if (currentPath === "Documents" || currentPath === "Photos") {
      setCurrentItems(rootItems);
      setCurrentPath("root");
    } else if (currentPath === "Photos/Vacation 2024") {
      setCurrentItems(photosFolderItems);
      setCurrentPath("Photos");
    }
    // Add more conditions for deeper navigation if needed
  };

  return (
    <main className="container mx-auto min-h-screen p-6">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center space-x-4">
          {/* Back Button - Show only when not in root */}
          {currentPath !== "root" && (
            <button
              onClick={handleBackClick}
              className="p-2 rounded-full hover:bg-gray-700 transition-colors"
              aria-label="Go back"
            >
              <FaArrowLeft size={20} />
            </button>
          )}
          {/* Display current path/folder name */}
          <h1 className="text-2xl font-semibold">
            {currentPath === "root" ? "My Drive" : currentPath.split("/").pop()}
          </h1>
        </div>

        {/* Mock Upload Button */}
        <button className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 rounded-md text-white transition-colors">
          <FaUpload className="mr-2" />
          Upload
        </button>
      </div>

      {/* File/Folder List */}
      <div className="bg-gray-800 rounded-lg shadow p-4">
        <ul className="space-y-2">
          {currentItems.length === 0 ? (
            <li className="text-gray-400 text-center py-4">Folder is empty</li>
          ) : (
            currentItems.map((item) => (
              <li
                key={item.id}
                className={`flex items-center p-3 rounded-md transition-colors ${item.type === "folder"
                  ? "hover:bg-gray-700 cursor-pointer"
                  : "hover:bg-gray-750" // Slightly different hover for files
                  }`}
                onClick={() =>
                  item.type === "folder" ? handleFolderClick(item.name) : null
                }
              >
                {item.type === "folder" ? (
                  // Folder Item
                  <>
                    <FaFolder size={20} className="mr-3 text-blue-400" />
                    <span className="flex-grow">{item.name}</span>
                  </>
                ) : (
                  // File Item - Render as a link
                  <a
                    href={item.url}
                    target="_blank" // Open file links in a new tab
                    rel="noopener noreferrer"
                    className="flex items-center w-full"
                    onClick={(e) => e.stopPropagation()} // Prevent li onClick from firing
                  >
                    <FaFileAlt size={20} className="mr-3 text-gray-400" />
                    <span className="flex-grow">{item.name}</span>
                  </a>
                )}
              </li>
            ))
          )}
        </ul>
      </div>
    </main>
  );
}