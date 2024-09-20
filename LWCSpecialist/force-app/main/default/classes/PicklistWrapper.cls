public with sharing class PicklistWrapper {
   
    
    @AuraEnabled(cacheable = true)
    public static FieldWrapper getPickListFieldData(String recordId, String objApiName, String fieldName) {
        FieldWrapper fieldWrap = new FieldWrapper();

        //line no. 9-25 helps in getting all the values present in specified picklist field
        Schema.SObjectType objType = Schema.getGlobalDescribe().get(objApiName);
        if (objType == null) {
            return fieldWrap;
        }
        Schema.DescribeSObjectResult sobjectDescribe = objType.getDescribe();
        Map < String, Schema.SObjectField > fieldMap = sobjectDescribe.fields.getMap();
        if (fieldMap.get(fieldName) == null) {
            return fieldWrap;
        }
        List < Schema.PicklistEntry > pickListValues = fieldMap.get(fieldName).getDescribe().getPickListValues();
        for (Schema.PicklistEntry f: pickListValues) {
            Map < String, String > values = new Map < String, String > {
                'label' => f.getLabel(),
                'value' => f.getValue()
            };
            fieldWrap.picklistValues.add(values);
        }

        //line no. 28-29 helps in getting the label of specified picklist field
        String fieldLabel = fieldMap.get(fieldName).getDescribe().getLabel();
        fieldWrap.fieldLabel = fieldLabel;

        //line no. 32-34 helps in getting the selected value of specified picklist field
        String query = 'SELECT '+ fieldName + ' FROM '+ objApiName + ' WHERE ID =\''+recordId+'\' LIMIT 1';
        SObject obj = Database.query(query);
        fieldWrap.defaultValue = (String)obj.get(fieldName);

        return fieldWrap;
    }
    
    public class FieldWrapper{
        @AuraEnabled
        public List<Map<String, String>> picklistValues {get; set;}
        @AuraEnabled
        public String fieldLabel {get; set;}
        @AuraEnabled
        public String defaultValue {get; set;}
        
        public FieldWrapper(){
            picklistValues = new List<Map<String, String>>();
        }
    }
}