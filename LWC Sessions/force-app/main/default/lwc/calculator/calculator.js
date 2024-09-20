import { LightningElement } from 'lwc';

export default class Calculator extends LightningElement {
    first;
    second;
    result;
    check = false;
    arrayResult = [];
    handleChange(event){
        if(event.target.name === 'firstNumber'){
            this.first = parseInt(event.target.value);
        }
        else if(event.target.name === 'secondNumber'){
            this.second = parseInt(event.target.value);
        }
    }
    add(){
        this.result = this.first + this.second;
        this.arrayResult.push(this.result);
    }
    subtract(){
        this.result = this.first - this.second;
        this.arrayResult.push(this.result);
    }
    multiply(){
        this.result = this.first * this.second;
        this.arrayResult.push(this.result);
    }
    divide(){
        this.result = this.first / this.second;
        this.arrayResult.push(this.result);
    }
    showArrayResult(event){
        this.check = event.target.checked;
    }
    

}