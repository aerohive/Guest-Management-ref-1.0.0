/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web.util;

import java.io.IOException;
import java.io.StringWriter;
import java.io.Writer;
import java.util.List;

import lombok.extern.slf4j.Slf4j;

import com.fasterxml.jackson.core.JsonGenerationException;
import com.fasterxml.jackson.core.JsonParseException;
import com.fasterxml.jackson.core.JsonParser.Feature;
import com.fasterxml.jackson.databind.JsonMappingException;
import com.fasterxml.jackson.databind.ObjectMapper;

/**
 * Utility to convert to/from JSON. The "Raw" variants will pass the Jackson exceptions up to the caller.
 *
 * @author wei.song
 * @author ksakura
 * @author sqwen
 */
@Slf4j
public final class JsonUtil {

    private static final ObjectMapper mapper = new ObjectMapper();
    static {
        mapper.configure(Feature.ALLOW_COMMENTS, true);
    }

    private static ObjectMapper getObjectMapper(final boolean decodeForXss) {
        return mapper;
    }

    public static String toJsonStringRaw(final Object obj)
                    throws JsonGenerationException, JsonMappingException, IOException {
        return toJsonStringRaw(obj, false);
    }

    public static String toJsonStringRaw(final Object obj, final boolean encodeForXss)
                    throws JsonGenerationException, JsonMappingException, IOException {
        Writer sw = new StringWriter();
        getObjectMapper(encodeForXss).writerWithDefaultPrettyPrinter().writeValue(sw, obj);
        return sw.toString();
    }

    public static <T> T toObjectRaw(final String json, final Class<T> valueType)
                    throws JsonParseException, JsonMappingException, IOException {
        return mapper.readValue(json, valueType);
    }

    public static <T> T toObjectRaw(final String json, final Class<T> valueType, final boolean decodeForXss)
                    throws JsonParseException, JsonMappingException, IOException {
        return getObjectMapper(decodeForXss).readValue(json, valueType);
    }

    public static String toJsonString(final Object obj) {
        try {
            return toJsonStringRaw(obj);
        } catch (Exception e) {
            log.error("Failed convert {} to JSON", obj, e);
        }
        return null;
    }

    public static <T> T toObject(final String json, final Class<T> valueType) {
        return toObject(json, valueType, true);
    }

    public static <T> T toObject(final String json, final Class<T> valueType, final boolean decodeForXss) {
        try {
            return toObjectRaw(json, valueType, decodeForXss);
        } catch (Exception e) {
            log.error("Failed convert JSON: {} to: {}", json, valueType, e);
        }
        return null;
    }

    public static <T> T toObject(final String json, final Class<T> valueType, final Class<?>... parameterTypes) {
        try {
            return mapper.readValue(json, mapper.getTypeFactory().constructParametricType(valueType, parameterTypes));
        }
        catch (Exception e) {
            log.error("Failed convert JSON: {} to: {}", json, valueType, e);
        }
        return null;
    }

    public static <T> List<T> toObjectList(final String json, final Class<T> valueType) {
        return toObjectList(json, valueType, true);
    }

    public static <T> List<T> toObjectList(final String json, final Class<T> valueType, final boolean decodeForXss) {
        try {
            return toObjectListRaw(json, valueType, decodeForXss);
        } catch (Exception e) {
            log.error("Failed convert JSON: {} to: List<{}>", json, valueType, e);
        }
        return null;
    }

    public static <T> List<T> toObjectListRaw(final String json, final Class<T> valueType, final boolean decodeForXss)
                    throws JsonParseException, JsonMappingException, IOException {
        ObjectMapper mapper = getObjectMapper(decodeForXss);
        return mapper.readValue(json, mapper.getTypeFactory().constructCollectionType(List.class, valueType));
    }

    private JsonUtil() {
        throw new AssertionError("JsonUtil should never be instantiated");
    }

}
