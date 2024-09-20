import { LightningElement } from 'lwc';

export default class ParentOne extends LightningElement {


    input;
    handleChange(event){
        this.input = event.target.value;
    }
    handleSelect(){
        const childComp = this.template.querySelector('c-child-one');
        childComp.selectedCheckbox(this.input);
    }
}