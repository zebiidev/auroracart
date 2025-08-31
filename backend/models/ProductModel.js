import mongoose from "mongoose";

const product = mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "user",
    },
    name: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    price: {
      type: Number,
      required: true,
    },
    discountPrice: {
      type: Number,
      required: true,
    },
    countInStock: {
      type: Number,
    },
    sku: {
      type: String,
      required: true,
    },
    category: {
      type: String,
      required: true,
    },
    brand: {
      type: String,
      required: true,
    },
    sizes: {
      type: [String],
      required: true,
    },
    colors: {
      type: [String],
      required: true,
    },
    collections: {
      type: String,
      required: true,
    },
    material: {
      type: String,
      required: true,
    },
    gender: {
      type: String,
      required: true,
    },
    images: [
      {
        url: { type: String, required: true },
        altText: { type: String, required: true },
      },
    ],
    numReviews: {
      type: Number,
    },
  },
  { timestamps: true }
);

product.pre("save", function (next) {
  if (this.name) {
    this.name =
      this.name.charAt(0).toUpperCase() + this.name.slice(1).toLowerCase();
  }

  if (this.colors && this.colors.length > 0) {
    let colorsArray = [];

    if (typeof this.colors === "string") {
      colorsArray = this.colors
        .split(",")
        .map(
          (color) =>
            color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
        );
    } else {
      colorsArray = this.colors.map(
        (color) => color.charAt(0).toUpperCase() + color.slice(1).toLowerCase()
      );
    }

    this.colors = colorsArray;
  }

  if (this.sizes && this.sizes.length > 0) {
    let sizesArray = [];

    if (typeof this.sizes === "string") {
      sizesArray = this.sizes.split(",").map((s) => s.toUpperCase());
    } else {
      sizesArray = this.sizes.map((size) => size.toUpperCase());
    }

    this.sizes = sizesArray;
  }

  const fildsToCapitalized = [
    "gender",
    "collections",
    "material",
    "brand",
    "category",
  ];

  fildsToCapitalized.forEach((field) => {
    if (this[field]) {
      this[field] =
        this[field].charAt(0).toUpperCase() +
        this[field].slice(1).toLowerCase();
    }
  });

  next();
});

const Product = mongoose.model("product", product);

export default Product;
