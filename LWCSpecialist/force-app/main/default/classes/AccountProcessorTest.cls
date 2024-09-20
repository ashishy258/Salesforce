@IsTest
private with sharing class AccountProcessorTest {
    
    @TestSetup
    static void makeData(){
        List<Account> accToInsert = new List<Account>();
        for(Integer i = 0; i <200; i++){
            Account acc = new Account(Name = 'Test'+i);
            accToInsert.add(acc);
        }
        insert accToInsert;

        List<Account> accLst = [SELECT Id, Name FROM Account];
        List<Contact> conLst = new List<Contact>();
        for(Account a : accLst){
            Contact c = new Contact(LastName = a.Name+':Contact', AccountId = a.Id);
            conLst.add(c);
        }
        insert conLst;
        
    }

    @IsTest
    private static void testCountContacts(){

        List<Account> accLst = [SELECT Id FROM Account];
        List<String> listIds = new List<String>();
        for (Account a : accLst){
            listIds.add(a.Id);
        }
        test.startTest();
        AccountProcessor.countContacts(listIds);
        test.stopTest();
        List<Account> accountsLst = [SELECT Id, Number_Of_Contacts__c from Account];
        System.assertEquals(1, accountsLst[0].Number_Of_Contacts__c, 'Contact size is not equal to 1');
    }
}