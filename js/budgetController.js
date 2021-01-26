console.log("App has started.");
console.log("Loading controllers.");

var budgetController = (function() {

    var prvExpense = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
        this.percentageOfExpenseOutOfTotalIncome = -1; // -1 = value can't be calculated yet
    };

    prvExpense.prototype.calculatePercentageOfExpenseOutOfTotalIncome = function() {
        if (prvData.totals.inc > 0) {
            var percentageOfExpTotalInc = (this.value / prvData.totals.inc) * 100;

            this.percentageOfExpenseOutOfTotalIncome = rpJSframework.pblCutNdecimalsFromFloatNum(percentageOfExpTotalInc, 2);

        }
        else {
            this.percentageOfExpenseOutOfTotalIncome = -1;
        }
    }

    prvExpense.prototype.getPercentageOfSubmitedExpense = function() {
        return this.percentageOfExpenseOutOfTotalIncome;
    }

    var prvIncome = function(id, description, value) {
        this.id = id;
        this.description = description;
        this.value = value;
    };

    var prvData = {

        allItems: {
            exp: [],

            inc: []
        },

        totals: {
            exp: 0,

            inc: 0
        },

        budget: 0,

        expensesPercentageIncome: -1
    };

    var prvCalculateTotal = function(type) {
        var sum = 0;

        prvData.allItems[type].forEach(function(currElem) {
            sum = sum + currElem.value;
        });

        prvData.totals[type] = sum;
    }

    return {
        pblAddItem: function(type, descripton, value) {

            var newItem;

            var id;

            id = prvData.allItems[type].length > 0 ? prvData.allItems[type][prvData.allItems[type].length - 1].id + 1 : 0;

            if(type === "exp") {
                newItem = new prvExpense(id, descripton, value);
            } else if (type === "inc") {
                newItem = new prvIncome(id, descripton, value);
            }
            prvData.allItems[type].push(newItem);

            return newItem;
        },
        pblDeleteItem: function(transType, transId) {

            console.info("transType %s", transType);
            console.info("transId %d", transId);

            var trasactionTypeIds, indexDeleteElem;
            trasactionTypeIds = prvData.allItems[transType].map(function(currentElem) {
                return currentElem.id;
            });
            console.info("trasactionTypeIds %O", trasactionTypeIds);

            indexDeleteElem = trasactionTypeIds.indexOf(transId);
            console.info("indexDeleteElem %O", indexDeleteElem);

            if (indexDeleteElem !== -1) {

                prvData.allItems[transType].splice(indexDeleteElem, 1);
            }
            console.info(" prvData.allItems[%s] %O", transType, prvData.allItems[transType]);

        },

        pblTestGetDataStr: function() {
            console.info("prvData = %O", prvData);
        },

        pblCalculateBudget: function() {

            prvCalculateTotal("inc");

            prvCalculateTotal("exp");

            prvData.budget = prvData.totals.inc - prvData.totals.exp;

            if (prvData.totals.inc > 0){

                var percentTotalExpOutOfTotalInc =
                    rpJSframework.pblCutNdecimalsFromFloatNum(((prvData.totals.exp * 100) / prvData.totals.inc), 2);

                prvData.expensesPercentageIncome = percentTotalExpOutOfTotalInc;
            }
            else {
                prvData.expensesPercentageIncome =  -1;
            }
        },

        pblSetPercentageOfExpenseOutOfTotalIncomeForEachExp: function() {
            prvData.allItems.exp.forEach(function(currentElem) {
                currentElem.calculatePercentageOfExpenseOutOfTotalIncome();
            })
        },

        pblGetPercentageOfExpenseOutOfTotalIncomeForEachExp: function() {
            var arrayPercentageOfExpenseOutOfTotalIncome;

            arrayPercentageOfExpenseOutOfTotalIncome = prvData.allItems.exp.map(function(currentElement) {
                return currentElement.getPercentageOfSubmitedExpense();
            });

            return arrayPercentageOfExpenseOutOfTotalIncome;
        },

        pblGetBudgetExpIncExpPercentage: function() {
            return {
                budget: prvData.budget,
                totalExpenses : prvData.totals.exp,
                totalIncome : prvData.totals.inc,
                expensesPercentageIncome : prvData.expensesPercentageIncome
            };
        },
    }
})();

console.log("budgetController.js has finished loading.");
