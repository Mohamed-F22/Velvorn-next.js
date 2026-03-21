import cartModel from "@/app/models/cartModel";
import { AppError } from "../Errors/AppError";
import productModel from "../models/ProductModel";

interface createCart {
  userId: string;
}
const createCart = async ({ userId }: createCart) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }

  const cart = await cartModel.create({
    userId,
    items: [],
    totalAmount: 0,
  });
  return cart;
};

interface getCart {
  userId: string;
}

export const getCart = async ({ userId }: getCart) => {
  let cart = await cartModel.findOne({ userId, status: "active" }).populate({
    path: "items.product",
    model: productModel,
    select: "title imgs price offerPrice stock",
  });

  if (!cart) {
    cart = await createCart({ userId });
  }

  return cart;
};

interface addItemToCart {
  productId: string;
  quantity: number;
  size: string;
  userId: string;
}

export const addItemToCart = async ({
  productId,
  quantity,
  size,
  userId,
}: addItemToCart) => {
  if (!productId || !size || quantity <= 0) {
    throw new AppError("Invalid input data", 400);
  }
  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  const price = product.offerPrice || product.price;

  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCart({ userId });
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId && item.size === size,
  );

  if (itemIndex > -1) {
    cart.items[itemIndex].quantity += quantity;
  } else {
    cart.items.push({
      product: productId,
      quantity,
      unitPrice: price,
      size,
    });
  }

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();
  const finalCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate({
      path: "items.product",
      model: productModel,
      select: "title imgs price offerPrice stock",
    });
  return finalCart;
};

interface updateItemInCart {
  productId: string;
  size: string;
  quantity: number;
  userId: string;
}

export const updateItemInCart = async ({
  productId,
  size,
  quantity,
  userId,
}: updateItemInCart) => {
  if (!productId || !size || quantity === undefined) {
    throw new AppError("Missing some data!", 400);
  }

  if (quantity < 1) {
    throw new AppError("Quantity must be at least 1", 400);
  }

  const cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    throw new AppError("Cart not found!", 404);
  }

  const itemIndex = cart.items.findIndex(
    (item: any) => item.product.toString() === productId && item.size === size,
  );

  if (itemIndex === -1) {
    throw new AppError("Item not found in cart!", 404);
  }

  const product = await productModel.findById(productId);

  if (!product) {
    throw new AppError("Product not found", 404);
  }

  if (quantity > product.stock) {
    throw new AppError("Not enough stock", 400);
  }

  if (quantity === 0) {
    cart.items.splice(itemIndex, 1);
  } else {
    cart.items[itemIndex].quantity = quantity;
  }

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();

  const finalCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate({
      path: "items.product",
      model: productModel,
      select: "title imgs price offerPrice stock",
    });
  return finalCart;
};

interface deleteItem {
  productId: string;
  size: string;
  userId: string;
}

export const deleteItem = async ({ productId, size, userId }: deleteItem) => {
  if (!productId || !size) {
    throw new AppError("Missing some data!", 400);
  }

  const cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    throw new AppError("Cart not found!", 404);
  }

  const originalLength = cart.items.length;
  cart.items = cart.items.filter(
    (item: any) =>
      !(item.product.toString() === productId && item.size === size),
  );

  if (cart.items.length === originalLength) {
    throw new AppError("Item not found in cart!", 404);
  }

  cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
    return acc + item.quantity * item.unitPrice;
  }, 0);

  await cart.save();
  const finalCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate({
      path: "items.product",
      model: productModel,
      select: "title imgs price offerPrice stock",
    });

  return finalCart;
};

interface clearCart {
  userId: string;
}

export const clearCart = async ({ userId }: clearCart) => {
  if (!userId) {
    throw new AppError("User ID is required", 400);
  }
  let cart = await cartModel.findOneAndUpdate(
    { userId, status: "active" },
    {
      $set: {
        items: [],
        totalAmount: 0,
      },
    },
    { new: true },
  );

  if (!cart) {
    cart = await createCart({ userId });
  }
  return cart;
};

interface LocalItem {
  product: string;
  quantity: number;
  size?: string;
}

export const mergeLocalCart = async (
  localItems: LocalItem[],
  userId: string,
) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await createCart({ userId });
  }

  if (localItems.length) {
    const productIds = localItems.map((item) => item.product);

    const products = await productModel.find({
      _id: { $in: productIds },
    });

    const productMap = new Map(products.map((p) => [p._id.toString(), p]));

    localItems.forEach((localItem) => {
      const product = productMap.get(localItem.product);

      if (!product) return;

      const price = product.offerPrice || product.price;

      const existingItemIndex = cart.items.findIndex(
        (dbItem: any) =>
          dbItem.product.toString() === localItem.product &&
          dbItem.size === localItem.size,
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += localItem.quantity;
      } else {
        cart.items.push({
          product: localItem.product,
          quantity: localItem.quantity,
          size: localItem.size,
          unitPrice: price,
        });
      }
    });

    cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.unitPrice;
    }, 0);
  }

  await cart.save();

  const finalCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate({
      path: "items.product",
      model: productModel,
      select: "title imgs price offerPrice stock",
    });

  return finalCart;
};
