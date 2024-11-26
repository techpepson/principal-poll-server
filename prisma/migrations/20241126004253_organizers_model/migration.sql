-- CreateTable
CREATE TABLE "Organizers" (
    "id" SERIAL NOT NULL,
    "organizationName" TEXT NOT NULL,
    "phone" TEXT NOT NULL,
    "otherPhone" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "profileImage" TEXT NOT NULL,

    CONSTRAINT "Organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Contestants" (
    "id" SERIAL NOT NULL,

    CONSTRAINT "Contestants_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Organizers_id_key" ON "Organizers"("id");
