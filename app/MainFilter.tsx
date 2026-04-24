"use client";

import { useState } from "react";
import FilterBox from "./realestate/FilterBox";
import FilesOnMap from "./realestate/FilesOnMap";
import { useData } from '@/app/context/DataContext';

type PropertyImage = {
  id: number;
  imageUrl: string;
  isMain: boolean;
  sortOrder: number;
};

type Property = {
  id: number;
  title: string;
  slug: string;
  propertyType: string;
  dealType: string;
  status: string;
  city: string | null;
  district: string | null;
  price: number | null;
  depositPrice: number | null;
  rentPrice: number | null;
  pricePerMeter: number | null;
  images: PropertyImage[];
  createdAt: string;
  roomNumber: string;
  landArea: string;
  isFeatured: boolean;
  isConvertible: boolean;
};

function MainFilter() {
  const [mapStatus, setMapStatus] = useState(false);
  const [filterbox, setFilterbox] = useState(false);
  const [Filters, setFilters] = useState("");
  const [finalProperties, setFinalProperties] = useState<Property[]>([]);
  const { dynamicdata, dynamicloading, dynamicerror, refetch } = useData();
  
  const handleOpenedlightbox = () => {
    const body = document.querySelector("body");
    if (filterbox) {
      setFilterbox(false);
      if (body) {
        body.style.overflow = "auto";
      }
    } else {
      setFilterbox(true);
      if (body) {
        body.style.overflow = "hidden";
      }
    }
  };

  const handleFilterChange = (newFilters: string) => {
    setFilters(newFilters);
    const url = new URL(window.location.href);
    url.search = `?${newFilters}`;
    window.location.href = `/realestate${url.search}`;
  };

  if(dynamicloading){
    return(
      <div className="ccdiv w-full h-[100vh]">
        <p>در حال بارگذار ...</p>
      </div>
    )
  }


  return (
    <>
      <div className={`${filterbox ? "flex" : "hidden"}`}>
        <FilterBox
          filters={Filters}
          onFilterChange={handleFilterChange}
          closedlightBox={handleOpenedlightbox}
        />
      </div>
      <FilesOnMap
        allProperty={finalProperties}
        onMap={mapStatus}
        setOnMap={setMapStatus}
      />
      <div className="filterHeader ccdiv flex-col w-full h-[90vh] md:h-[100vh]">
        <div className="info text-center z-1">
          <h1 className="text-7xl font-bold text-[var(--title)]">{(dynamicdata as any)?.siteName ? (dynamicdata as any)?.siteName : ''}</h1>
          <p className="mt-5 text-2xl font-light text-[var(--headertext)] bg[var(--title)] px3">
            {(dynamicdata as any)?.siteTarget ? (dynamicdata as any)?.siteTarget : ''}
          </p>
        </div>
        <div className="searchBox w-full flex flex-col justify-center md:flex-row relative z-1 mt-10">
          <input
            type="text"
            placeholder="نوع ملک، متراژ، قیمت، ..."
            className="w-[95%] md:w-[33%] h-[60px] mr-[2.5%] border border-[var(--headertext)]/20 bg-[var(--background)] cursor-pointer outline-none rounded-xl px-6"
            onClick={() => {
              handleOpenedlightbox();
            }}
          />
          <button
            onClick={() => {
              handleOpenedlightbox();
            }}
            className="absolute w-[35%] md:w-[10%] h-[45px] pb-1 top-[7.5px] rounded-xl right-[60%] md:right-[51%] cursor-pointer border border-[var(--headertext)]/20"
          >
            جست و جو
          </button>
          <button
            onClick={() => {
              setMapStatus(true);
            }}
            className="w-[95%] flex items-center justify-center gap-2 mt-5 md:mt-0 md:w-[12%] h-[58px] pb-1 top-[7.5px] rounded-xl mr-[10px] cursor-pointer bg-[var(--background)] border border-[var(--headertext)]/20"
          >
            <i className="ri-map-2-line"></i>جست و جو با نقشه
          </button>
        </div>

        {/* <button
            className="w-[70px] h-[70px] bg-[var(--background)] rounded-full mt-25 md:mt-13 ccdiv text-[var(--title)] text-2xl"
        ><i className="ri-arrow-down-line"></i></button> */}
      </div>
    </>
  );
}

export default MainFilter;
