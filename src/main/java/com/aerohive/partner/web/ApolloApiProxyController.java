/* 
 * This file is subject to the terms and conditions defined in
 * file 'LICENSE.txt', which is part of this source code package.
 * 
 * (c)2015 Aerohive. All rights reserved.
 */

package com.aerohive.partner.web;

import java.io.IOException;
import java.io.InputStream;
import java.util.Arrays;
import java.util.Map;

import javax.annotation.PostConstruct;
import javax.servlet.http.Cookie;
import javax.servlet.http.HttpServletRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpMethod;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.util.Assert;
import org.springframework.util.StreamUtils;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.client.HttpClientErrorException;
import org.springframework.web.client.HttpServerErrorException;
import org.springframework.web.client.RestClientException;
import org.springframework.web.client.RestTemplate;

import com.aerohive.partner.rest.CustomResponseException;
import com.aerohive.partner.rest.ResponseEnvelope;
import com.aerohive.partner.web.auth.model.ApolloAccessTokenVo;
import com.aerohive.partner.web.auth.model.KioskSecureVo;
import com.aerohive.partner.web.auth.model.RegistrationSettingVo;
import com.aerohive.partner.web.util.CookieUtil;
import com.aerohive.partner.web.util.JsonUtil;

/**
 * Register Guest/Kiosk Reference Apppliation - API proxy 
 *  
 * @author thimmayyaame
 */
@Controller
@RequestMapping("/services/proxy")
public class ApolloApiProxyController {

    @Value("${app.apollo.clientId:}")
    private String apolloClientId;

    @Value("${app.apollo.clientSecret:}")
    private String apolloClientSecret;

    @Value("${app.apollo.clientId.header:}")
    private String apolloClientIdHeader;

    @Value("${app.apollo.clientSecret.header:}")
    private String apolloClientSecretHeader;

    @Value("${app.apollo.clientRedirectUri:}")
    private String apolloClientRedirectUri;

    @Value("${app.apollo.clientRedirectUri.header:}")
    private String apolloClientRedirectUriHeader;

    @Value("${app.apollo.vpc.url}")
    private String apolloVpcUrl;

    @Value("${app.apollo.ownerId}")
    private String apolloOwnerId;

    @Value("${oauth.login.ad.enable:true}")
    private boolean oauthLoginIsAd;

    @Value("${oauth.login.ad.url:}")
    private String oauthLoginAdUrl;

    @Value("${oauth.login.idp.url:}")
    private String oauthLoginIdpUrl;

    @Value("${oauth.login.target.resource.url:}")
    private String oauthLoginTargetResourceUrl;

    @Value("${app.request.forward.xapi.url.prefix}")
    private String forwardXapiUrlPrefix;

    @Value("${app.kiosk.enable:true}")
    private boolean enableKiosk;
    
    @Value("${app.keep.time:100000}")
    private Long keepTime;

    private boolean enableSingle;

    private boolean enableGroup;

    @Value("${app.kiosk.password:123}")
    private String password;    

    private final RestTemplate restTemplate = new RestTemplate();

    @PostConstruct
    private void validateProperties() {
        Assert.hasLength(apolloClientId);
        Assert.hasLength(apolloClientSecret);
        Assert.hasLength(apolloClientRedirectUri);
        Assert.hasLength(apolloClientIdHeader);
        Assert.hasLength(apolloClientSecretHeader);
        Assert.hasLength(apolloClientRedirectUriHeader);
        Assert.hasLength(apolloOwnerId);
        Assert.hasLength(oauthLoginAdUrl);
        Assert.hasLength(oauthLoginIdpUrl);
        Assert.hasLength(oauthLoginTargetResourceUrl);
        enableSingle = !enableKiosk;
        enableGroup = !enableKiosk;
    }

    @RequestMapping(value="logout", method=RequestMethod.POST, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<?> logOut(@RequestBody KioskSecureVo vo) {
        return new ResponseEntity<Boolean>(vo.getPassword().equals(this.password), HttpStatus.OK);
    }
    
    @RequestMapping(value = "registration", method = RequestMethod.GET, produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Object> registration(HttpServletRequest request) throws Exception {
        ResponseEnvelope<RegistrationSettingVo> env = new ResponseEnvelope<RegistrationSettingVo>(
                new RegistrationSettingVo(enableKiosk, enableSingle, enableGroup,keepTime));
        return new ResponseEntity<Object>(env, HttpStatus.OK);
    }

    @RequestMapping(value="apollo",
            method = RequestMethod.GET,
            produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Object> invokeApolloApiGet(
            @RequestParam("resource") String uri,
            HttpServletRequest request) throws Exception {

        ApolloAccessTokenVo token = findAccessToken(request);
        if (token == null) {
            return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
        }

        String url = buildXapiUrl(token, uri);
        return invoke(url, token.getAccessToken(), HttpMethod.GET, null);
    }

    @RequestMapping(value="apollo",
        method = RequestMethod.DELETE)
    public ResponseEntity<Object> invokeApolloApiDelete(
        @RequestParam("resource") String uri,
        HttpServletRequest request) throws Exception {

        ApolloAccessTokenVo token = findAccessToken(request);
        if (token == null) {
            return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
        }

        String url = buildXapiUrl(token, uri);
        return invoke(url, token.getAccessToken(), HttpMethod.DELETE, null);
    }

    @RequestMapping(value="apollo",
        method = RequestMethod.POST,
        produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Object> invokeApolloApiPost(
        @RequestParam("resource") String uri,
        HttpServletRequest request) throws Exception {

        ApolloAccessTokenVo token = findAccessToken(request);
        if (token == null) {
            return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
        }

        byte[] requestBodyCopy = null;
        try {
            InputStream inputStream = ((HttpServletRequest)request).getInputStream();
            requestBodyCopy = StreamUtils.copyToByteArray(inputStream);
        } catch (IOException ioe) {
            return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }

        String url = buildXapiUrl(token, uri);
        return invoke(url, token.getAccessToken(), HttpMethod.POST, requestBodyCopy);
    }

    @RequestMapping(value="apollo",
        method = RequestMethod.PUT,
        produces = { MediaType.APPLICATION_JSON_VALUE })
    public ResponseEntity<Object> invokeApolloApiPut(
        @RequestParam("resource") String uri,
        HttpServletRequest request) throws Exception {

        ApolloAccessTokenVo token = findAccessToken(request);
        if (token == null) {
            return new ResponseEntity<Object>(HttpStatus.UNAUTHORIZED);
        }

        byte[] requestBodyCopy = null;
        try {
            InputStream inputStream = ((HttpServletRequest)request).getInputStream();
            requestBodyCopy = StreamUtils.copyToByteArray(inputStream);
        } catch (IOException ioe) {
            return new ResponseEntity<Object>(HttpStatus.BAD_REQUEST);
        }

        String url = buildXapiUrl(token, uri);
        return invoke(url, token.getAccessToken(), HttpMethod.PUT, requestBodyCopy);
    }

    private String buildXapiUrl(ApolloAccessTokenVo token, String uri) {
        String url = token.getVpcUrl()
            + (token.getVpcUrl().endsWith("/") ? "" : "/")
            + forwardXapiUrlPrefix
            + uri
            + (uri.contains("?") ? "&" : "?") + "ownerId=" + token.getOwnerId();
        return url;
    }

    private ApolloAccessTokenVo findAccessToken(HttpServletRequest request) {
        /**
         * - Get user info / token value from Cache
         */
        Cookie tokenCookie = CookieUtil.getCookieByName(request, "hmAT");
        if (tokenCookie == null) {
            return null;
        }
        if (tokenCookie == null || tokenCookie.getValue() == null) {
            return null;
        }

        ApolloAccessTokenVo token = new ApolloAccessTokenVo();
        token.setAccessToken(tokenCookie.getValue());
        token.setOwnerId(Long.valueOf(apolloOwnerId));
        token.setVpcUrl(apolloVpcUrl);
        return token;
    }

    private HttpHeaders createHeaders(String accessToken) {
        HttpHeaders headers = new HttpHeaders();
        headers.setAccept(Arrays.asList(MediaType.APPLICATION_JSON));
        headers.set(HttpHeaders.CONTENT_TYPE.toString(), MediaType.APPLICATION_JSON_VALUE);
        headers.set(HttpHeaders.ACCEPT.toString(), MediaType.APPLICATION_JSON_VALUE);

        headers.set(apolloClientIdHeader, apolloClientId);
        headers.set(apolloClientSecretHeader, apolloClientSecret);
        headers.set(apolloClientRedirectUriHeader, apolloClientRedirectUri);
        headers.set(HttpHeaders.AUTHORIZATION, "Bearer " + accessToken);
        return headers;
    }

    @SuppressWarnings("rawtypes")
    public ResponseEntity invoke(String url, String accessToken, HttpMethod httpMethod, byte[] payload)
        throws Exception {
        HttpHeaders headers = createHeaders(accessToken);

        try {
            HttpEntity<?> requestEntity = null;
            switch (httpMethod) {
                case GET:
                case DELETE: {
                    requestEntity = new HttpEntity<Void>(null, headers);
                    break;
                }

                case PUT:
                case POST: {
                    requestEntity = new HttpEntity<Object>(payload, headers);
                    break;
                }
                default: {
                    throw new Exception("unsupported method: " + httpMethod);
                }
            }

            ResponseEntity<ResponseEnvelope> re = restTemplate.exchange(url, httpMethod, requestEntity, ResponseEnvelope.class);
            return new ResponseEntity<Object>(re.getBody(), HttpStatus.OK);
        } catch (RestClientException rce) {
            rce.printStackTrace();
            if (rce.getCause() instanceof CustomResponseException) {
                CustomResponseException cre = (CustomResponseException)rce.getCause();
                return new ResponseEntity<Object>(cre.getProperties(), HttpStatus.valueOf(Integer.parseInt(cre.getProperties().get("status").toString())));
            }
            else if (rce instanceof HttpClientErrorException) {
                HttpClientErrorException hce = (HttpClientErrorException) rce;
                Map<String, Object> map = JsonUtil.toObject(((HttpClientErrorException) rce).getResponseBodyAsString(),Map.class);
                return new ResponseEntity<Object>(map, hce.getStatusCode());
            }
            else if (rce instanceof HttpServerErrorException) {
                HttpServerErrorException hce = (HttpServerErrorException) rce;
                Map<String, Object> map = JsonUtil.toObject(((HttpServerErrorException) rce).getResponseBodyAsString(),Map.class);
                return new ResponseEntity<Object>(map, hce.getStatusCode());
            }
            else {
                return new ResponseEntity<Object>(rce.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
            }
            
        } catch (Exception e) {
            e.printStackTrace();
            return new ResponseEntity<Object>(e.getMessage(), HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

}
