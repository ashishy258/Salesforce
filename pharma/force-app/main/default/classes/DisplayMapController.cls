public with sharing class DisplayMapController {
    
    @AuraEnabled (cacheable=true)
    public static List<Physician__c> getClinicLocations(String physicianNameInitial){
        String str = '%' + physicianNameInitial + '%';
        if (physicianNameInitial != null) {
            
            return [SELECT Id, Name, City__c,Country__c FROM Physician__c WHERE Name LIKE :str];   
        }
        else {
            return [SELECT Id, Name, City__c,Country__c FROM Physician__c ];   
        }
            
    }
}