/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.rest;

import java.io.IOException;
import java.nio.charset.Charset;
import java.util.Map;

import org.springframework.http.client.ClientHttpResponse;
import org.springframework.util.StreamUtils;
import org.springframework.web.client.DefaultResponseErrorHandler;
import org.springframework.web.client.ResponseErrorHandler;

/**
 * Define and customize the error handling
 */
public class CustomResponseErrorHandler implements ResponseErrorHandler {
    
    private static final Charset UTF8 = Charset.forName("UTF-8");

    private ResponseErrorHandler errorHandler = new DefaultResponseErrorHandler();

    public boolean hasError(ClientHttpResponse response) throws IOException {
        return errorHandler.hasError(response);
    }

    public void handleError(ClientHttpResponse response) throws IOException {
        String theString = StreamUtils.copyToString(response.getBody(), UTF8);
        CustomResponseException exception = new CustomResponseException();
        Map<String, Object> properties = exception.getProperties();
        properties.put("status", response.getStatusCode().toString());
        properties.put("body", theString);
        properties.put("header", response.getHeaders());
        throw exception;
    }
}
