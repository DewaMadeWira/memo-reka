import React, { useState } from "react";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
} from "@/Components/ui/alert-dialog";

interface MemoImage {
    id?: number;
    file_path: string;
    file_name: string;
    file_type?: string;
    file_size?: number;
}

interface ImagePreviewProps {
    isOpen: boolean;
    onClose: () => void;
    images: MemoImage[];
    initialIndex?: number;
}

export function ImagePreview({
    isOpen,
    onClose,
    images,
    initialIndex = 0,
}: ImagePreviewProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    const imagesCount = images.length;
    const currentImage = images[currentImageIndex];

    const navigateNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    };

    const navigatePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    };

    return (
        <AlertDialogContent className="w-full max-w-7xl">
            <AlertDialogHeader className="">
                <AlertDialogTitle>
                    Preview File{imagesCount > 1 ? "s" : ""}
                </AlertDialogTitle>
                <div className="flex flex-col w-full">
                    <div className="relative w-full h-[60vh] bg-gray-100 rounded-md overflow-hidden">
                        {/* Loading indicator */}
                        <div
                            className="absolute inset-0 flex items-center justify-center z-10 bg-white/50"
                            id={`loading-indicator-${currentImageIndex}`}
                        >
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                        </div>

                        {/* Navigation buttons for multiple images */}
                        {imagesCount > 1 && (
                            <>
                                <button
                                    onClick={navigatePrev}
                                    className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-20"
                                    aria-label="Previous image"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="15 18 9 12 15 6"></polyline>
                                    </svg>
                                </button>
                                <button
                                    onClick={navigateNext}
                                    className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 z-20"
                                    aria-label="Next image"
                                >
                                    <svg
                                        xmlns="http://www.w3.org/2000/svg"
                                        width="24"
                                        height="24"
                                        viewBox="0 0 24 24"
                                        fill="none"
                                        stroke="currentColor"
                                        strokeWidth="2"
                                        strokeLinecap="round"
                                        strokeLinejoin="round"
                                    >
                                        <polyline points="9 18 15 12 9 6"></polyline>
                                    </svg>
                                </button>
                            </>
                        )}

                        {/* Actual image with zoom functionality */}
                        <div className="w-full h-full flex items-center justify-center overflow-auto">
                            <img
                                src={`memo-file/${currentImage?.file_path}`}
                                className="max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105"
                                alt="Document preview"
                                onLoad={(e) => {
                                    // Hide loading indicator when image loads
                                    const loadingEl = document.getElementById(
                                        `loading-indicator-${currentImageIndex}`
                                    );
                                    if (loadingEl)
                                        loadingEl.style.display = "none";
                                }}
                                onError={(e) => {
                                    // Show error message if image fails to load
                                    e.currentTarget.src =
                                        "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjQiIGhlaWdodD0iMjQiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgZmlsbC1ydWxlPSJldmVub2RkIiBjbGlwLXJ1bGU9ImV2ZW5vZGQiPjxwYXRoIGQ9Ik0xMiAwYzYuNjIzIDAgMTIgNS4zNzcgMTIgMTJzLTUuMzc3IDEyLTEyIDEyLTEyLTUuMzc3LTEyLTEyIDUuMzc3LTEyIDEyLTEyem0wIDFjNi4wNzEgMCAxMSA0LjkyOSAxMSAxMXMtNC45MjkgMTEtMTEgMTEtMTEtNC45MjktMTEtMTEgNC45MjktMTEgMTEtMTF6bS41IDEyaC0ydi02aDJ2NnptLTEtNi43NWMtLjY5IDAtMS4yNS0uNTYtMS4yNS0xLjI1cy41Ni0xLjI1IDEuMjUtMS4yNSAxLjI1LjU2IDEuMjUgMS4yNS0uNTYgMS4yNS0xLjI1IDEuMjV6Ii8+PC9zdmc+";
                                    e.currentTarget.className =
                                        "w-24 h-24 opacity-60";
                                    const loadingEl = document.getElementById(
                                        `loading-indicator-${currentImageIndex}`
                                    );
                                    if (loadingEl) {
                                        loadingEl.innerHTML =
                                            '<p class="text-red-500">Failed to load image</p>';
                                        loadingEl.classList.remove(
                                            "bg-white/50"
                                        );
                                    }
                                }}
                            />
                        </div>
                    </div>

                    {/* Image info and pagination indicator */}
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            {currentImage?.file_name}
                        </div>
                        {imagesCount > 1 && (
                            <div className="flex items-center gap-1">
                                <span className="text-sm text-gray-500">
                                    {currentImageIndex + 1} / {imagesCount}
                                </span>
                            </div>
                        )}
                        <div className="flex gap-2">
                            <button
                                className="px-3 py-1 bg-gray-200 rounded-md text-sm"
                                onClick={() =>
                                    window.open(
                                        `memo-file/${currentImage?.file_path}`,
                                        "_blank"
                                    )
                                }
                            >
                                Buka di tab baru
                            </button>
                        </div>
                    </div>
                </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
                <AlertDialogCancel
                    className="bg-blue-500 text-white"
                    onClick={onClose}
                >
                    Kembali
                </AlertDialogCancel>
            </AlertDialogFooter>
        </AlertDialogContent>
    );
}
