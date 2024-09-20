public with sharing class CustomTopicCatalogController {
    
    @AuraEnabled(cacheable=true)
    public static string getNavigationalTopics(){
        Integer depth = 8;
        String experienceSiteId = [SELECT Id FROM Network WHERE Name = 'iPhone Accessories' WITH USER_MODE LIMIT 1].Id;
        ConnectApi.ManagedTopicCollection topics = ConnectApi.ManagedTopics.getManagedTopics(experienceSiteId, ConnectApi.ManagedTopicType.Navigational, depth);
        return JSON.serialize(topics);
    }
}