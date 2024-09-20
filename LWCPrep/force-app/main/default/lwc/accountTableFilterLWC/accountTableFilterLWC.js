import { LightningElement, track, api, wire } from 'lwc';
import getDependentPicklistValues from '@salesforce/apex/AccountController.getDependentPicklistValues';
import { publish, MessageContext } from 'lightning/messageService';
import accountTableFilterMessageChannel from '@salesforce/messageChannel/accountTableFilter__c';

export default class AccountTableFilterLWC extends LightningElement {

    picklistOptions = {};
    isPicklistArrived = false;
    selectedCountry;
    selectedState;
    selectedCountryCode;
    filter = {};
    isStateDisabled = true;
    @track countryOptions = [];
    @track stateOptions = [];

    @wire(MessageContext)
    messageContext;

    connectedCallback(){
        getDependentPicklistValues()
            .then(result => {
                this.picklistOptions = result;
                this.isPicklistArrived = true;
                this.countryOptions = [{'value': 'none', 'label': '--None--'}, ...this.getCountryOptions()];
            })
            .catch(error =>{
                console.error(error);
            })
    }

    getCountryOptions(){
        const arrOptions = Object.keys(this.picklistOptions.countryLabelAndCode);
        return arrOptions.map(item => {
            let keyValue = item;
            return { 'value': item, 'label': this.picklistOptions.countryLabelAndCode[keyValue]};
        });
    }

    handleCountryChange(event){
        this.filter = {};
        this.selectedState = '';
        this.isStateDisabled = true;
        this.selectedCountry = event.target.value;
        if(this.selectedCountry !== 'none'){
            let label = this.picklistOptions.countryLabelAndCode[this.selectedCountry];
            if(this.picklistOptions.dependentPicklist.hasOwnProperty(label)){
                this.stateOptions = this.picklistOptions.dependentPicklist[label].map(item => {
                    return { 'value': item, 'label': item };
                });
                this.isStateDisabled = false;
            }
            this.filter.BillingCountryCode = this.selectedCountry;
        }
        this.handleFilterChange(this.filter);
    }

    handleStateChange(event){
        this.selectedState = event.target.value;
        this.filter.BillingStateCode = this.selectedState;
        this.handleFilterChange(this.filter);
    }

    handleFilterChange(data) {
        const payload = { filters: data };
        publish(this.messageContext, accountTableFilterMessageChannel, payload);
    }
}