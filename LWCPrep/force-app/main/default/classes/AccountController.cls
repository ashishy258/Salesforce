public with sharing class AccountController {

    @AuraEnabled(cacheable=true)
    public static List<Account> getFilteredAccounts(Map<String, String> filter){
        String whereClause = '';

        for(String filterKey : filter.keySet()){
            whereClause = (String.isBlank(whereClause) ? 'WHERE ' : whereClause + ' AND ') + filterKey + ' = \'' + filter.get(filterKey) + '\'';
        }
        String query = 'SELECT Id, Name, Site, Owner.Name, AnnualRevenue, NumberOfEmployees FROM Account ' + whereClause;
        return Database.query(query);
    }

    @AuraEnabled
    public static String getString(){
        return 'Ashish';
    }
    
    
    @AuraEnabled(cacheable=true)
    public static List<Contact> getRelatedContacts(String parentAccId){
        return [SELECT Id, Name, Email FROM Contact WHERE AccountId =: parentAccId WITH SECURITY_ENFORCED];
    }

    @AuraEnabled
    public static void createContact(Contact contactRecord, String accId){
        contactRecord.AccountId = accId;
        insert contactRecord;
    }

    @AuraEnabled
    public static String sendWelcomeMail(List<String> emailIds){
        Messaging.SingleEmailMessage message = new Messaging.SingleEmailMessage();
        message.toAddresses = emailIds;
        message.subject = 'Subject Test Message';
        message.plainTextBody = 'This is the message body.';
        List<Messaging.SingleEmailMessage> messages =   new List<Messaging.SingleEmailMessage>{message};
        List<Messaging.SendEmailResult> results = Messaging.sendEmail(messages);

        if (results[0].success) {
            return 'Success';
        } else {
            return 'Failure';
        }
    }

    @AuraEnabled(cacheable=true)
    public static WrapperClass getAccountist(){
        WrapperClass allData = new WrapperClass();
        List<Account> lstAccount = [SELECT Id, Name, Type, Industry, AnnualRevenue, activities_count__c, CreatedDate  FROM Account WITH SECURITY_ENFORCED];

        for(Account a: lstAccount){
            allData.recordData.add(a);
        }
        Schema.SObjectType objType = Schema.getGlobalDescribe().get('Account');
        Schema.DescribeSObjectResult sobjectDescribe = objType.getDescribe();
        Map<String, Schema.SObjectField> fieldMap = sobjectDescribe.fields.getMap();
        List<Schema.PicklistEntry> pickListValues = fieldMap.get('Type').getDescribe().getPickListValues();
        for (Schema.PicklistEntry f: pickListValues) {
            Map<String, String> values = new Map<String, String>{
                'label' => f.getLabel(),
                'value' => f.getValue()
            };
            allData.typeFieldValues.add(values);    
        }
        allData.typeFieldLabel = fieldMap.get('Type').getDescribe().getLabel();

        return allData;
    }

    public class WrapperClass{
        @AuraEnabled
        public List<Account> recordData {get; set;}
        @AuraEnabled
        public String typeFieldLabel {get; set;}
        @AuraEnabled
        public List<Map<String, String>> typeFieldValues {get; set;}

        public WrapperClass(){
            recordData = new List<Account>();
            typeFieldValues = new List<Map<String, String>>();

        }
    }

    @AuraEnabled
    public static string updateAccounts(Object data) {
        List<Account> accountsForUpdate = (List<Account>) JSON.deserialize(JSON.serialize(data), List<Account>.class);
        try {
            update accountsForUpdate;
            return 'Success: accounts updated successfully';
        }
        catch (Exception e) {
            return 'The following exception has occurred: ' + e.getMessage();
        }
    }

    @AuraEnabled(cacheable=true)
    public static List<Account> getAccountListCustom() {
        return [SELECT Id, Name, Industry, NumberOfEmployees FROM Account WITH SECURITY_ENFORCED limit 2];
    }

    @AuraEnabled
    public static CountryStateWrapper getDependentPicklistValues() {

        CountryStateWrapper finalWrapper = new CountryStateWrapper();
        Map<String, String> countryLabelCode = new Map<String, String>();
        Schema.DescribeFieldResult fieldResult = User.Countrycode.getDescribe();
        List<Schema.PicklistEntry> controlEntries = fieldResult.getPicklistValues();
        for( Schema.PicklistEntry country : controlEntries){
            countryLabelCode.put(country.getValue(), country.getLabel());
        }
        finalWrapper.countryLabelAndCode = countryLabelCode;
        Schema.DescribeFieldResult depend = User.statecode.getDescribe();
 
        String base64map = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/';
        Map<String,List<String>> dependentPicklistValues = new Map<String,List<String>>();
        
        for (Schema.PicklistEntry entry : depend.getPicklistValues()) {
            if (entry.isActive() && String.isNotEmpty(String.valueOf(((Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(entry))).get('validFor')))) {
                List<String> base64chars = String.valueOf(((Map<String,Object>) JSON.deserializeUntyped(JSON.serialize(entry))).get('validFor')).split('');
                for (Integer index = 0; index < controlEntries.size(); index++) {
                    Object controlValue = controlEntries[index].isActive() ? controlEntries[index].getLabel() : null;
                    Integer bitIndex = index / 6;
                    if (bitIndex > base64chars.size() - 1) {
                        break;
                    }
                    Integer bitShift = 5 - Math.mod(index, 6);
                    if  (controlValue == null || (base64map.indexOf( base64chars[ bitIndex ] ) & (1 << bitShift)) == 0)
                        continue;
                    if (!dependentPicklistValues.containsKey((String) controlValue)) {
                        dependentPicklistValues.put((String) controlValue, new List<String>());
                    }
                    dependentPicklistValues.get((String) controlValue).add(entry.getValue());
                }
            }
        }
        finalWrapper.dependentPicklist = dependentPicklistValues;
        return finalWrapper;
    }

    public class CountryStateWrapper{
        @AuraEnabled
        public Map<String,List<String>> dependentPicklist {get; set;}
        @AuraEnabled
        public Map<String, String> countryLabelAndCode {get; set;}
        public CountryStateWrapper(){
            dependentPicklist = new Map<String,List<String>>();
            countryLabelAndCode = new Map<String, String>();
        }
    }
}