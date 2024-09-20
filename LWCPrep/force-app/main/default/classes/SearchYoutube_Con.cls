public class SearchYoutube_Con {
    
    public String body {set; get;}
    public String searchText{set; get;}
    public superItemList[] dataSet {set; get;}
    
    public void search(){
        Http http = new Http();
        
        HttpRequest req = new HttpRequest();
        searchText = searchText.replaceAll(' ', '+');
        
        req.setEndpoint('https://youtube.googleapis.com/youtube/v3/search?part=snippet&q='+searchText+'&key=AIzaSyB8HnTZpXLUdzUXajLOdAWNQg0oJVQdaSg');
        req.setMethod('GET');
        req.setHeader('content-type', 'application/json');
        
        HttpResponse res = http.send(req);
        
        body = res.getBody();

        System.debug('Testing Mavensmate');
        
        fromJSON n = (fromJSON)JSON.deserialize(body, fromJSON.class);
        
        System.debug(' 🚀 ' + n.kind ); //youtube#searchListResponse
        System.debug(' 🚀 ' + n.pageInfo.totalResults); //36
		System.debug(' 🚀 ' + n.items[0].kind);	//youtube#searchResult    
        System.debug(' 🚀 ' + n.items[0].snippet.title); //Salesforce Casts
		System.debug(' 🚀 ' + n.items[0].snippet.thumbnails.high.url); ////https://yt3.ggpht.com....
        
        dataSet = new superItemList[]{};
        
        //Iterate the list for all the records returned from REST API
        for(integer i=0; i< n.items.size(); i++){
        
        
            //Add values to the dataset
            //This will be a list of lists.
            dataSet.add(new superItemList( n.items[i].snippet.title, n.items[i].snippet.description, n.items[i].snippet.thumbnails.medium.url, n.items[i].snippet.publishedAt));                      
        }
        
    }
    
    //Custom DataType
    public class superItemList{
        public String f1{set; get;}
        public String f2{set; get;}
        public String f3{set; get;}
        public String f4{set; get;}
        public superItemList(String cf1, String cf2, String cf3, String cf4){
            
            f1 = cf1;
            f2 = cf2;
            f3 = cf3;
            f4 = cf4;
        }
        
    }
    
    public class fromJSON{
        public String kind;	//youtube#searchListResponse
        public String etag;	//"XI7nbFXulYBIpL0ayR_gDh3eu1k/K3U-i-YGDiKj9-QofYNg0RxMPlE"
        public String nextPageToken;	//CAUQAA
        public String regionCode;	//IN
        public cls_pageInfo pageInfo;
        public cls_items[] items;
        
        /**
        public static fromJSON parse(String json){
            return (fromJSON) System.JSON.deserialize(json, fromJSON.class);
        }
        */
        
    }
    
    class cls_pageInfo {
        public Integer totalResults;	//36
        public Integer resultsPerPage;	//5
    }
    class cls_items {
        public String kind;	//youtube#searchResult
        public String etag;	//"XI7nbFXulYBIpL0ayR_gDh3eu1k/Zb4TzX-JI-9r-5OWn68I10Euivk"
        public cls_id id;
        public cls_snippet snippet;
    }
    class cls_id {
        public String kind;	//youtube#channel
        public String channelId;	//UC4VyzR4uWqMofCCjtKry4sg
    }
    class cls_snippet {
        public String publishedAt;	//2017-12-02T13:40:19.000Z
        public String channelId;	//UC4VyzR4uWqMofCCjtKry4sg
        public String title;	//Salesforce Casts
        public String description;	//
        public cls_thumbnails thumbnails;
        public String channelTitle;	//Salesforce Casts
        public String liveBroadcastContent;	//none
    }
    class cls_thumbnails {
        public cls_default defaultCustom;
        public cls_medium medium;
        public cls_high high;
    }
    class cls_default {
        public String url;	//https://yt3.ggpht.com/-LbNz3Nx51fU/AAAAAAAAAAI/AAAAAAAAAAA/EH4ZHvZYWiY/s88-c-k-no-mo-rj-c0xffffff/photo.jpg
    }
    class cls_medium {
        public String url;	//https://yt3.ggpht.com/-LbNz3Nx51fU/AAAAAAAAAAI/AAAAAAAAAAA/EH4ZHvZYWiY/s240-c-k-no-mo-rj-c0xffffff/photo.jpg
    }
    class cls_high {
        public String url;	//https://yt3.ggpht.com/-LbNz3Nx51fU/AAAAAAAAAAI/AAAAAAAAAAA/EH4ZHvZYWiY/s800-c-k-no-mo-rj-c0xffffff/photo.jpg
    }
    
}