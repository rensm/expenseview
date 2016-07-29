function showTooltip(anchor, text, width, className) 
{
    var defaultClassName = "infoBox";
    var toolTipDiv = document.getElementById("toolTip");	
    var left = (Left(anchor) + 30) + "px";
    var top = (Top(anchor)) + "px";
    
    toolTipDiv.style.position = "absolute";
	toolTipDiv.style.left = left;
	toolTipDiv.style.top = top;

	//Show toolTipDiv
	if (text)
	{
	    toolTipDiv.innerHTML = text;
	}
	else
	{
	    toolTipDiv.innerHTML = anchor.getAttribute('tipitle');
	}

	toolTipDiv.style.display = "block";

	if (className)
	{
	    defaultClassName = className;
	}

	toolTipDiv.setAttribute("class", defaultClassName);

    if (width)
    {
        toolTipDiv.style.width = width;
    }
    else
    {
        toolTipDiv.style.width = "500px";
    }
}

function hideTooltip() 
{
    var toolTipDiv = document.getElementById("toolTip");
	toolTipDiv.innerHTML = "";
	toolTipDiv.style.display = "none";
}
