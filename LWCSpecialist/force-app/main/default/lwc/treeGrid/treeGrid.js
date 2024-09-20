import { LightningElement, wire, api } from 'lwc';
import getAccounts from '@salesforce/apex/GetChildAccounts.getAccounts';
// import {
//     EXAMPLES_COLUMNS_DEFINITION_BASIC,
//     EXAMPLES_DATA_BASIC,
// } from './sample';

export default class TreeGrid extends LightningElement {

    @api recordId;
    gridData;

    gridColumns = [{
        type: 'text',
        fieldName: 'Name',
        label: 'Name'
    },
    {
        type: 'text',
        fieldName: 'Industry',
        label: 'Industry'
    },
    {
        type: 'text',
        fieldName: 'FirstName',
        label: 'FirstName'
    },
    {
        type: 'Picklist',
        fieldName: 'Status',
        label: 'Status'

    }
];
    // definition of columns for the tree grid
    // gridColumns = EXAMPLES_COLUMNS_DEFINITION_BASIC;

    // data provided to the tree grid
    // gridData = EXAMPLES_DATA_BASIC;

    @wire(getAccounts,{recordId:'$recordId'})
    accsWithCons({error,data}){
        if (data) {
            let parseData = JSON.parse(JSON.stringify(data));

            for (let i = 0; i < parseData.length; i++) {
                parseData[i]._children = parseData[i]['Cases'];
                delete parseData[i]['Cases'];
            }
            console.log(parseData);

            this.gridData = parseData;
        } else if (error) {
            console.log('error ====> ' + JSON.stringify(error));
        }
    }
}