import { NextResponse } from 'next/server';
import Product from '@/models/Product';
import { dbConnect } from '@/lib/mongodb';

export async function GET() {
  try {
    await dbConnect();

    // جلب كل المنتجات بدون فلترة
    const allProducts = await Product.find({});
    
    // إرسال المصفوفة مباشرة
    return NextResponse.json(allProducts);
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}