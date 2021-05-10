function PieGraphModule(displayDiv, categoryType)
{
    this.toHTML = function(dateRange)
    {
        var amountArray = createAmountArray(dateRange);        
        var sb1 = new StringBuffer();

        
        return sb1.toString();
    }
    
    function createAmountArray(dateRange)
    {
    }        

    this.drawEmpty = function()
    {
        document.getElementById(displayDiv).innerHTML = "";    
    };
    
}
