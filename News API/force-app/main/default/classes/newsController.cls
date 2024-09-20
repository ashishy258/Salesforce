public with sharing class newsController {
    @AuraEnabled
    public static Map<String, Object> retriveNews(){
        HttpRequest httpRequest = new HttpRequest();
        httpRequest.setEndpoint('http://newsapi.org/v2/everything?q=bitcoin&from=2020-08-08&sortBy=publishedAt&apiKey=f62da32ee04f45ea953bae42e03e31cb');
        httpRequest.setMethod('GET');

        Map<String, Object> newsJsonData = new Map<String, Object>();
        String strResponse = null;

        try{
            Http http = new Http();
            HttpResponse httpResponse = http.send(httpRequest);
            if(httpResponse.getStatusCode() == 200){
                strResponse = httpResponse.getBody();
            } else {
                throw new CalloutException(httpResponse.getBody());
            }

        } catch(Exception ex){
            throw ex;
        }

        if(!String.isBlank(strResponse)){
            newsJsonData = (Map<String, Object>)JSON.deserializeUntyped(strResponse);
        }
        if(!newsJsonData.isEmpty()){
            return newsJsonData;
        } else {
            return null;
        }
    }
}