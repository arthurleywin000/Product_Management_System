package com.revanth.Product_Management_System.controller;

import com.revanth.Product_Management_System.model.ProductDetails;
import com.revanth.Product_Management_System.service.ProductService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;


@RestController
@CrossOrigin(origins = "*")
public class ProductController {
    @Autowired
    private ProductService productService;


    @PostMapping("/saveProduct")
    public ResponseEntity<?> saveProduct(@RequestBody ProductDetails productDetails){
        return new ResponseEntity<>(productService.saveProductDetails(productDetails), HttpStatus.CREATED);
    }

    @GetMapping("/products")
    public ResponseEntity<?> getAllProducts(){
        return new ResponseEntity<>(productService.getAllProductDetails(), HttpStatus.OK);
    }

    @GetMapping("/{id}")
    public ResponseEntity<?> getProductById(@PathVariable Integer id){
        return new ResponseEntity<>(productService.getProductById(id), HttpStatus.OK);
    }

    @GetMapping("/deleteProduct/{id}")
    public ResponseEntity<?> deleteProduct(@PathVariable Integer id){
        return new ResponseEntity<>(productService.deleteProductById(id),HttpStatus.OK);
    }

    @PostMapping("/editProduct/{id}")
    public ResponseEntity<?> editProduct(@RequestBody ProductDetails productDetails,@PathVariable Integer id){
        return new ResponseEntity<>(productService.editProduct(productDetails,id), HttpStatus.CREATED);

    }
}
