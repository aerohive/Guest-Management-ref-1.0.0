## Synopsis
Guestmgmt-ref is a web based application, running with web server (tomcat or jetty) and launch from web browser. It is published in form of "AS IS" source code. Users need to follow instruction to configure "guestmgmt-ref-application.properties", customize to own needs, compile a war file and deploy on a web server.

## Pre-requisitions
- Register an API client account in order to call Aerohive HMNG Identify APIs
- Work with Aerohive to configure PingFederate for using own Active Directory login as employee sponsorship
- Install Maven and JDK 1.7 to compile source code 

## Configuration
Users need to configures “src/main/resources/guestmgmt-ref-application.properties" before compilation and deployment.
### Deployment Mode
Configure deployment mode as either "Kiosk" application, which is mostly used for lobby ambassador or "Register User" application, which is used for employee sponsored guests registration.

### API account information
Fill in API client account information

### HMNG servers information
Fill in HMNG server information. 

### Active Directory and FingFederate information
Fill in information gotten from Aerohive support for using own Active Directory login

### Application web server attributes
Fill in own deployed web server attributes 

### Override properties files
Having “/aerohive_app/etc/guestmgmt-ref-application.properties” can override the properties defined in “src/main/resources/guestmgmt-ref-application.properties"

## Customization on source code
Users can modify source code to apply with own business logic and presentation view.

### Simple Customization on View
- Customize style by editing src/main/webapp/resources/css/guestmgmtapp.css
- Customize image by replacing image files under src/main/webapp/resources/images

## Compilation and Deployment
- At project based directory, issue command “mvn clean; mvn compile war:war” to build war file 
- Put war file to either Tomcat or Jetty webapp associated directory
- Restart Tomcat or Jetty
- Launch web application through URL https://<application-server/guestmgmt-ref/

## Package source code
- At project base directory, issue command "mvn clean; mvn assembly:single"

## API Reference
Refer to https://aerohive-admin.3scale.net/admin/api_docs/services


## License
Refer to license file
