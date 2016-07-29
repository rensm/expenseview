/************************* ContentLoader Page Functions *************************/
function ContentLoader(htmlURL, containerId, jsURLs)
{       
    var httpRequest;

    var numJSFilesToLoad = 0;
    var numJSFilesLoaded = 0;
    var jsFileArray = null;    
        
    //Javascript files to load
    if(jsURLs)
    {
        jsFileArray = jsURLs.split(",");                
        numJSFilesToLoad += jsFileArray.length;        
    }
        
    var pageLoaded = false;    
    var onLoadFunction;

    this.isLoaded = function()
    {
        return pageLoaded;
    }
    
	this.loadPage = function(loadFunction)
	{	
	    onLoadFunction = loadFunction;
	    httpRequest = getXMLHttpRequest();
	    
	    //Load HTML Page
        if(httpRequest)
        {
            httpRequest.onreadystatechange = function()
            {
	            loadHTML_Callback();
            };
            
            httpRequest.open('GET', htmlURL, true);
            httpRequest.send(null);		                    
        }
        else
        {
            return false;
        }        
    }
            
    function loadHTML_Callback()
    {    
	    if (httpRequest.readyState == 4 && (httpRequest.status==200 || window.location.href.indexOf("http")==-1))
	    {
            document.getElementById(containerId).innerHTML = httpRequest.responseText;
            
            if(numJSFilesToLoad > 0)
            {
                loadJSFile(0);
            }
            else
            {                      
                callOnLoadFunction();
            }
	    }
    }
    
    function loadJSFile(fileIndex)
    {
        httpRequest = getXMLHttpRequest();
        
        httpRequest.onreadystatechange = function()
        {
            loadJS_Callback(fileIndex);
        };
                
        httpRequest.open('GET', jsFileArray[fileIndex], true);
        httpRequest.send(null);	                     
    }
    
    function loadJS_Callback(fileIndex)
    {
        
	    if(httpRequest.readyState == 4 && (httpRequest.status==200 || window.location.href.indexOf("http")==-1))
	    {
	        var code = httpRequest.responseText;
	        
            if(window.execScript)
            { 
                //IF IE
                window.execScript(code, 'javascript');
            }
            else if (navigator.userAgent.indexOf('Safari')!=-1) 
            {
                //IF Safari
                window.setTimeout(code,0);
            }
            else
            {
                window.eval(code);
            }
            
            numJSFilesLoaded += 1; 
            
            if(numJSFilesToLoad > numJSFilesLoaded)
            {
                loadJSFile(fileIndex+1);            
            }
            else
            {
                callOnLoadFunction();            
            }                        
        }
    }
    
    function callOnLoadFunction() {
        pageLoaded = true;
        setTimeout(onLoadFunction,100);       
    }    
    
    function getXMLHttpRequest()
    {
	    if (window.XMLHttpRequest) // if Mozilla, Safari etc
	    {
		    return new XMLHttpRequest();
	    }
	    else if (window.ActiveXObject)  // if IE
	    {
		    try 
		    {
			    return new ActiveXObject("Msxml2.XMLHTTP");
		    } 
		    catch (e)
		    {
			    try
			    {
				    return new ActiveXObject("Microsoft.XMLHTTP");
			    }
			    catch (e)
			    {
			    }
		    }
	    }
        
        return false;
    }    
}



