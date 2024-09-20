import { LightningElement, api, track } from 'lwc';

export default class GenericMultiPicklistLWC extends LightningElement {

    @api label = 'Default';
    @api options = [];
    showDropdown = false;
    valueSelected = 'All';
    itemSelected = 0;
    valuesToSend = [];
    secOptions = [];

    connectedCallback(){
        this.options = [{label: 'All', value: 'all'}, ...this.options];
        this.secOptions = this.options;
    }

    handleButtonClick(){
        this.valuesToSend = [];
        this.showDropdown = this.showDropdown ? false : true;
        this.options.map(item => {
            if(item.hasOwnProperty('iconName') && item.iconName === 'utility:check' && item.label !== 'All'){
                this.valuesToSend.push(item.value);
            }
        });
        const selectedValues = new CustomEvent('selection', { detail: this.valuesToSend});
        this.dispatchEvent(selectedValues);
        console.log(this.valuesToSend);
    }

    handleSelection(event) {
        if(event.target.dataset.name === 'All'){
            this.itemSelected = 0;
            this.options = this.options.map(elem => {
                let icon;
                if(elem.value === event.target.dataset.key){
                    icon = elem.iconName ? '' : 'utility:check';
                }
                else{
                    icon = '';
                    
                }
                return {...elem, iconName:icon};
            });
            this.valueSelected = 'All';
            return;
        }
        this.options = this.options.map(elem => {
            if(elem.value === event.target.dataset.key){
                let icon = elem.iconName ? '' : 'utility:check';
                this.itemSelected = elem.iconName ? this.itemSelected - 1 : this.itemSelected + 1;
                return {...elem, iconName:icon};
            }
            else if(elem.label === 'All'){
                let icon = ''
                return {...elem, iconName:icon};
            }
            return elem;
        });
        this.valueSelected = this.itemSelected ? this.itemSelected + ' options selected' : 'All';
    }
}