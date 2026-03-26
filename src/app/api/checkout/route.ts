import { dbConnect } from "@/lib/mongodb";
import cartModel from "@/models/cartModel";
import orderModel from "@/models/orderModel";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import mongoose from "mongoose";
import { getUserFromToken } from "@/services/server/userService";
import {
  buildGuestOrderItems,
  buildUserOrderItems,
  validateAddress,
} from "@/services/server/checkoutService";
import { AppError } from "@/Errors/AppError";
import { RequestLog } from "@/models/RequestLog";

const SHIPPING_FEES = 15;

// export async function POST(req: Request) {
//   const session = await mongoose.startSession();

//   try {
//     await dbConnect();

//     const idempotencyKey = req.headers.get("x-idempotency-key");

//     if (idempotencyKey) {
//       try {
//         await RequestLog.create({ key: idempotencyKey });
//       } catch (err: any) {
//         if (err.code === 11000) {
//           throw new AppError("Request already processed", 409);
//         }
//         throw err;
//       }
//     }

//     const cookieStore = await cookies();
//     const token = cookieStore.get("token")?.value;
//     const userId = await getUserFromToken(token);

//     const body = await req.json();
//     const { shippingAddress, notes, guestItems } = body;

//     if (!validateAddress(shippingAddress)) {
//       throw new AppError("Invalid address data!", 400);
//     }

//     let orderData;

//     if (userId) {
//       orderData = await buildUserOrderItems(userId);
//     } else if (guestItems?.length > 0) {
//       orderData = await buildGuestOrderItems(guestItems);
//     } else {
//       throw new AppError("Cart is empty!", 400);
//     }

//     const finalAmount = orderData.total + SHIPPING_FEES;

//     let newOrder: any[] | undefined;

//     await session.withTransaction(async () => {
//       newOrder = await orderModel.create(
//         [
//           {
//             orderItems: orderData.items,
//             totalAmount: finalAmount,
//             shippingAddress,
//             userId: userId || null,
//             notes,
//           },
//         ],
//         { session },
//       );

//       if (userId) {
//         await cartModel.findOneAndUpdate(
//           { userId, status: "active" },
//           { items: [], totalAmount: 0 },
//           { session },
//         );
//       }
//     });

//     return NextResponse.json(
//       { success: true, orderId: newOrder?.[0]._id },
//       { status: 201 },
//     );
//   } catch (error: any) {
//     return NextResponse.json(
//       { message: error.message || "Server Error" },
//       { status: 500 },
//     );
//   } finally {
//     session.endSession();
//   }
// }


export async function POST(req: Request) {
  try {
    // 1. الاتصال بقاعدة البيانات أولاً
    await dbConnect();

    const idempotencyKey = req.headers.get("x-idempotency-key");

    // 2. التحقق من مفتاح تكرار الطلب (Idempotency)
    if (idempotencyKey) {
      try {
        await RequestLog.create({ key: idempotencyKey });
      } catch (err: any) {
        if (err.code === 11000) {
          return NextResponse.json(
            { message: "Request already processed" },
            { status: 409 }
          );
        }
        throw err;
      }
    }

    const cookieStore = await cookies();
    const token = cookieStore.get("token")?.value;
    const userId = await getUserFromToken(token);

    const body = await req.json();
    const { shippingAddress, notes, guestItems } = body;

    // 3. التحقق من البيانات
    if (!validateAddress(shippingAddress)) {
      return NextResponse.json(
        { message: "Invalid address data!" },
        { status: 400 }
      );
    }

    let orderData;
    if (userId) {
      orderData = await buildUserOrderItems(userId);
    } else if (guestItems?.length > 0) {
      orderData = await buildGuestOrderItems(guestItems);
    } else {
      return NextResponse.json(
        { message: "Cart is empty!" },
        { status: 400 }
      );
    }

    const finalAmount = orderData.total + SHIPPING_FEES;

    // 4. إنشاء الطلب مباشرة (بدون Session)
    const newOrder = await orderModel.create({
      orderItems: orderData.items,
      totalAmount: finalAmount,
      shippingAddress,
      userId: userId || null,
      notes,
    });

    // 5. تفريغ السلة إذا كان المستخدم مسجلاً
    if (userId) {
      await cartModel.findOneAndUpdate(
        { userId, status: "active" },
        { items: [], totalAmount: 0 }
      );
    }

    return NextResponse.json(
      { success: true, orderId: newOrder._id },
      { status: 201 }
    );

  } catch (error: any) {
    console.error("Checkout Error Log:", error);
    
    // إرجاع حالة الخطأ بناءً على نوع الخطأ أو 500 كحالة افتراضية
    const statusCode = error.statusCode || 500;
    return NextResponse.json(
      { message: error.message || "Server Error" },
      { status: statusCode }
    );
  }
}