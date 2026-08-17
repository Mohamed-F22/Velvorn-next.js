"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  IconButton,
  MenuItem,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableRow,
  TextField,
  Typography,
} from "@mui/material";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import AddIcon from "@mui/icons-material/Add";
import { PRODUCT_CATEGORIES, PRODUCT_STATUSES } from "@/lib/constants";

type Stock = { xs: number; sm: number; md: number; lg: number; xl: number };

type Product = {
  _id: string;
  title: string;
  category: string;
  style: string[];
  imgs: string[];
  price: number;
  offerPrice: number | null;
  stock: Stock;
  desc: string;
  status: string;
};

const SIZES = ["xs", "sm", "md", "lg", "xl"] as const;

const emptyForm = {
  title: "",
  category: "compression",
  style: "",
  imgs: [] as string[],
  imageUrl: "",
  price: 0,
  offerPrice: "" as string | number,
  stock: { xs: 0, sm: 0, md: 0, lg: 0, xl: 0 } as Stock,
  desc: "",
  status: "available",
};

export default function DashboardProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<string[]>([
    ...PRODUCT_CATEGORIES,
  ]);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [category, setCategory] = useState("");
  const [size, setSize] = useState("");
  const [offer, setOffer] = useState(false);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [sort, setSort] = useState("");
  const [open, setOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState("");
  const [newCategory, setNewCategory] = useState("");

  const categoryOptions = useMemo(() => {
    return [...new Set([...PRODUCT_CATEGORIES, ...categories])].sort();
  }, [categories]);

  const load = useCallback(async () => {
    setLoading(true);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (category) params.set("category", category);
    if (size) params.set("size", size);
    if (offer) params.set("offer", "true");
    if (minPrice !== "") params.set("minPrice", minPrice);
    if (maxPrice !== "") params.set("maxPrice", maxPrice);
    if (statusFilter) params.set("status", statusFilter);
    if (sort) params.set("sort", sort);

    const res = await fetch(`/api/admin/products?${params}`, {
      credentials: "include",
    });
    const data = await res.json();
    setProducts(data.products || []);
    if (data.categories?.length) {
      setCategories(data.categories);
    }
    setLoading(false);
  }, [q, category, size, offer, minPrice, maxPrice, statusFilter, sort]);

  useEffect(() => {
    const t = setTimeout(load, 250);
    return () => clearTimeout(t);
  }, [load]);

  const openCreate = () => {
    setEditingId(null);
    setForm({
      ...emptyForm,
      category: categoryOptions[0] || "compression",
    });
    setError("");
    setOpen(true);
  };

  const openEdit = (product: Product) => {
    setEditingId(product._id);
    setForm({
      title: product.title,
      category: product.category,
      style: (product.style || []).join(", "),
      imgs: product.imgs || [],
      imageUrl: "",
      price: product.price,
      offerPrice: product.offerPrice ?? "",
      stock: product.stock,
      desc: product.desc,
      status: product.status || "available",
    });
    setError("");
    setOpen(true);
  };

  const handleUpload = async (files: FileList | null) => {
    if (!files?.length) return;
    setUploading(true);
    setError("");
    try {
      const fd = new FormData();
      Array.from(files).forEach((f) => fd.append("files", f));
      const res = await fetch("/api/admin/upload", {
        method: "POST",
        credentials: "include",
        body: fd,
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed");
      setForm((prev) => ({ ...prev, imgs: [...prev.imgs, ...data.urls] }));
    } catch (e: any) {
      setError(e.message);
    } finally {
      setUploading(false);
    }
  };

  const addImageUrl = () => {
    if (!form.imageUrl.trim()) return;
    setForm((prev) => ({
      ...prev,
      imgs: [...prev.imgs, prev.imageUrl.trim()],
      imageUrl: "",
    }));
  };

  const addCategoryOption = () => {
    const value = newCategory.trim();
    if (!value) return;
    setCategories((prev) =>
      prev.includes(value) ? prev : [...prev, value].sort(),
    );
    setForm((prev) => ({ ...prev, category: value }));
    setNewCategory("");
  };

  const save = async () => {
    setSaving(true);
    setError("");

    const payload = {
      title: form.title,
      category: form.category.trim(),
      style: form.style
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean),
      imgs: form.imgs,
      price: Number(form.price),
      offerPrice:
        form.offerPrice === "" || form.offerPrice == null
          ? null
          : Number(form.offerPrice),
      stock: form.stock,
      desc: form.desc,
      status: form.status,
    };

    try {
      if (!payload.category) throw new Error("Category is required");

      const res = await fetch(
        editingId ? `/api/admin/products/${editingId}` : "/api/admin/products",
        {
          method: editingId ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Save failed");

      setCategories((prev) =>
        prev.includes(payload.category)
          ? prev
          : [...prev, payload.category].sort(),
      );
      setOpen(false);
      await load();
    } catch (e: any) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this product?")) return;
    await fetch(`/api/admin/products/${id}`, {
      method: "DELETE",
      credentials: "include",
    });
    await load();
  };

  const clearFilters = () => {
    setQ("");
    setCategory("");
    setSize("");
    setOffer(false);
    setMinPrice("");
    setMaxPrice("");
    setStatusFilter("");
    setSort("");
  };

  return (
    <Box>
      <Stack
        direction={{ xs: "row" }}
        justifyContent="space-between"
        alignItems={{ sm: "center" }}
        gap={2}
        mb={3}
      >
        <Typography variant="h4" sx={{ fontWeight: 700 }}>
          Products
        </Typography>
        <Button
          startIcon={<AddIcon />}
          variant="contained"
          onClick={openCreate}
          sx={{
            bgcolor: "#222",
            borderRadius: 0,
            "&:hover": { bgcolor: "#444" },
          }}
        >
          Add product
        </Button>
      </Stack>

      <Box
        sx={{
          bgcolor: "#fff",
          border: "1px solid #e5e5e5",
          p: 2,
          mb: 2,
        }}
      >
        <Stack spacing={2}>
          <Grid container spacing={2}>
            {/* search */}
            <Grid size={{ xs: 12, sm: 5, md: 5, lg: 4.5 }}>
              <TextField
                size="small"
                placeholder="Search products..."
                value={q}
                onChange={(e) => setQ(e.target.value)}
                sx={{ width: "100%" }}
              />
            </Grid>
            {/* price range */}
            <Grid container size={{ xs: 12, sm: 4, md: 4, lg: 5 }}>
              <Grid size={{ xs: 6 }}>
                <TextField
                  size="small"
                  type="number"
                  label="Min price"
                  value={minPrice}
                  onChange={(e) => setMinPrice(e.target.value)}
                  sx={{ width: "100%" }}
                />
              </Grid>
              <Grid size={{ xs: 6 }}>
                {" "}
                <TextField
                  size="small"
                  type="number"
                  label="Max price"
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(e.target.value)}
                  sx={{ width: "100%" }}
                />
              </Grid>
            </Grid>
            {/* offer */}
            <Grid
              sx={{ display: { xs: "none", sm: "block" } }}
              size={{ xs: 3, sm: 3, md: 3, lg: 2.5 }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={offer}
                    onChange={(e) => setOffer(e.target.checked)}
                  />
                }
                label="On offer"
              />
            </Grid>
            {/* category */}
            <Grid size={{ xs: 6, sm: 2.25, md: 2.5, lg: 2.25 }}>
              <TextField
                select
                size="small"
                label="Category"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">All</MenuItem>
                {categoryOptions.map((c) => (
                  <MenuItem key={c} value={c}>
                    {c}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* size */}
            <Grid size={{ xs: 6, sm: 2.25, md: 2.5, lg: 2.25 }}>
              <TextField
                select
                size="small"
                label="Size"
                value={size}
                onChange={(e) => setSize(e.target.value)}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">All</MenuItem>
                {SIZES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s.toUpperCase()}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* status */}
            <Grid size={{ xs: 6, sm: 2.25, md: 2, lg: 2.5 }}>
              <TextField
                select
                size="small"
                label="Status"
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">All</MenuItem>
                {PRODUCT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            {/* sort */}
            <Grid size={{ xs: 6, sm: 2.25, md: 2, lg: 2.5 }}>
              <TextField
                select
                size="small"
                label="Sort"
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                sx={{ width: "100%" }}
              >
                <MenuItem value="">Newest</MenuItem>
                <MenuItem value="price-asc">Price: Low to High</MenuItem>
                <MenuItem value="price-desc">Price: High to Low</MenuItem>
              </TextField>
            </Grid>
            {/* clear filters */}
            <Grid  size={{ xs: 6, sm: 3, md: 3, lg: 2.5 }}>
              <Button
                sx={{
                  fontSize: { sm: "13px", md: "14px" },
                  py: { sm: "7px", md: "6px" },
                  px: { sm: "8px", md: "15px" },
                  width: "100%",
                }}
                variant="outlined"
                color="error"
                onClick={clearFilters}
              >
                Clear filters
              </Button>
            </Grid>
            <Grid
              sx={{ display: { xs: "block", sm: "none" } }}
              size={{ xs: 6 }}
            >
              <FormControlLabel
                sx={{ m: 0 }}
                control={
                  <Checkbox
                    checked={offer}
                    onChange={(e) => setOffer(e.target.checked)}
                  />
                }
                label="On offer"
              />
            </Grid>
          </Grid>
        </Stack>
      </Box>

      {/* {loading ? (
        <CircularProgress sx={{ color: "#222" }} />
      ) : (
        <Box
          sx={{
            overflowX: "auto",
            bgcolor: "#fff",
            border: "1px solid #e5e5e5",
          }}
        >
          <Table size="small">
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell>Price</TableCell>
                <TableCell>Status</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {products.map((p) => (
                <TableRow key={p._id}>
                  <TableCell>
                    <Stack direction="row" spacing={1.5} alignItems="center">
                      {p.imgs?.[0] && (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img
                          src={p.imgs[0]}
                          alt=""
                          width={40}
                          height={50}
                          style={{ objectFit: "cover" }}
                        />
                      )}
                      <Typography fontWeight={600}>{p.title}</Typography>
                    </Stack>
                  </TableCell>
                  <TableCell>{p.category}</TableCell>
                  <TableCell>
                    {p.offerPrice != null && p.offerPrice < p.price ? (
                      <>
                        ${p.offerPrice}{" "}
                        <Typography
                          component="span"
                          sx={{ textDecoration: "line-through", color: "#999" }}
                        >
                          ${p.price}
                        </Typography>
                      </>
                    ) : (
                      `$${p.price}`
                    )}
                  </TableCell>
                  <TableCell>
                    <Chip
                      size="small"
                      label={p.status || "available"}
                      sx={{ borderRadius: 0 }}
                    />
                  </TableCell>
                  <TableCell align="right">
                    <IconButton onClick={() => openEdit(p)}>
                      <EditIcon fontSize="small" />
                    </IconButton>
                    <IconButton onClick={() => remove(p._id)}>
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </TableCell>
                </TableRow>
              ))}
              {!products.length && (
                <TableRow>
                  <TableCell colSpan={5}>No products match filters.</TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </Box>
      )} */}

      {loading ? (
  <CircularProgress sx={{ color: "#222" }} />
) : (
  <>
    {/* ================= DESKTOP TABLE ================= */}
    <Box
      sx={{
        display: { xs: "none", md: "block" },
        overflowX: "auto",
        bgcolor: "#fff",
        border: "1px solid #e5e5e5",
      }}
    >
      <Table size="small">
        <TableHead>
          <TableRow>
            <TableCell>Product</TableCell>
            <TableCell>Category</TableCell>
            <TableCell>Price</TableCell>
            <TableCell>Status</TableCell>
            <TableCell align="right">Actions</TableCell>
          </TableRow>
        </TableHead>

        <TableBody>
          {products.map((p) => (
            <TableRow key={p._id}>
              {/* Product */}
              <TableCell>
                <Stack
                  direction="row"
                  spacing={1.5}
                  alignItems="center"
                >
                  {p.imgs?.[0] && (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img
                      src={p.imgs[0]}
                      alt=""
                      width={40}
                      height={50}
                      style={{
                        objectFit: "cover",
                        borderRadius: 2,
                      }}
                    />
                  )}

                  <Typography fontWeight={600}>
                    {p.title}
                  </Typography>
                </Stack>
              </TableCell>

              {/* Category */}
              <TableCell>{p.category}</TableCell>

              {/* Price */}
              <TableCell>
                {p.offerPrice != null &&
                p.offerPrice < p.price ? (
                  <>
                    ${p.offerPrice}{" "}
                    <Typography
                      component="span"
                      sx={{
                        textDecoration: "line-through",
                        color: "#999",
                      }}
                    >
                      ${p.price}
                    </Typography>
                  </>
                ) : (
                  `$${p.price}`
                )}
              </TableCell>

              {/* Status */}
              <TableCell>
                <Chip
                  size="small"
                  label={p.status || "available"}
                  sx={{ borderRadius: 0 }}
                />
              </TableCell>

              {/* Actions */}
              <TableCell align="right">
                <IconButton onClick={() => openEdit(p)}>
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton onClick={() => remove(p._id)}>
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </TableCell>
            </TableRow>
          ))}

          {!products.length && (
            <TableRow>
              <TableCell colSpan={5}>
                No products match filters.
              </TableCell>
            </TableRow>
          )}
        </TableBody>
      </Table>
    </Box>

    {/* ================= MOBILE CARDS ================= */}
    <Stack
      spacing={1.5}
      sx={{
        display: { xs: "flex", md: "none" },
      }}
    >
      {!products.length ? (
        <Box
          sx={{
            bgcolor: "#fff",
            border: "1px solid #e5e5e5",
            p: 2,
            textAlign: "center",
          }}
        >
          <Typography color="text.secondary">
            No products match filters.
          </Typography>
        </Box>
      ) : (
        products.map((p) => (
          <Box
            key={p._id}
            sx={{
              bgcolor: "#fff",
              border: "1px solid #e5e5e5",
              p: 1.5,
            }}
          >
            {/* Product Header */}
            <Stack
              direction="row"
              spacing={1.5}
              alignItems="center"
            >
              {p.imgs?.[0] && (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={p.imgs[0]}
                  alt=""
                  width={55}
                  height={65}
                  style={{
                    objectFit: "cover",
                    borderRadius: 2,
                    flexShrink: 0,
                  }}
                />
              )}

              <Box sx={{ minWidth: 0, flex: 1 }}>
                <Typography
                  fontWeight={600}
                  sx={{
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    whiteSpace: "nowrap",
                  }}
                >
                  {p.title}
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                  sx={{ mt: 0.3 }}
                >
                  {p.category}
                </Typography>
              </Box>
            </Stack>

            {/* Product Details */}
            <Stack
              direction="row"
              justifyContent="space-between"
              alignItems="center"
              sx={{
                mt: 1.5,
                pt: 1.5,
                borderTop: "1px solid #eee",
              }}
            >
              {/* Price */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                >
                  Price
                </Typography>

                <Typography fontWeight={600}>
                  {p.offerPrice != null &&
                  p.offerPrice < p.price ? (
                    <>
                      ${p.offerPrice}{" "}
                      <Typography
                        component="span"
                        variant="body2"
                        sx={{
                          textDecoration: "line-through",
                          color: "#999",
                        }}
                      >
                        ${p.price}
                      </Typography>
                    </>
                  ) : (
                    `$${p.price}`
                  )}
                </Typography>
              </Box>

              {/* Status */}
              <Box>
                <Typography
                  variant="caption"
                  color="text.secondary"
                  display="block"
                  sx={{ mb: 0.3 }}
                >
                  Status
                </Typography>

                <Chip
                  size="small"
                  label={p.status || "available"}
                  sx={{ borderRadius: 0 }}
                />
              </Box>

              {/* Actions */}
              <Box>
                <IconButton
                  size="small"
                  onClick={() => openEdit(p)}
                >
                  <EditIcon fontSize="small" />
                </IconButton>

                <IconButton
                  size="small"
                  onClick={() => remove(p._id)}
                >
                  <DeleteIcon fontSize="small" />
                </IconButton>
              </Box>
            </Stack>
          </Box>
        ))
      )}
    </Stack>
  </>
)}

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        fullWidth
        maxWidth="md"
      >
        <DialogTitle>{editingId ? "Edit product" : "Add product"}</DialogTitle>
        <DialogContent>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>
            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                fullWidth
                label="Title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6 }}>
              <Autocomplete
                freeSolo
                options={categoryOptions}
                value={form.category}
                onChange={(_, value) =>
                  setForm({ ...form, category: value || "" })
                }
                onInputChange={(_, value) =>
                  setForm({ ...form, category: value })
                }
                renderInput={(params) => (
                  <TextField {...params} label="Category" />
                )}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <TextField
                  fullWidth
                  size="small"
                  label="Add new category"
                  value={newCategory}
                  onChange={(e) => setNewCategory(e.target.value)}
                />
                <Button
                  variant="outlined"
                  onClick={addCategoryOption}
                  sx={{ borderRadius: 0, whiteSpace: "nowrap" }}
                >
                  Add category
                </Button>
              </Stack>
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                value={form.price}
                onChange={(e) =>
                  setForm({ ...form, price: Number(e.target.value) })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                fullWidth
                type="number"
                label="Offer price"
                value={form.offerPrice}
                onChange={(e) =>
                  setForm({ ...form, offerPrice: e.target.value })
                }
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 4 }}>
              <TextField
                select
                fullWidth
                label="Status"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                {PRODUCT_STATUSES.map((s) => (
                  <MenuItem key={s} value={s}>
                    {s}
                  </MenuItem>
                ))}
              </TextField>
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                label="Styles (comma separated)"
                value={form.style}
                onChange={(e) => setForm({ ...form, style: e.target.value })}
              />
            </Grid>
            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                rows={3}
                label="Description"
                value={form.desc}
                onChange={(e) => setForm({ ...form, desc: e.target.value })}
              />
            </Grid>
            {SIZES.map((sizeKey) => (
              <Grid key={sizeKey} size={{ xs: 6, sm: 2 }}>
                <TextField
                  fullWidth
                  type="number"
                  label={`Stock ${sizeKey.toUpperCase()}`}
                  value={form.stock[sizeKey]}
                  onChange={(e) =>
                    setForm({
                      ...form,
                      stock: {
                        ...form.stock,
                        [sizeKey]: Number(e.target.value),
                      },
                    })
                  }
                />
              </Grid>
            ))}
            <Grid size={{ xs: 12 }}>
              <Typography variant="subtitle2" mb={1}>
                Images
              </Typography>
              <Stack
                direction="row"
                spacing={1}
                flexWrap="wrap"
                useFlexGap
                mb={1}
              >
                {form.imgs.map((url, i) => (
                  <Box key={`${url}-${i}`} sx={{ position: "relative" }}>
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={url}
                      alt=""
                      width={64}
                      height={80}
                      style={{ objectFit: "cover" }}
                    />
                    <IconButton
                      size="small"
                      sx={{
                        position: "absolute",
                        top: -8,
                        right: -8,
                        bgcolor: "#fff",
                      }}
                      onClick={() =>
                        setForm({
                          ...form,
                          imgs: form.imgs.filter((_, idx) => idx !== i),
                        })
                      }
                    >
                      <DeleteIcon fontSize="inherit" />
                    </IconButton>
                  </Box>
                ))}
              </Stack>
              <Stack direction={{ xs: "column", sm: "row" }} spacing={1}>
                <Button
                  variant="outlined"
                  component="label"
                  disabled={uploading}
                  sx={{ borderRadius: 0 }}
                >
                  {uploading ? "Uploading..." : "Upload images"}
                  <input
                    hidden
                    type="file"
                    accept="image/*"
                    multiple
                    onChange={(e) => handleUpload(e.target.files)}
                  />
                </Button>
                <TextField
                  size="small"
                  placeholder="Or paste image URL"
                  value={form.imageUrl}
                  onChange={(e) =>
                    setForm({ ...form, imageUrl: e.target.value })
                  }
                  sx={{ flex: 1 }}
                />
                <Button
                  variant="outlined"
                  onClick={addImageUrl}
                  sx={{ borderRadius: 0 }}
                >
                  Add URL
                </Button>
              </Stack>
            </Grid>
          </Grid>
          {error && (
            <Typography color="error" sx={{ mt: 2 }}>
              {error}
            </Typography>
          )}
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          <Button onClick={() => setOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            disabled={saving}
            onClick={save}
            sx={{
              bgcolor: "#222",
              borderRadius: 0,
              "&:hover": { bgcolor: "#444" },
            }}
          >
            {saving ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}
