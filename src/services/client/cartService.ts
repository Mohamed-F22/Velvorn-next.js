export const cartService = {
  async getCart() {
    const res = await fetch("/api/cart/get");
    if (!res.ok) throw new Error("Failed to fetch cart");
    return res.json();
  },

  async mergeCart(localItems: any) {
    const res = await fetch("/api/cart/merge", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ localItems }),
    });
    if (!res.ok) throw new Error("Failed to add item");
    return res.json();
  },

  async addItem(data: any) {
    const res = await fetch("/api/cart/add", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to add item");
    return res.json();
  },

  async updateItem(data: any) {
    const res = await fetch("/api/cart/update", {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to update item");
    return res.json();
  },

  async deleteItem(data: any) {
    const res = await fetch("/api/cart/delete", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error("Failed to delete item");
    return res.json();
  },
};

export const mapCartItems = (items: any[]) => {
  return items.map((item) => ({
    ...item.product,
    quantity: item.quantity,
    selectedSize: item.size,
    _id: item.product._id,
  }));
};
