public with sharing class DrugController {
    public DrugController() {

    }
    @AuraEnabled(cacheable = true)
    public static List<sObject> searchDrug(String searchParam){
        String likeParam = '%'+searchParam+'%';
        String Query = '';

        if (searchParam != null) {
            
            Query = 'select name, inventory_left__c, price__c, product_type__c, image__c from pharma_product__c where name like : likeParam';
        }
        else {
            Query = 'select name, inventory_left__c, price__c, product_type__c, image__c from pharma_product__c';
        }

        List<sObject> drugList = Database.query(Query);
        return drugList;
    }
}
