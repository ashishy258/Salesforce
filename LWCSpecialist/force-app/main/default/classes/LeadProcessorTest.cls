@IsTest
private class LeadProcessorTest {
    
    @TestSetup
    static void makeData(){
        List<Lead> leadsToInsert = new List<Lead>();
        for(Integer i = 0; i < 200; i++){
            leadsToInsert.add(new Lead(LastName = 'Test:'+i, Company = 'DMI'));
        }
        insert leadsToInsert;
    }

    @IsTest
    private static void updateLeadProcessorTest(){

        test.startTest();
        LeadProcessor lp = new LeadProcessor();
        Id batchId = Database.executeBatch(lp);
        Test.stopTest();
        List<Lead> updatedLeads = [SELECT Id FROM Lead WHERE LeadSource = 'Dreamforce'];
        System.assertEquals(200, updatedLeads.size(), 'size of returned list is not correct');
    }
}