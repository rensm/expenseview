function TransData(transArray)
{
    //private vars used to determine sort direction for transArray values
    var dateSortDirection = 1;
    var catSortDirection = 1;
    var amountSortDirection = 1;
    var descSortDirection = 1;

    this.getTransArray = function() 
    {
        return transArray;
    }


    this.getLength = function ()
    {
        return transArray.length;
    }

    //Returns the total amount for all transactions 
    this.getTotalAmount = function ()
    {
        var numTransactions = transArray.length;
        var totalAmount = 0;
        for (var i = 0; i < numTransactions; i++)
        {
            totalAmount += (transArray[i].Amount * 1);
        }

        return totalAmount;
    }

    
    //Returns the Transaction associated by the TransID
    this.getTransByTransID = function(transID) 
    {
        var numTrans = transArray.length;
        for (var i = 0; i < numTrans; i++) 
        {
            if (transArray[i].TransID === transID) 
            {
                return transArray[i];
            }
        }
    }
    
    
    //Deletes the transaction with the specified TransactionID
    this.deleteTransByTransID = function(transID)
    {
        var numTrans = transArray.length;
        for(var i=numTrans; i>0; i--)
        {            
            var delIndex = i-1;        
            if(transArray[delIndex].TransID === transID)
            {
                transArray.splice(delIndex, 1);
                break;      
            }
        }                        
    };
    
    //Deletes All Transactions with the specified CategoryID
    this.deleteAllTransInCategory = function(categoryID)
    {
        var numTrans = transArray.length;
        for(var i=numTrans; i>0; i--)
        {    
            var delIndex = i-1;        
            if(transArray[delIndex].CategoryID == categoryID)
            {
                transArray.splice(delIndex, 1);
            }
        }
    };

    //Deletes All Transactions with the specified SubCategoryID
    this.deleteAllTransInSubCategory = function(subCategoryID)
    {
        var numTrans = transArray.length;
        for (var i = numTrans; i > 0; i--)
        {
            var delIndex = i - 1;
            if (transArray[delIndex].SubCategoryID == subCategoryID)
            {
                transArray.splice(delIndex, 1);
            }
        }
    };

    this.addTrans = function(trans) 
    {
        transArray.unshift(trans);
        var numRows = transArray.length;

        //transArray[numRows] = trans;

        return numRows;
    };


    this.updateTransByTransID = function(transID, trans) 
    {
        var numTrans = transArray.length;
        for (var i = 0; i < numTrans; i++) 
        {
            if (transArray[i].TransID === transID) 
            {
                transArray[i] = trans;
                break;
            }
        }
    };

    //Sorts the transArray based on the column name        
    this.sortData = function(fieldName)
    {
        var numTrans = transArray.length;

        for (var i = 0; i < (numTrans - 1); i++)
        {
            for (var j = i + 1; j < numTrans; j++)
            {
                if (fieldName === "Date")
                {
                    if (dateSortDirection === -1)
                    {
                        if ((transArray[j].Date < transArray[i].Date)
                            || ((transArray[j].Date == transArray[i].Date) && (transArray[j].TransID < transArray[i].TransID)))
                        {
                            var dummy1 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy1;
                        }
                    }
                    else
                    {
                        if ((transArray[j].Date > transArray[i].Date)
                            || ((transArray[j].Date == transArray[i].Date) && (transArray[j].TransID > transArray[i].TransID)))
                        {
                            var dummy2 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy2;
                        }
                    }
                }
                else if (fieldName === "Category")
                {
                    if (catSortDirection === -1)
                    {
                        if ((transArray[j].CategoryName < transArray[i].CategoryName)
                            || ((transArray[j].CategoryName == transArray[i].CategoryName) && (transArray[j].TransID < transArray[i].TransID)))
                        {
                            var dummy3 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy3;
                        }
                    }
                    else
                    {
                        if ((transArray[j].CategoryName > transArray[i].CategoryName)
                            || ((transArray[j].CategoryName == transArray[i].CategoryName) && (transArray[j].TransID > transArray[i].TransID)))
                        {
                            var dummy4 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy4;
                        }
                    }
                }
                else if (fieldName === "Amount")
                {
                    if (amountSortDirection === -1)
                    {
                        if (((transArray[j].Amount * 1) < (transArray[i].Amount * 1))
                            || (((transArray[j].Amount * 1) == (transArray[i].Amount * 1)) && (transArray[j].TransID < transArray[i].TransID)))
                        {
                            var dummy5 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy5;
                        }
                    }
                    else
                    {
                        if (((transArray[j].Amount * 1) > (transArray[i].Amount * 1))
                            || (((transArray[j].Amount * 1) == (transArray[i].Amount * 1)) && (transArray[j].TransID > transArray[i].TransID)))
                        {
                            var dummy6 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy6;
                        }
                    }
                }
                else if (fieldName === "Description")
                {
                    if (descSortDirection === -1)
                    {
                        if ((transArray[j].Description < transArray[i].Description)
                            || ((transArray[j].Description == transArray[i].Description) && (transArray[j].TransID < transArray[i].TransID)))
                        {
                            var dummy7 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy7;
                        }
                    }
                    else
                    {
                        if ((transArray[j].Description > transArray[i].Description)
                            || ((transArray[j].Description == transArray[i].Description) && (transArray[j].TransID > transArray[i].TransID)))
                        {
                            var dummy8 = transArray[i];
                            transArray[i] = transArray[j];
                            transArray[j] = dummy8;
                        }
                    }
                }
            }
        }

        if (fieldName === "Date")
        {
            dateSortDirection = dateSortDirection * -1;
        }
        else if (fieldName === "Category")
        {
            catSortDirection = catSortDirection * -1;
        }
        else if (fieldName === "Amount")
        {
            amountSortDirection = amountSortDirection * -1;
        }
        else if (fieldName === "Description")
        {
            descSortDirection = descSortDirection * -1;
        }
    }

}