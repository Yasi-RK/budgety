
// budget controller

var budgetController = (function(){
    
    var Expense = function (id, description, value){

        this.id= id;
        this.description= description;
        this.value = value;
    };

    var Income = function (id, description, value){

        this.id= id;
        this.description= description;
        this.value = value;
    };

    var calculateTotal = function(type){
        var sum = 0;
        data.allItems[type].forEach(function(cur){
            sum += cur.value;
        });
        /*
        0
        [200,400,100]
        sum = 0+200
        sum = 200+400
        summ= 600+100
        */

        data.totals[type]= sum;
    };

  
    var data = {
        allItems : {
            exp:[],
            inc:[]
        },
        totals:{
            exp:0,
            inc:0
        },
        budget : 0,
        percentage : -1
    };

    return {
         addItem: function(type,des,val){

            var newItem, ID;

            // create new ID
            if(data.allItems[type.length >0]){
                ID= data.allItems[type][data.allItems.lenght - 1].id +1 ;
            }else {
                ID=0;
            }
            
            //[1 2 3 4 ], next ID = 6
            //[1 3 5 6 8], next ID = 9
            // ID=last ID +1
            // 

            // create new item based on inc or exp type
            if( type === 'exp'){
                newItem = new Expense(ID,des,val);
            }else if (type === 'inc'){
                newItem = new Income(ID,des,val);
            }
            // push to data struscture
            data.allItems[type].push(newItem);

            // return the bew element
            return newItem;
         },

         calculateBudget : function(){

             // calculate total income and expenses
             calculateTotal('exp');
             calculateTotal('inc');


             //calculate budget : income-expense
             data.budget = data.totals.inc - data.totals.exp;


             //calculate the percentage of income that we spent
             if(data.totals.inc >0){
                data.percentage = Math.round((data.totals.exp / data.totals.inc) *100);
             }else {
                 data.percentage = -1;
             }
             

         },
         getBudget : function(){
            return {
                budget: data.budget,
                totalInc : data.totals.inc,
                totalExp : data.totals.exp,
                percentage : data.percentage
            };

        },





         testing: function(){
             console.log(data);
         }
    };

})();



// UI controller
var UIcontroller = (function(){

    var DOMstrings = {
        inputType :'.add__type',
        inputDescription :'.add__description',
        inputValue : '.add__value',
        inputBtn : '.add__btn',
        incomContainer :'.income__list',
        expenseContainer : '.expenses__list'

    };

    return{

        getInput:function(){

            return {
            
            type :document.querySelector(DOMstrings.inputType).value, // will be either inc or exp
            
            description : document.querySelector(DOMstrings.inputDescription ).value,
            
            value : parseFloat(document.querySelector(DOMstrings.inputValue).value)  

            };
            
        },

        addListItem : function(obj,type){

            var html;

            // create htme string with placeholder text
            if (type === 'inc'){
                element = DOMstrings.incomContainer;
                html = '<div class="item clearfix" id="income-%id%"><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';
            }else if(type === 'exp'){ 
                element = DOMstrings.expenseContainer;  
                html = '<div class="item clearfix" id="income-%id%""><div class="item__description">%description%</div><div class="right clearfix"><div class="item__value">%value%</div><div class="item__delete"><button class="item__delete--btn"><i class="ion-ios-close-outline"></i></button></div></div></div>';

            }
           

            // replace the placeholder text with some actual data

            newHtml = html.replace('%id%' ,obj.id);
            newHtml = newHtml.replace('%description%' ,obj.description);
            newHtml = newHtml.replace('%value%' , obj.value);


            // inser the html to the DOM
            document.querySelector(element).insertAdjacentHTML('beforeend', newHtml);

        },

        clearFeilds: function(){

            var fields, fieldsArr;

            fields = document.querySelectorAll(DOMstrings.inputDescription+','+DOMstrings.inputValue);

            fieldsArr = Array.prototype.slice.call(fields);

            fieldsArr.forEach(function(current,index,array){
                    current.value ="";
            });

            fieldsArr[0].focus();
          
           
        },

    

        getDOMstrings : function(){
            return DOMstrings;
        }
    };

    

})();



// ********** global App controller

var controller = (function(budgtCtrl,UICtrl){

    var setUpEventListeners = function() {

        var DOM = UICtrl.getDOMstrings();
        document.querySelector(DOM.inputBtn).addEventListener('click',ctrlAddItem);
        document.addEventListener('keypress',function(event){
         if(event.keyCode === 13 || event.which === 13 ){
             ctrlAddItem();
         }
        });
    };


    var updateBudget = function(){
        
        // 1- calculate the budget
        budgtCtrl.calculateBudget();

        // 2- return the budget
        var budget = budgtCtrl.getBudget();

        // 3- update the budget on UI
        console.log(budget);

    }
 
    var ctrlAddItem = function(){

        var input,newItem;

        // 1-get the field input data
        input = UICtrl.getInput();

        if (input.description !== "" && input.value !== NaN && input.value >0){

        // 2- add the item to budget controller
        newItem = budgtCtrl.addItem(input.type,input.description,input.value);

        // 3- add to th UI
        UICtrl.addListItem(newItem,input.type);

        //4- clear the fiels
        UICtrl.clearFeilds();

        //5- calcu;ate and update budget
        updateBudget();

        }   

    };

    return {
        init: function(){
           console.log('application has started.');
           setUpEventListeners();
        }
    };
})(budgetController,UIcontroller);

controller.init();










