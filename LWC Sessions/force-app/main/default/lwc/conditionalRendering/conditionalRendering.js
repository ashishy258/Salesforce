import { LightningElement } from 'lwc';

export default class ConditionalRendering extends LightningElement {
    check = false;
    handleChange(event){
        this.check = event.target.checked;
    }
    array = ['ashish','indu','avni'];
}