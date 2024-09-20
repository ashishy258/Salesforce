public with sharing class AccountManager {

    @AuraEnabled(cacheable = true)
    public static List<Account> getAccounts(){
        return [Select name, phone,website from Account];
    }

}
