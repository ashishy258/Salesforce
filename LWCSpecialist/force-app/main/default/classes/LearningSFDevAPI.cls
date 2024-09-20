public class LearningSFDevAPI {
	
    public static void getMessages(){
        
        HttpRequest req = new HttpRequest();
        req.setMethod('GET');
        req.setEndpoint('https://www.googleapis.com/books/v1/volumes?q=harry');
        
        Http http = new Http();
        HTTPResponse res = http.send(req);
       Map<String,Object> jsonParsed =(Map<String,Object> ) JSON.deserializeUntyped(res.getBody());
        List<Object> entriesArray =( List<Object> ) jsonParsed.get('items');
        for(Object inidividualEntries : entriesArray){
            Map<String,Object> ind = (Map<String,Object> )inidividualEntries;
            System.debug('Id = '+ ind.get('kind'));
            System.debug('name = '+ ind.get('id'));
            System.debug('---------------------------------------------');
        }
    }
    
 
    

}