package com.revanth.Product_Management_System.service;


import com.revanth.Product_Management_System.model.ProductDetails;
import com.revanth.Product_Management_System.repo.ProductRepo;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;


import java.util.List;

@Service
public class ProductServiceImpl implements ProductService {
    @Autowired
    private ProductRepo productRepo;

    @Override
    public ProductDetails saveProductDetails(ProductDetails product) {
        return productRepo.save(product);
    }

    @Override
    public List<ProductDetails> getAllProductDetails() {
        return productRepo.findAllByOrderByIdAsc();
    }

    @Override
    public ProductDetails getProductById(int id) {
        return productRepo.findById(id).get();
    }

    @Override
    public String deleteProductById(int id) {
        ProductDetails product=productRepo.findById(id).get();

        if(product!=null){
            productRepo.delete(product);
            return  "Product Deleted Successfully";
        }

        return "Something went wrong";

    }

    @Override
    public ProductDetails editProduct(ProductDetails productDetails, Integer id) {
        ProductDetails oldProduct=productRepo.findById(id).get();

        oldProduct.setProductName(productDetails.getProductName());
        oldProduct.setProductPrice(productDetails.getProductPrice());
        oldProduct.setProductDescription(productDetails.getProductDescription());
        oldProduct.setProductStatus(productDetails.getProductStatus());

        return productRepo.save(oldProduct);
    }
}
