import { db } from "@/src/app/_lib/prisma";

// Apenas para referencia

export async function GET() {
    const categories = await db.category.findMany({});
    return Response.json({categories}, {
        status: 200,
    })
}

// export async function POST(request: Request) {
//     const body = await request.json();
//     const name = body.name;
//     const price = body.price;
//     const stock = body.stock;
//     await db.category.create({
//         data: {
//             name,
//             price,
//             stock
//         }
//     })
//     return Response.json({}, { status: 201 })
// }