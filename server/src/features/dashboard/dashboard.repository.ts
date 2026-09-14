import { prisma } from "../../database/prisma.js";

export class DashboardRepository {
  async getSalesSummary() {
    const now = new Date();

    // Start of today
    const todayStart = new Date(now);
    todayStart.setHours(0, 0, 0, 0);

    // Start of tomorrow
    const tomorrowStart = new Date(todayStart);
    tomorrowStart.setDate(tomorrowStart.getDate() + 1);

    // Start of this week (Monday)
    const weekStart = new Date(todayStart);
    const dayOfWeek = weekStart.getDay();

    const daysSinceMonday =
      dayOfWeek === 0 ? 6 : dayOfWeek - 1;

    weekStart.setDate(
      weekStart.getDate() - daysSinceMonday,
    );

    // Start of next week
    const nextWeekStart = new Date(weekStart);
    nextWeekStart.setDate(
      nextWeekStart.getDate() + 7,
    );

    // Start of this month
    const monthStart = new Date(
      now.getFullYear(),
      now.getMonth(),
      1,
    );

    // Start of next month
    const nextMonthStart = new Date(
      now.getFullYear(),
      now.getMonth() + 1,
      1,
    );

    const [today, thisWeek, thisMonth] =
      await Promise.all([
        prisma.deliveryItem.aggregate({
          _sum: {
            subtotal: true,
          },
          where: {
            delivery: {
              status: "COMPLETED",
              deliveryDate: {
                gte: todayStart,
                lt: tomorrowStart,
              },
            },
          },
        }),

        prisma.deliveryItem.aggregate({
          _sum: {
            subtotal: true,
          },
          where: {
            delivery: {
              status: "COMPLETED",
              deliveryDate: {
                gte: weekStart,
                lt: nextWeekStart,
              },
            },
          },
        }),

        prisma.deliveryItem.aggregate({
          _sum: {
            subtotal: true,
          },
          where: {
            delivery: {
              status: "COMPLETED",
              deliveryDate: {
                gte: monthStart,
                lt: nextMonthStart,
              },
            },
          },
        }),
      ]);

    return {
      today: today._sum.subtotal ?? 0,
      thisWeek: thisWeek._sum.subtotal ?? 0,
      thisMonth: thisMonth._sum.subtotal ?? 0,
    };
  }

  async getDeliverySummary() {
  const [draft, completed, cancelled] =
    await Promise.all([
      prisma.delivery.count({
        where: {
          status: "DRAFT",
        },
      }),

      prisma.delivery.count({
        where: {
          status: "COMPLETED",
        },
      }),

      prisma.delivery.count({
        where: {
          status: "CANCELLED",
        },
      }),
    ]);

  return {
    draft,
    completed,
    cancelled,
  };
}

async getInventorySummary() {
  const [totalProducts, lowStockResult, outOfStock] =
    await Promise.all([
      prisma.product.count(),

      prisma.$queryRaw<
        Array<{
          count: bigint;
        }>
      >`
        SELECT COUNT(*) AS count
        FROM "inventory"
        WHERE quantity > 0
          AND quantity <= "minimumStock"
      `,

      prisma.inventory.count({
        where: {
          quantity: 0,
        },
      }),
    ]);

  const lowStock = Number(lowStockResult[0]?.count ?? 0);

  return {
    totalProducts,
    lowStock,
    outOfStock,
  };
}

async getTopSellingProducts() {
  const products = await prisma.product.findMany({
    where: {
      deliveryItems: {
        some: {
          delivery: {
            status: "COMPLETED",
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      deliveryItems: {
        where: {
          delivery: {
            status: "COMPLETED",
          },
        },
        select: {
          quantity: true,
        },
      },
    },
  });

  return products
    .map((product) => ({
      productId: product.id,
      productName: product.name,
      quantitySold: product.deliveryItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }))
    .sort((a, b) => b.quantitySold - a.quantitySold)
    .slice(0, 5);
}

async getProductsInDemand() {
  const products = await prisma.product.findMany({
    where: {
      orderItems: {
        some: {
          order: {
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
          },
        },
      },
    },
    select: {
      id: true,
      name: true,
      orderItems: {
        where: {
          order: {
            status: {
              in: ["PENDING", "CONFIRMED"],
            },
          },
        },
        select: {
          quantity: true,
        },
      },
    },
  });

  return products
    .map((product) => ({
      productId: product.id,
      productName: product.name,
      quantityDemanded: product.orderItems.reduce(
        (total, item) => total + item.quantity,
        0,
      ),
    }))
    .sort(
      (a, b) =>
        b.quantityDemanded - a.quantityDemanded,
    )
    .slice(0, 5);
}

async getRecentOrders() {
  const orders = await prisma.order.findMany({
    orderBy: [
      {
        orderDate: "desc",
      },
        {
          id: "desc",
        },
    ],
    take: 10,
    select: {
      id: true,
      orderDate: true,
      status: true,
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        select: {
          subtotal: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    orderId: order.id,
    customerId: order.customer.id,
    customerName: order.customer.name,
    orderDate: order.orderDate,
    status: order.status,
    totalAmount: order.items.reduce(
      (total, item) =>
        total + Number(item.subtotal),
      0,
    ),
  }));
}

async getOrders(filters?: {
  status?: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  customerId?: number;
  from?: string;
  to?: string;
  limit?: number;
}) {
  const toDate = filters?.to
  ? new Date(`${filters.to}T00:00:00.000Z`)
  : undefined;

  if (toDate) {
    toDate.setDate(toDate.getDate() + 1);
  }

  const orders = await prisma.order.findMany({
    where: {
      ...(filters?.status
        ? {
            status: filters.status,
          }
        : {}),

      ...(filters?.customerId
        ? {
            customerId: filters.customerId,
          }
        : {}),

      ...(filters?.from || filters?.to
        ? {
            orderDate: {
              ...(filters?.from
                ? {
                    gte: new Date(
                      `${filters.from}T00:00:00.000Z`,
                    ),
                  }
                : {}),

              ...(toDate
                ? {
                    lt: toDate,
                  }
                : {}),
            },
          }
        : {}),
    },

    orderBy: [
        {
          orderDate: "desc",
        },
        {
          id: "desc",
        },
    ],

    take: filters?.limit ?? 50,

    select: {
      id: true,
      orderDate: true,
      status: true,

      customer: {
        select: {
          id: true,
          name: true,
        },
      },

      items: {
        select: {
          subtotal: true,
        },
      },
    },
  });

  return orders.map((order) => ({
    orderId: order.id,
    customerId: order.customer.id,
    customerName: order.customer.name,
    orderDate: order.orderDate,
    status: order.status,
    totalAmount: order.items.reduce(
      (total, item) =>
        total + Number(item.subtotal),
      0,
    ),
  }));
}

async getDeliveries(filters?: {
  status?: "DRAFT" | "COMPLETED" | "CANCELLED";
  customerId?: number;
  from?: string;
  to?: string;
  limit?: number;
}) {
  const toDate = filters?.to
    ? new Date(`${filters.to}T00:00:00.000Z`)
    : undefined;

  if (toDate) {
    toDate.setDate(toDate.getDate() + 1);
  }

  const deliveries = await prisma.delivery.findMany({
    where: {
      ...(filters?.status
        ? {
            status: filters.status,
          }
        : {}),

      ...(filters?.customerId
        ? {
            customerId: filters.customerId,
          }
        : {}),

      ...(filters?.from || filters?.to
        ? {
            deliveryDate: {
              ...(filters?.from
                ? {
                    gte: new Date(
                      `${filters.from}T00:00:00.000Z`,
                    ),
                  }
                : {}),

              ...(toDate
                ? {
                    lt: toDate,
                  }
                : {}),
            },
          }
        : {}),
    },

      orderBy: [
        {
          deliveryDate: "desc",
        },
          {
            id: "desc",
          },
      ],

    take: filters?.limit ?? 50,

    select: {
      id: true,
      deliveryDate: true,
      status: true,

      customer: {
        select: {
          id: true,
          name: true,
        },
      },

      items: {
        select: {
          subtotal: true,
        },
      },
    },
  });

  return deliveries.map((delivery) => ({
    deliveryId: delivery.id,
    customerId: delivery.customer.id,
    customerName: delivery.customer.name,
    deliveryDate: delivery.deliveryDate,
    status: delivery.status,
    totalAmount: delivery.items.reduce(
      (total, item) =>
        total + Number(item.subtotal ?? 0),
      0,
    ),
  }));
}

async getRecentDeliveries() {
  const deliveries = await prisma.delivery.findMany({
    orderBy: [
        {
          deliveryDate: "desc",
        },
        {
          id: "desc",
        },
    ],
    take: 10,
    select: {
      id: true,
      deliveryDate: true,
      status: true,
      customer: {
        select: {
          id: true,
          name: true,
        },
      },
      items: {
        select: {
          subtotal: true,
        },
      },
    },
  });

  return deliveries.map((delivery) => ({
    deliveryId: delivery.id,
    customerId: delivery.customer.id,
    customerName: delivery.customer.name,
    deliveryDate: delivery.deliveryDate,
    status: delivery.status,
    totalAmount: delivery.items.reduce(
      (total, item) =>
        total + Number(item.subtotal ?? 0),
      0,
    ),
  }));
}

}

export const dashboardRepository =
  new DashboardRepository();

  

  

  

  

