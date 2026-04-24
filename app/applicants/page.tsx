"use client";

import { useEffect, useState, Fragment } from "react";
import { propertyFeatures } from "@/propertyFeatures.config";
import TextInput from "@/app/components/themes/TextInput";
import NumberInput from "@/app/components/themes/NumberInput";
import SelectInput from "@/app/components/themes/SelectInput";
import TextArey from "@/app/components/themes/TextArey";
import { toast } from "react-toastify";

interface data {
  city: string[] | null | undefined;
  Province: string | null | undefined;
}

export default function ApplicantRequestPage() {
  const [applicantData, setApplicantData] = useState<any>({
    title: "",
    description: "",
    fullName: "",
    mobile: "",
    email: "",
    propertyType: "",
    dealType: "",
    status: "active",
    budgetMin: "",
    budgetMax: "",
    city: "",
    province: "",
    buildingFacade: [],
    floorCovering: [],
    commonAreas: [],
    heatingCooling: [],
    kitchenFeatures: [],
    otherFeatures: [],
    wallCeiling: [],
    parkingTypes: [],
    propertySpecs: [],
    utilities: [],
    minRoomNumber: "",
    maxRoomNumber: "",
    propertydirection: "Not specified",
    propertyUnit: "Not specified",
    propertyFloors: "",
    floor: "",
    unitInFloor: "",
    allUnit: "",
    minLandArea: "",
    maxLandArea: "",
    minBuildingArea: "",
    maxBuildingArea: "",
    categoryTitle: "",
  });

  const [citys, setCitys] = useState<data[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [dealType, setDealType] = useState<string>("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function getPropertyTypes(dealType?: string) {
    const allTypes = [
      "Apartment",
      "Villa",
      "Yard House",
      "Land",
      "Office",
      "Shop",
      "Commercial",
      "Old Structure",
      "Warehouse",
      "Hotel",
      "Garden",
      "Livestock",
      "Poultry",
      "Factory",
      "Workshop",
      "Hall",
      "Basement",
      "Suite",
    ];

    // For now, return all types regardless of deal type
    // Later we can customize based on deal type if needed
    return allTypes;
  }

  const propertyTypes = getPropertyTypes(dealType);

  const handleApplicantChange = (key: string, value: any) => {
    setApplicantData((prev: any) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleArrayFieldChange = (fieldName: string, value: string) => {
    const currentValues = applicantData[fieldName] || [];
    const newValues = currentValues.includes(value)
      ? currentValues.filter((item: string) => item !== value)
      : [...currentValues, value];

    handleApplicantChange(fieldName, newValues);
  };

  const getFeatureFieldName = (category: string): string => {
    const fieldMapping: { [key: string]: string } = {
      "Utilities": "utilities",
      "Property Specifications": "propertySpecs",
      "Building Facade": "buildingFacade",
      "Common Areas": "commonAreas",
      "Heating & Cooling": "heatingCooling",
      "Floor Covering": "floorCovering",
      "Kitchen": "kitchenFeatures",
      "Other Features": "otherFeatures",
      "Wall & Ceiling": "wallCeiling",
      "Parking Types": "parkingTypes",
      "Property Direction": "propertydirection",
      "Property Unit": "propertyUnit",
      "Total Floors": "propertyFloors",
      "Floor": "floor",
      "Units Per Floor": "unitInFloor",
      "Total Units": "allUnit",
      "Min Land Area": "minLandArea",
      "Max Land Area": "maxLandArea",
      "Min Building Area": "minBuildingArea",
      "Max Building Area": "maxBuildingArea",
      "Min Room Number": "minRoomNumber",
      "Max Room Number": "maxRoomNumber",
      "Category Title": "categoryTitle",
    };
    return fieldMapping[category] || category;
  };

  const handleSubmit = async () => {
    if (applicantData.title === "") {
      toast.warn("Please enter a title");
      return;
    }

    if (applicantData.dealType === "") {
      toast.warn("Please select a deal type");
      return;
    }
    if (applicantData.propertyType === "") {
      toast.warn("Please select a property type");
      return;
    }

    if (applicantData.fullName === "") {
      toast.warn("Please enter your full name");
      return;
    }

    if (applicantData.mobile === "") {
      toast.warn("Please enter your mobile number");
      return;
    }

    if (applicantData.email === "") {
      toast.warn("Please enter your email");
      return;
    }

    try {
      setIsSubmitting(true);
      
      const preparedApplicantData = {
        ...applicantData,
        categoryTitle: applicantData.categoryId,
        budgetMin: applicantData.budgetMin ? Number(applicantData.budgetMin) : null,
        budgetMax: applicantData.budgetMax ? Number(applicantData.budgetMax) : null,
        minLandArea: applicantData.minLandArea ? Number(applicantData.minLandArea) : null,
        maxLandArea: applicantData.maxLandArea ? Number(applicantData.maxLandArea) : null,
        minBuildingArea: applicantData.minBuildingArea ? Number(applicantData.minBuildingArea) : null,
        maxBuildingArea: applicantData.maxBuildingArea ? Number(applicantData.maxBuildingArea) : null,
        minRoomNumber: applicantData.minRoomNumber ? Number(applicantData.minRoomNumber) : null,
        maxRoomNumber: applicantData.maxRoomNumber ? Number(applicantData.maxRoomNumber) : null,
      };

      const applicantRes = await fetch("/api/applicants", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preparedApplicantData),
      });

      if (!applicantRes.ok) {
        const errorData = await applicantRes.json().catch(() => ({}));
        toast.error(errorData.error || "Error submitting request");
        return;
      }

      toast.success("Your request has been submitted successfully!");
      
      // Reset form
      setApplicantData({
        title: "",
        description: "",
        fullName: "",
        mobile: "",
        email: "",
        propertyType: "",
        dealType: "",
        status: "active",
        budgetMin: "",
        budgetMax: "",
        city: "",
        province: "",
        buildingFacade: [],
        floorCovering: [],
        commonAreas: [],
        heatingCooling: [],
        kitchenFeatures: [],
        otherFeatures: [],
        wallCeiling: [],
        parkingTypes: [],
        propertySpecs: [],
        utilities: [],
        minRoomNumber: "",
        maxRoomNumber: "",
        propertydirection: "Not specified",
        propertyUnit: "Not specified",
        propertyFloors: "",
        floor: "",
        unitInFloor: "",
        allUnit: "",
        minLandArea: "",
        maxLandArea: "",
        minBuildingArea: "",
        maxBuildingArea: "",
        categoryTitle: "",
      });
      
    } catch (error) {
      console.error("Error in form submission:", error);
      toast.error("An error occurred while submitting your request");
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    try {
      fetch("/api/dynamicOptions", {
        method: "GET",
        headers: {
          "Content-Type": "application/json; charset=utf-8",
        },
      })
        .then((res) => res.json())
        .then((data) => {
          setCitys(data);
          handleApplicantChange("province", data[0]?.Province || "");
        });
    } catch (error) {
      console.error("Error fetching dynamic site values", error);
    }
  }, []);

  useEffect(() => {
    try {
      fetch("/api/categories")
        .then((res) => res.json())
        .then((data) => {
          setCategories(data);
        });
    } catch (error) {
      console.error("Error fetching categories", error);
    }
  }, []);

  useEffect(() => {
    if (citys && citys.length > 0) {
      handleApplicantChange("province", citys[0].Province);
    }
  }, [citys]);

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <div className="bg-white rounded-lg shadow-lg p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-4">
              Property Request Form
            </h1>
            <p className="text-gray-600">
              Fill out the form below to submit your property request. Our team will contact you soon.
            </p>
          </div>

          {/* ================= Basic Information ================= */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Basic Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <TextInput
                  category={"title"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Request Title"}
                  isNumber={false}
                  value={applicantData.title}
                />
              </div>
              <div>
                <TextArey
                  category={"description"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Describe your ideal property"}
                  value={applicantData["description"]}
                />
              </div>
            </div>
          </section>

          {/* ================= Type and Status ================= */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Details</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <SelectInput
                place={"Deal Type"}
                values={["Buy", "Sell", "Rent", "Partnership", "Pre-sale"]}
                category={"dealType"}
                handlePropertyChange={handleApplicantChange}
                setDealType={setDealType}
                value={applicantData["dealType"]}
              />

              {applicantData.dealType && (
                <SelectInput
                  place="Property Type"
                  values={propertyTypes}
                  category="propertyType"
                  handlePropertyChange={handleApplicantChange}
                  value={applicantData["propertyType"]}
                />
              )}

              {applicantData.propertyType && (
                <SelectInput
                  place={"Category"}
                  values={categories.map(cat => cat.title)}
                  category={"categoryId"}
                  handlePropertyChange={handleApplicantChange}
                  value={applicantData["categoryId"]}
                />
              )}
            </div>
          </section>

          {/* ================= Applicant Information ================= */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Contact Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <TextInput
                category={"fullName"}
                handlePropertyChange={handleApplicantChange}
                place={"Full Name"}
                isNumber={false}
                value={applicantData.fullName}
              />

              <TextInput
                category={"mobile"}
                handlePropertyChange={handleApplicantChange}
                place={"Mobile Number"}
                isNumber={true}
                value={applicantData.mobile}
              />

              <TextInput
                category={"email"}
                handlePropertyChange={handleApplicantChange}
                place={"Email Address"}
                isNumber={false}
                value={applicantData.email}
              />
            </div>
          </section>

          {/* ================= Location ================= */}
          {applicantData.fullName && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Location Preferences</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <SelectInput
                  place={"City"}
                  values={citys?.[0]?.city || []}
                  category={"city"}
                  handlePropertyChange={handleApplicantChange}
                  value={applicantData["city"]}
                />

                <TextInput
                  category={"address"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Preferred Area/Neighborhood"}
                  isNumber={false}
                  value={applicantData.address}
                />
              </div>
            </section>
          )}

          {/* ================= Budget ================= */}
          {applicantData.city && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  category={"budgetMin"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Minimum Budget"}
                  isPrice={true}
                  value={applicantData.budgetMin}
                />

                <TextInput
                  category={"budgetMax"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Maximum Budget"}
                  isPrice={true}
                  value={applicantData.budgetMax}
                />
              </div>
            </section>
          )}

          {/* ================= Property Specifications ================= */}
          {applicantData.budgetMin && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold text-gray-900 mb-6">Property Specifications</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <TextInput
                  category={"minRoomNumber"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Minimum Number of Rooms"}
                  isNumber={true}
                  value={applicantData.minRoomNumber}
                />

                <TextInput
                  category={"maxRoomNumber"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Maximum Number of Rooms"}
                  isNumber={true}
                  value={applicantData.maxRoomNumber}
                />

                <TextInput
                  category={"minBuildingArea"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Minimum Building Area (m²)"}
                  isNumber={true}
                  value={applicantData.minBuildingArea}
                />

                <TextInput
                  category={"maxBuildingArea"}
                  handlePropertyChange={handleApplicantChange}
                  place={"Maximum Building Area (m²)"}
                  isNumber={true}
                  value={applicantData.maxBuildingArea}
                />
              </div>
            </section>
          )}

          {/* ================= Submit Button ================= */}
          {applicantData.minRoomNumber && (
            <section className="text-center">
              <button
                onClick={handleSubmit}
                disabled={isSubmitting}
                className="bg-blue-600 text-white px-8 py-3 rounded-lg hover:bg-blue-700 transition-colors font-medium disabled:bg-gray-400 disabled:cursor-not-allowed"
              >
                {isSubmitting ? "Submitting..." : "Submit Request"}
              </button>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
