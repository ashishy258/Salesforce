/* myDatatable.js */
import { LightningElement, wire, track } from 'lwc';
import getAccountListCustom from '@salesforce/apex/AccountController.getAccountListCustom';
import { getPicklistValues, getObjectInfo } from 'lightning/uiObjectInfoApi';
import ACCOUNT_OBJECT from '@salesforce/schema/Account';
import INDUSTRY from '@salesforce/schema/Account.Industry';

const COLS = [
    { label: 'Account Name', type: 'customText',
        typeAttributes: {
            accountName: { fieldName: 'Name' }
        },
    },
    { label: 'Industry', type: 'customPicklist', wrapText: true,
        typeAttributes: {
            options: {fieldName: 'industryOptions'},
            value: {fieldName: 'Industry'}
        },
        cellAttributes: {
            class: { fieldName: 'industryClass' },
        }
    },
    { label: 'Employees', type: 'customNumber', fieldName: 'NumberOfEmployees',
        typeAttributes: {
            status: {fieldName: 'status'}
        },
        cellAttributes: {
            class: 'slds-theme_alert-texture'
        }
    }];

export default class MyDatatable extends LightningElement {
    columns = COLS;
    @track accounts = [];
    industryOptions = [];

    @wire(getObjectInfo, { objectApiName: ACCOUNT_OBJECT })
    recordTypeInfo;

    @wire(getPicklistValues, { recordTypeId: '$recordTypeInfo.data.defaultRecordTypeId', fieldApiName: INDUSTRY })
    industryPicklist({data, error}){
        if (data) {
            this.industryOptions = data.values.map(item => (
                {label: item.label, value: item.value}
            ));
            console.log('industryOptions: ', this.industryOptions);
            this.fetchAccounts();
        }
        else if (error) {
            console.log(error);
        }
    }

    fetchAccounts(){
        getAccountListCustom()
            .then(result => {

                this.accounts = result.map((record) => {
                    let industryColor = record.Industry === 'Energy' ? 'slds-text-color_success': '';
                    let industryClass = 'blueText';
                    let status = record.NumberOfEmployees > 10000 ? 'utility:ribbon' : '';
                    return {...record, 
                        'industryColor': industryColor,
                        'status': status,
                        'industryOptions': this.industryOptions,
                        'industryClass': industryClass
                    }
                });
                console.log('accounts: ', this.accounts);
                console.log('ashish1: ', this.template.querySelector("lightning-combobox"));
            })
            .catch(error =>{
                console.error(error);
            })
    }

    renderedCallback() {
        console.log('ashish2: ', this.template.querySelector("lightning-combobox"));
    }
}