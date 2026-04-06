package com.revanth.Product_Management_System.service;



import com.revanth.Product_Management_System.model.ProductDetails;

import java.util.List;

public interface ProductService {
    public ProductDetails saveProductDetails(ProductDetails product);

    public List<ProductDetails> getAllProductDetails();

    public ProductDetails getProductById(int id);

    public String deleteProductById(int id);

    public ProductDetails editProduct(ProductDetails productDetails,Integer id);
}
