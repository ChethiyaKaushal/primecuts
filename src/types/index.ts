// ─── DummyJSON API Types ────────────────────────────────────────────────────

export interface ProductDimensions {
  width: number
  height: number
  depth: number
}

export interface ProductMeta {
  createdAt: string
  updatedAt: string
  barcode: string
  qrCode: string
}

export interface ProductReview {
  rating: number
  comment: string
  date: string
  reviewerName: string
  reviewerEmail: string
}

export interface Product {
  id: number
  title: string
  description: string
  category: string
  price: number
  discountPercentage: number
  rating: number
  stock: number
  tags: string[]
  brand: string
  sku: string
  weight: number
  dimensions: ProductDimensions
  warrantyInformation: string
  shippingInformation: string
  availabilityStatus: string
  reviews: ProductReview[]
  returnPolicy: string
  minimumOrderQuantity: number
  meta: ProductMeta
  images: string[]
  thumbnail: string
}

export interface ProductsResponse {
  products: Product[]
  total: number
  skip: number
  limit: number
}

// ─── Auth Types ─────────────────────────────────────────────────────────────

export interface LoginCredentials {
  username: string
  password: string
}

export interface AuthUser {
  id: number
  username: string
  email: string
  firstName: string
  lastName: string
  gender: string
  image: string
  accessToken: string
  refreshToken: string
}

// ─── Cart Types ──────────────────────────────────────────────────────────────

export interface CartItem {
  product: Product
  quantity: number
}

// ─── Category Types ──────────────────────────────────────────────────────────

export type SortOption = '' | 'price-asc' | 'price-desc' | 'rating' | 'discount' | 'name'
