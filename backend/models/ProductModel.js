import mongoose from "mongoose";

const productSchema = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    discountPrice: { type: Number },
    countInStock: { type: Number },
    sku: { type: String, required: true },
    category: { type: String, required: true },
    brand: { type: String, required: true },
    sizes: { type: [String], required: true },
    colors: { type: [String], required: true },
    collections: { type: [String], required: true },
    material: { type: String, required: true },
    gender: { type: String, required: true },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, required: true },
      },
    ],
    numReviews: { type: Number },
  },
  { timestamps: true }
);

productSchema.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }

  if (this.sku) this.sku = this.sku.toUpperCase();

  if (this.colors && this.colors.length > 0) {
    this.colors = this.colors.map(
      (color) => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
    );
  }

  if (this.sizes && this.sizes.length > 0) {
    this.sizes = this.sizes.map((size) => size.toUpperCase());
  }

  const fieldsToCapitalized = ["gender", "material", "brand", "category"];

  fieldsToCapitalized.forEach((field) => {
    if (this[field]) {
      this[field] =
        this[field].charAt(0).toUpperCase() +
        this[field].slice(1).toLowerCase();
    }
  });

  if (this.collections && this.collections.length > 0) {
    this.collections = this.collections.map(
      (col) => col.charAt(0).toUpperCase() + col.slice(1).toLowerCase()
    );
  }

  next();
});

const Product = mongoose.model("product", productSchema);

export default Product;
