@IsTest
public class AccountControllerTest {
   
   
    @TestSetup
    static void setup(){
        Account accIndia = new Account(Name = 'TestAccountOne', BillingCountryCode = 'IN', BillingStateCode = 'DL');
        Account accUS = new Account(Name = 'TestAccountTwo', BillingCountryCode = 'US', BillingStateCode = 'AL');
        insert new List<Account>{accIndia, accUS};
    }
   
    @IsTest
    static void testGetFilteredAccounts() {
       
        Map<String, String> filterMap = new Map<String, String>{'BillingCountryCode' => 'IN', 'BillingStateCode' => 'DL'};
       
        Test.startTest();
        List<Account> filteredAccounts = AccountController.getFilteredAccounts(filterMap);
        Test.stopTest();
       
        System.assertEquals('TestAccountOne', filteredAccounts[0].Name, 'The name of filtered Account should be TestAccountOne');
       
    }

    @IsTest
    static void testGetDependentPicklistValues() {
       
        Test.startTest();
        AccountController.CountryStateWrapper countStateWrap = AccountController.getDependentPicklistValues();
        Test.stopTest();

        System.assertEquals(true, countStateWrap.countryLabelAndCode.containsKey('US'), 'the countryLabelAndCode map should be having US as its one of the country code');
       
    }
}