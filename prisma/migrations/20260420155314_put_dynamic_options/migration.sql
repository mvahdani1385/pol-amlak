-- AlterTable
ALTER TABLE "Article" ALTER COLUMN "redirect" SET DEFAULT '';

-- AlterTable
ALTER TABLE "DynamicOptions" ADD COLUMN     "address" TEXT DEFAULT 'ایران - اصفحان - مبارکه',
ADD COLUMN     "certificates" TEXT[],
ADD COLUMN     "coptright" TEXT DEFAULT 'تمامی حقوق مادی و معنوی این وبسایت متعلق به پل است',
ADD COLUMN     "footerText" TEXT DEFAULT 'لورم ایپسوم و با استفاده از طراحان گرافیک است، چاپگرها و متون بلکه روزنامه وجود طراحی اساسا مورد استفاده قرار گیرد.',
ADD COLUMN     "siteEmail" TEXT DEFAULT 'pol@info.com',
ADD COLUMN     "siteName" TEXT DEFAULT 'املاک پل',
ADD COLUMN     "sitePhone" TEXT DEFAULT '09932169402',
ADD COLUMN     "siteTarget" TEXT DEFAULT 'بزرگترین املاک لنجان و مبارکه';
