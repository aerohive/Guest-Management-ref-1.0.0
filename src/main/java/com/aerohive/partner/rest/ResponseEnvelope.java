/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.rest;

import lombok.Getter;

import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.annotation.JsonInclude.Include;


/**
 * Define API response with data, pagination and error information
 */
@JsonInclude(Include.NON_NULL)
public class ResponseEnvelope<T> {

    @Getter
    private T data;
    @Getter
    private PaginationInfo pagination;
    @Getter
    private RestApiError error;

    public ResponseEnvelope() {
        this(null, null);
    }

    public ResponseEnvelope(T data) {
        this(data, null);
    }

    public ResponseEnvelope(T data, PaginationInfo pagination) {
        this.data = data;
        this.pagination = pagination;
    }

    public ResponseEnvelope(RestApiError error) {
        this.error = error;
    }

}
