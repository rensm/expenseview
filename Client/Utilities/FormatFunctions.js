//Generates a random color
function getRandomColor()
{
    var array = new Array("f", "e", "d", "c", "b", "a", "9", "8", "7", "6", "5", "4", "3", "2", "1");  // array of possible hex values.
    var hexColor = "";  // this is the hex color that will be returned

    // and each time add a new character to the returned color.
    for (var i = 0; i < 6; i++)
    {
        hexColor += array[Math.floor(Math.random() * array.length)];
    }

    return hexColor;
};


function cleanXML(xmlValue)
{
    xmlValue = xmlValue.replace(/&/g, "*").replace(/>/g, "*").replace(/</g, "*").replace(/'/g, "*");
    return xmlValue;
}

function escapeQuote(stringValue)
{
    if(!stringValue || stringValue === "")
    {
        return stringValue;
    }
    else  
    {
        return stringValue.replace(/'/g, "&#39;");
    }
}

function getRoundedAmount(amount)
{
    if(!amount || amount === "")
    {
        return "0";
    }
    else
    {
        return roundAmount(amount);
    }
}

function roundAmount(amount) 
{ 
    var roundedValue = Math.round(amount*100)/100;      
    return padZeros(roundedValue);
}

function padZeros(amount)
{    
    if(!amount || amount === "")
    {
        return "";
    }
    
    var amountString = amount.toString();
    var decimalIndex = amountString.indexOf('.');
    
    if(decimalIndex === -1)
    {
        if (ExpViewGlobalData.userDisplayDecimals === 2) {
            return (amountString += ".00");
        }
        else if (ExpViewGlobalData.userDisplayDecimals === 3) {
            return (amountString += ".000");
        }
        else {
            return amountString;
        }
    }
    else
    {
        var numDecimalPlaces = (amountString.length - 1) - decimalIndex;

        if (numDecimalPlaces === 2) 
        {
            if (ExpViewGlobalData.userDisplayDecimals === 3) {
                return amountString + "0";
            }
            else {
                return amountString;
            }
        }
        else if (numDecimalPlaces === 1) 
        {
            if (ExpViewGlobalData.userDisplayDecimals === 2) {
                return (amountString += "0");
            }
            else if (ExpViewGlobalData.userDisplayDecimals === 3) {
                return (amountString += "00");
            }
            else 
            {
                return amountString;
            }
        }
        else if(numDecimalPlaces === 0)
        {
            if (ExpViewGlobalData.userDisplayDecimals === 2) {
                return (amountString += "00");
            }
            else if (ExpViewGlobalData.userDisplayDecimals === 3) {
                return (amountString += "000");
            }
            else {
                return amountString;
            }
        }
    }
}