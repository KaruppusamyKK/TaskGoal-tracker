package com.trackIt.api.dto.response;

import com.trackIt.api.exception.CustomServiceException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
@Slf4j
public class ResponseHandler {

    public static ResponseEntity<?> handleResponse(ServiceCall serviceCall) {
        try {
            Object result = serviceCall.execute();
            return ResponseEntity.ok(result);
        } catch (CustomServiceException e) {
            logger.error("CustomServiceException occurred: {}", e.getMessage(), e);
            throw e;
        } catch (Exception e) {
            logger.error("Unexpected exception occurred: {}", e.getMessage(), e);
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body("An error occurred while processing the request");
        }
    }




    @FunctionalInterface
    public interface ServiceCall {
        Object execute() throws Exception;
    }
}
