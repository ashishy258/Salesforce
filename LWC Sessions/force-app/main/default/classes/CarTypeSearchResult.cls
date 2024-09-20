public with sharing class CarTypeSearchResult {
    
    @AuraEnabled(cacheable=true)
    public static List<Car__c> getCars(string carTypeId){
        
        if(string.isEmpty(carTypeId)){
            return [Select id,Name from Car__c 
                    where Available_For_Rent__c = true];

        }else{
            return [Select id,Name from Car__c
                    where Available_For_Rent__c = true
                    And Car_Type__c =: carTypeId];
        }
    }
}
