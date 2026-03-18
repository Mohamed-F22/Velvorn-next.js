import cartModel from "@/app/models/cartModel";
import productModel from "@/app/models/ProductModel";

export const mergeLocalCart = async (localItems: any, userId: string) => {
  let cart = await cartModel.findOne({ userId, status: "active" });

  if (!cart) {
    cart = await cartModel.create({ userId, items: [], totalAmount: 0 });
  }

  if (localItems && localItems.length > 0) {
    localItems.forEach((localItem: any) => {
      const existingItemIndex = cart.items.findIndex(
        (dbItem: any) =>
          dbItem.product.toString() === localItem.product &&
          dbItem.size === localItem.size,
      );

      if (existingItemIndex > -1) {
        cart.items[existingItemIndex].quantity += localItem.quantity;
      } else {
        cart.items.push(localItem);
      }
    });

    cart.totalAmount = cart.items.reduce((acc: number, item: any) => {
      return acc + item.quantity * item.unitPrice;
    }, 0);

    await cart.save();
  }

  const finalCart = await cartModel
    .findOne({ userId, status: "active" })
    .populate({
      path: "items.product",
      model: productModel,
      select: "title imgs price offerPrice stock",
    });

  return finalCart;
};
