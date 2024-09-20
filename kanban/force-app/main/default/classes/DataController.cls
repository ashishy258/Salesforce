public with sharing class DataController {
   
    @AuraEnabled(cacheable = true)
    public static List<Contact> getContactList(){
        return [Select Id,Name from Contact];
    }
}
