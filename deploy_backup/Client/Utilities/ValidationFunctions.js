

function isValidAmount(amountValue)
{
    var amountRegExp = /^\d{1,}\.{0,1}\d{0,2}$/;    
    
    if(!amountRegExp.test(amountValue))
    {
        return false;
    }
    return true;    
}