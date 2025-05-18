import React, { useState, useEffect } from "react";
import axios from "axios";
import {
    AlertDialog,
    AlertDialogContent,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogCancel,
    AlertDialogAction,
} from "@/Components/ui/alert-dialog";
import { router } from "@inertiajs/react";

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
    onImagesDeleted?: (imageIds: number[]) => void; // Updated to handle multiple deletions
}

export function ImagePreview({
    isOpen,
    onClose,
    images,
    initialIndex = 0,
    onImagesDeleted,
}: ImagePreviewProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Set<number>>(
        new Set()
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [multiSelectMode, setMultiSelectMode] = useState(false);

    const imagesCount = images.length;
    const currentImage = images[currentImageIndex];

    // Reset selected images when component mounts or images change
    useEffect(() => {
        setSelectedImages(new Set());
        setMultiSelectMode(false);
    }, [images]);

    const navigateNext = () => {
        setCurrentImageIndex((prev) => (prev + 1) % imagesCount);
    };

    const navigatePrev = () => {
        setCurrentImageIndex((prev) => (prev - 1 + imagesCount) % imagesCount);
    };

    const toggleImageSelection = (imageId: number | undefined) => {
        if (!imageId) return;

        const newSelection = new Set(selectedImages);
        if (newSelection.has(imageId)) {
            newSelection.delete(imageId);
        } else {
            newSelection.add(imageId);
        }
        setSelectedImages(newSelection);
    };

    const toggleCurrentImageSelection = () => {
        if (!currentImage.id) return;
        toggleImageSelection(currentImage.id);
    };

    const handleDeleteSingleImage = async (imageId: number) => {
        try {
            setIsDeleting(true);
            await axios.delete(`/memo-image/${imageId}`);

            // Call the callback if provided
            if (onImagesDeleted) {
                onImagesDeleted([imageId]);
            }

            // If we're deleting the last image, close the preview
            if (imagesCount === 1) {
                onClose();
                return;
            }

            // Navigate to previous image if available, or next if not
            if (currentImageIndex > 0) {
                navigatePrev();
            } else if (imagesCount > 1) {
                navigateNext();
            }
        } catch (error) {
            console.error("Failed to delete image:", error);
            alert("Failed to delete image. Please try again.");
        } finally {
            setIsDeleting(false);
        }
    };

    const handleDeleteSelectedImages = async () => {
        if (selectedImages.size === 0) return;

        try {
            setIsDeleting(true);
            setShowDeleteConfirm(false);

            // Convert Set to Array for the API call
            const imageIdsToDelete = Array.from(selectedImages);

            // Send the request to delete multiple images
            router.post("/delete-evidence-multiple", {
                imageIds: imageIdsToDelete,
            });

            // Call the callback if provided
            if (onImagesDeleted) {
                onImagesDeleted(imageIdsToDelete);
            }

            // If we deleted all images, close the preview
            if (selectedImages.size >= imagesCount) {
                onClose();
                return;
            }

            // Reset selection and determine which image to show next
            setSelectedImages(new Set());
            setMultiSelectMode(false);

            // If current image was deleted, navigate to a new one
            if (currentImage.id && selectedImages.has(currentImage.id)) {
                // Find the first non-deleted image
                const remainingImageIndex = images.findIndex(
                    (img) => img.id && !selectedImages.has(img.id)
                );
                if (remainingImageIndex >= 0) {
                    setCurrentImageIndex(remainingImageIndex);
                }
            }
        } catch (error) {
            console.error("Failed to delete images:", error);
            alert("Failed to delete images. Please try again.");
        } finally {
            setIsDeleting(false);
            router.visit(window.location.pathname, {
                preserveScroll: true,
            });
        }
    };

    const isCurrentImageSelected = currentImage.id
        ? selectedImages.has(currentImage.id)
        : false;

    return (
        <>
            <AlertDialogContent className="w-full max-w-7xl">
                <AlertDialogHeader className="">
                    <div className="flex justify-between items-center">
                        <AlertDialogTitle>
                            Preview File{imagesCount > 1 ? "s" : ""}
                        </AlertDialogTitle>
                        {/* {imagesCount > 1 && (
                            <div className="flex items-center gap-3">
                                <button
                                    className={`px-3 py-1 ${
                                        multiSelectMode
                                            ? "bg-blue-500 text-white"
                                            : "bg-gray-200 text-gray-700"
                                    } rounded-md text-sm transition-colors duration-200`}
                                    onClick={() =>
                                        setMultiSelectMode(!multiSelectMode)
                                    }
                                >
                                    {multiSelectMode
                                        ? "Exit Selection Mode"
                                        : "Select Multiple"}
                                </button>
                                {multiSelectMode && selectedImages.size > 0 && (
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                        disabled={isDeleting}
                                    >
                                        Delete Selected ({selectedImages.size})
                                    </button>
                                )}
                            </div>
                        )} */}
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="relative w-full h-[60vh] bg-gray-100 rounded-md overflow-hidden">
                            {/* Loading indicator */}
                            <div
                                className="absolute inset-0 flex items-center justify-center z-10 bg-white/50"
                                id={`loading-indicator-${currentImageIndex}`}
                            >
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                            </div>

                            {/* Selection checkbox for current image */}
                            {currentImage.id && (
                                <div className="absolute top-3 left-3 z-30">
                                    <label className="flex items-center space-x-2 bg-white/80 p-2 rounded-md backdrop-blur">
                                        <input
                                            type="checkbox"
                                            checked={isCurrentImageSelected}
                                            onChange={
                                                toggleCurrentImageSelection
                                            }
                                            className="w-4 h-4 accent-blue-500"
                                        />
                                        <span className="text-sm font-medium">
                                            Pilih Gambar
                                        </span>
                                    </label>
                                </div>
                            )}

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
                                    className={`max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105 ${
                                        isCurrentImageSelected
                                            ? "ring-4 ring-blue-500 ring-opacity-70"
                                            : ""
                                    }`}
                                    alt="Document preview"
                                    onLoad={(e) => {
                                        // Hide loading indicator when image loads
                                        const loadingEl =
                                            document.getElementById(
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
                                        const loadingEl =
                                            document.getElementById(
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
                                    onClick={() => {
                                        if (
                                            multiSelectMode &&
                                            currentImage.id
                                        ) {
                                            toggleCurrentImageSelection();
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
                                {selectedImages.size > 0 && (
                                    <button
                                        className="px-3 py-1 bg-red-500 text-white rounded-md text-sm hover:bg-red-600 transition-colors duration-200"
                                        onClick={() =>
                                            setShowDeleteConfirm(true)
                                        }
                                        disabled={isDeleting}
                                    >
                                        Hapus gambar yang dipilih (
                                        {selectedImages.size})
                                    </button>
                                )}
                                <button
                                    className="px-3 py-1 bg-gray-200 rounded-md text-sm hover:bg-gray-300 transition-colors duration-200"
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

            {/* Confirmation dialog for deleting multiple images */}
            {showDeleteConfirm && (
                <AlertDialog
                    open={showDeleteConfirm}
                    onOpenChange={setShowDeleteConfirm}
                >
                    <AlertDialogContent className="max-w-md">
                        <AlertDialogHeader>
                            <AlertDialogTitle>
                                Hapus ({selectedImages.size}) gambar
                            </AlertDialogTitle>
                            <AlertDialogDescription>
                                Apakah anda yakin akan menghapus{" "}
                                {selectedImages.size} gambar
                                {selectedImages.size > 1 ? "s" : ""}? tindakan
                                ini tidak dapat dibatalkan.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel
                                onClick={() => setShowDeleteConfirm(false)}
                            >
                                Kembali
                            </AlertDialogCancel>
                            <AlertDialogAction
                                onClick={handleDeleteSelectedImages}
                                className="bg-red-500 text-white hover:bg-red-600"
                                disabled={isDeleting}
                            >
                                {isDeleting ? "Menghapus..." : "Hapus"}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            )}
        </>
    );
}
