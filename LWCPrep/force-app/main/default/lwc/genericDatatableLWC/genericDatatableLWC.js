import { LightningElement, api, track, wire } from 'lwc';
import getTableInfo from '@salesforce/apex/GenericDatatableController.getTableInfo';
import { getRecord } from "lightning/uiRecordApi";
import TEST_SESSION_ID from "@salesforce/schema/Account.testSessionId__c";
 
export default class GenericDatatableLWC extends LightningElement {

    @api parentMetadataName;
    @track columns = [];
    @track records = [];
    @track recordsFinal = [];
    @track filteredData = [];
    sObjectName;
    isLoaded = false;
    inputValue = '';
    recordSize;
    rowOffset = 0;
    isPagination = false;
    isSearchable = false;
    filterableFields = [];

    @wire(getRecord, {recordId: "0015g00000DzuxvAAB", fields: [TEST_SESSION_ID]})
    account({data, error}){
        if(data){
            console.log('here1:', data);
        }
        else if (error){
            console.log(error);
        }
    };

    // connectedCallback() {
    //     fetch('https://login.salesforce.com/services/oauth2/token?grant_type=password&client_id=3MVG9fe4g9fhX0E50Q2UCznFVGQ7Wk74NRgN1ugCJ2x424vlYEdTMStwT5S0eImbhSupfriSHhiP2R8f8T.2V&client_secret=056A2EB7292F5006CA06D79D1CD10058D89E10608CB07CF75F56BA43178D2560&username=lwcpractice@udemy.com&password=xpb@zpr6AKW4kca-kjt',
    //         {
    //             headers: {           
    //                 "Content-Type": "application/json"
    //             },
    //             method: 'POST',
    //         }
    //     )
    //     .then(response => response.json())
    //     .then(data => {
    //         console.log('data2: ', data);
    //     })
    //     .catch(error => {
    //         console.log('error: ', error);
    //     });
    // };

    getCompleteData() {
        getTableInfo({ 'parentMetadataName' : this.parentMetadataName })
            .then(result => {
                if(result){
                    this.sObjectName = result.objectName;
                    this.isPagination = result.isPagination;
                    this.recordSize = result.recordsOnPage;
                    this.isSearchable = result.isSearchable;
                    this.createColumns(result.columns);
                    this.modifyRecordData(result.tableData);
                }
            })
            .catch(error => {
                console.log(JSON.stringify(error));
            });
    }

    createColumns(data){
        data.forEach(element => {
            let item = {};
            item.type = element.type;
            item.label = element.label;
            if(element.type === 'url'){
                item.fieldName = element.urlValue;
                item.typeAttributes = {label: {fieldName: element.urlLabel}, target: '_blank'};
            } else{
                item.fieldName = element.fieldName;
            }
            this.columns.push(item);
        });
        this.columns = JSON.parse(JSON.stringify(this.columns));
    }

    modifyRecordData(data){
        data.forEach(elem => {
            let item = {};
            Object.keys(elem).forEach(innerElem => {
                if(typeof(elem[innerElem]) === 'object'){
                    Object.keys(elem[innerElem]).forEach(innerItem => {
                        if(innerItem === 'Id'){
                            item[innerElem + '.' + innerItem] = '/lightning/r/'+this.sObjectName+'/' + elem[innerElem][innerItem] + '/view';
                        } else {
                            item[innerElem + '.' + innerItem] = elem[innerElem][innerItem];
                            this.filterableFields.push(innerElem + '.' + innerItem);
                        }
                    });
                }
                else if(innerElem === 'Id'){
                    item[innerElem] = '/lightning/r/'+this.sObjectName+'/' + elem[innerElem] + '/view';
                } else{
                    item[innerElem] = elem[innerElem];
                    this.filterableFields.push(innerElem);
                }  
            });
            this.records.push(item);
        });
        console.log('records: ', this.records);
        this.records = JSON.parse(JSON.stringify(this.records));
        if(!this.isPagination){
            this.recordsFinal = this.records;
        }
    }

    renderedCallback(){
        if(!this.isLoaded){
            this.getCompleteData();
        }
        this.isLoaded = true;
    }

    handlePagination(event){
        this.recordsFinal = event.detail.records;
        this.rowOffset = this.recordSize * (event.detail.cpage - 1);
    }

    handleSearchChange(event){
        this.filteredData = this.records;
        let searchTerm = event.target.value;
        if (searchTerm) {
            this.filteredData = this.records.filter(eachRec => {
                return Object.keys(eachRec).some(key =>{
                            return (this.filterableFields.includes(key) && eachRec[key].toString().toLowerCase().includes(searchTerm.toLowerCase()));
                        });
            });
        } 

        if(this.isPagination){
            this.records = this.filteredData;
        } else{
            this.recordsFinal = this.filteredData;
        }
    }
}