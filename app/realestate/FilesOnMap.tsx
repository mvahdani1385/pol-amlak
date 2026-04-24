"use client";

import { useState } from "react";
import dynamic from "next/dynamic";

const MapComponent = dynamic(() => import("./MapComponent"), {
  ssr: false,
});

interface MapData {
  setOnMap: (value: boolean) => void;
  onMap: boolean;
  allProperty: any[];
}

export default function FilesOnMap({ setOnMap, onMap, allProperty }: MapData) {
  return (
    <>
      <div
        className={`lightbox flex flex-col justify-starts md:justify-center items-center ${onMap ? "flex" : "hidden"}`}
      >
          <div className="w-[90%] md:w-[60%] mt-10 md:mt-0">
            <button
            onClick={() => {
              setOnMap(false);
            }}
            className="delBtn w-[100px] h-[50px] mb-5"
          >
            بستن
          </button>
          </div>
        <div className="mapBox w-[90%] md:w-[60%] h-[70vh] md:h-[80vh] rounded-xl overflow-hidden">
          <MapComponent allProperty={allProperty} />
        </div>
      </div>
    </>
  );
}
