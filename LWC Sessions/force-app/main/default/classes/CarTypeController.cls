public with sharing class CarTypeController {
    
    @AuraEnabled(cacheable=true)
    public static List<Car_Type__c > getCarTypes(){
        return [select id, name from Car_Type__c ];
    }
}
