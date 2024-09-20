import { LightningElement, wire } from 'lwc';
import getFilteredAccounts from '@salesforce/apex/AccountController.getFilteredAccounts';
import { publish, subscribe, unsubscribe, MessageContext } from 'lightning/messageService';
import { refreshApex } from '@salesforce/apex';
import { updateRecord } from 'lightning/uiRecordApi';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';
import accountTableFilterMessageChannel from '@salesforce/messageChannel/accountTableFilter__c';

const COLUMNS = [
    { label: 'Name', fieldName: 'nameURL', type: 'url', initialWidth: 250, editable: true, typeAttributes:{
                                                            label: {fieldName: 'Name'},
                                                            target: '_blank'}},
    { label: 'Account Site', fieldName: 'Site', type: 'url', typeAttributes:{
                                                            label: {fieldName: 'Site'},
                                                            target: '_blank'}},
    { label: 'Account Owner', fieldName: 'accountOwnerNameURL', type: 'url', typeAttributes:{
                                                                                label: {fieldName: 'accountOwnerName'},
                                                                                target: '_blank'}},
    { label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable: true, type:'currency', typeAttributes: { currencyCode: 'USD' },},
    { label: 'No of Employee', fieldName: 'NumberOfEmployees'},
];

// const COLUMNS = [
//     { label: 'Name', fieldName: 'Name', type: 'text', cellAttributes: {
//                                             class: 'slds-var-p-bottom_large slds-text-color_success slds-text-title_caps'
//                                             }},
//     { label: 'Account Site', fieldName: 'Site', type: 'url', typeAttributes:{
//                                                             label: {fieldName: 'Site'},
//                                                             target: '_blank'}},
//     { label: 'Account Owner', fieldName: 'accountOwnerNameURL', type: 'url', typeAttributes:{
//                                                                                 label: {fieldName: 'accountOwnerName'},
//                                                                                 target: '_blank'}},
//     { label: 'Annual Revenue', fieldName: 'AnnualRevenue', editable: true, type:'currency', typeAttributes: { currencyCode: 'USD' },},
//     { label: 'No of Employee', fieldName: 'NumberOfEmployees'},
// ];

export default class AccountTableListViewLWC extends LightningElement {

    filters = {};
    columns = COLUMNS;
    filteredData = [];
    wholeData = [];
    @wire(MessageContext)
    messageContext;
    inputValue = '';
    filterableFields = ['Name', 'Site', 'accountOwnerName', 'AnnualRevenue', 'NumberOfEmployees'];
    draftValues = [];
    wireData;

    @wire(getFilteredAccounts, { filter: '$filters'})
    getAccounts(wireResults){
        const {data, error} = wireResults;
        this.wireData = wireResults;
        if (data) {
            this.wholeData = data.map(elem => {
                return {...elem, accountOwnerName: (elem.hasOwnProperty('Owner') ? elem.Owner.Name : ''),
                                 accountOwnerNameURL: (elem.hasOwnProperty('Owner') ? '/' + elem.Owner.Id : ''),
                                 nameURL: '/' + elem.Id};
            });
            this.filteredData = this.wholeData;
        }
        else if (error) {
            this.error = error;
            console.error(error);
        }
    }

    connectedCallback() {
        this.subscribeToMessageChannel();
    }

    subscribeToMessageChannel() {
        if (!this.subscription) {
            this.subscription = subscribe(
                this.messageContext,
                accountTableFilterMessageChannel,
                (message) => this.handleMessage(message)
            );
        }
    }

    handleMessage(message) {
        this.filters = {...message.filters};
    }

    handleSearchChange(event){
        this.filteredData = this.wholeData;
        let searchTerm = event.target.value;
        if (searchTerm) {
            this.filteredData = this.wholeData.filter(eachRec => {
                return Object.keys(eachRec).some(key =>{
                            return (this.filterableFields.includes(key) && eachRec[key].toString().toLowerCase().includes(searchTerm.toLowerCase()));
                        });
            });
        }
        
    }

    async handleSave(event) {
        const records = event.detail.draftValues.slice().map((draftValue) => {
            const fields = Object.assign({}, draftValue);
            return { fields };
        });
        try {
            const recordUpdatePromises = records.map((record) =>
                updateRecord(record)
            );
            Promise.all(recordUpdatePromises)
            .then(() => {
                this.dispatchEvent(
                    new ShowToastEvent({
                        title: 'Success',
                        message: 'Accounts updated',
                        variant: 'success'
                    })
                );
                this.draftValues = [];
                return refreshApex(this.wireData);
            });
        } catch (error) {
            console.log(error);
            this.dispatchEvent(
                new ShowToastEvent({
                    title: 'Error updating or reloading accounts',
                    message: 'Failed',
                    variant: 'error'
                })
            );
        }
    }

    // renderedCallback() {
    //     const style = document.createElement('style');
    //     style.innerText = `c-account-table-list-view .slds-table th, .slds-table td {
    //         padding-bottom: 100px;
    //         color: pink;
    //     }`;
    //     this.template.querySelector('lightning-datatable').appendChild(style);


    // }
}