"use client";

import "@/app/css/themes.css";
import React, { useState, useEffect, useRef } from "react";


interface NumberInputProps {
    place?: string;
    values?: string[];
    category?: string;
    handlePropertyChange?: (fieldName: string, value: string) => void;
    setDealType?: (value: string) => void;
    initialDealType?: string;
    value: any;
}

function SelectInput({
    place,
    values = [],
    category,
    handlePropertyChange,
    setDealType,
    initialDealType = "",
    value
}: NumberInputProps) {
    const [selected, setSelected] = useState<string>(initialDealType || '');
    const [showDrop, setShowDrop] = useState<string>('deactive');

    const [searchTerm, setSearchTerm] = useState<string>('');

    const containerRef = useRef<HTMLDivElement>(null);

    const itemCount = values.length;

    const filteredValues = values.filter(value =>
        value.toLowerCase().includes(searchTerm.toLowerCase())
    );

    useEffect(() => {
        if (value) {
            setSelected(value)
        }
    })

    useEffect(() => {
        if (initialDealType && initialDealType !== selected) {
            setSelected(initialDealType);
        }
    }, [initialDealType, selected]);


    useEffect(() => {
        function handleOutsideClick(event: MouseEvent) {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDrop('deactive');
                setSearchTerm('');
            }
        }

        document.addEventListener("mousedown", handleOutsideClick);
        return () => {
            document.removeEventListener("mousedown", handleOutsideClick);
        };
    }, []);

    const handleItemClick = (feature: string) => {
        setSelected(feature);
        setShowDrop('deactive');
        setSearchTerm('');

        const newValueToSend = feature;

        if (handlePropertyChange && category) {
            handlePropertyChange(category, newValueToSend);
        }

        if (setDealType) {
            setDealType(newValueToSend);
        }
    };

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    };

    const displayValue = selected || place || '';

    return (
        <div className="selectInput" ref={containerRef}>
            <div className={`dropdown ${showDrop}`}>
                {itemCount > 6 && (
                    <b className="search-input-container">
                        <input
                            type="text"
                            placeholder="جستجو..."
                            value={searchTerm}
                            onChange={handleSearchChange}
                            className="dropdown-search-input"
                        />
                    </b>
                )}
                {
                    filteredValues.map((feature, featureIndex) => (
                        <div
                            key={featureIndex}
                            onClick={() => handleItemClick(feature)}
                            className="dropdown-item"
                        >
                            {feature}
                        </div>
                    ))
                }
                {filteredValues.length === 0 && searchTerm !== '' && (
                    <div className="no-results">موردی یافت نشد</div>
                )}
            </div>
            <label> {place} :</label>
            <div className="w-full flex items-center">
                <input
                    type="text"
                    placeholder={displayValue}
                    value={selected !== '' ? selected : ''}
                    onClick={() => {
                        setShowDrop('active');
                    }}
                    readOnly
                    className="border p-2 w-full"
                />
                <i className="ri-arrow-down-wide-line"></i>
            </div>
        </div>
    );
}

export default SelectInput;
