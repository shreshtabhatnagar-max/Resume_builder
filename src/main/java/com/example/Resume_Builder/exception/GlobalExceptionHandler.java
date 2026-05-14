package com.example.Resume_Builder.exception;

import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
@Slf4j
public class GlobalExceptionHandler {

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        log.info("Inside GlobalExceptionHandler - handleValidationExceptions()");
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().
                forEach(error -> {
                    String fieldName = ((FieldError) error)
                            .getField();
                    String errorMessage = error.getDefaultMessage();
                    errors.put(fieldName, errorMessage);
                });
        Map<String, Object> response = new HashMap<>();
        response.put("message", "Validation failed");
        response.put("errors", errors);
        //response.put("email",)
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
    }
    @ExceptionHandler(ResourceExistException.class)
    public ResponseEntity<Map<String, Object>> handleResourceExistsException(ResourceExistException existException)
    {
        log.info("Inside GlobalExceptionHandler - handleResourceExistsException()");
        Map<String ,Object> response =new HashMap<>();
        response.put("message","Resource exists");
       // response.put("Status",HttpStatus.CONFLICT);
        response.put("Errors",existException.getMessage());

        return ResponseEntity.status(HttpStatus.CONFLICT).body(response);
    }
    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, Object>> handleGenericException(Exception ex){
        log.info("Inside GlobalExceptionHandler - handleGenericException()");
        Map<String ,Object> response =new HashMap<>();
        response.put("message","Something Went Wrong.Contact administrator");
        response.put("Errors",ex.getMessage());
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(response);
    }
}
