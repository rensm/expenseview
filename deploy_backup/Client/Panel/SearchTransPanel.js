function SearchTransPanel(panelName, transType, transCatData, recentTransData)
{
    //data returned from the search parameters
    var searchTransData;
    
    //Modules in this panel
    var searchTransInputModule;
    var searchTransResultTable;
    
    //Displays all the modules in the panel
    this.drawPanel = function()
    {
        searchTransInputModule = new SearchTransModule(panelName, transType);

        document.getElementById("div_" + panelName).innerHTML = toHTML();

        //initialize calendar for Start and End Date Textboxes
        var startSearchDateTextBox = "#" + panelName +  "searchStartDate";
        $(startSearchDateTextBox).datepicker();

        var endSearchDateTextBox = "#" + panelName + "searchEndDate";
        $(endSearchDateTextBox).datepicker();
    }


    //Redraws the RecentTrans module in the panel
    this.drawRecentTransModule = function(startPage)
    {
        document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);
    }
    
    

    function toHTML()
    {
        var sb = new StringBuffer();
        sb.append("<table cellpadding='0' cellspacing='0'><tr><td>");
        
        if(transType == "Expense")
        {
            sb.append("<span class='panelHeader'>Search / Export Expenses</span>");
        }
        else
        {
            sb.append("<span class='panelHeader'>Search / Export Income</span>");        
        }
        
        sb.append("<i><font color='gray'>(Specify parameters to narrow what records to retrieve)</font></i>");

        sb.append(searchTransInputModule.toHTML(transCatData.getCategories()));
                
        sb.append("<br />");
                
        //Display Search Header
        sb.append("<div id='" + panelName + "_SearchResultsHeader'></div>");        
        
        //Display Search Results    
        sb.append("<div id='" + panelName + "_SearchResults'></div>");
        sb.append("</td></tr></table>");

        return sb.toString();
    }

    this.searchTrans = function() {
        var ts = searchTransInputModule.getTransSearch();
        jsonService.SearchTrans(ts.StartDate, ts.EndDate, ts.CategoryType, ts.CategoryId, ts.AmountOperator, ts.Amount,
            function(response) {
                response.context = new Object();
                response.context.StartDate = ts.StartDate;
                response.context.EndDate = ts.EndDate;
                response.context.CategoryType = ts.CategoryType;
                response.context.CategoryId = ts.CategoryId;
                response.context.AmountOperator = ts.AmountOperator;
                response.context.Amount = ts.Amount;
                searchTrans_CallBack(response);
            });

        //Display Loading Element        
        document.getElementById(panelName + "_SearchResults").innerHTML = "Searching...<img src='images/loading.gif' />";
    }

    function searchTrans_CallBack(response)
    {
        var resValue = response.result;

        if (resValue)
        {
            if (resValue == 0)
            {
                //Display No Data Found
                document.getElementById(panelName + "_SearchResults").innerHTML = "<h2>No Data found for Date Range</h2>"; ;            
            }
            else if (resValue == -1)
            {
                //Display No Data Found
                document.getElementById(panelName + "_SearchResults").innerHTML = "<h2>Error ocurred while searching for transactions.</h2>"; ;            
            }
            else
            {
                var searchResponseArray = JSON.parse(resValue);
                searchTransData = new TransData(searchResponseArray);

                //Display overall results
                var sb = new StringBuffer();
                sb.append("<h2>");
                sb.append(searchTransData.getLength());
                sb.append(" transactions were found, ")
                sb.append("totalling ");
                sb.append(getRoundedAmount(searchTransData.getTotalAmount()));
                sb.append("</h2>");

                //Display Search Header
                if (transType == "Expense")
                {
                    sb.append("&nbsp;&nbsp;<table cellpadding='1' cellspacing='0'><tr><td valign='bottom'><span class='panelHeader'>Search Results</span>&nbsp;&nbsp;</td><td valign='bottom'><img src='images/page_excel.png' style='border-style: none'/></td><td><a href='generateReport.aspx?catType=Expense&startDate=" + response.context.StartDate + "&endDate=" + response.context.EndDate + "&catId=" + response.context.CategoryId + "&amountOper=" + response.context.AmountOperator + "&amount=" + response.context.Amount + "'>Export Expense Records</a></td></tr></table>");
                }
                else
                {
                    sb.append("&nbsp;&nbsp;<table cellpadding='1' cellspacing='0'><tr><td valign='bottom'><span class='panelHeader'>Search Results</span>&nbsp;&nbsp;</td><td valign='bottom'><img src='images/page_excel.png' style='border-style: none'/></td><td><a href='generateReport.aspx?catType=Income&startDate=" + response.context.StartDate + "&endDate=" + response.context.EndDate + "&catId=" + response.context.CategoryId + "&amountOper=" + response.context.AmountOperator + "&amount=" + response.context.Amount + "'>Export Income Records</a></td></tr></table>");
                }

                document.getElementById(panelName + "_SearchResultsHeader").innerHTML = sb.toString();

                sb = new StringBuffer();

                searchTransResultTable = new TransTableModule(panelName, searchTransData, transCatData, 25, true);
                sb.append(searchTransResultTable.toHTML(1));

                //Display Search Results
                document.getElementById(panelName + "_SearchResults").innerHTML = sb.toString();
            }
        }
    }

    this.toggleTransSelect = function(transID, startPage)
    {
        var trans = searchTransData.getTransByTransID(transID);

        if (!trans.Selected)
        {
            trans.Selected = true;
        }
        else
        {
            trans.Selected = false;
        }

        //Redraw the Search Trans Table
        document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);
    }

    this.sortTransTableByColumn = function(columnName, startPage)
    {
        //Sorts the TransData based on field name specified
        searchTransData.sortData(columnName);
        
        //Redraw the Search Trans Table
        document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);
    }

    this.updateTrans = function(transID, startPage)
    {
        //Get Old Transaction to be deleted
        var updatingTrans = searchTransData.getTransByTransID(transID);
        updatingTrans.oldCategoryID = updatingTrans.CategoryID;
        updatingTrans.oldAmount = updatingTrans.Amount;
        updatingTrans.oldDate = updatingTrans.Date;
        updatingTrans.oldDescription = updatingTrans.Description;
        updatingTrans.oldSubCategoryID = updatingTrans.SubCategoryID;
        updatingTrans.oldCategoryName = updatingTrans.CategoryName;

        //Get New Transaction to be saved
        var newTrans = searchTransResultTable.getCurrentRowData(transID);
        updatingTrans.CategoryID = newTrans.CategoryID;
        updatingTrans.Amount = newTrans.Amount;
        updatingTrans.Date = newTrans.Date;
        updatingTrans.Description = newTrans.Description;
        updatingTrans.SubCategoryID = newTrans.SubCategoryID;
        updatingTrans.CategoryName = newTrans.CategoryName;

        if (isValidTransForUpdate(updatingTrans, transType))
        {
            internalUpdateTrans(startPage, updatingTrans);
        }
    };
    
    this.retryUpdateTrans = function(transID, startPage)
    {
        var updatingTrans = searchTransData.getTransByTransID(transID);
        
        internalUpdateTrans(startPage, updatingTrans);
    };

    function internalUpdateTrans(startPage, updatingTrans)
    {
        updatingTrans.Selected = false;
        updatingTrans.State = "Updating";
        
        //Redraw Search TransTable
        document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);                        

        jsonService.UpdateTrans(updatingTrans, function(response)
        { 
            response.context = new Object();
            response.context.updatingTrans = updatingTrans;
            response.context.startPage = startPage;
            
            updateTrans_CallBack(response);
            });                            
    }
    
    function updateTrans_CallBack(response)
    {
        var updatingTrans = response.context.updatingTrans;
        var startPage = response.context.startPage;
        
        var resValue = response.result;
        if(resValue && resValue !== -1)
        {
            //Update State
            updatingTrans.State = "Current";
            
            //Update CategoryData
            transCatData.deleteTrans(updatingTrans.oldCategoryID, updatingTrans.oldAmount, updatingTrans.oldDate, updatingTrans.oldSubCategoryID);
            transCatData.addTrans(updatingTrans.CategoryID, updatingTrans.Amount, updatingTrans.Date, updatingTrans.SubCategoryID);            
            
            //Also update recentTransData if the trans is part of it
            recentTransData.updateTransByTransID(updatingTrans.TransID, updatingTrans);
        }                 
        else
        {
            updatingTrans.State = "UpdateFailed";            
            alert("Failed to update " + transType + " record. Unexpected error ocurred. Please retry");         
        }

        //Redraw Search Results
        document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);                        
    }

    function isValidTransForUpdate(trans, transType)
    {
        if(!trans.Date)
        {
             alert("Cannot update " + transType + ".  Invalid Date Specified.");
             return false;       
        }
         
        if(!isValidAmount(trans.Amount))
        {
             alert("Cannot update " + transType + ".  Invalid Amount Specified.");
             return false;               
        }
        
        return true;
    }

    this.deleteTrans = function(transID, startPage)
    {
        var trans = searchTransData.getTransByTransID(transID);

        if (confirm("Are you sure you want to delete this " + transType + " record?\n--> " + trans.CategoryName + ": " + roundAmount(trans.Amount)))
        {
            //Redraw transTable to show trans being deleted
            trans.State = "Deleting";
            document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);                        

            jsonService.DeleteTrans(trans.TransID, function(response)
            {
                response.context = new Object();
                response.context.trans = trans;
                response.context.startPage = startPage;

                deleteTrans_CallBack(response);
            });
        }
    };
    
    function deleteTrans_CallBack(response)
    {
        var startPage = response.context.startPage;
        var trans = response.context.trans;
        
        var resValue = response.result;
        if(resValue && resValue !== -1)
        {
            //Delete from CategoryData        
            transCatData.deleteTrans(trans.CategoryID, trans.Amount, trans.Date, trans.SubCategoryID);

            //Delete from recent trans array
            searchTransData.deleteTransByTransID(trans.TransID);

            //Also delete from recentTransData if the trans is part of it
            recentTransData.deleteTransByTransID(trans.TransID, trans);

            //Redraw Search Results
            document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);                        
        }                 
        else
        {
            trans.State = "DeleteFailed";
            document.getElementById(panelName + "_SearchResults").innerHTML = searchTransResultTable.toHTML(startPage);                        
            
            alert("Failed to delete " + transType + " record. Unexpected error ocurred. Please retry");         
        }
    }    
}