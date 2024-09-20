import {LightningElement, api} from 'lwc';
import getPickListFieldData from '@salesforce/apex/PicklistWrapper.getPickListFieldData';
export default class CustomPicklist extends LightningElement {
	options;
	error;
	fieldLabel;
	@api fieldName;
	@api objectName;
    @api recordId;
	@api isRequired;
    @api selectedValue;
	connectedCallback() {
		getPickListFieldData({recordId: this.recordId, objApiName: this.objectName, fieldName: this.fieldName})
			.then(data => {
				let recipeMap = [{label: "--None--", value: ""}];
				if(this.isRequired){
					this.options = data.picklistValues;
					this.selectedValue = data.defaultValue;
					this.fieldLabel = '*'+data.fieldLabel;
					console.log(this.options);
					console.log(data);
					this.error = undefined;
				}
				else{
					this.options = recipeMap.concat(data.picklistValues);
					this.selectedValue = data.defaultValue;
					this.fieldLabel = data.fieldLabel;
					console.log(this.options);
					console.log(data);
					this.error = undefined;
				}
				
			})
			.catch(error => {
				this.error = error;
				this.options = undefined;
			});
	}

	selectionChangeHandler(event) {
        this.selectedValue = event.target.value;
	}
}