"use client"

import "@/app/css/themes.css"

import React, { useState, useEffect, useRef } from "react";

interface CheckboxInputProps {
    idx?: string | number;
    category?: string;
    place: string;
    handleArrayFieldChange?: (fieldName: string, value: string) => void;
    value: any[];
    icon?: any
}


function CheckboxInput({ idx, category, place, handleArrayFieldChange, value, icon}: CheckboxInputProps) {

    const [checked, setChecked] = useState(false);
    const [isChecked, setISChecked] = useState(false)



    let foundPlace: any;
    function getDataOfcheckbox() {

        if (typeof value === 'object' && value !== null) {
            if (Array.isArray(value)) {
                foundPlace = value.find((pl: any) => pl === place);
            } else {
                foundPlace = value;
            }
        } else if (typeof value === 'boolean' && value !== null) {
            foundPlace = value;
        }

        return foundPlace;
    }

    getDataOfcheckbox()


    useEffect(() => {
        if (foundPlace) {
            setChecked(true);
            setISChecked(true);
        } else {
            setChecked(false);
            setISChecked(false);
        }
    }, [foundPlace]);


    return (
        <>
            <div className={`CheckboxInput ${checked ? 'active' : ''}`}>
                <label>
                    <span className="text-sm flex flex-wrap"><i className={`ml-2 ${icon}`}></i> {place}</span>
                    {value ? (
                        <input
                            key={idx}
                            type="checkbox"
                            onChange={(e) => {
                                if (handleArrayFieldChange && category && place) {
                                    handleArrayFieldChange(category, place);
                                }
                            }}
                            onClick={() => { checked ? setChecked(false) : setChecked(true) }}
                            className="custom-checkbox"
                            checked={isChecked}
                        />
                    ) : (
                        <input
                            key={idx}
                            type="checkbox"
                            onChange={(e) => {
                                if (handleArrayFieldChange && category && place) {
                                    handleArrayFieldChange(category, place);
                                }
                            }}
                            onClick={() => { checked ? setChecked(false) : setChecked(true) }}
                            className="custom-checkbox"
                            checked={false}
                        />
                    )}
                </label>
            </div>
        </>
    )
}

export default CheckboxInput