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
    onImagesDeleted?: (imageIds: number[]) => void;
    allowEdit?: boolean;
}

export function ImagePreview({
    isOpen,
    onClose,
    images,
    initialIndex = 0,
    onImagesDeleted,
    allowEdit = false,
}: ImagePreviewProps) {
    const [currentImageIndex, setCurrentImageIndex] = useState(initialIndex);
    const [isDeleting, setIsDeleting] = useState(false);
    const [selectedImages, setSelectedImages] = useState<Set<number>>(
        new Set()
    );
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [multiSelectMode, setMultiSelectMode] = useState(false);
    const [imageLoading, setImageLoading] = useState(true); // Add loading state
    const [imageError, setImageError] = useState(false); // Add error state

    const imagesCount = images.length;
    const currentImage = images[currentImageIndex];

    // Reset states when image changes
    useEffect(() => {
        setImageLoading(true);
        setImageError(false);
    }, [currentImageIndex, images]);

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
        if (!imageId || !allowEdit) return;

        const newSelection = new Set(selectedImages);
        if (newSelection.has(imageId)) {
            newSelection.delete(imageId);
        } else {
            newSelection.add(imageId);
        }
        setSelectedImages(newSelection);
    };

    const toggleCurrentImageSelection = () => {
        if (!currentImage.id || !allowEdit) return;
        toggleImageSelection(currentImage.id);
    };

    const handleDeleteSingleImage = async (imageId: number) => {
        if (!allowEdit) return;

        try {
            setIsDeleting(true);
            await axios.delete(`/memo-image/${imageId}`);

            if (onImagesDeleted) {
                onImagesDeleted([imageId]);
            }

            if (imagesCount === 1) {
                onClose();
                return;
            }

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
        if (selectedImages.size === 0 || !allowEdit) return;

        try {
            setIsDeleting(true);
            setShowDeleteConfirm(false);

            const imageIdsToDelete = Array.from(selectedImages);

            router.post("/delete-evidence-multiple", {
                imageIds: imageIdsToDelete,
            });

            if (onImagesDeleted) {
                onImagesDeleted(imageIdsToDelete);
            }

            if (selectedImages.size >= imagesCount) {
                onClose();
                return;
            }

            setSelectedImages(new Set());
            setMultiSelectMode(false);

            if (currentImage.id && selectedImages.has(currentImage.id)) {
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

    const handleImageLoad = () => {
        setImageLoading(false);
        setImageError(false);
    };

    const handleImageError = () => {
        setImageLoading(false);
        setImageError(true);
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
                    </div>
                    <div className="flex flex-col w-full">
                        <div className="relative w-full h-[60vh] bg-gray-100 rounded-md overflow-hidden">
                            {/* Loading indicator */}
                            {imageLoading && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
                                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
                                </div>
                            )}

                            {/* Error indicator */}
                            {imageError && (
                                <div className="absolute inset-0 flex items-center justify-center z-10 bg-white/50">
                                    <div className="text-center">
                                        <div className="w-24 h-24 mx-auto mb-4 opacity-60">
                                            <svg
                                                xmlns="http://www.w3.org/2000/svg"
                                                fill="none"
                                                viewBox="0 0 24 24"
                                                stroke="currentColor"
                                                className="w-full h-full text-red-500"
                                            >
                                                <path
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                    strokeWidth={2}
                                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z"
                                                />
                                            </svg>
                                        </div>
                                        <p className="text-red-500 text-sm">
                                            Failed to load image
                                        </p>
                                    </div>
                                </div>
                            )}

                            {/* Selection checkbox for current image - Only show if allowEdit is true */}
                            {allowEdit &&
                                currentImage.id &&
                                !imageLoading &&
                                !imageError && (
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
                            {imagesCount > 1 && !imageLoading && (
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

                            {/* Actual image */}
                            <div className="w-full h-full flex items-center justify-center overflow-auto">
                                <img
                                    key={`${currentImage?.file_path}-${currentImageIndex}`} // Force re-render on image change
                                    src={`/memo-file/${currentImage?.file_path}`}
                                    className={`max-w-full max-h-full object-contain transition-transform duration-200 hover:scale-105 ${
                                        isCurrentImageSelected
                                            ? "ring-4 ring-blue-500 ring-opacity-70"
                                            : ""
                                    } ${
                                        imageLoading
                                            ? "opacity-0"
                                            : "opacity-100"
                                    }`}
                                    alt="Document preview"
                                    onLoad={handleImageLoad}
                                    onError={handleImageError}
                                    onClick={() => {
                                        if (
                                            allowEdit &&
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
                                {/* Only show delete button if allowEdit is true */}
                                {allowEdit && selectedImages.size > 0 && (
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
                                            `/memo-file/${currentImage?.file_path}`,
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
                        className="bg-blue-500 text-white hover:bg-blue-600 hover:text-white"
                        onClick={onClose}
                    >
                        Kembali
                    </AlertDialogCancel>
                </AlertDialogFooter>
            </AlertDialogContent>

            {/* Confirmation dialog for deleting multiple images - Only show if allowEdit is true */}
            {allowEdit && showDeleteConfirm && (
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
