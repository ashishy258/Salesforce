import { LightningElement, wire, api } from 'lwc';
import { getListInfoByName } from 'lightning/uiListsApi';
import CASE_OBJECT from '@salesforce/schema/Case';
import { NavigationMixin } from 'lightning/navigation';

export default class AccordianLWC extends NavigationMixin(LightningElement) {

    showPopover = false;
    value = 'Sales';
    listViewId;
    get options() {
        return [
            { label: 'Sales', value: 'Sales' },
            { label: 'Force', value: 'Force' },
        ];
    }

    @api randomNumber;

    error;
    displayColumns;

    @wire(getListInfoByName, { objectApiName: CASE_OBJECT.objectApiName, listViewApiName: 'RecentlyViewedCases' })
    listInfo({ error, data }) {
        if (data) {
            console.log('data1:', JSON.parse(JSON.stringify(data)));
            console.log('listViewId: ', data.listReference.id);
            console.log('randomNumber: ', this.randomNumber);
            this.listViewId = data.listReference.id;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.displayColumns = undefined;
        }
    }

    handleToggle(){
        this.showPopover = !this.showPopover;
        this.handleListViewNavigation();
    }

    handleRadioChange(event) {
        let value = event.detail.value;
        this.value = value;
        console.log('value: ', value);
        setTimeout(() => {
            this.showPopover = false;
        }, 500);
    }

    handleBlur(){
        this.showPopover = false;
    }

    handleListViewNavigation() {
        // Navigate to the Accounts object's Recent list view.
        this[NavigationMixin.Navigate]({
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Case',
                actionName: 'list'
            },
            state: {
                filterName: this.listViewId
            }
        });
    }
}