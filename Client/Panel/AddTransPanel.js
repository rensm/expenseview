function AddTransPanel(panelName, transType, recentTransData, transCategoryData)
{
    //Modules that are dsiplayed in this panel
    var addTransModule;
    var recentTransTable;
    var transSummaryTable;
    
    //Displays all the modules in the panel
    this.drawPanel = function ()
    {
        //Create AddExpensePanel Modules
        addTransModule = new AddTransModule(panelName, transType, transCategoryData.getCategories());
        recentTransTable = new TransTableModule(panelName, recentTransData, transCategoryData, 5, true);
        transSummaryTable = new TransSummaryTableModule(panelName, transCategoryData, transType);

        document.getElementById("div_" + panelName).innerHTML = toHTML();

        //initialize calendar for AddTrans Date Textbox
        var transDateTextBox = "#" + panelName + "_addTransDate";
        $(transDateTextBox).datepicker();
    }
     
    //Returns the HTML string to dispaly this panel  
    function toHTML()
    {
        var sb = new StringBuffer();
        sb.append("<table cellpadding='0' cellspacing='0'><tr>");
        sb.append("<td valign='top' colspan='2' align='left'>");

        if (transType == "Expense")
        {
            sb.append("<span class='panelHeader'>Add Expenses</span><br />");
        }
        else
        {
            sb.append("<span class='panelHeader'>Add Income</span><br />");
        }

        //Draw Add Trans Module
        sb.append("<div id='" + panelName + "_AddTransModule'>");
        sb.append(addTransModule.toHTML());
        sb.append("</div>");

        sb.append("<br />&nbsp;&nbsp;<br />");

        if (transType == "Expense")
        {
            sb.append("<span class='panelHeader'>Recently Added Expenses</span>");
            sb.append("<i><font color='gray'>&nbsp;(Displays the last 25 added expenses.  Search Expenses to view more expenses.)</font></i>");
        }
        else
        {
            sb.append("<span class='panelHeader'>Recently Added Income</span>");
            sb.append("<i><font color='gray'>&nbsp;(Displays the last 25 added income records.  Search Income to view more records.)</font></i>");
        }

        //Get Recent Trans Module HTML
        sb.append("<div id='" + panelName + "_RecentTransTableModule'>");
        sb.append(recentTransTable.toHTML(1));
        sb.append("</div>");
        
        sb.append("<br />&nbsp;&nbsp;<br /></td></tr><tr>");
        sb.append("<td valign='top' colspan='2' align='left'>");

        if (transType == "Expense")
        {
            sb.append("<span class='panelHeader'>Expense Summary</span>");
            sb.append("<i><font color='gray'>&nbsp;(Displays the total amount spent for each category. Any amounts over budget are highlighed in red.)</font></i>");
        }
        else
        {
            sb.append("<span class='panelHeader'>Income Summary</span>");
            sb.append("<i><font color='gray'>&nbsp;(Displays the total amount gained for each category. Any amounts more than expected are highlighed in green.)</font></i>");
        }

        //Append TransSummaryTable HTML
        sb.append("<div id='" + panelName + "_TransSummaryTableModule'>");        
        sb.append(transSummaryTable.toHTML());
        sb.append("</div>");

        sb.append("</td></tr></table>");

        return sb.toString();
    }

    //Redraws the AddTrans module in the panel
    function redrawAddTransModule()
    {
        document.getElementById(panelName + "_AddTransModule").innerHTML = addTransModule.toHTML();
    }

    //Redraws the RecentTrans module in the panel
    function redrawRecentTransTable(startPage)
    {
        var transTableString = recentTransTable.toHTML(startPage);
        document.getElementById(panelName + "_RecentTransTableModule").innerHTML = transTableString;
    }

    //Redraws the SummaryTrans module in the panel
    function redrawSummaryTransTable()
    {
        document.getElementById(panelName + "_TransSummaryTableModule").innerHTML = transSummaryTable.toHTML();
    }

    this.drawRecentTransModule = function(startPage)
    {
        redrawRecentTransTable(startPage);
    }

    this.addTrans = function()
    {
        var trans = addTransModule.getTrans();

        if (isValidTransForAdd(trans, transType))
        {
            //Add New Expense to recent expenses table and redraw
            trans.TransID = createGuid();
            trans.State = "Adding";
            recentTransData.addTrans(trans);

            var startPage = 1;
            redrawRecentTransTable(startPage);

            //Clear out Fields
            addTransModule.clearFields();

            //Create tempTrans object to pass to backend
            //Can't pass trans object directly because it contains
            //a generated guid for TransID 
            var tempTrans = new Object();
            tempTrans.CategoryID = trans.CategoryID;
            tempTrans.SubCategoryID = trans.SubCategoryID;
            tempTrans.Amount = trans.Amount;
            tempTrans.DisplayAmout = trans.DisplayAmount;
            tempTrans.Description = trans.Description;
            tempTrans.Date = trans.Date;

            //Call service to insert record
            jsonService.InsertTrans(tempTrans, function(response)
            {
                //set context variables
                response.context = new Object();
                response.context.startPage = startPage;
                response.context.addedTrans = trans;
                
                addTrans_CallBack(response);
            })
        }
    };

    this.retryAddTrans = function(transID, startPage)
    {
        var trans = recentTransData.getTransByTransID(transID);
        trans.State = "Adding";
        redrawRecentTransTable(startPage);

        //Create tempTrans object to pass to backend
        //Can't pass trans object directly because it contains
        //a generated guid for TransID 
        var tempTrans = new Object();
        tempTrans.CategoryID = trans.CategoryID;
        tempTrans.SubCategoryID = trans.SubCategoryID;
        tempTrans.Amount = trans.Amount;
        tempTrans.DisplayAmout = trans.DisplayAmount;
        tempTrans.Description = trans.Description;
        tempTrans.Date = trans.Date;

        jsonService.InsertTrans(tempTrans, function(response)
        {
            //set context variables
            response.context = new Object();            
            response.context.startPage = startPage;
            response.context.addedTrans = trans;

            addTrans_CallBack(response);
        })
    };

    function addTrans_CallBack(response)
    {
        var trans = response.context.addedTrans;

        var startPage = response.context.startPage;

        var resValue = response.result;

        if (resValue && resValue !== -1)
        {
            trans.TransID = resValue;
            trans.State = "Current";

            //Add new expense data to categories
            transCategoryData.addTrans(trans.CategoryID, trans.Amount, trans.Date, trans.SubCategoryID);
            redrawSummaryTransTable();
        }
        else
        {
            trans.State = "AddFailed";
            alert("Failed to add " + transType + " record. Unexpected error ocurred. Please retry");
        }

        redrawRecentTransTable(startPage);
    }

    function isValidTransForAdd(trans, transType)
    {
        if (!trans.Date)
        {
            alert("Cannot Add " + transType + ".  Invalid Date Specified.");
            return false;
        }

        if (!isValidAmount(trans.Amount))
        {
            alert("Cannot Add " + transType + ".  Invalid Amount Specified.");
            return false;
        }

        return true;
    }

    this.toggleTransSelect = function (transID, startPage)
    {
        var trans = recentTransData.getTransByTransID(transID);

        if (!trans.Selected)
        {
            trans.Selected = true;
        }
        else
        {
            trans.Selected = false;
        }

        redrawRecentTransTable(startPage);


        if (trans.Selected)
        {
            //initialize calendar for RecentTrans Date Textbox
            var transDateTextBox = "#" + panelName + trans.TransID + "EditRowDate";
            $(transDateTextBox).datepicker();
        }
    }

    this.sortTransTableByColumn = function(columnName, startPage)
    {
        //Sorts the TransData based on field name specified
        recentTransData.sortData(columnName);

        //Redraw the Recent Trans Table
        redrawRecentTransTable(startPage);
    }

    this.updateTrans = function(transID, startPage)
    {
        //Get Old Transaction to be deleted
        var updatingTrans = recentTransData.getTransByTransID(transID);
        updatingTrans.oldCategoryID = updatingTrans.CategoryID;
        updatingTrans.oldAmount = updatingTrans.Amount;
        updatingTrans.oldDate = updatingTrans.Date;
        updatingTrans.oldDescription = updatingTrans.Description;
        updatingTrans.oldSubCategoryID = updatingTrans.SubCategoryID;
        updatingTrans.oldCategoryName = updatingTrans.CategoryName;

        //Get New Transaction to be saved
        var newTrans = recentTransTable.getCurrentRowData(transID);
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
        var updatingTrans = recentTransData.getTransByTransID(transID);

        internalUpdateTrans(startPage, updatingTrans);
    };

    function internalUpdateTrans(startPage, updatingTrans)
    {
        updatingTrans.Selected = false;
        updatingTrans.State = "Updating";

        redrawRecentTransTable(startPage);
        
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
        if (resValue && resValue !== -1)
        {
            //Update State
            updatingTrans.State = "Current";

            //Update CategoryData
            transCategoryData.deleteTrans(updatingTrans.oldCategoryID, updatingTrans.oldAmount, updatingTrans.oldDate, updatingTrans.oldSubCategoryID);
            transCategoryData.addTrans(updatingTrans.CategoryID, updatingTrans.Amount, updatingTrans.Date, updatingTrans.SubCategoryID);

            //Redraw SummaryTable
            redrawSummaryTransTable();
        }
        else
        {
            updatingTrans.State = "UpdateFailed";
            alert("Failed to update " + transType + " record. Unexpected error ocurred. Please retry");
        }

        //Redraw TransTableModule
        redrawRecentTransTable(startPage);
    }

    function isValidTransForUpdate(trans, transType)
    {
        if (!trans.Date)
        {
            alert("Cannot update " + transType + ".  Invalid Date Specified.");
            return false;
        }

        if (!isValidAmount(trans.Amount))
        {
            alert("Cannot update " + transType + ".  Invalid Amount Specified.");
            return false;
        }

        return true;
    }

    this.deleteTrans = function(transID, startPage)
    {
        var trans = recentTransData.getTransByTransID(transID);

        if (confirm("Are you sure you want to delete this " + transType + " record?\n--> " + trans.CategoryName + ": " + roundAmount(trans.Amount)))
        {
            //Redraw transTable to show trans being deleted
            trans.State = "Deleting";
            redrawRecentTransTable(startPage);

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
        if (resValue && resValue !== -1)
        {
            //Delete from CategoryData        
            transCategoryData.deleteTrans(trans.CategoryID, trans.Amount, trans.Date, trans.SubCategoryID);

            //Delete from recent trans array
            recentTransData.deleteTransByTransID(trans.TransID);

            //Remove Transaction and redraw Recent Table
            redrawRecentTransTable(startPage);
            
            //Redraw SummaryTable
            redrawSummaryTransTable();
        }
        else
        {
            trans.State = "DeleteFailed";
            redrawRecentTransTable(startPage);

            alert("Failed to delete " + transType + " record. Unexpected error ocurred. Please retry");
        }
    };

    this.toggleSubCategories = function(tbodyid, ClickIcon, categoryID)
    {
        transSummaryTable.toggleSubCategories(tbodyid, ClickIcon, categoryID);
    }
     

}