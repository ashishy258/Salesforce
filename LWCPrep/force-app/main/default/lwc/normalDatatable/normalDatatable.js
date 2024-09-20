import { LightningElement, wire } from 'lwc';
import { getRecords } from "lightning/uiRecordApi";
import NAME_FIELD from "@salesforce/schema/User.Name";
import EMAIL_FIELD from "@salesforce/schema/User.Email";

const columns = [
    { label: 'Label', fieldName: 'name' },
    { label: 'Website', fieldName: 'website', type: 'url' },
    { label: 'Phone', fieldName: 'phone', type: 'phone' },
    { label: 'Balance', fieldName: 'amount', type: 'currency' },
    { label: 'CloseAt', fieldName: 'closeAt', type: 'date' },
];

export default class NormalDatatable extends LightningElement {

    data = [];
    columns = columns;

    @wire(getRecords, { records: [{
                                    recordIds: ["0055g0000099XHMAA2"],
                                    fields: [NAME_FIELD],
                                    optionalFields: [EMAIL_FIELD]
                                }
                            ]
    })
    wiredRecords({ error, data }) {
        if (data) {
            console.log('userData: ', JSON.parse(JSON.stringify(data)));
        } else if (error) {
            console.log('error: ', error);
        }
    }

    connectedCallback() {
        const data = [{name: 'One', website: 'www.salesforce.com'},
                      {name: 'Two', website: 'www.salesforce.com'}];
        this.data = data;
        console.log('data: ', this.data);
    }
}