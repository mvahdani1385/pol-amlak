"use client"

import "@/app/css/themes.css"
import { useState, useRef } from 'react';

interface FileInputProps {
    images: File[];
    mainImageIndex: number | null;
    setImages: (newImages: File[]) => void;
    setMainImageIndex: (index: number | null) => void;
    allowMultipleSelection?: boolean;
}

function FileInput({ images, mainImageIndex, setImages, setMainImageIndex, allowMultipleSelection = true }: FileInputProps) {
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleUploadClick = () => {
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
        fileInputRef.current?.click();
    };



    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        let newFiles: File[] = [];
        if (allowMultipleSelection) {
            newFiles = Array.from(e.target.files);

        } else {
            newFiles.push(e.target.files[0]);
        }

        const updatedImages = [...images, ...newFiles];
        setImages(updatedImages);

        if (images.length === 0 && updatedImages.length > 0) {
            setMainImageIndex(0);
        }
        if (e.target.value) {
            e.target.value = '';
        }
    };


    function handleDeleteImage(imgIndexToDelete: number) {
        const updatedImages = images.filter((_, index) => index !== imgIndexToDelete);

        setImages(updatedImages);
    
        if (mainImageIndex === imgIndexToDelete) {
            setMainImageIndex(null);
        } else if (mainImageIndex !== null && imgIndexToDelete < mainImageIndex) {
            setMainImageIndex(mainImageIndex - 1);
        }
    }



    return (
        <>
            <div className="FileInput">
                <h2 className="text-lg w-full mb-5 font-bold">تصاویر ملک</h2>
                <input
                    ref={fileInputRef}
                    type="file"
                    multiple={allowMultipleSelection}
                    accept="image/*"
                    onChange={handleFileChange}
                    style={{ display: 'none' }}
                />

                {images.length === 0 && (
                    <div className="upload" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                        <p id="plus">+</p>
                        <p>اضافه کردن تصویر</p>
                    </div>
                )}


                {images.length > 0 && (
                    <>
                        <div className="flex w-full">
                            <div className="uploadedFiles">
                                <div className="upload" onClick={handleUploadClick} style={{ cursor: 'pointer' }}>
                                    <p id="plus">+</p>
                                    <p>اضافه کردن تصویر</p>
                                </div>
                                {images.map((image, index) => (
                                    <div
                                        key={index}
                                        className={`imageBox ${mainImageIndex === index ? "select" : ""}`}
                                        onClick={() => setMainImageIndex(index)}
                                    >
                                        <img
                                            src={URL.createObjectURL(image)}
                                            alt="preview"
                                        />
                                        <div className="setMain">
                                            <p>
                                                {mainImageIndex === index
                                                    ? "تصویر اصلی "
                                                    : "انتخاب"}
                                            </p>
                                        </div>
                                        {/* {images.length > 1 && ( */}
                                        <button
                                            onClick={() => handleDeleteImage(index)}
                                            className="deleteButton"
                                            title="حذف تصویر"
                                        >
                                            حذف تصویر
                                        </button>
                                        {/* )} */}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
}

export default FileInput;