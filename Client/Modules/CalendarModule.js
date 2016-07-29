/************************************************************************************/
/* Adapted From Swazz Javascript Calendar ---
By Oliver Bryant
*************************************************************************************/
function getObj(objID)
{
    if (document.getElementById) {return document.getElementById(objID);}
    else if (document.all) {return document.all[objID];}
    else if (document.layers) {return document.layers[objID];}
}

function checkClick(e) {
	e?evt=e:evt=event;
	CSE=evt.target?evt.target:evt.srcElement;
	if (getObj('fc'))
		if (!isChild(CSE,getObj('fc')))
			getObj('fc').style.display='none';
}

function isChild(s,d) {
	while(s) {
		if (s==d) 
			return true;
		s=s.parentNode;
	}
	return false;
}

function Left(obj)
{
	var curleft = 0;

	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curleft += obj.offsetLeft
			obj = obj.offsetParent;
		}
	}
	else if (obj.x)
		curleft += obj.x;
	return curleft;
}

function Top(obj)
{
	var curtop = 0;

	if (obj.offsetParent)
	{
		while (obj.offsetParent)
		{
			curtop += obj.offsetTop
			obj = obj.offsetParent;
		}
	}
	else if (obj.y)
		curtop += obj.y;
		
	return curtop;
}
	
document.write('<table id="fc" style="position:absolute;border-collapse:collapse;background:#FFFFFF;border:1px solid #ABABAB;display:none;z-index:20;" cellpadding=2>');
document.write('<tr><td style="cursor:pointer" onclick="csubm()"><img src="images/arrowleftmonth.gif"></td><td colspan=5 id="mns" align="center" style="font:bold 13px Arial"></td><td align="right" style="cursor:pointer" onclick="caddm()"><img src="images/arrowrightmonth.gif"></td></tr>');
document.write('<tr><td align=center style="background:#ABABAB;font:12px Arial">S</td><td align=center style="background:#ABABAB;font:12px Arial">M</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">W</td><td align=center style="background:#ABABAB;font:12px Arial">T</td><td align=center style="background:#ABABAB;font:12px Arial">F</td><td align=center style="background:#ABABAB;font:12px Arial">S</td></tr>');
for(var kk=1;kk<=6;kk++) {
	document.write('<tr>');
	for(var tt=1;tt<=7;tt++) {
		num=7 * (kk-1) - (-tt);
		document.write('<td id="v' + num + '" style="width:18px;height:18px">&nbsp;</td>');
	}
	document.write('</tr>');
}
document.write('</table>');

document.all?document.attachEvent('onclick',checkClick):document.addEventListener('click',checkClick,false);


// Calendar script
var now = new Date;
var sccm=now.getMonth();
var sccy=now.getFullYear();
var ccm=now.getMonth();
var ccy = now.getFullYear();
var ccd = now.getDate();

var updobj;
function lcs(ielem) {
	updobj=ielem;
	getObj('fc').style.left=''+Left(ielem)+'px';
	getObj('fc').style.top=''+(Top(ielem)+ielem.offsetHeight)+'px';
	getObj('fc').style.display='';
	
	//Set CurrentDate based on value specified in input element
	curdt = ielem.value;
	if (curdt && isValidFormattedDate(curdt))
	{
	    var currentDate = getDateFromFormattedDateString(curdt);
	    if (currentDate)
	    {
            ccm = currentDate.getMonth();
            ccy = currentDate.getFullYear();
            ccd = currentDate.getDate();
	    }
	}
	
	prepcalendar(ccm,ccd,ccy);	
}

function evtTgt(e)
{
	var el;
	if(e.target)el=e.target;
	else if(e.srcElement)el=e.srcElement;
	if(el.nodeType==3)el=el.parentNode; // defeat Safari bug
	return el;
}
function EvtObj(e){if(!e)e=window.event;return e;}
function cs_over(e) {
	evtTgt(EvtObj(e)).style.background='#FFCC66';
}
function cs_out(e) {
	evtTgt(EvtObj(e)).style.background='#C4D3EA';
}
function cs_click(e) {
    updobj.value = getFormattedDateString(calvalarr[evtTgt(EvtObj(e)).id.substring(1, evtTgt(EvtObj(e)).id.length)]);
	getObj('fc').style.display='none';	
}

var mn=new Array('JAN','FEB','MAR','APR','MAY','JUN','JUL','AUG','SEP','OCT','NOV','DEC');
var mnn=new Array('31','28','31','30','31','30','31','31','30','31','30','31');
var mnl=new Array('31','29','31','30','31','30','31','31','30','31','30','31');
var calvalarr=new Array(42);

function f_cps(obj) {
	obj.style.background='#C4D3EA';
	obj.style.font='10px Arial';
	obj.style.color='#333333';
	obj.style.textAlign='center';
	obj.style.textDecoration='none';
	obj.style.border='1px solid #6487AE';
	obj.style.cursor='pointer';
}

function f_cpps(obj) {
	obj.style.background='#C4D3EA';
	obj.style.font='10px Arial';
	obj.style.color='#ABABAB';
	obj.style.textAlign='center';
	obj.style.textDecoration='line-through';
	obj.style.border='1px solid #6487AE';
	obj.style.cursor='default';
}

function f_hds(obj) {
	obj.style.background='#FFF799';
	obj.style.font='bold 10px Arial';
	obj.style.color='#333333';
	obj.style.textAlign='center';
	obj.style.border='1px solid #6487AE';
	obj.style.cursor='pointer';
}

// day selected
function prepcalendar(cm,hd,cy) {
	now=new Date();
	sd=now.getDate();
	td=new Date();
	td.setDate(1);
	td.setFullYear(cy);
	td.setMonth(cm);
	cd=td.getDay();
	getObj('mns').innerHTML=mn[cm]+ ' ' + cy;
	marr = ((cy % 4) == 0) ? mnl : mnn;

	for (var d = 1; d <= 42; d++) 
	{
		f_cps(getObj('v'+parseInt(d)));
		if ((d >= (cd - (-1))) && (d <= cd - (-marr[cm])))
		{
		    htd = ((hd != '') && (d - cd == hd));
		    if (htd)
		        f_hds(getObj('v' + parseInt(d)));

		    getObj('v' + parseInt(d)).onmouseover = cs_over;
		    getObj('v' + parseInt(d)).onmouseout = cs_out;
		    getObj('v' + parseInt(d)).onclick = cs_click;

		    getObj('v' + parseInt(d)).innerHTML = d - cd;
		    var monthVal = '' + (cm - (-1));
		    if (monthVal.length === 1) { monthVal = "0" + monthVal };
		    var dateVal = '' + (d - cd);
		    if (dateVal.length === 1) { dateVal = "0" + dateVal };

		    //format == YYYY-MM- DD
		    calvalarr[d] = '' + cy + '-' + monthVal + '-' + dateVal;
		}
		else
		{
		    getObj('v' + d).innerHTML = '&nbsp;';
		    getObj('v' + parseInt(d)).onmouseover = null;
		    getObj('v' + parseInt(d)).onmouseout = null;
		    getObj('v' + parseInt(d)).style.cursor = 'default';
		}
	}
}

prepcalendar(ccm,'',ccy);
//getObj('fc'+cc).style.visibility='hidden';

function caddm() {
	marr=((ccy%4)==0)?mnl:mnn;
	
	ccm+=1;
	if (ccm>=12) {
		ccm=0;
		ccy++;
	}
	prepcalendar(ccm,'',ccy);
}

function csubm() {
	marr=((ccy%4)==0)?mnl:mnn;
	
	ccm-=1;
	if (ccm<0) {
		ccm=11;
		ccy--;
	}
	prepcalendar(ccm,'',ccy);
}
