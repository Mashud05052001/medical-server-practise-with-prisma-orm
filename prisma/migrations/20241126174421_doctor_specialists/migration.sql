-- CreateTable
CREATE TABLE "specialities" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "doctor" TEXT NOT NULL,
    "icon" TEXT NOT NULL,

    CONSTRAINT "specialities_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "doctorSpecialists" (
    "specialitiesId" TEXT NOT NULL,
    "doctorId" TEXT NOT NULL,

    CONSTRAINT "doctorSpecialists_pkey" PRIMARY KEY ("doctorId","specialitiesId")
);

-- AddForeignKey
ALTER TABLE "doctorSpecialists" ADD CONSTRAINT "doctorSpecialists_specialitiesId_fkey" FOREIGN KEY ("specialitiesId") REFERENCES "specialities"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "doctorSpecialists" ADD CONSTRAINT "doctorSpecialists_doctorId_fkey" FOREIGN KEY ("doctorId") REFERENCES "doctors"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
