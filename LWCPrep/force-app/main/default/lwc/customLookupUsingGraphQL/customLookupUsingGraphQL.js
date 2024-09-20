import { LightningElement, wire, track, api } from 'lwc';

export default class CustomLookupUsingGraphQL extends LightningElement {

    errors;
    @api recordsList;
    @track searchKey = "";
    selectedValue;
    selectedRecordId;
    @api iconName = 'standard:account';
    @api lookupLabel;
    @track message;
    @track filteredList;
    @api isRequired = false;
    @track className = 'slds-form-element';
    @track isErrorMsgOnUI = false;

    // @wire(graphql, {
    //     query: gql`
    //       query AccountWithName {
    //         uiapi {
    //           query {
    //             Account(first: 50) {
    //               edges {
    //                 node {
    //                   Id
    //                   Name {
    //                     value
    //                   }
    //                 }
    //               }
    //             }
    //           }
    //         }
    //       }
    //     `,
    // })
    // graphqlQueryResult({ data, errors }) {
    //     if (data) {
    //       this.recordsList = data.uiapi.query.Account.edges.map((edge) => {
    //                             return {Id: edge.node.Id, Name: edge.node.Name.value};
    //                         });
    //       console.log('Accounts: ', JSON.parse(JSON.stringify(this.recordsList)));
    //     }
    //     this.errors = errors;
    // }

    

    @api
    validate() {
        if (this.isRequired !== true || (this.isRequired === true && !this.isValueNullOrBlank(this.selectedValue))) {
            return {
                isValid: true
            };
        } else {
            this.className = 'slds-form-element slds-has-error';
            this.isErrorMsgOnUI = true;
            return {
                isValid: false,
                errorMessage: 'Please enter some valid input. Input is not optional.'
            };
        }
    }

    isValueNullOrBlank(value){
        if(value !== null && value !== undefined && value.trim().length > 0){
            return false;
        }else{
            return true;
        }
    }

    connectedCallback() {
        this.template.addEventListener("keydown", (event) => {
            var keyPressed = event.key;
            if(keyPressed === 'Tab'){
                this.handleBlur();
            }
        });
    }

    disconnectedCallback() {
        this.template.removeEventListener("keydown", this.handleBlur());
    }

    handleBlur(){
        setTimeout(() => {
            this.filteredList = null;
        }, 100);
    }

    onRecordSelection(event) {
        this.selectedRecordId = event.target.dataset.key;
        this.selectedValue = event.target.dataset.name;
        let selectedData = {Id: this.selectedRecordId, value: this.selectedValue};
        this.searchKey = "";
        const selectedEvent = new CustomEvent('selected', { detail: selectedData});
        this.dispatchEvent(selectedEvent);
        console.log('selected Data: ', selectedData);
    }

    handleKeyChange(event) {
        const searchKey = event.target.value;
        console.log('event: ', event.key);
        this.searchKey = searchKey;
        this.filteredList = this.getfilterListClientEnd(this.recordsList);
    }

    removeRecordOnLookup() {
        this.searchKey = "";
        this.selectedValue = null;
        this.selectedRecordId = null;
        this.filteredList = null;
    }

    getfilterListClientEnd(recordList) {
        var result = [];
        for (var i = 0; i < recordList.length; i++) {
            if (recordList[i].Name !== undefined) {
                let value = recordList[i].Name.toLowerCase();
                let searchval = this.searchKey.toLowerCase();
                if (value.indexOf(searchval) !== -1) {
                    let records = {};
                    records.Id = recordList[i].Id;
                    records.Name = recordList[i].Name;
                    result.push(records);
                }
            }
        }
        return result;
    }
}