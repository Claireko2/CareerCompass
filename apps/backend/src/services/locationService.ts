import { PrismaClient } from '@prisma/client';
const prisma = new PrismaClient();

export const upsertLocation = async (
    city: string | null,
    region: string | null,
    country: string
) => {
    return prisma.location.upsert({
        where: {
            city_region_country: {
                city: city ?? 'Unknown',
                region: region ?? 'Unknown',
                country,
            },
        },
        create: { city, region, country },
        update: {},
    });
};

export const findLocationById = async (id: string) => {
    return prisma.location.findUnique({ where: { id } });
};
