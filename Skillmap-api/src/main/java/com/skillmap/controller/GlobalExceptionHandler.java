package com.skillmap.controller;

import com.skillmap.exception.ApiErrorResponse;
import com.skillmap.exception.InvalidRoadmapRequestException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

@RestControllerAdvice
public class GlobalExceptionHandler {

	@ExceptionHandler(InvalidRoadmapRequestException.class)
	public ResponseEntity<ApiErrorResponse> handleInvalidRoadmapRequest(InvalidRoadmapRequestException exception) {
		return ResponseEntity.status(HttpStatus.BAD_REQUEST)
				.body(new ApiErrorResponse(exception.getMessage()));
	}
}
