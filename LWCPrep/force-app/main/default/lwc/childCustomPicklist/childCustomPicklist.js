import { LightningElement, api } from 'lwc';

export default class ChildCustomPicklist extends LightningElement {

    showPicklist = true;
    @api options = [];
    @api value;

    renderedCallback() {
        this.template.querySelector("lightning-combobox")?.focus();
    }
    
    handleChange(event){
        console.log('acdasda: ', event.detail.value);
    }

    handleClick(event){
        this.showPicklist = true;
        var xPosition = event.clientX;
        var yPosition = event.clientY;
        console.log('here123: ', xPosition, ' ', yPosition);
    }

    closePicklist(){
        this.showPicklist = false;
    }
}