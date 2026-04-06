package com.revanth.Product_Management_System.repo;

import com.revanth.Product_Management_System.model.ProductDetails;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface ProductRepo extends JpaRepository<ProductDetails, Integer> {
    List<ProductDetails> findAllByOrderByIdAsc();
}
