import { LightningElement } from 'lwc';

export default class ToDo extends LightningElement {

    // input;
    // taskList = [];
    
    
    handleInput(event){ 
       
        var input = this.template.querySelector(".input");
        console.log(input);

    }
    handleAdd(){ 
        var input = this.template.querySelector("lightning-input").value;
        var li = document.createElement("li");
        li.innerText = input;
        var btn = document.createElement("BUTTON");   
        btn.innerHTML = "Del";                   
        btn.addEventListener("click", function(){ 
            btn.parentNode.remove();
        });
        this.template.querySelector("ul").appendChild(li);
        li.appendChild(btn); 
        this.template.querySelector("lightning-input").value = '';
          
    }

    
}