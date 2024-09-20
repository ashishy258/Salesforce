public with sharing class AccountProcessor {
    
    @future
    public static void countContacts(List<String> accountIds){

        List<Account> accountsLst = [SELECT Id, Number_Of_Contacts__c,  (Select Id from Contacts) from Account WHERE Id IN : accountIds];
        List<Account> accToUpdate = new List<Account>();
        for(Account a : accountsLst){
            a.Number_Of_Contacts__c = a.Contacts.size();
            accToUpdate.add(a);
        }
        update accToUpdate;
    }
}