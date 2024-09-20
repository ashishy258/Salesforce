public with sharing class LinkdInCallout {
    
    @AuraEnabled()
    public static void authenticLinkdin(){
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=77s23g40jm6z56&redirect_uri=https://testlwc3-dev-ed.lightning.force.com/lightning/r/Account/0015g00000nZZ4AAAW/view&scope=w_member_social');
        request.setMethod('GET');
        Http http = new Http();
        HTTPResponse response = http.send(request);
        if(response.getStatusCode() == 200) {
            system.debug('ashish');
        } else {
            throw new AuraHandledException('exceptionText');
        }
    }
}
