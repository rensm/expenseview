
Date.prototype.fallsWithinLastWeek = function ()
{
    var fallsWithinLastWeek = false;

    var start = Date.parse("1 week ago");

    //First day of week is Sunday
    if (ExpViewGlobalData.userWeekStart == 0)
    {
        //Move the start back to last Sunday if the start day is not already a Sunday
        if (!start.is().sun())
        {
            start.last().sun();
        }
    }
    else if (ExpViewGlobalData.userWeekStart == 1)
    {
        //Move the start back to last Monday if the start day is not already a Monday
        if (!start.is().mon())
        {
            start.last().mon();
        }
    }

    //Set the end date to be 7 days from start of the week
    var end = start.clone().add(7).days();

    if ((this >= start) && (this < end))
    {
        fallsWithinLastWeek = true;
    }

    return fallsWithinLastWeek;
}

Date.prototype.fallsWithinThisWeek = function ()
{
    var fallsWithinThisWeek = false;

    //First day of week is Sunday
    if (ExpViewGlobalData.userWeekStart == 0)
    {
        if ((this >= Date.parse("Sunday")) && (this < Date.parse("next Sunday")))
        {
            fallsWithinThisWeek = true;
        }
    }
    else if (ExpViewGlobalData.userWeekStart == 1)
    {
        if ((this >= Date.parse("Monday")) && (this < Date.parse("next Monday")))
        {
            fallsWithinThisWeek = true;
        }
    }

    return fallsWithinThisWeek;
}


Date.prototype.getPriorMonth = function()
{
    if (this.getMonth() === 0)
    {
        return 11;
    }
    else
    {
        return this.getMonth() - 1;
    }
}

Date.prototype.isBetweenDates = function (beginDate, endDate)
{
    if ((this <= endDate && this >= beginDate))
    {
        return true;
    }

    return false;
}

function getDateFromDefaultDateString(dateString)
{
    //Make sure parameter is converted to string value
    dateString = dateString + "";

    //format == YYYY-MM- DD
    var dateArray = dateString.split("-");
    var yearValue = dateArray[0];
    var monthValue = dateArray[1];
    var dateValue = dateArray[2];

    //Month should be from 0-11, Convert from string of 1-12 when creating date object
    var date = new Date(yearValue, monthValue - 1, dateValue);

    return date;
}

//Converts the Formatted Date String value passed in to the default 
//date string format of YYYY-MM-DD
function getDateStringFromFormattedDateString(dateString)
{
    var date = getDateFromFormattedDateString(dateString);

    //format == YYYY-MM-DD
    if (date)
    {
        return "" + date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate();
    }
    else
    {
        return null;
    }
}

function getDateFromFormattedDateString(dateString)
{
    //Make sure parameter is converted to string value
    dateString = dateString + "";

    if (isValidFormattedDate(dateString))
    {
        //variables to store data attributes
        var yearValue;
        var monthValue;
        var dateValue;

        var dateArray;

        if (ExpViewGlobalData.userDateFormat == 1)
        {
            //format == YYYY-MM- DD
            dateArray = dateString.split("-");
            yearValue = dateArray[0];
            monthValue = dateArray[1];
            dateValue = dateArray[2];
        }
        else if (ExpViewGlobalData.userDateFormat == 2)
        {
            //format == MM/DD/YYYY
            dateArray = dateString.split("/");
            yearValue = dateArray[2];
            monthValue = dateArray[0];
            dateValue = dateArray[1];
        }
        else if (ExpViewGlobalData.userDateFormat == 3)
        {
            //format == DD/MM/YYYY
            dateArray = dateString.split("/");
            yearValue = dateArray[2];
            monthValue = dateArray[1];
            dateValue = dateArray[0];
        }

        //Month should be from 0-11, Convert from string of 1-12 when creating date object
        var date = new Date(yearValue, monthValue - 1, dateValue);

        return date;
    }
    else
    {
        return null;
    }
}

//Returns a date string formatted according to the user's preferred format
//The method converts the dateString inputted from the standard format of YYYY-MM-DD
//to the user's preferred format.
function getFormattedDateString(dateString)
{
    //variables to store date attributes
    var date;

    //format = YYYY-MM- DD
    if (dateString)
    {
        dateString = dateString + "";    
        var dateArray = dateString.split("-");        
        date = new Date(dateArray[0], (dateArray[1] - 1), dateArray[2]);
    }
    else
    {
        //No in dateString specified, Default to today's date
        date = new Date();
    }

    //Append 0 if month or dayDate value is only one character
    var month = (date.getMonth() + 1) + "";
    if (month.length === 1)
    {
        month = "0" + month;
    }

    var dayDate = date.getDate() + "";
    if (dayDate.length === 1)
    {
        dayDate = "0" + dayDate;
    }
            
    //userDateFormat is set globally app initiation method
    if (ExpViewGlobalData.userDateFormat == 1)
    {
        //format == YYYY-MM-DD
        return "" + date.getFullYear() + "-" + month + "-" + dayDate;
    }
    else if (ExpViewGlobalData.userDateFormat == 2)
    {
        //format == MM/DD/YYYY
        return "" + month + "/" + dayDate + "/" + date.getFullYear();
    }
    else if (ExpViewGlobalData.userDateFormat == 3)
    {
        //format == DD/MM/YYYY
        return "" + dayDate + "/" + month + "/" + date.getFullYear();    
    }
}

function getPreferredDateFormatFromValue(userDateFormatValue) {
    var preferredDateFormat = "";
    if (userDateFormatValue == 1) {
        preferredDateFormat = "yy-mm-dd";
    }
    else if (userDateFormatValue == 2) {
        preferredDateFormat = "mm/dd/yy";
    }
    else if (userDateFormatValue == 3) {
        preferredDateFormat = "dd/mm/yy";
    }

    return preferredDateFormat;
}


function isValidFormattedDate(dateString)
{
    //Ensure that dateString is treated as a string
    dateString = dateString + "";
    
    //variables to store data attributes
    var yearValue;
    var monthValue;
    var dateValue;
    var dateRegExp;
    var dateArray;

    if (ExpViewGlobalData.userDateFormat == 1)
    {
        //format == YYYY-MM- DD
        dateRegExp = /^\d{4}(\-)\d{1,2}\1\d{1,2}$/;

        dateArray = dateString.split("-");
        yearValue = dateArray[0];
        monthValue = dateArray[1];
        dateValue = dateArray[2];
    }
    else if (ExpViewGlobalData.userDateFormat == 2)
    {
        //format == MM/DD/YYYY
        dateRegExp = /^\d{1,2}(\/)\d{1,2}\1\d{4}$/

        dateArray = dateString.split("/");
        yearValue = dateArray[2];
        monthValue = dateArray[0];
        dateValue = dateArray[1];
    }
    else if (ExpViewGlobalData.userDateFormat == 3)
    {
        //format == DD/MM/YYYY
        dateRegExp = /^\d{1,2}(\/)\d{1,2}\1\d{4}$/

        dateArray = dateString.split("/");
        yearValue = dateArray[2];
        monthValue = dateArray[1];
        dateValue = dateArray[0];
    }
    
    //First check to see if format is correct
    if (!dateRegExp.test(dateString))
    {
        return false;
    }
    else
    {
        //Then check to see if the values specified fall into the right ranges
        var ALTERdDate = new Date(yearValue, monthValue - 1, dateValue);

        if ((ALTERdDate.getMonth() != monthValue-1) || (ALTERdDate.getDate() != dateValue) || (ALTERdDate.getFullYear() != yearValue))
        {
            return false;
        }
        else
        {
            return true;
        }
    }
}
