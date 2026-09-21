import { prisma } from "../../database/prisma.js";
export class SalesRepository {
    async getSalesSummary() {
        const completedDeliveries = await prisma.delivery.findMany({
            where: {
                status: "COMPLETED",
            },
            include: {
                items: true,
            },
        });
        return completedDeliveries;
    }
}
export const salesRepository = new SalesRepository();
