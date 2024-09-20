import { LightningElement, api } from 'lwc';

export default class ChildOne extends LightningElement {
    value = 'red';
    options = [
            { label: 'r', value: 'red' },
            { label: 'b', value: 'blue' },
            { label: 'g', value: 'green' },
        ];

    
    @api
    selectedCheckbox(checkboxvalue){
        const val = this.options.find(check =>{
            return (checkboxvalue === check.label);
        })
        
        if(val){
            this.value = val.value;
            return 'found';
        }
        return 'No checkbox found';
    }
}