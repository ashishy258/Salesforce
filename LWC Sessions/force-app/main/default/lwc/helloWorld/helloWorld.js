import { LightningElement, track, wire } from 'lwc';

export default class HelloWorld extends LightningElement {
    
    show = true;
    showOpp = false;
    a = '';
    handleChange(){
        console.log(this.a);
        console.log(this.a == '');
        if(this.a){
            this.a = '';
            this.show = true;
            this.showOpp = false;
        }else{
            this.a = 'ashish';
            this.show = false;
            this.showOpp = true;
        }
    }


}