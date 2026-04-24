-- AlterTable
ALTER TABLE "Property" ADD COLUMN     "bathroomFeatures" TEXT[],
ADD COLUMN     "buildingFacade" TEXT,
ADD COLUMN     "commonAreas" TEXT[],
ADD COLUMN     "floorCovering" TEXT,
ADD COLUMN     "heatingCooling" TEXT[],
ADD COLUMN     "kitchenFeatures" TEXT[],
ADD COLUMN     "otherFeatures" TEXT[],
ADD COLUMN     "parkingTypes" TEXT[],
ADD COLUMN     "propertySpecs" TEXT[],
ADD COLUMN     "utilities" TEXT[],
ADD COLUMN     "wallCeiling" TEXT[];
