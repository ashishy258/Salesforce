@IsTest
public class PicklistWrapperTest {
   
    @TestSetup
    public static void setup(){
        Account acc = new Account(name='Ashish Inc.', Rating='Hot');
        insert acc;
    }
    
    @IsTest
    public Static void testGetPickListFieldData(){
        
        Account acc = [Select Id, Rating from Account limit 1];
        Test.startTest();
        PicklistWrapper.FieldWrapper fw = PicklistWrapper.getPickListFieldData(acc.Id, 'Account', 'Rating');
        Test.stopTest();
        system.assertEquals(3, fw.picklistValues.size());
        system.assertEquals('Account Rating', fw.fieldLabel);
        system.assertEquals('Hot', fw.defaultValue);
        
    }
}