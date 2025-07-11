"use client"

import Loader from "@/components/custom ui/Loader"
import ProductForm from "@/components/products/ProductForm"
import { use, useEffect, useState } from "react"

const ProductDetails = ({ params: paramsPromise }: { params: Promise<{ productId: string }> }) => {
  const [loading, setLoading] = useState(true)
  const [productDetails, setProductDetails] = useState<ProductType | null>(null)
  const params = use(paramsPromise)

  const getProductDetails = async () => {
    try { 
      const res = await fetch(`/api/products/${params.productId}`, {
        method: "GET"
      })
      const data = await res.json()
      setProductDetails(data)
      setLoading(false)
    } catch (err) {
      console.log("[productId_GET]", err)
    }
  }

  useEffect(() => {
    getProductDetails()
  }, [])

  return loading ? <Loader /> : (
    <ProductForm initialData={productDetails}/>
  )
}

export default ProductDetails