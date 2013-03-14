
var dwui_buildnumber=33035;var configroot="/config/";var htmlroot="/dwui/";function urlex(url)
{return url+"?sid="+Math.random();}
function factoryXmlHttpRequest()
{if(window.XMLHttpRequest){return new XMLHttpRequest();}
else
if(window.ActiveXObject)
{var msxmls=["Msxml2.XMLHTTP.5.0","Msxml2.XMLHTTP.4.0","Msxml2.XMLHTTP.3.0","Msxml2.XMLHTTP","Microsoft.XMLHTTP"];for(var i=0;i<msxmls.length;i++)
{try
{return new ActiveXObject(msxmls[i]);}
catch(e){}}}
throw new Error("Could not instantiate XMLHttpRequest.");}
function geturl(url)
{var _xmlhttp=factoryXmlHttpRequest();if(_xmlhttp)
{_xmlhttp.open("GET",urlex(url),false);try{_xmlhttp.send(null);return _xmlhttp.responseText;}
catch(e){}}
return null;}
function posturl(url,xml)
{var _xmlhttp=factoryXmlHttpRequest();if(_xmlhttp)
{_xmlhttp.open("POST",urlex(url),false);_xmlhttp.setRequestHeader("Content-Type","text/xml");_xmlhttp.setRequestHeader("Content-Length",xml.length);_xmlhttp.setRequestHeader("Connection","close");try{_xmlhttp.send(xml);return _xmlhttp.responseText;}
catch(e){alert("Post error: "+e.description);}}
return null;}
function puturl(url,xml)
{var retval=null;if(xml===null){alert("puturl: null data.");return;}
if(xml.length===0){alert("puturl: zero length data.");return;}
var _xmlhttp=factoryXmlHttpRequest();if(_xmlhttp)
{_xmlhttp.open("PUT",urlex(url),false);_xmlhttp.setRequestHeader("Content-Type","text/xml");_xmlhttp.setRequestHeader("Content-Length",xml.length);_xmlhttp.setRequestHeader("Connection","close");try{_xmlhttp.send(xml);retval=_xmlhttp.status;}
catch(e){alert("Put error: "+e.description);}}
return retval;}
function deleteurl(url)
{var retval=null;var _xmlhttp=factoryXmlHttpRequest();if(_xmlhttp)
{_xmlhttp.open("DELETE",urlex(url),false);_xmlhttp.setRequestHeader("Content-Type","text/xml");_xmlhttp.setRequestHeader("Connection","close");try{_xmlhttp.send(null);retval=_xmlhttp.status;}
catch(e){alert("Delete error: "+e.description);}}
return retval;}
function connected()
{var _xmlhttp=factoryXmlHttpRequest();if(_xmlhttp)
{_xmlhttp.open("GET",urlex("ping.xml?ping"),false);try{_xmlhttp.send(null);return true;}
catch(e){}}
alert("Lost connection with DataWedge.\r\n\r\nDataWedge may not be running or your remote connection may have been broken.");return false;}
var nodeType={Element:1,Attribute:2,Text:3,Comment:8,Document:9}
function removeWhitespace(str){var re=/[>]([ \t\r\n]*)[<]/g;return str.replace(re,"><");}
String.prototype.removeWhitespace=function()
{var re=/[>]([ \t\r\n]*)[<]/g;return this.replace(re,"><");}
function createDocument()
{var versions=["MSXML2.DOMDocument.6.0","MSXML2.DOMDocument.3.0","MSXML2.DOMDocument"];for(var i=0,len=versions.length;i<len;i++){try{var xmlDoc=new ActiveXObject(versions[i]);return xmlDoc;}
catch(ex){}}
return null;}
function newXMLDoc()
{var xmlDoc=createDocument();if(xmlDoc!==null){return xmlDoc;}
try
{xmlDoc=document.implementation.createDocument("","",null);return(xmlDoc);}
catch(e)
{alert(e.message);}
return(null);}
function loadXMLDoc(dname)
{var xmlDoc;try
{xmlDoc=new ActiveXObject("MSXML2.DOMDocument");}
catch(e)
{try
{xmlDoc=document.implementation.createDocument("","",null);}
catch(e)
{alert(e.message);}}
try
{xmlDoc.async=false;xmlDoc.validateOnParse=false;xmlDoc.resolveExternals=false;xmlDoc.preserveWhiteSpace=false;xmlDoc.load(dname);return(xmlDoc);}
catch(e)
{alert(e.message);}
return(null);}
function loadXMLString(txt)
{var xmlDoc;try
{xmlDoc=createDocument();xmlDoc.async=false;xmlDoc.validateOnParse=false;xmlDoc.resolveExternals=false;xmlDoc.preserveWhiteSpace=false;xmlDoc.setProperty("SelectionLanguage","XPath");xmlDoc.loadXML(txt);return(xmlDoc);}
catch(e)
{try
{txt=removeWhitespace(txt);parser=new DOMParser();xmlDoc=parser.parseFromString(txt,"text/xml");return(xmlDoc);}
catch(e)
{alert(e.message);}}
return(null);}
function writeMenu()
{var kt=keytrap;keytrapajax=false;var n=menu[0].length;var xml="<?xml version=\"1.0\" encoding=\"utf-8\"?>\r\n<DWUI>\r\n";for(var i=0;i<n;i++)
{xml+=xml2str(menu[0][i]);}
xml+="\r\n</DWUI>"
var ret=puturl("/config/dwui_menu.xml",xml);if(ret==null)alert("Error writing menu. DataWedge may not be running.");keytrap=kt;}
function reloadMenu()
{var resp=geturl("/config/dwui_menu.xml");if(resp.length==0)return;if(resp.match("<?xml")==null)return;var xml=loadXMLString(resp);menu[0]=xml.documentElement.childNodes;if(dwuiView==viewType.basic)
menu[1]=menu[0][1].childNodes;else{menu[1]=menu[0][0].childNodes;menu[2]=menu[1][0].childNodes;}
valueChanged=false;}
var profileXml;function createProfileString(name,xmlroot)
{profileXml=newXMLDoc();profileXml.async=false;profileXml.preserveWhiteSpace=true;var newel=xmldocblank.createElement("DWProfileConfig");profileXml.appendChild(newel);var newatt=profileXml.createAttribute("name");newatt.nodeValue=name;var px=selectNodes(profileXml,"/DWProfileConfig")[0];px.setAttributeNode(newatt);newel=xmldocblank.createElement("PlugIns");px.appendChild(newel);newel=xmldocblank.createElement("DataPaths");px.appendChild(newel);newel=xmldocblank.createElement("Input");px=selectNodes(profileXml,"/DWProfileConfig/PlugIns")[0];px.appendChild(newel);newel=xmldocblank.createElement("Output");px.appendChild(newel);newel=xmldocblank.createElement("Process");px.appendChild(newel);var ppin=selectNodes(dwconfigdfn,"/DWConfigDfn/PlugIns/Process/PlugIn");var i;px=selectNodes(profileXml,"/DWProfileConfig/PlugIns/Process")[0];for(i=0;i<ppin.length;i++)
{newel=xmldocblank.createElement("PlugIn");newel.setAttribute("id",ppin[i].getAttribute("id"));px.appendChild(newel);}
var plugsrc,plugdest;plugsrc=selectNodes(xmlroot,"//Profile[@name='"+name+"']/Input/PlugIn");plugdest=selectNodes(profileXml,"/DWProfileConfig/PlugIns/Input");walkXmlTree(plugsrc,plugdest,0);plugsrc=selectNodes(xmlroot,"//Profile[@name='"+name+"']/Output/PlugIn");plugdest=selectNodes(profileXml,"/DWProfileConfig/PlugIns/Output");walkXmlTree(plugsrc,plugdest,0);plugsrc=selectNodes(xmlroot,"//Profile[@name='"+name+"']/DataPaths/Path");plugdest=selectNodes(profileXml,"/DWProfileConfig/DataPaths");walkXmlTree(plugsrc,plugdest,0);return xml2str(profileXml);}
function walkXmlTree(srcnode,destnode,index)
{var n,nlen,nchildren;var el,tn,attr,ptype,tval;var nname;nlen=srcnode.length;if(nlen>0)
{for(n=0;n<nlen;n++)
{if(srcnode[n].nodeType!=nodeType.Element)
{if(srcnode[n].nodeType==nodeType.Text)
{len=destnode.length;tn=xmldocblank.createTextNode(srcnode[n].nodeValue);if(index<len){destnode[index].appendChild(tn);}
else
destnode[len-1].appendChild(tn);}
return false;}
nname=srcnode[n].nodeName;if(nname=="Move")continue;if(nname=="Rename")continue;if(nname=="Decoder")
if(srcnode[n].childNodes[0].nodeType==nodeType.Text)
if(srcnode[n].childNodes[0].nodeValue=="0")continue;el=xmldocblank.createElement(nname);attr=selectNodes(srcnode[n],"@id");if(attr.length>0)
{ptype=srcnode[n].parentNode.getAttribute("type");if(ptype=="add")continue;if(ptype=="delete")continue;if(ptype=="hidden")continue;if(ptype=="fixed")
{tval=srcnode[n].parentNode.getAttribute("value");if(attr[0].nodeValue!=tval)continue;}
el.setAttribute("id",attr[0].nodeValue);attr=selectNodes(srcnode[n],"@value");if(attr.length>0)
{tn=xmldocblank.createTextNode(attr[0].nodeValue);el.appendChild(tn);destnode[destnode.length-1].appendChild(el);continue;}
attr=selectNodes(srcnode[n],"@desc");if(attr.length>0)
el.setAttribute("desc",attr[0].nodeValue);}
else
{ptype=srcnode[n].getAttribute("type");switch(ptype)
{case"add":case"action":case"delete":case"hidden":continue;break;case"fixed":el.setAttribute("value",srcnode[n].getAttribute("value"));break;case"select":attr=selectNodes(srcnode[n],"@value");if(attr.length>0)
{if(srcnode[n].nodeName=="Plugin")
{el.setAttribute("id",srcnode[n].getAttribute("value"));destnode[destnode.length-1].appendChild(el);continue;}
tn=xmldocblank.createTextNode(attr[0].nodeValue);el.appendChild(tn);destnode[destnode.length-1].appendChild(el);continue;}
break;}}
destnode[destnode.length-1].appendChild(el);nchildren=srcnode[n].childNodes.length;if(nchildren>0)
{walkXmlTree(srcnode[n].childNodes,destnode[destnode.length-1].childNodes,n);}}}
return true;}
function selectNodes(xmlDoc,xpath)
{try
{return xmlDoc.selectNodes(xpath);}
catch(e)
{try
{var oEvaluator=new XPathEvaluator();var oResult=oEvaluator.evaluate(xpath,xmlDoc,null,XPathResult.ORDERED_NODE_ITERATOR_TYPE,null);var aNodes=new Array();if(oResult!=null){var oElement=oResult.iterateNext();while(oElement){aNodes.push(oElement);oElement=oResult.iterateNext();}}
return aNodes;}
catch(e)
{return null;}}
return null;}
function xml2str(xmlNode){var str;try{var izer=new XMLSerializer();str=izer.serializeToString(xmlNode);if(!str.match("<?xml"))
str="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+str;return str;}
catch(e){try{str=xmlNode.xml;if(!str.match("<?xml"))
str="<?xml version=\"1.0\" encoding=\"UTF-8\"?>"+str;return str;}
catch(e){alert('Xmlserializer not supported');}}
return false;}
function writeDWConfig()
{var kt=keytrap;keytrap=false;rebuildActiveProfileList();var profile=new Array();profile=menu[0][0].getElementsByTagName("Profile");var _dwprfl=new Array();dwprfl=dwconfig.getElementsByTagName("Profile");var ap=menu[0][0].getElementsByTagName("ActiveProfile")[0];var i,j,k;var apps,app,papp,val,tn,name;var dwpname,dwpfname,pname,pfname;var apset=false;for(i=0;i<dwprfl.length;i++)
{dwpname=dwprfl[i].getAttribute("name");dwpfname=dwprfl[i].getAttribute("filename");for(j=0;j<profile.length;j++)
{pname=profile[j].getAttribute("name");pfname=profile[j].getAttribute("filename");if(dwpfname==pfname)
{dwprfl[i].setAttribute("name",pname);dwprfl[i].setAttribute("enabled",profile[j].childNodes[0].childNodes[0].nodeValue);if(ap.getAttribute("value")==dwpfname)
{dwprfl[i].setAttribute("active",1);apset=true;}
else
dwprfl[i].setAttribute("active",0);if(dwpfname=="Default")continue;if(dwpfname=="Profile0")continue;apps=dwprfl[i].getElementsByTagName("Applications");if(apps.length>0)apps[0].parentNode.removeChild(apps[0]);apps=xmldocblank.createElement("Applications");papp=profile[j].getElementsByTagName("Application");for(k=0;k<papp.length;k++)
{if(papp[k].attributes.length==0)continue;val=papp[k].getAttribute("value");name=papp[k].getAttribute("name");if(val==null)continue;app=xmldocblank.createElement("Application");tn=xmldocblank.createTextNode(name);app.appendChild(tn);apps.appendChild(app);}
dwprfl[i].appendChild(apps);break;}}}
if(!apset)
if(profile.length>0)
dwprfl[0].setAttribute("active",1);var aps=menu[0][0].getElementsByTagName("AutoProfileSwitching")[0];var dwaps=dwconfig.getElementsByTagName("AutoProfileSwitching")[0];dwaps.childNodes[0].nodeValue=aps.getAttribute("value");updateDWConfigLogSettings();var ret=puturl("/config/DWConfig.xml",xml2str(dwconfig));keytrap=kt;if(ret==null)alert("Error writing configuration.  DataWedge may not be running.");}
function updateDWConfigLogSettings()
{var newnode,newtext,val;var log=selectNodes(dwconfig.documentElement,"//Log")[0];var logdest=selectNodes(dwconfig.documentElement,"//LogSize")[0];var logsrc=selectNodes(menu[0][0],"//LogSize")[0];val=logsrc.getAttribute("value");if(logdest==null)
{newnode=xmldocblank.createElement("LogSize");newtext=xmldocblank.createTextNode(val);newnode.appendChild(newtext);log.appendChild(newnode);}
else
logdest.childNodes[0].nodeValue=val;logdest=selectNodes(dwconfig.documentElement,"//LogPath")[0];logsrc=selectNodes(menu[0][0],"//LogPath")[0];val=logsrc.childNodes[0].nodeValue;if(logdest==null)
{newnode=xmldocblank.createElement("LogPath");newtext=xmldocblank.createTextNode(val);newnode.appendChild(newtext);log.appendChild(newnode);}
else
logdest.childNodes[0].nodeValue=val;logdest=selectNodes(dwconfig.documentElement,"//TempPath")[0];logsrc=selectNodes(menu[0][0],"//TempPath")[0];val=logsrc.childNodes[0].nodeValue;if(logdest==null)
{newnode=xmldocblank.createElement("TempPath");newtext=xmldocblank.createTextNode(val);newnode.appendChild(newtext);log.appendChild(newnode);}
else
logdest.childNodes[0].nodeValue=val;logdest=selectNodes(dwconfig.documentElement,"//LogLevel")[0];logsrc=selectNodes(menu[0][0],"//LogLevel")[0];val=logsrc.getAttribute("value");if(logdest==null)
{newnode=xmldocblank.createElement("LogLevel");newtext=xmldocblank.createTextNode(val);newnode.appendChild(newtext);log.appendChild(newnode);}
else
logdest.childNodes[0].nodeValue=val;}
function moveNode(node,dir)
{var numnodes=node.parentNode.childNodes.length;if(numnodes<2)return;var n1=node.parentNode;var n2,n3,ntype;if(dir.toLowerCase()=="up")
{n2=n1.previousSibling;if(n2==null)return;n1.parentNode.insertBefore(n1,n2);}
if(dir.toLowerCase()=="down")
{n2=n1.nextSibling;if(n2==null)return;ntype=n2.getAttribute("type");if(ntype!=null)
if(ntype=="add")return;n2.parentNode.insertBefore(n2,n1);}}
function rebuildActiveProfileList()
{var ap=menu[0][0].getElementsByTagName("ActiveProfile")[0];var newap=xmldocblank.createElement("ActiveProfile");newap.setAttribute("name",ap.getAttribute("name"));newap.setAttribute("type",ap.getAttribute("type"));newap.setAttribute("oid",0);newap.setAttribute("value",ap.getAttribute("value"));var prfl=menu[0][0].getElementsByTagName("Profile");var oidset=false;for(var i=0;i<prfl.length;i++)
{if(prfl[i].getAttribute("type")!=null)continue;var newopt=xmldocblank.createElement("option");var name=prfl[i].getAttribute("name");var filename=prfl[i].getAttribute("filename");newopt.setAttribute("id",i);newopt.setAttribute("name",name);newopt.setAttribute("value",filename);if(ap.getAttribute("value")==filename){newap.setAttribute("oid",i);oidset=true;}
newap.appendChild(newopt);}
if(!oidset)newap.setAttribute("value",prfl[0].getAttribute("filename"));ap.parentNode.replaceChild(newap,ap);}
function enableAllDecoders(idx)
{menu[menulevel][idx].firstChild.nodeValue=1;menu[menulevel][idx].parentNode.getElementsByTagName("DisableAll")[0].firstChild.nodeValue=0;var e=selectNodes(menu[menulevel][idx].parentNode,"Decoder/Enabled");for(var i=0;i<e.length;i++)
{e[i].firstChild.nodeValue=1;}
updateMenu();}
function disableAllDecoders(idx)
{menu[menulevel][idx].firstChild.nodeValue=1;menu[menulevel][idx].parentNode.getElementsByTagName("EnableAll")[0].firstChild.nodeValue=0;var e=selectNodes(menu[menulevel][idx].parentNode,"Decoder/Enabled");for(var i=0;i<e.length;i++)
{e[i].firstChild.nodeValue=0;}
updateMenu();}
var dwuiVersion="2.00";var settings=null;var profile=null;var plugin=null;var device=null;var path=null;var keytrap=false;var redact=false;var MAX_PATH=260;var MAX_PROFILENAME=32;var wt_sep="\n";var uglySendEnterHack=false;function c_stack_obj()
{this.m_stack=[];}
c_stack_obj.prototype.push=function(txt)
{this.m_stack.push(txt);};c_stack_obj.prototype.pop=function()
{return this.m_stack.pop();};c_stack_obj.prototype.getLastValue=function()
{if(this.m_stack.length>0){return this.m_stack[this.m_stack.length-1];}
else{return null;}};c_stack_obj.prototype.get2ndToLastValue=function()
{if(this.m_stack.length>1){return this.m_stack[this.m_stack.length-2];}
else{return null;}};c_stack_obj.prototype.length=function()
{return this.m_stack.length;};classStack=new c_stack_obj();c_base_obj=function()
{this.name=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.menupageStack=new c_stack_obj();this.changed=0;this.menupage=0;this.nodeSelected=null;this.m_guvnor=null;this.m_redirect=null;};c_base_obj.prototype.m_ticked="\u221a";c_base_obj.prototype.m_blank="&nbsp;";c_base_obj.prototype.shortcut="1234567890ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz";c_base_obj.prototype.setCfgBase=function(cfg)
{this.m_cfgdom=cfg;};c_base_obj.prototype.setDfnBase=function(dfn)
{this.m_dfndom=dfn;};c_base_obj.prototype.setXmlBase=function(xml)
{this.m_xmldom=xml;};c_base_obj.prototype.setGuvnor=function(guv)
{this.m_guvnor=guv;};c_base_obj.prototype.setRedirect=function(xpath)
{this.m_redirect=xpath;};c_base_obj.prototype.updateNodeValues=function(xmlNode,cfgNode,dfnNode)
{var did=null,ddesc=null,dtype=null,dro=null,dflt=null,dchld=null,enabled=null,value="";if(dfnNode!=null){did=dfnNode.getAttribute("id");ddesc=dfnNode.getAttribute("desc");dtype=dfnNode.getAttribute("type");dro=dfnNode.getAttribute("readonly");dflt=dfnNode.getAttribute("default");var dval=dfnNode.getAttribute("value");if(dval!=null){xmlNode.setAttribute("value",dval);}
if(dro!=null){xmlNode.setAttribute("readonly",dro);}
dval=dfnNode.getAttribute("min");if(dval!=null){xmlNode.setAttribute("min",dval);}
dval=dfnNode.getAttribute("max");if(dval!=null){xmlNode.setAttribute("max",dval);}
dchld=selectNodes(dfnNode,"Enabled");if(dchld!=null){if(dchld.length>0){enabled=dchld[0].getAttribute("default");}}}
if(ddesc!=null){cfgNode.setAttribute("desc",ddesc);}
else{var xdesc=xmlNode.getAttribute("desc");if(xdesc!=null){cfgNode.setAttribute("desc",xdesc);}}
if(enabled!=null){var xchld=selectNodes(xmlNode,"Enabled");var cchld=selectNodes(cfgNode,"Enabled");if(cchld!=null){if(cchld.length>0){enabled=cchld[0].firstChild.nodeValue;}}
if(xchld!=null){if(xchld.length>0){xchld[0].firstChild.nodeValue=enabled;}}}
var type=xmlNode.getAttribute("type");if(cfgNode!=null){var cname=cfgNode.getAttribute("name");if(cname!=null){xmlNode.setAttribute("name",cname);}
if(cfgNode.childNodes.length==0){if(dflt==null){return;}
if(cfgNode.nodeName=="Device"){return;}
tnode=cfgNode.ownerDocument.createTextNode(dflt);cfgNode.appendChild(tnode);}
if(cfgNode.firstChild.nodeType!=3){return;}
value=cfgNode.firstChild.nodeValue;}
var chld=null;switch(type)
{case"select":var val,id;xmlNode.setAttribute("value",value);chld=xmlNode.firstChild;while(chld!=null)
{val=chld.getAttribute("value");if(val==value){id=chld.getAttribute("id");xmlNode.setAttribute("oid",id);break;}
chld=chld.nextSibling;}
break;case"readonly":if(dflt!=null)value=dflt;chld=xmlNode.firstChild;while(chld!=null){if(chld.nodeType==3){break;}
if(chld.nodeName=="option"){if(chld.getAttribute("value")==value){value=chld.getAttribute("name");}
xmlNode.removeChild(chld);chld=xmlNode.firstChild;}
else{chld=chld.nextSibling;}}
default:if(xmlNode.childNodes.length>0){if(xmlNode.firstChild.nodeType==3){xmlNode.firstChild.nodeValue=value;}}
else{var txt=xmlNode.ownerDocument.createTextNode(value);xmlNode.appendChild(txt);}}};c_base_obj.prototype.removeNode=function(node)
{return false;};c_base_obj.prototype.skipConfigNode=function(node)
{switch(node.nodeName){case"option":case"Edit":case"Rename":case"Delete":case"Move":case"Up":case"Down":case"Mapping":case"Action":return true;default:}
return false;};c_base_obj.prototype.updateNodeListValues=function(xpath,nodeList)
{var xpth=xpath;var i=0;var len=nodeList.length;var xmlNode,dfnNode,cfgNode,nname,node,xid,xdesc,xdevicetype,xp,val,xtype;for(i=0;i<len;i++)
{xmlNode=nodeList[i];if(xmlNode.nodeType==3){continue;}
xtype=xmlNode.getAttribute("type");if(xtype=="add"){continue;}
xdesc=null;if(xmlNode.nodeName!="PlugIn"){xdesc=xmlNode.getAttribute("desc");}
xid=xmlNode.getAttribute("id");xp=xpth.removePid().convertUid()+"/"+xmlNode.nodeName;if(xid!=null){xp+="[@id='"+xid+"']";}
if(xdesc!=null){xp+="[@desc='"+xdesc+"']";}
dfnNode=selectNodes(this.m_dfndom,xp);cfgNode=selectNodes(this.m_cfgdom,xp);if(dfnNode==null){}
else if(dfnNode.length==0){if(this.removeNode(xmlNode)){nodeList=selectNodes(this.m_xmldom,xpath+"/*");len=nodeList.length;;i--;continue;}}
var crnew=false;if(cfgNode==null){crnew=true;}
else if(cfgNode.length==0){crnew=true;}
if(crnew&&(xtype!="readonly")){nname=xmlNode.nodeName;if(this.skipConfigNode(xmlNode)){return;}
cfgNode=selectNodes(this.m_cfgdom,xpth.removePid().convertUid());if(cfgNode==null){alert(">>> c_base_obj.prototype.updateNodeListValues: cfgNode == null <<<");continue;}
if(cfgNode.length==0){xp=xpth.removePid().removeUid();var fs=0,lp=0;while(fs>=0){lp=fs;fs=xp.indexOf("/",fs+1);}
if(lp>0){cfgNode=selectNodes(this.m_cfgdom,xp.substr(0,lp));var ndname=xp.substr(lp+1);node=this.m_cfgdom.ownerDocument.createElement(ndname);cfgNode[0].appendChild(node);cfgNode=selectNodes(this.m_cfgdom,xp);}}
node=cfgNode[0].ownerDocument.createElement(nname);if(xid!=null){node.setAttribute("id",xid);}
xdesc=xmlNode.getAttribute("desc");if(xdesc!=null){node.setAttribute("desc",xdesc);}
xdevicetype=xmlNode.getAttribute("devicetype");if(xdevicetype!=null){node.setAttribute("devicetype",xdevicetype);}
if(xmlNode.getAttribute("type")=="fixed"){val=xmlNode.getAttribute("value");node.setAttribute("value",val);}
cfgNode[0].appendChild(node);xp=xpth.removePid().convertUid()+"/"+xmlNode.nodeName;if(xid!=null){xp+="[@id='"+xid+"']";}
if(xdesc!=null){xp+="[@desc='"+xdesc+"']";}
cfgNode=selectNodes(this.m_cfgdom,xp);}
if(dfnNode==null){this.updateNodeValues(xmlNode,cfgNode[0],null);}
else{this.updateNodeValues(xmlNode,cfgNode[0],dfnNode[0]);}}};c_base_obj.prototype.show=function()
{var xpath=".";if(arguments.length>0){xpath=arguments[0];}
this.m_xpathStack.push(xpath);var nodeList=selectNodes(this.m_xmldom,xpath+"/*");this.updateNodeListValues(xpath,nodeList);var name=this.name;if(name==null){name=nodeList[0].parentNode.getAttribute("name");}
if(name==null){name=nodeList[0].parentNode.nodeName;}
locationbar.push(name);this.updateMenu(nodeList);};c_base_obj.prototype.load=function()
{alert("Function: load()\r\nYou should have overridden this!");};c_base_obj.prototype.refresh=function()
{var xpath,nodeList;xpath=this.m_xpathStack.getLastValue();if(xpath==null){keytrap=true;setTimeout("onSelect(666);",10)
return;}
nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.refresh();this.updateMenu(nodeList);keytrap=true;};c_base_obj.prototype.checkFile=function(valu,id)
{value=valu.trim();if(value.length>0){var ret=value.validFilename();if(!ret){alert(value+" contains invalid characters!");}
else{if(value.length>MAX_PATH){alert("The folder name is too long.\r\nPlease enter a shorter folder name.");}
else{var filetype=this.nodeSelected.getAttribute("filetype");if(filetype!=null){if(value.lastIndexOf(filetype)==-1){alert("Filename must have a "+filetype+" extension.");return false;}}
this.setTextNodeValue(value);this.changed++;this.editDone(id);}}}
else{alert("Zero length input is invalid.\r\nPlease enter a valid folder name.");}
return false;};c_base_obj.prototype.checkString=function(value,id)
{if(value.length>0){var ret=value.validString();if(!ret){alert(value+" contains invalid characters!");}
else{if(value.length>MAX_PATH){alert("The string is too long.\r\nPlease enter a shorter string.");}
else{this.setTextNodeValue(value.dwencode());this.changed++;this.editDone(id);}}}
else{this.setTextNodeValue("");this.changed++;this.editDone(id);}
return false;};c_base_obj.prototype.checkInteger=function(value,id)
{var minval=this.nodeSelected.getAttribute("min");if(minval!=null){minval=parseInt(minval,10);}
var maxval=this.nodeSelected.getAttribute("max");if(maxval!=null){maxval=parseInt(maxval,10);}
var valid=value.validInteger();if(valid)
{value=parseInt(value,10);if(value!=NaN)
{if(value>1E+15){alert("Value is too big.");return false;}
var minok=false;var maxok=false;if(minval==null){minok=true;}
else{if(value>=minval){minok=true;}}
if(maxval==null){maxok=true;}
else{if(value<=maxval){maxok=true;}}
if(minok&&maxok){this.setTextNodeValue(value);return true;}}}
if(!valid){alert("Value must be an integer.");}
else if((maxval==null)&&(minval!=null)){alert("Value must be greater than or equal to "+minval);}
else if((minval==null)&&(maxval!=null)){alert("Value must be less than or equal to "+maxval);}
else if((minval!=null)&&(maxval!=null)){alert("Value must be between "+minval+" and "+maxval);}
else{alert("Value is out of range.");}
return false;};c_base_obj.prototype.checkRename=function(value,id)
{return false;};c_base_obj.prototype.checkUnknown=function(value,id)
{return false;};c_base_obj.prototype.editCheck=function(value,id)
{var ret=false;switch(id)
{case"integer":ret=this.checkInteger(value,id);break;case"string":ret=this.checkString(value,id);break;case"file":ret=this.checkFile(value,id);break;case"rename":ret=this.checkRename(value,id);break;default:ret=this.checkUnknown(value,id);break;}
if(ret){this.changed++;this.editDone();}
return false;};c_base_obj.prototype.editDone=function(id)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();locationbar.refresh();this.refresh();redact=false;};function IEMobileOnSubmitHack()
{return;}
c_base_obj.prototype.editBox=function(name,title,value,obj,id)
{if(name!==null){if(name.length>0){locationbar.refresh(name);}}
var html;html="<div class=\"heading\">"+title+"</div><form id=\"editform\" action=\"\" method=\"GET\" onsubmit=\"return "+obj+".editCheck(editbox.value, '"+id+"');\"><input class=\"txt\" name=\"editbox\" type=\"text\" value=\""+String(value)+"\"><p>Press ENTER to save or tap Cancel below.</p><input class=\"btn\" name=\"sav\" type=\"button\" value=\"Save\" onclick=\""+obj+".editCheck(editbox.value, '"+id+"');\" /><input class=\"btn\" name=\"cancel\" type=\"button\" value=\"Cancel\" onclick=\""+obj+".editDone('"+id+"');\" /></form>";document.getElementById("centerpanel").innerHTML=html;keytrap=false;redact=true;setTimeout("document.getElementById('editform').editbox.select();",50);};c_base_obj.prototype.showReadOnly=function(name,title,value,obj,id)
{if(name!==null){if(name.length>0){locationbar.refresh(name);}}
var html;html="<div class=\"heading\">"+title+"</div><form id=\"editform\" action=\"\" method=\"GET\" onsubmit=\"return "+obj+".editDone();\"><p class=\"\">"+value+"</p><br/><p>Press ENTER or tap Done.</p><input class=\"btn\" name=\"cancel\" id=\"cancel\" type=\"button\" value=\"Done\" onclick=\""+obj+".editDone('"+id+"');\" /></form>";document.getElementById("centerpanel").innerHTML=html;keytrap=false;redact=true;setTimeout("document.getElementById('editform').cancel.focus();",20);};c_base_obj.prototype.handleOption=function(node,idx)
{var xpath=this.m_xpathStack.get2ndToLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().removeUid());var pid=node.parentNode.getAttribute("oid");if((pid>=this.menupage*8)&&(pid<this.menupage*8+9)){document.getElementById("img"+(pid-this.menupage*8)).innerHTML=this.m_blank;}
var val=node.getAttribute("value");var oid=node.getAttribute("id");document.getElementById("img"+(oid-this.menupage*8)).innerHTML=this.m_ticked;node.parentNode.getAttributeNode("value").nodeValue=val;node.parentNode.getAttributeNode("oid").nodeValue=oid;if(cfgnode[0].childNodes.length==0){var tnode=cfgnode[0].ownerDocument.createTextNode(val);cfgnode[0].appendChild(tnode);}
else{cfgnode[0].firstChild.nodeValue=val;}
this.changed++;this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.setCfgNodeValue=function(node,val)
{node.firstChild.nodeValue=val;if(node.nodeName=="Enabled")
{if(node.parentNode.nodeName=="Profile"){dwconfig.enableProfile(this.name,val);return;}}
var xpath=this.m_xpathStack.getLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().convertUid());if(cfgnode==null)return;if(cfgnode.length==0)return;if(cfgnode[0].childNodes.length==0){var tnode=cfgnode[0].ownerDocument.createTextNode(val);cfgnode[0].appendChild(tnode);}
else{cfgnode[0].firstChild.nodeValue=val;}};c_base_obj.prototype.handleMono=function(node,idx)
{var xpath=this.m_xpathStack.getLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().removeUid());var did=cfgnode[0].parentNode.getAttribute("id");var cid,noen,c;var cp=cfgnode[0].parentNode.parentNode;var d=cp.firstChild;while(d!=null){cid=d.getAttribute("id");if(did!=cid){noen=true;if(d.childNodes.length>0){c=d.firstChild;while(c!=null){if(c.nodeName=="Enabled"){c.firstChild.nodeValue="0";noen=false;break;}
c=c.nextSibling;}}
if(noen){var n=this.m_cfgdom.ownerDocument.createElement("Enabled");var t=this.m_cfgdom.ownerDocument.createTextNode("0");n.appendChild(t);d.appendChild(n);}}
d=d.nextSibling;}
var s=node.parentNode.previousSibling;while(s!=null)
{s.firstChild.firstChild.nodeValue="0";s=s.previousSibling;}
s=node.parentNode.nextSibling;while(s!=null)
{s.firstChild.firstChild.nodeValue="0";s=s.nextSibling;}};c_base_obj.prototype.handleBool=function(node,idx)
{var xpath=this.m_xpathStack.getLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().convertUid());var value;if(node.firstChild.nodeValue=="1")
{value=0;document.getElementById("img"+(idx-this.menupage*8)).innerHTML=this.m_blank;this.setCfgNodeValue(node,"0");}
else
{value=1;document.getElementById("img"+(idx-this.menupage*8)).innerHTML=this.m_ticked;this.setCfgNodeValue(node,"1");if(node.parentNode.getAttribute("type")=="mono")
{this.handleMono(node,idx);}}
if(node.nodeName=="Enabled")
{if(node.parentNode.attributes.getNamedItem("enabled"))
{node.parentNode.setAttribute("enabled",value);}
if(node.parentNode.nodeName=="Decoder")
{var dcdrnode;if(value==0){dcdrnode=cfgnode[0].parentNode.parentNode.getElementsByTagName("EnableAll");if(dcdrnode!=null){if(dcdrnode.length>0){dcdrnode[0].firstChild.nodeValue=0;}}}}}
this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.changed++;return true;};c_base_obj.prototype.handleAction=function(node,idx)
{var dir=node.getAttribute("value");this.m_xpathStack.pop();this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.menupage=this.menupageStack.pop();locationbar.pop();var xpth=this.m_xpathStack.getLastValue();var xmlnode=node.parentNode.parentNode;var uid=xmlnode.getAttribute("uid");if(uid!=null){var sqbr=xpth.indexOf("[");if(sqbr>0){xpth=xpth.substr(0,sqbr);}
uid=parseInt(uid,10);xpth+="["+(uid+1)+"]";}
var cfgnode=selectNodes(this.m_cfgdom,xpth.removePid().convertUid());if(cfgnode[0].parentNode.childNodes.length>1){switch(dir.toLowerCase()){case"up":var sib=cfgnode[0].previousSibling;if(sib!=null){cfgnode[0].parentNode.insertBefore(cfgnode[0],sib);this.changed++;}
sib=xmlnode.previousSibling;if(sib!=null){if(sib.nodeType==1){var sibuid=sib.getAttribute("uid");if(sibuid!=null){sib.setAttribute("uid",uid);xmlnode.setAttribute("uid",sibuid);}
xmlnode.parentNode.insertBefore(xmlnode,sib);}}
break;case"down":var sib=cfgnode[0].nextSibling;if(sib!=null){sib.parentNode.insertBefore(sib,cfgnode[0]);this.changed++;}
sib=xmlnode.nextSibling;if(sib!=null){if(sib.nodeType==1){var type=sib.getAttribute("type");if(type!="add"){var sibuid=sib.getAttribute("uid");if(sibuid!=null){sib.setAttribute("uid",uid);xmlnode.setAttribute("uid",sibuid);}
sib.parentNode.insertBefore(sib,xmlnode);}}}
break;}}
this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.refresh();return true;};c_base_obj.prototype.handleAddNew=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.handleFile=function(node,idx)
{var cls=classStack.getLastValue();var name=node.getAttribute("name");if(name==null){name=node.nodeName;}
this.editBox(null,name,this.nodeSelected.firstChild.nodeValue,cls,"file");return true;};c_base_obj.prototype.handleEdit=function(node,idx)
{this.m_xpathStack.pop();this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.handleRestore=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();ret=confirm("This will delete all your profiles and settings and restore DataWedge back to its default configuration.\r\n\r\nOK to proceed?");return true;};c_base_obj.prototype.handleRedirect=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.handleInteger=function(node,idx)
{var name=node.getAttribute("name");if(name==null){name=node.nodeName;}
var value=node.firstChild.nodeValue;var cls=classStack.getLastValue();this.editBox(null,name,value,cls,"integer");return true;};c_base_obj.prototype.handleReadonly=function(node,idx)
{var name=node.getAttribute("name");var type=node.getAttribute("type");if(name==null){name=node.nodeName;}
var value="";if(node.childNodes.length>0){var chld=node.firstChild;if(chld.nodeType==3){value=chld.nodeValue;}
if(type=="bool"){if(value=="1")value="Enabled";else value="Disabled";}
if(type=="select"){var id=node.getAttribute("oid");value=node.childNodes[id].getAttribute("name");}}
var cls=classStack.getLastValue();this.showReadOnly(null,name,value,cls,"readonly");return true;};c_base_obj.prototype.handleString=function(node,idx)
{var name=node.getAttribute("name");if(name==null){name=node.nodeName;}
var value="";if(node.childNodes.length>0){if(node.firstChild.nodeType==3){value=node.firstChild.nodeValue;value=value.dwdecode();}}
var cls=classStack.getLastValue();this.editBox(null,name,value,cls,"string");return true;};c_base_obj.prototype.handleFeedback=function(node,idx)
{feedback=null;feedback=new c_feedback_plugin();var xpath=this.m_xpathStack.getLastValue();var cfgNode=selectNodes(this.m_cfgdom,xpath.removePid().removeUid());feedback.setCfgBase(cfgNode[0]);var dfnNode=selectNodes(this.m_dfndom,xpath.removePid().removeUid());dfnNode=dwconfigdfn.getMyFeedback(dfnNode);feedback.setDfnBase(dfnNode[0]);classStack.push("feedback");feedback.setGuvnor(this);var name=node.getAttribute("name");if(name==null){name=node.nodeName;}
feedback.name=name;displayMessage("Loading feedback, please wait...");setTimeout("feedback.load('ngdwfeedbak');",10);return true;};c_base_obj.prototype.handleFunction=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();alert("base.handleFunction");return true;};c_base_obj.prototype.handleHidden=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.handleRename=function(node,idx)
{var name=node.parentNode.getAttribute("name");if(name==null){name=this.name;}
var cls=classStack.getLastValue();this.editBox(null,"Enter a new name...",name,cls,"rename");return true;};c_base_obj.prototype.handleFixed=function(node,idx)
{var val=node.getAttribute("value");var name=node.getAttribute("name");if(name==null){name=node.nodeName;}
locationbar.push(name);var xpath=this.m_xpathStack.getLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath);cfgnode[0].setAttribute("value",val);keytrap=true;setTimeout("onSelect("+val+");",20);return true;};c_base_obj.prototype.handleDelete=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_base_obj.prototype.handleUnknownType=function(node,idx)
{return false;};c_base_obj.prototype.handleUnknownNodeName=function(node,idx)
{return false;};c_base_obj.prototype.setTextNodeValue=function(value)
{var xpath=this.m_xpathStack.getLastValue();var xmlnode=selectNodes(this.m_xmldom,xpath);var xpth=xpath.removePid().convertUid();var cfgnode=selectNodes(this.m_cfgdom,xpth.removePid().convertUid());if(xmlnode[0].childNodes.length==0){var tn=this.m_xmldom.ownerDocument.createTextNode(value);xmlnode[0].appendChild(tn);}
else{xmlnode[0].firstChild.nodeValue=value;}
if(cfgnode[0].childNodes.length==0){var tn=this.m_cfgdom.ownerDocument.createTextNode(value);cfgnode[0].appendChild(tn);}
else{cfgnode[0].firstChild.nodeValue=value;}};c_base_obj.prototype.updateMenu=function(nodeList)
{var node,val,view;var sctxt,txt,sub;var img=" ";var more=false;var hide;var tick=getTick();menubody.clear();var len=nodeList.length;var anfang=this.menupage*8;var i,ende;if((len-anfang)>9){ende=anfang+8;more=true;}
else{ende=len;}
var scindx=0;for(i=anfang;i<ende;i++)
{node=nodeList[i];if(node.nodeType===nodeType.Text){continue;}
if(node.nodeType===nodeType.Comment){continue;}
sub="...";if(node.hasChildNodes()){if(node.firstChild.nodeType===nodeType.Text){sub=node.firstChild.nodeValue;}}
hide=false;view=null;sctxt=this.shortcut.charAt(scindx)+".";txt=node.nodeName;img=this.m_blank;if(node.attributes.length>0)
{if(node.attributes.getNamedItem("name")){txt=node.getAttribute("name");}
if(txt.length===0){txt=" ";}
if(node.attributes.getNamedItem("type"))
{switch(node.getAttribute("type"))
{case"bool":sub=this.m_blank;if(node.firstChild.nodeValue==="1"){img=this.m_ticked;}
break;case"integer":break;case"file":case"string":break;case"select":var opt=node.childNodes;var oid=node.getAttribute("oid");var olen=opt.length;for(var j=0;j<olen;j++)
{if(opt[j].getAttribute("id")===oid)
{sub=opt[j].getAttribute("name");break;}}
break;case"function":sub=this.m_blank;break;case"fixed":break;case"hidden":continue;}}
if(node.parentNode==null)continue;if(node.parentNode.attributes.getNamedItem("type"))
{switch(node.parentNode.getAttribute("type"))
{case"select":if(node.nodeName==="option")
{if(node.parentNode.getAttribute("value")===node.getAttribute("value")){img=this.m_ticked;}}
break;case"displayonly":sctxt="&nbsp;";break;case"integer":break;case"fixed":if(node.parentNode.getAttribute("value")!==node.getAttribute("id")){hide=true;}
break;case"hidden":continue;}}
else
if(node.attributes.getNamedItem("enabled"))
{switch(node.getAttribute("enabled"))
{case"1":img=this.m_ticked;}}
if(node.hasChildNodes())
{if(node.firstChild.nodeName==="Enabled"){if(node.firstChild.firstChild.nodeValue==="1"){img=this.m_ticked;}}}}
else
if(node.hasChildNodes()){if(node.childNodes[0].nodeType===nodeType.Text)
{txt=node.childNodes[0].nodeValue;sub=this.m_blank;}}
if(node.childNodes.length===0){sub=this.m_blank;}
if((node.nodeName==="Action")&&(node.parentNode.nodeName==="Action")){sub=this.m_blank;}
if((node.nodeName==="Mapping")&&(node.getAttribute("type")===null)){sub=node.childNodes[0].childNodes[0].nodeValue+":"+node.childNodes[1].childNodes[0].nodeValue;}
if(!hide){menubody.add("onSelect("+(scindx)+", "+tick+");",img,sctxt,txt,sub.enclt());}
scindx++;}
if(more){menubody.add("onSelect(8, "+tick+");",this.m_blank,"9.","More","...");}
var pnn="";if(nodeList[0].parentNode!=null){pnn=nodeList[0].parentNode.nodeName;}
if((pnn!=="Advanced")&&(pnn!=="Basic"))
{menubody.add("onSelect(666, "+tick+");",this.m_blank,"0.","Back","");}
else{menubody.add("onSelect(-1, "+tick+");",this.m_blank,"0.","Exit","");}
menubody.refresh();keytrap=true;};c_base_obj.prototype.save=function()
{this.m_guvnor.save();keytrap=true;return true;};c_base_obj.prototype.onExit=function(idx)
{if(this.changed>0)
{displayMessage("Saving changes, please wait...");var cls=classStack.getLastValue();if(idx!=777){setTimeout(cls+".save();",10);}
else{eval(cls+".save();");keytrap=true;}}
else{keytrap=true;}};c_base_obj.prototype.onBack=function(idx)
{if(this.menupage>0)
{this.menupage--;if(idx!=777){this.refresh();}
keytrap=true;return true;}
var xpath,ret;var nodeList;if(this.m_xpathStack.length()>1)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");var skip=nodeList[0].getAttribute("skip");if(skip!=null){locationbar.pop();var cls=classStack.getLastValue();keytrap=true;if(idx!=777){if(cls!=null){setTimeout(cls+".onSelect("+idx+");",20);}}
return true;}
locationbar.pop();if(idx!=777){this.updateMenu(nodeList);}
keytrap=true;return true;}
else{this.onExit(idx);return false;}
keytrap=true;return false;};c_base_obj.prototype.addNodeToXpath=function(xpath,node)
{var attrName,attrVal=null;;var xp=xpath+"/"+node.nodeName;if(node.parentNode!=null){if(node.parentNode.getAttribute("type")=="fixed"){attrName="pid";attrVal=node.parentNode.getAttribute("value");xp+="[@"+attrName+"='"+attrVal+"']";}}
if(attrVal==null){attrName="uid";attrVal=node.getAttribute(attrName);if(attrVal!==null){xp+="[@"+attrName+"='"+attrVal+"']";}}
if(attrVal==null){attrName="id";attrVal=node.getAttribute(attrName);if(attrVal!==null){xp+="[@"+attrName+"='"+attrVal+"']";}}
if(node.nodeName!="PlugIn"){attrName="desc";attrVal=node.getAttribute(attrName);if(attrVal!==null){xp+="[@"+attrName+"='"+attrVal+"']";}}
return xp;};c_base_obj.prototype.onSelect=function(idx)
{if(!keytrap){return true;}
keytrap=false;var xpath;var nodeList;var name,type,ro;if((idx===666)||(idx===-1)||(idx===777)){return this.onBack(idx);}
xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");if(nodeList===null){keytrap=true;return false;}
if(nodeList.length===0){keytrap=true;return false;}
if(idx==8)
{if(nodeList.length>(this.menupage*8+idx+1))
{this.menupage++;this.refresh();return true;}}
idx=this.menupage*8+idx;if(idx>=nodeList.length){keytrap=true;return true;}
this.nodeSelected=nodeList[idx];xpath=this.addNodeToXpath(xpath,this.nodeSelected);this.m_xpathStack.push(xpath);this.menupageStack.push(this.menupage);name=this.nodeSelected.getAttribute("name");type=this.nodeSelected.getAttribute("type");ro=this.nodeSelected.getAttribute("readonly");this.updateNodeListValues(xpath,this.nodeSelected.childNodes);var handled=false;if(ro!=null){if(ro=="1"){handled=this.handleReadonly(this.nodeSelected,idx);type=null;}}
if(type!==null)
{switch(type)
{case"bool":handled=this.handleBool(this.nodeSelected,idx);break;case"add":handled=this.handleAddNew(this.nodeSelected,idx);break;case"delete":handled=this.handleDelete(this.nodeSelected,idx);break;case"rename":handled=this.handleRename(this.nodeSelected,idx);break;case"edit":handled=this.handleEdit(this.nodeSelected,idx);break;case"integer":handled=this.handleInteger(this.nodeSelected,idx);break;case"string":handled=this.handleString(this.nodeSelected,idx);break;case"redirect":handled=this.handleRedirect(this.nodeSelected,idx);break;case"action":handled=this.handleAction(this.nodeSelected,idx);break;case"readonly":handled=this.handleReadonly(this.nodeSelected,idx);break;case"file":handled=this.handleFile(this.nodeSelected,idx);break;case"function":handled=this.handleFunction(this.nodeSelected,idx);break;case"feedback":handled=this.handleFeedback(this.nodeSelected,idx);break;case"fixed":handled=this.handleFixed(this.nodeSelected,idx);if(handled)keytrap=true;break;case"restore":handled=this.handleRestore(this.nodeSelected,idx);break;case"hidden":handled=this.handleHidden(this.nodeSelected,idx);break;default:handled=this.handleUnknownType(this.nodeSelected,idx);}}
if(handled){if(!redact){setTimeout("keytrap = true;",50);}
return true;}
switch(this.nodeSelected.nodeName)
{case"option":handled=this.handleOption(this.nodeSelected,idx);break;case"Delete":handled=this.handleDelete(this.nodeSelected,idx);break;case"Rename":handled=this.handleRename(this.nodeSelected,idx);break;default:handled=this.handleUnknownNodeName(this.nodeSelected,idx);}
if(handled){if(!redact){setTimeout("keytrap = true;",50);}
return true;}
if(this.nodeSelected.parentNode!=null){if(this.nodeSelected.parentNode.nodeName=="About"){this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();setTimeout("keytrap = true;",50);return true;}}
if(this.nodeSelected.childNodes.length>0)
{if(name===null){name=this.nodeSelected.nodeName;}
this.menupage=0;locationbar.push(name);var skip=this.nodeSelected.firstChild.getAttribute("skip");if(skip!=null){var val=0;var cls=classStack.getLastValue();keytrap=true;setTimeout(cls+".onSelect("+val+");",20);return true;}
this.updateMenu(this.nodeSelected.childNodes);keytrap=true;}
else{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();}
setTimeout("keytrap = true;",50);return true;};c_base_plugin=function()
{this.plugdom=null;this.id=null;this.desc=null;this.name=null;this.version=null;};c_base_plugin.prototype=new c_base_obj();c_base_plugin.prototype.constructor=c_base_plugin;c_base_plugin.prototype.parent=c_base_obj.prototype;c_base_plugin.prototype.getPluginName=function()
{var plug=this.m_xmldom.getElementsByTagName("PlugIn");return plug[0].getAttribute("name");};c_base_plugin.prototype.getPluginAttributes=function()
{var plug=this.plugdom.getElementsByTagName("PlugIn");this.id=plug[0].getAttribute("id");if(this.name==null){this.name=plug[0].getAttribute("name");}
this.version=plug[0].getAttribute("version");var dfnnode=selectNodes(this.m_dfndom,".");this.desc=dfnnode[0].getAttribute("desc");var cfgnode=selectNodes(this.m_cfgdom,".");if(cfgnode[0].getAttribute("desc")!=null){cfgnode[0].setAttribute("desc",this.desc);}};c_base_plugin.prototype.updateDeviceList=function()
{var dfndev=selectNodes(this.m_dfndom,"./Device");var dfnlen=dfndev.length;if(dfnlen==0){alert("No devices found!");setTimeout("onSelect(666);",20);return false;}
var xmldev=selectNodes(this.m_xmldom,"./Device");var xmllen=xmldev.length;var i=0,id,name,desc,dev,en,txt,cfgdev,enabled,enode,nodev,noen;while(i<dfnlen)
{id=dfndev[i].getAttribute("id");name=dfndev[i].getAttribute("name");desc=dfndev[i].getAttribute("desc");enabled=dfndev[i].firstChild.getAttribute("default");cfgdev=selectNodes(this.m_cfgdom,"./Device[@id='"+id+"']");nodev=true;noen=true;if(cfgdev!=null){if(cfgdev.length>0){nodev=false;enode=selectNodes(cfgdev[0],"Enabled");if(enode!=null){if(enode.length>0){enabled=enode[0].firstChild.nodeValue;noen=false;}}}}
if(nodev){cfgdev=this.m_cfgdom.ownerDocument.createElement("Device");cfgdev.setAttribute("id",id);cfgdev.setAttribute("desc",desc);this.m_cfgdom.appendChild(cfgdev);cfgdev=selectNodes(this.m_cfgdom,"./Device[@id='"+id+"']");if(cfgdev!=null){if(cfgdev.length>0){nodev=false;}}}
if(!nodev&&noen){enode=this.m_cfgdom.ownerDocument.createElement("Enabled");txt=this.m_cfgdom.ownerDocument.createTextNode(enabled);enode.appendChild(txt);cfgdev[0].appendChild(enode);this.changed++;}
if(i<xmllen){xmldev[i].setAttribute("id",id);xmldev[i].setAttribute("name",name);xmldev[i].setAttribute("desc",desc);xmldev[i].firstChild.firstChild.nodeValue=enabled;}
else{dev=this.plugdom.createElement("Device");dev.setAttribute("id",id);dev.setAttribute("name",name);dev.setAttribute("desc",desc);en=this.plugdom.createElement("Enabled");txt=this.plugdom.createTextNode(enabled);en.appendChild(txt);dev.appendChild(en);xmldev[0].parentNode.appendChild(dev);}
i++;}
return true;};c_base_plugin.prototype.preload=function(id)
{};c_base_plugin.prototype.subload=function(id)
{};c_base_plugin.prototype.load=function(id)
{this.preload();var url=htmlroot+"dwui_"+id+".xml";var xml=geturl(url);if(xml!=null){if(xml.match("<?xml"))
{this.plugdom=loadXMLString(xml);this.m_xmldom=selectNodes(this.plugdom,"/PlugIn")[0];this.getPluginAttributes();this.subload(id);var devs=selectNodes(this.m_xmldom,"./Device");if(devs.length>0){this.updateDeviceList();}
this.show();return;}}
alert("Error loading plug-in template.");this.onSelect(666);};c_base_plugin.prototype.refresh=function()
{var devs=selectNodes(this.m_xmldom,"./Device");if(devs.length>0){this.updateDeviceList();}
var xpath,nodeList;xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.refresh();this.updateMenu(nodeList);keytrap=true;};var DECODER=[];DECODER[48]="UPCE0";DECODER[49]="UPCE1";DECODER[50]="UPCA";DECODER[51]="MSI";DECODER[52]="EAN8";DECODER[53]="EAN13";DECODER[54]="CODABAR";DECODER[55]="CODE39";DECODER[56]="D2OF5";DECODER[57]="I2OF5";DECODER[58]="CODE11";DECODER[59]="CODE93";DECODER[60]="CODE128";DECODER[61]="ID=61";DECODER[62]="ID=62";DECODER[63]="EAN128";DECODER[64]="PDF417";DECODER[65]="ISBT128";DECODER[66]="TRIOPTIC39";DECODER[67]="COUPON";DECODER[68]="BOOKLAND";DECODER[69]="MICROPDF";DECODER[70]="CODE32";DECODER[71]="MACROPDF";DECODER[72]="MAXICODE";DECODER[73]="DATAMATRIX";DECODER[74]="QRCODE";DECODER[75]="MACROMICROPDF";DECODER[76]="RSS14";DECODER[77]="RSSLIM";DECODER[78]="RSSEXP";DECODER[79]="ID=79";DECODER[80]="ID=80";DECODER[81]="ID=81";DECODER[82]="ID=82";DECODER[83]="ID=83";DECODER[84]="WEBCODE";DECODER[85]="CUECODE";DECODER[86]="COMPOSITE_AB";DECODER[87]="COMPOSITE_C";DECODER[88]="TLC39";DECODER[89]="ID=89";DECODER[90]="ID=90";DECODER[91]="ID=91";DECODER[92]="ID=92";DECODER[93]="ID=93";DECODER[94]="ID=94";DECODER[95]="ID=95";DECODER[96]="ID=96";DECODER[97]="USPOSTNET";DECODER[98]="USPLANET";DECODER[99]="UKPOSTAL";DECODER[100]="JAPPOSTAL";DECODER[101]="AUSPOSTAL";DECODER[102]="DUTCHPOSTAL";DECODER[103]="CANPOSTAL";DECODER[104]="ID=104";DECODER[105]="ID=105";DECODER[106]="ID=106";DECODER[107]="ID=107";DECODER[108]="ID=108";DECODER[109]="ID=109";DECODER[110]="ID=110";DECODER[111]="ID=111";DECODER[112]="CHINESE_2OF5";DECODER[113]="ID=113";DECODER[114]="ID=114";DECODER[115]="ID=115";DECODER[116]="AZTEC";DECODER[117]="MICROQR";DECODER[118]="KOREAN_3OF5";DECODER[119]="US4STATE";DECODER[120]="ID=120";DECODER[121]="US4STATE_FICS";function pluginAttributes(parent,id,desc,version)
{this.parentNodeName=parent;this.id=id;this.desc=desc;this.version=version;}
function deviceAttributes(parent,id,desc,name,devicetype)
{this.parentNodeName=parent;this.id=id;this.desc=desc;this.name=name;this.devicetype=devicetype;}
function c_dwconfigdfn_obj()
{this.m_xmldom=null;this.dfnTimestamp=null;this.pluginList=null;}
dwconfigdfn=new c_dwconfigdfn_obj();c_dwconfigdfn_obj.prototype.load=function()
{this.m_xmldom=null;var url=configroot+"DWConfigDfn.xml";var xml=geturl(url);return this.cbDWConfigDfn(xml,0);};c_dwconfigdfn_obj.prototype.cbDWConfigDfn=function(xml,param)
{if(xml!==null){if(xml.match("<?xml"))
{this.m_xmldom=loadXMLString(xml);if(this.m_xmldom!=null){if(this.m_xmldom.childNodes.length>0){this.dfnTimestamp=this.getDfnTimestamp();this.pluginList=this.getPluginList();return true;}}}}
displayMessage("Initialization data not found.<br/>Initialization data is created the first time DataWedge is run.<br/>Please close this window, start DataWedge, then launch your configuration choice again.");return false;};c_dwconfigdfn_obj.prototype.getDfnTimestamp=function()
{var node=this.m_xmldom.getElementsByTagName("DWConfigDfn");return node[0].getAttribute("definitiontimestamp");};c_dwconfigdfn_obj.prototype.getPluginList=function(type)
{var xpath="//PlugIn";if(arguments.length>0){xpath="//"+type+"/PlugIn";}
var plugs=selectNodes(this.m_xmldom,xpath);var i=0;var pluginList=[];var pattr;while(i<plugs.length)
{pattr=new pluginAttributes(plugs[i].parentNode.nodeName,plugs[i].getAttribute("id"),plugs[i].getAttribute("desc"),plugs[i].getAttribute("version"));pluginList.push(pattr);i++;}
return pluginList;};c_dwconfigdfn_obj.prototype.getPluginDescById=function(pid)
{var xpath="//PlugIn[@id='"+pid+"']";var plug=selectNodes(this.m_xmldom,xpath);var desc="ouch";if(plug.length>0){desc=plug[0].getAttribute("desc");if(desc==null){desc="ouch";}}
return desc;};c_dwconfigdfn_obj.prototype.getDeviceList=function(parent)
{var xpath="/DWConfigDfn/PlugIns/Input/PlugIn/Device";if(arguments.length>0){xpath="//"+parent+"/Device";}
var device=selectNodes(this.m_xmldom,xpath);var i=0;var deviceList=[];var dattr;while(i<device.length)
{dattr=new deviceAttributes(device[i].parentNode.nodeName,device[i].getAttribute("id"),device[i].getAttribute("desc"),device[i].getAttribute("name"),device[i].getAttribute("devicetype"));deviceList.push(dattr);i++;}
return deviceList;};c_dwconfigdfn_obj.prototype.getInputDeviceListByPluginId=function(pid)
{var xpath="//Input/PlugIn[@id='"+pid+"']/Device";var device=selectNodes(this.m_xmldom,xpath);var i=0;var deviceList=[];var dattr;while(i<device.length)
{dattr=new deviceAttributes(device[i].parentNode.nodeName,device[i].getAttribute("id"),device[i].getAttribute("desc"),device[i].getAttribute("name"),device[i].getAttribute("devicetype"));deviceList.push(dattr);i++;}
return deviceList;};c_dwconfigdfn_obj.prototype.getLogSize=function()
{var els=this.m_xmldom.getElementsByTagName("LogSize");return els[0].firstChild.nodeValue;};c_dwconfigdfn_obj.prototype.getLogPath=function()
{var els=this.m_xmldom.getElementsByTagName("LogPath");return els[0].firstChild.nodeValue;};c_dwconfigdfn_obj.prototype.getTempPath=function()
{var els=this.m_xmldom.getElementsByTagName("TempPath");return els[0].firstChild.nodeValue;};c_dwconfigdfn_obj.prototype.getLogLevel=function()
{var els=this.m_xmldom.getElementsByTagName("LogLevel");return els[0].firstChild.nodeValue;};c_dwconfigdfn_obj.prototype.getDWVersion=function()
{var els=this.m_xmldom.getElementsByTagName("DataWedge");return els[0].getAttribute("version");};c_dwconfigdfn_obj.prototype.getAutoProfileSwitching=function()
{var els=this.m_xmldom.getElementsByTagName("AutoProfileSwitching");return els[0].getAttribute("default");};c_dwconfigdfn_obj.prototype.getAutoStartEnabled=function()
{var xpath="/DWConfigDfn/DesktopAutoStart/Enabled";var els=selectNodes(this.m_xmldom,xpath);return els[0].getAttribute("default");};c_dwconfigdfn_obj.prototype.getAutoStartApp=function()
{var xpath="/DWConfigDfn/DesktopAutoStart/AutoStartApp";var els=selectNodes(this.m_xmldom,xpath);return els[0].getAttribute("default");};c_dwconfigdfn_obj.prototype.iterateFeedbackDefaults=function(pfbdfn,wfbdfn)
{var pchld=pfbdfn.firstChild;var wchld;var pdef,wdef;while(pchld!=null){wchld=wfbdfn.getElementsByTagName(pchld.nodeName);if(wchld!=null){if(wchld.length>0){if(pchld.childNodes.length>0){this.iterateFeedbackDefaults(pchld,wchld[0]);}
pdef=pchld.getAttribute("default");if(pdef!=null){wdef=wchld[0].getAttribute("default");if(wdef!=null){wchld[0].setAttribute("default",pdef);}}}}
pchld=pchld.nextSibling;}};c_dwconfigdfn_obj.prototype.getMyFeedback=function(pfbdfn)
{var fb_xpath="/DWConfigDfn/Feedback";var temp_xpath="/DWConfigDfn/_temp";var tempfb_xpath="/DWConfigDfn/_temp/Feedback";var temp=selectNodes(this.m_xmldom,temp_xpath);var head;var tempExists=false;if(temp!=null){if(temp.length>0){tempExists=true;}}
if(!tempExists){temp=this.m_xmldom.createElement("_temp");head=this.m_xmldom.getElementsByTagName("DWConfigDfn")[0];head.appendChild(temp);temp=selectNodes(this.m_xmldom,temp_xpath)[0];}
var tfb=selectNodes(this.m_xmldom,tempfb_xpath);var fb=selectNodes(this.m_xmldom,fb_xpath);var fbclone=fb[0].cloneNode(true);if(tfb!=null){if(tfb.length>0){tfb[0].parentNode.replaceChild(fbclone,tfb[0]);}
else{temp.appendChild(fbclone);}}
else{temp.appendChild(fbclone);}
temp=selectNodes(this.m_xmldom,tempfb_xpath);if(pfbdfn!=null){if(pfbdfn.length>0){this.iterateFeedbackDefaults(pfbdfn[0],temp[0]);}}
var myfb=selectNodes(this.m_xmldom,tempfb_xpath);return myfb;};function c_dwconfig_obj()
{this.m_xmldom=null;this.m_profileIndex=0;this.dfnTimestamp=null;this.changed=0;}
var dwconfig=new c_dwconfig_obj();c_dwconfig_obj.prototype.addAutoStartNode=function()
{var node=this.m_xmldom.getElementsByTagName("DesktopAutoStart");var subnode;if(node!=null){if(node.length>0){return;}}
var root=this.m_xmldom.getElementsByTagName("DWConfig");node=this.m_xmldom.createElement("DesktopAutoStart");subnode=this.m_xmldom.createElement("Enabled");var dfltEnabled=dwconfigdfn.getAutoStartEnabled();var dfltApp=dwconfigdfn.getAutoStartApp();var txt=this.m_xmldom.createTextNode(dfltEnabled);subnode.appendChild(txt);node.appendChild(subnode);subnode=this.m_xmldom.createElement("AutoStartApp");txt=this.m_xmldom.createTextNode(dfltApp);subnode.appendChild(txt);node.appendChild(subnode);root[0].appendChild(node);};c_dwconfig_obj.prototype.addAutoProfileSwitching=function()
{var node=this.m_xmldom.getElementsByTagName("AutoProfileSwitching");if(node!=null){if(node.length>0){return;}}
var root=this.m_xmldom.getElementsByTagName("DWConfig");node=this.m_xmldom.createElement("AutoProfileSwitching");var dfltAPS=dwconfigdfn.getAutoProfileSwitching();var txt=this.m_xmldom.createTextNode(dfltAPS);node.appendChild(txt);root[0].appendChild(node);};c_dwconfig_obj.prototype.load=function()
{this.m_xmldom=null;var url=configroot+"DWConfig.xml";var xml=geturl(url);this.cbDWConfig(xml,0);};c_dwconfig_obj.prototype.cbDWConfig=function(xml,param)
{if(xml!==null){if(xml.match("<?xml"))
{this.m_xmldom=loadXMLString(xml);this.addAutoStartNode();this.addAutoProfileSwitching();this.dfnTimestamp=this.getDfnTimestamp();}}};c_dwconfig_obj.prototype.getDfnTimestamp=function()
{var node=this.m_xmldom.getElementsByTagName("DWConfig");return node[0].getAttribute("definitiontimestamp");};c_dwconfig_obj.prototype.checkForUpdates=function()
{var url="/config/DWConfig.xml";var xml=geturl(url);this.cbUpdate(xml,0);};c_dwconfig_obj.prototype.cbUpdate=function(xml,param)
{var idx=xml.indexOf("definitiontimestamp");if(idx>0)
{var endtag=xml.indexOf(">",idx);var i,q1=0,c;for(i=idx+19;i<endtag;i++){c=xml.charAt(i);if((c=="'")||(c=="\"")){q1=i+1;break;}}
if(q1>idx)
{var q2=0;for(i=q1;i<endtag;i++){c=xml.charAt(i);if((c=="'")||(c=="\"")){q2=i;break;}}
if(q2>q1)
{var ts=xml.substr(q1,q2-q1);if(ts!=this.dfnTimestamp){this.dfnTimestamp=ts;if(ts!=dwconfigdfn.dfnTimestamp){dwconfigdfn.load();if(ts!=dwconfigdfn.dfnTimestamp){}}}}}}};c_dwconfig_obj.prototype.profileCount=function()
{var prfls=selectNodes(this.m_xmldom,"//Profiles/*");return prfls.length;};c_dwconfig_obj.prototype.getFirstProfile=function()
{this.m_profileIndex=0;var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile");if(pfl.length==0){return null;}
var name=pfl[this.m_profileIndex].getAttribute("name");var filename=pfl[this.m_profileIndex].getAttribute("filename");var active=pfl[this.m_profileIndex].getAttribute("active");var enabled=pfl[this.m_profileIndex].getAttribute("enabled");return new profileAttributes(name,filename,active,enabled);};c_dwconfig_obj.prototype.getNextProfile=function()
{if(this.m_profileIndex>=this.profileCount()-1){return null;}
this.m_profileIndex++;var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile");var name=pfl[this.m_profileIndex].getAttribute("name");var filename=pfl[this.m_profileIndex].getAttribute("filename");var active=pfl[this.m_profileIndex].getAttribute("active");var enabled=pfl[this.m_profileIndex].getAttribute("enabled");return new profileAttributes(name,filename,active,enabled);};c_dwconfig_obj.prototype.getProfileByName=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");var name=pfl[0].getAttribute("name");var filename=pfl[0].getAttribute("filename");var active=pfl[0].getAttribute("active");var enabled=pfl[0].getAttribute("enabled");return new profileAttributes(name,filename,active,enabled);};c_dwconfig_obj.prototype.getProfileByFilename=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@filename='"+pname+"']");var name=pfl[0].getAttribute("name");var filename=pfl[0].getAttribute("filename");var active=pfl[0].getAttribute("active");var enabled=pfl[0].getAttribute("enabled");return new profileAttributes(name,filename,active,enabled);};c_dwconfig_obj.prototype.addProfile=function(pname,filename,active,enabled)
{var prfls=selectNodes(this.m_xmldom,"//Profiles");var pfl=this.m_xmldom.createElement("Profile");pfl.setAttribute("name",pname);pfl.setAttribute("filename",filename);pfl.setAttribute("active","0");pfl.setAttribute("enabled","1");prfls[0].appendChild(pfl);this.changed++;};c_dwconfig_obj.prototype.cloneProfile=function(name,pname,filename)
{var prfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+name+"']");if(prfl==null){return;}
if(prfl.length==0){return;}
var pfl=prfl[0].cloneNode(true);pfl.setAttribute("name",pname);pfl.setAttribute("filename",filename);pfl.setAttribute("active","0");pfl.setAttribute("enabled","1");var prfls=selectNodes(this.m_xmldom,"//Profiles");prfls[0].appendChild(pfl);this.changed++;};c_dwconfig_obj.prototype.removeProfile=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");var active=pfl[0].getAttribute("active");pfl[0].parentNode.removeChild(pfl[0]);if(active=="1")
{pfl=selectNodes(this.m_xmldom,"//Profiles/Profile");pfl[0].setAttribute("active","1");}
this.changed++;};c_dwconfig_obj.prototype.renameProfile=function(pname,newname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");pfl[0].setAttribute("name",newname);this.changed++;};c_dwconfig_obj.prototype.enableProfile=function(pname,value)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");pfl[0].setAttribute("enabled",value);this.changed++;};c_dwconfig_obj.prototype.getActiveProfile=function()
{var pfl=selectNodes(this.m_xmldom,"//Profiles/*");var i=0;while(i<pfl.length)
{if(pfl[i].getAttribute("active")=="1"){return pfl[i].getAttribute("name");}
i++;}
return pfl[0].getAttribute("name");};c_dwconfig_obj.prototype.setActiveProfile=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/*");var i=0;var set=false;while(i<pfl.length)
{if(pfl[i].getAttribute("name")==pname){pfl[i].setAttribute("active","1");set=true;}
else{pfl[i].setAttribute("active","0");}
i++;}
if(!set){pfl[0].setAttribute("active","1");}
this.changed++;};c_dwconfig_obj.prototype.getApplicationList=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");if(pfl[0].childNodes.length>0)
{var apps=pfl[0].firstChild;if(apps.childNodes.length>0)
{var app=apps.childNodes;var appList=[];var i=0;while(i<app.length)
{appList.push(app[i].firstChild.nodeValue);i++;}
return appList;}}
return null;};c_dwconfig_obj.prototype.getApplicationTitleList=function(pname)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");if(pfl[0].childNodes.length>0)
{var apps=pfl[0].firstChild;if(apps.childNodes.length>0)
{var app=apps.childNodes;var appList=[];var i=0;var appName,appNameValue,val;var title,titles,titleList,appTitleList;while(i<app.length)
{if(app[i].firstChild.nodeType==3)
{appName=app[i].firstChild.nodeValue;titleList=[];appTitleList=[];appTitleList.push(appName);appTitleList.push(titleList);appList.push(appTitleList);}
else
{appName=selectNodes(app[i],"Name");if(appName!=null)
{if(appName.length>0)
{appNameValue=appName[0].firstChild.nodeValue;titles=0;title=selectNodes(app[i],"Titles/Title");if(title!=null)
{if(title.length>0)
{titleList=[];while(titles<title.length)
{if(title[titles].childNodes.length>0){val=title[titles].firstChild.nodeValue;if(val.length>0){titleList.push(val);}}
titles++;}
appTitleList=[];appTitleList.push(appNameValue);appTitleList.push(titleList);appList.push(appTitleList);}}
if(titles==0)
{appTitleList=[];appTitleList.push(appNameValue);titleList=[];appTitleList.push(titleList);appList.push(appTitleList);}}}}
i++;}
return appList;}}
return null;};c_dwconfig_obj.prototype.appAssigned=function(name)
{var app=selectNodes(this.m_xmldom,"//Application/Name[text()='"+name+"']");if(app!==null){if(app.length>0){return true;}}
app=selectNodes(this.m_xmldom,"//Application[text()='"+name+"']");if(app!==null){if(app.length>0){return true;}}
return false;};c_dwconfig_obj.prototype.appAssignedInProfile=function(pname,appname)
{var app=selectNodes(this.m_xmldom,"//Profile[@name='"+pname+"']/Application/Name[text()='"+name+"']");if(app!==null){if(app.length>0){return true;}}
app=selectNodes(this.m_xmldom,"//Profile[@name='"+pname+"']/Application[text()='"+name+"']");if(app!==null){if(app.length>0){return true;}}
return false;};c_dwconfig_obj.prototype.appTitleAssigned=function(name,title)
{var app=selectNodes(this.m_xmldom,"//Application/Name[text()='"+name+"']/parent::*/Titles/Title[text()='"+title+"']");if(app!==null){if(app.length>0){return true;}}
return false;};c_dwconfig_obj.prototype.appTitleAssignedExProfile=function(pname,appname,title)
{var app=selectNodes(this.m_xmldom,"//Application/Name[text()='"+appname+"']/parent::*/Titles/Title[text()='"+title+"']");if(app!==null){if(app.length>0){var i=0,pn,count=0;while(i<app.length){pn=app[i].parentNode.parentNode.parentNode.parentNode.getAttribute("name");if(pn!=null){if(pn!=pname)count++;}
i++;}
if(count>0)return true;}}
return false;};c_dwconfig_obj.prototype.appNoTitleAssignedExProfile=function(pname,appname)
{var app=selectNodes(this.m_xmldom,"//Application/Name[text()='"+appname+"']/parent::*");if(app!==null){if(app.length>0){var i=0,pn,count=0,tn;while(i<app.length){pn=app[i].parentNode.parentNode.getAttribute("name");if(pn!=null){tn=app[i].getElementsByTagName("Title");if(tn==null){if(pn!=pname)count++;}
else if(tn.length==0){if(pn!=pname)count++;}}
i++;}
if(count>0)return true;}}
return false;};c_dwconfig_obj.prototype.addApplication=function(pname,appname,strWindowTitles)
{var pfl=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']");if(pfl[0].childNodes.length===0)
{var appsEl=this.m_xmldom.createElement("Applications");pfl[0].appendChild(appsEl);}
var apps=pfl[0].firstChild;var appEl=this.m_xmldom.createElement("Application");var appnameEl=this.m_xmldom.createElement("Name");var appnameTxt=this.m_xmldom.createTextNode(appname);appnameEl.appendChild(appnameTxt);appEl.appendChild(appnameEl);var windowTitle=strWindowTitles.split(wt_sep);if(windowTitle.length>0)
{var titles=this.m_xmldom.createElement("Titles");i=0;var wt,title,txtleText,count=0;while(i<windowTitle.length)
{wt=windowTitle[i].trim();if(wt.length>0){title=this.m_xmldom.createElement("Title");titleText=this.m_xmldom.createTextNode(wt);title.appendChild(titleText);titles.appendChild(title);count++;}
i++;}
if(count>0)appEl.appendChild(titles);}
apps.appendChild(appEl);this.changed++;};c_dwconfig_obj.prototype.removeApplication=function(pname,appname)
{var app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application/Name[text()='"+appname+"']");if(app!=null){if(app.length>0){var pn=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications");pn[0].removeChild(app[0].parentNode);this.changed++;return;}}
app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application[text()='"+appname+"']");if(app!=null){if(app.length>0){app[0].parentNode.removeChild(app[0]);this.changed++;}}};c_dwconfig_obj.prototype.changeApplication=function(pname,appname,newappname,strWindowTitles)
{var app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application/Name[text()='"+appname+"']");if(app!=null){if(app.length>0){app[0].firstChild.nodeValue=newappname;this.setWindowTitlesFromString(app[0].parentNode,strWindowTitles);this.changed++;return;}}
app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application[text()='"+appname+"']");if(app!=null){if(app.length>0){app[0].removeChild(app[0].firstChild);var nn=this.m_xmldom.createElement("Name");var tn=this.m_xmldom.createTextNode(newappname);nn.appendChild(tn);app[0].appendChild(nn);this.setWindowTitlesFromString(app[0],strWindowTitles);this.changed++;}}};c_dwconfig_obj.prototype.getAppWindowTitlesAsString=function(pname,appname)
{var strWindowTitles="";var app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application/Name[text()='"+appname+"']");if(app!=null)
{if(app.length>0)
{var i=0;while(i<app.length)
{strWindowTitles+=app[i].firstChild.nodeValue;i++;if(i<app.length)strWindowTitles+=wt_sep;}}}
return strWindowTitles;};c_dwconfig_obj.prototype.setAppWindowTitlesFromString=function(pname,appname,strWindowTitles)
{var app=selectNodes(this.m_xmldom,"//Profiles/Profile[@name='"+pname+"']/Applications/Application/Name[text()='"+appname+"']");if(app!=null)
{if(app.length>0)
{var child=app[0].childNodes;var i=0;while(i<child.length)
{if(child[i].nodeName=="Titles")
{child[i].parentNode.removeChild(child[i]);break;}
i++;}
var windowTitle=strWindowTitles.split(wt_sep);if(windowTitle.length>0)
{var tnc=0;var titles=this.m_xmldom.createElement("Titles");i=0;var wt,title,txtleText;while(i<windowTitle.length)
{wt=windowTitle[i].trim();if(wt.length>0){title=this.m_xmldom.createElement("Title");titleText=this.m_xmldom.createTextNode(wt);title.appendChild(titleText);titles.appendChild(title);tnc++;}
i++;}
if(tnc>0){app[0].appendChild(titles);}}
this.changed++;}}};c_dwconfig_obj.prototype.setWindowTitlesFromString=function(app,strWindowTitles)
{if(app==null)return;if(app.length==0)return;var child=app.childNodes;var i=0;while(i<child.length)
{if(child[i].nodeName=="Titles")
{child[i].parentNode.removeChild(child[i]);break;}
i++;}
var windowTitle=strWindowTitles.split(wt_sep);if(windowTitle.length>0)
{var tnc=0;var titles=this.m_xmldom.createElement("Titles");i=0;var wt,title,txtleText;while(i<windowTitle.length)
{wt=windowTitle[i].trim();if(wt.length>0){title=this.m_xmldom.createElement("Title");titleText=this.m_xmldom.createTextNode(wt);title.appendChild(titleText);titles.appendChild(title);tnc++;}
i++;}
if(tnc>0){app.appendChild(titles);}}};c_dwconfig_obj.prototype.getAutoProfileSwitching=function()
{var aps=this.m_xmldom.getElementsByTagName("AutoProfileSwitching");return aps[0].firstChild.nodeValue;};c_dwconfig_obj.prototype.setAutoProfileSwitching=function(value)
{var aps=this.m_xmldom.getElementsByTagName("AutoProfileSwitching");aps[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.getAutoStartEnabled=function()
{var ase=selectNodes(this.m_xmldom,"//DesktopAutoStart/Enabled");if(ase!=null){if(ase.length>0){return ase[0].firstChild.nodeValue;}}
return"1";};c_dwconfig_obj.prototype.setAutoStartEnabled=function(value)
{var aps=selectNodes(this.m_xmldom,"//DesktopAutoStart/Enabled");aps[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.getAutoStartApp=function()
{var asa=selectNodes(this.m_xmldom,"//DesktopAutoStart/AutoStartApp");if(asa!=null){if(asa.length>0){return asa[0].firstChild.nodeValue;}}
return"dwdemo.exe";};c_dwconfig_obj.prototype.setAutoStartApp=function(value)
{var aps=selectNodes(this.m_xmldom,"//DesktopAutoStart/AutoStartApp");aps[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.getLogSize=function()
{var els=this.m_xmldom.getElementsByTagName("LogSize");return els[0].firstChild.nodeValue;};c_dwconfig_obj.prototype.getLogPath=function()
{var els=this.m_xmldom.getElementsByTagName("LogPath");return els[0].firstChild.nodeValue;};c_dwconfig_obj.prototype.getTempPath=function()
{var els=this.m_xmldom.getElementsByTagName("TempPath");return els[0].firstChild.nodeValue;};c_dwconfig_obj.prototype.getLogLevel=function()
{var els=this.m_xmldom.getElementsByTagName("LogLevel");return els[0].firstChild.nodeValue;};c_dwconfig_obj.prototype.setLogSize=function(value)
{var els=this.m_xmldom.getElementsByTagName("LogSize");els[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.setLogPath=function(value)
{var els=this.m_xmldom.getElementsByTagName("LogPath");els[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.setTempPath=function(value)
{var els=this.m_xmldom.getElementsByTagName("TempPath");els[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.setLogLevel=function(value)
{var els=this.m_xmldom.getElementsByTagName("LogLevel");els[0].firstChild.nodeValue=value;this.changed++;};c_dwconfig_obj.prototype.save=function()
{if(arguments.length==0){if(this.changed==0){keytrap=true;return true;}}
var kt=keytrap;keytrap=false;var ret=puturl("/config/DWConfig.xml",xml2str(this.m_xmldom));keytrap=kt;if(ret==null){keytrap=true;return false;}
this.changed=0;keytrap=true;return true;};c_dwconfig_obj.prototype.getNewProfileName=function()
{var i=1,j;var pname,sname,pfname;var pnode=this.m_xmldom.getElementsByTagName("Profile");while(1)
{sname="Profile"+i;for(j=0;j<pnode.length;j++)
{pname=pnode[j].getAttribute("name");if(pname.toLowerCase()==sname.toLowerCase()){break;}
pfname=pnode[j].getAttribute("filename");if(pfname!=null){if(pfname.toLowerCase()==sname.toLowerCase()){break;}}}
if(j==pnode.length){break;}
i++;}
return sname;}
c_dwconfig_obj.prototype.existingProfileName=function(name)
{var j;var pname,pfilename;var profile=this.m_xmldom.getElementsByTagName("Profile");for(j=0;j<profile.length;j++)
{pname=profile[j].getAttribute("name");if(pname.toLowerCase()==name.toLowerCase()){return true;}
pfilename=profile[j].getAttribute("filename");if(pfilename!=null){if(pfilename.toLowerCase()==name.toLowerCase()){return true;}}}
return false;}
c_dwconfig_obj.prototype.resetToDefault=function()
{var pl=this.getFirstProfile();var ret;while(pl!=null)
{ret=deleteurl("/config/profiles/"+pl.filename+".xml");if(ret==null){alert("Error deleting profile. DataWedge may not be running.");}
pl=this.getNextProfile();}
var xml="<?xml version=\"1.0\" encoding=\"utf-8\"?><DWConfig definitiontimestamp=\""+this.dfnTimestamp+"\"/>";this.m_xmldom=null;this.m_xmldom=loadXMLString(xml);this.changed++;this.save();};c_feedback_plugin=function()
{this.id=null;this.name=null;this.version=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;};c_feedback_plugin.prototype=new c_base_plugin();c_feedback_plugin.prototype.constructor=c_feedback_plugin;c_feedback_plugin.prototype.parent=c_base_plugin.prototype;c_feedback_plugin.prototype.removeNode=function(node)
{switch(node.nodeName){case"DisableAll":case"option":break;default:if(node.parentNode!=null){node.parentNode.removeChild(node);}
return true;}
return false;};function profileAttributes(name,filename,active,enabled)
{this.name=name;this.filename=filename;this.active=active;this.enabled=enabled;}
c_profile_obj=function(attributes)
{this.name=attributes.name;this.filename=attributes.filename;this.active=attributes.active;this.enabled=attributes.enabled;this.cloneFilename=null;this.m_prflxmldom=null;this.m_prflcfgdom=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;this.appschanged=0;this.appId=0;};c_profile_obj.prototype=new c_base_obj();c_profile_obj.prototype.constructor=c_profile_obj;c_profile_obj.prototype.parent=c_base_obj.prototype;c_profile_obj.prototype.newCfgXml=function()
{var ip=dwconfigdfn.getPluginList("Input");var op=dwconfigdfn.getPluginList("Output");var pp=dwconfigdfn.getPluginList("Process");var xml="<?xml version=\"1.0\" encoding=\"utf-8\"?>";xml+="<DWProfileConfig><PlugIns><Input>";var i=0;while(i<ip.length){xml+="<PlugIn id=\""+ip[i].id+"\" desc=\""+ip[i].desc+"\"/>";i++;}
xml+="</Input><Output>";i=0;while(i<op.length){xml+="<PlugIn id=\""+op[i].id+"\" desc=\""+op[i].desc+"\"/>";i++;}
xml+="</Output><Process>";i=0;while(i<pp.length){xml+="<PlugIn id=\""+pp[i].id+"\" desc=\""+pp[i].desc+"\"/>";i++;}
xml+="</Process></PlugIns><DataPaths><Path><Input>";xml+="<PlugIn id =\""+ip[0].id+"\" desc=\""+ip[0].desc+"\"/>";xml+="</Input><Process>";i=0;var val;while(i<pp.length){xml+="<PlugIn id=\""+pp[i].id+"\" desc=\""+pp[i].desc+"\"><Enabled>";val=eval("c_"+pp[i].id.toLowerCase()+"_plugin.default_Enabled;");xml+=val+"</Enabled></PlugIn>";i++;}
xml+="</Process><Output>";xml+="<PlugIn id =\""+op[0].id+"\" desc=\""+op[0].desc+"\"/>";xml+="</Output></Path></DataPaths></DWProfileConfig>";return xml;};c_profile_obj.prototype.load=function()
{this.m_xmldom=null;var xml;if(this.m_cfgdom===null)
{var url;if(this.cloneFilename==null){url=configroot+"profiles/"+this.filename+".xml";}
else{url=configroot+"profiles/"+this.cloneFilename+".xml";}
xml=geturl(url);var gotxml=false;if(xml!==null){if(xml.match("<DWProfileConfig")){gotxml=true;}}
if(!gotxml){xml=this.newCfgXml();}
this.m_prflcfgdom=loadXMLString(xml);this.doSendEnterHack();this.m_cfgdom=selectNodes(this.m_prflcfgdom,"/DWProfileConfig")[0];if(gotxml){this.addIOPluginsToConfig("Input");this.addIOPluginsToConfig("Output");if(this.cloneFilename!=null){this.save();}}
else{this.save();}}
this.create();var xpath=".";this.m_xpathStack.push(xpath);if(this.m_redirect!=null){var rdsp=this.m_redirect.split("/");if(rdsp[0]=="Process"){this.loadRoute0(rdsp[1]);}
else{this.loadPlugin(rdsp[1]);}
return;}
var nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.push(this.name);this.updateMenu(nodeList);};c_profile_obj.prototype.cbProfile=function(xml,param)
{switch(param)
{case"dwui":if(xml!==null){if(xml.length>0)
{this.m_xmldom=loadXMLString(xml);}
else
{var url=configroot+"profiles/"+this.filename+".xml";SimpleAJAXCall(urlex(url),this.cbProfile,"","raw");}}
break;case"raw":if(this.m_xmldom!==null){return;}
if(xml===null){return;}
if(xml.length===0){return;}
this.m_xmldom=loadXMLString(xml);break;}};c_profile_obj.prototype.create=function()
{var url=htmlroot+"dwui_profile.xml";var xml=geturl(url);if(xml!==null){if(xml.length>0)
{this.m_prflxmldom=loadXMLString(xml);this.m_xmldom=selectNodes(this.m_prflxmldom,"/Profile")[0];this.initApplications();this.addCaptureModeToConfig();this.addIOPlugins("Input");this.addIOPlugins("Output");var en=selectNodes(this.m_xmldom,"./Enabled");en[0].firstChild.nodeValue=this.enabled;}}};c_profile_obj.prototype.initApplications=function()
{if((this.filename==="Default")||(this.filename==="Profile0"))
{var apps=this.m_xmldom.getElementsByTagName("Applications")[0];apps.parentNode.removeChild(apps);return;}
var appList=dwconfig.getApplicationTitleList(this.name);var appTitleList,titleList;if(appList!==null){if(appList.length>0)
{var i=0;var app,name,ed,del,addNode;var title,titles;while(i<appList.length)
{app=this.m_xmldom.ownerDocument.createElement("Application");appTitleList=appList[i];name=appTitleList[0];titleList=appTitleList[1];titles="";if(titleList!=null)
{if(titleList.length>0)
{title=0;while(title<titleList.length)
{titles+=titleList[title];title++;if(title<titleList.length)titles+=wt_sep;}}}
app.setAttribute("value",name);app.setAttribute("name",name);app.setAttribute("id",i);if(titles.length>0)
app.setAttribute("titles",titles);ed=this.m_xmldom.ownerDocument.createElement("Edit");ed.setAttribute("type","edit");app.appendChild(ed);del=this.m_xmldom.ownerDocument.createElement("Delete");del.setAttribute("type","delete");app.appendChild(del);addNode=selectNodes(this.m_xmldom,"./Applications/Application[@type='add']");addNode[0].parentNode.insertBefore(app,addNode[0]);i++;this.appId++;}}}
var pfl=selectNodes(this.m_xmldom,".");var ren=this.m_xmldom.ownerDocument.createElement("Rename");ren.setAttribute("type","rename");pfl[0].appendChild(ren);var del=this.m_xmldom.ownerDocument.createElement("Delete");del.setAttribute("type","delete");pfl[0].appendChild(del);};c_profile_obj.prototype.addPluginsToNodeByType=function(node,type)
{var plist=dwconfigdfn.getPluginList(type);var i=0;var pnode,pattr,pname;while(i<plist.length)
{pnode=node.ownerDocument.createElement("PlugIn");pnode.setAttribute("id",plist[i].id);pnode.setAttribute("name",plist[i].desc);pnode.setAttribute("desc",plist[i].desc);pnode.setAttribute("version",plist[i].version);pnode.setAttribute("type","plugin");node.appendChild(pnode);i++;}};c_profile_obj.prototype.addPluginsToNodeByTypeAsOption=function(node,type)
{var plist=dwconfigdfn.getPluginList(type);var i=0;var pnode,pattr,pname;while(i<plist.length)
{pnode=node.ownerDocument.createElement("option");pnode.setAttribute("id",i);pnode.setAttribute("value",plist[i].id);pnode.setAttribute("name",plist[i].desc);node.appendChild(pnode);i++;}
node.setAttribute("oid","0");node.setAttribute("value",plist[0].id);};c_profile_obj.prototype.addIOPlugins=function(type)
{var plug=selectNodes(this.m_xmldom,"./"+type);this.addPluginsToNodeByType(plug[0],type);};c_profile_obj.prototype.addProcPlugins=function()
{var plug=selectNodes(this.m_xmldom,"//Process");this.addPluginsToNodeByType(plug[0],"Process");};c_profile_obj.prototype.addPluginsToConfigByType=function(node,type)
{var plist=dwconfigdfn.getPluginList(type);var i=0;var pnode,pattr,pname,cn,exists;while(i<plist.length)
{cn=node.firstChild;exists=false;while(cn!=null){if(cn.getAttribute("id")==plist[i].id){exists=true;break;}
cn=cn.nextSibling;}
if(!exists){pnode=node.ownerDocument.createElement("PlugIn");pnode.setAttribute("id",plist[i].id);pnode.setAttribute("desc",plist[i].desc);node.appendChild(pnode);}
i++;}};c_profile_obj.prototype.addIOPluginsToConfig=function(type)
{var plug=selectNodes(this.m_cfgdom,"./PlugIns/"+type);this.addPluginsToConfigByType(plug[0],type);};c_profile_obj.prototype.addCaptureModeToConfig=function()
{var ccm=selectNodes(this.m_cfgdom,"./CaptureMode");if(ccm!=null){if(ccm.length>0){var xcm=selectNodes(this.m_xmldom,"./CaptureMode");if(xcm!=null){if(xcm.length>0){var cm=ccm[0].firstChild.nodeValue;xcm[0].setAttribute("value",cm);xcm[0].setAttribute("oid",cm);}}
return;}}
var cmnode=this.m_cfgdom.ownerDocument.createElement("CaptureMode");var tnode=this.m_cfgdom.ownerDocument.createTextNode("0");cmnode.appendChild(tnode);this.m_cfgdom.appendChild(cmnode);};c_profile_obj.prototype.appAssigned=function(name)
{if(dwconfig.appAssigned(name)){return true;}
var app=selectNodes(this.m_xmldom,"./Applications/Application[@name='"+name+"']");if(app.length>0){return true;}
return false;};c_profile_obj.prototype.appAssignedInThisProfile=function(appname)
{if(dwconfig.appAssignedInProfile(this.name,appname)){return true;}
app=selectNodes(this.m_xmldom,"./Applications/Application/Name[text()='"+appname+"']");if(app!=null){if(app.length>0){return true;}}
var app=selectNodes(this.m_xmldom,"./Applications/Application[@name='"+appname+"']");if(app!=null){if(app.length>0){return true;}}
return false;};c_profile_obj.prototype.appTitleAssigned=function(name,title)
{if(dwconfig.appTitleAssigned(name,title,this.name)){return true;}
var app=selectNodes(this.m_xmldom,"./Applications/Application[@name='"+name+"']");var al=app.length;if(al>0){var i=0,j,wts,wts;while(i<al)
{wts=app[i].getAttribute("titles");wt=wts.split(wt_sep);j=0;while(j<wt.length)
{if(wt[j]==title)return true;j++;}
i++;}}
return false;};c_profile_obj.prototype.appTitleAssignedInOtherProfiles=function(appname,title)
{if(dwconfig.appTitleAssignedExProfile(this.name,appname,title)){return true;}
return false;};c_profile_obj.prototype.appNoTitleAssignedInOtherProfiles=function(appname)
{if(dwconfig.appNoTitleAssignedExProfile(this.name,appname)){return true;}
return false;};c_profile_obj.prototype.addApplication=function(name,wintitles)
{var app=this.m_xmldom.ownerDocument.createElement("Application");app.setAttribute("value",name);app.setAttribute("name",name);app.setAttribute("titles",wintitles);app.setAttribute("id",this.appId);this.appId++;var edit=this.m_xmldom.ownerDocument.createElement("Edit");edit.setAttribute("type","edit");app.appendChild(edit);var del=this.m_xmldom.ownerDocument.createElement("Delete");del.setAttribute("type","delete");app.appendChild(del);var addNode=selectNodes(this.m_xmldom,"./Applications/Application[@type='add']");addNode[0].parentNode.insertBefore(app,addNode[0]);dwconfig.addApplication(this.name,name,wintitles);this.changed++;this.appschanged++;};c_profile_obj.prototype.changeApplication=function(newname,wintitles)
{var xpth=this.m_xpathStack.getLastValue();var xmlnode=selectNodes(this.m_xmldom,xpth);var name=xmlnode[0].getAttribute("value");dwconfig.changeApplication(this.name,name,newname,wintitles);xmlnode[0].setAttribute("value",newname);xmlnode[0].setAttribute("name",newname);xmlnode[0].setAttribute("titles",wintitles);this.changed++;this.appschanged++;};c_profile_obj.prototype.updateNodeListValues=function(xpath,nodeList)
{return;};c_profile_obj.prototype.checkRename=function(value,id)
{var name=value.trim();if(name.length==0)
{alert("Invalid entry.  Please try adding some characters.");return false;}
var chk=false,dup=true;var errmsg=" contains invalid characters!";if(name.length>MAX_PROFILENAME){errmsg=" is too long. Please shorten.";}
else{chk=name.validProfilename();}
if(chk){if(name==this.filename){dup=false;}
else{dup=dwconfig.existingProfileName(name);}}
if(!chk){alert(name+errmsg);}
else{if(dup){alert(name+" is already taken!");return false;}
dwconfig.renameProfile(this.name,name);this.name=name;locationbar.setLastValue(name);var node=selectNodes(this.m_cfgdom,"/DWProfileConfig");node[0].setAttribute("name",name);this.changed++;return true;}
return false;};c_profile_obj.prototype.editDone=function(id)
{if(id=="Application_Edit"){locationbar.pop();}
this.parent.editDone.call(this,id);};c_profile_obj.prototype.checkUnknown=function(value,id)
{switch(id)
{case"Application":case"Application_Edit":var name=value.trim().toLowerCase();var i;var re=/(.)+\.exe$/i;if(!re.test(name))
{alert("Invalid application name.");return false;}
var ret=name.validFilename();if(!ret)
{alert(name+" contains invalid characters!");return false;}
if(this.appAssigned(name))
{alert(name+" is already assigned.");return false;}
redact=false;if(id=="Application"){this.addApplication(name);}
if(id=="Application_Edit"){this.changeApplication(name);locationbar.pop();}
return true;break;case"Path":name=value.trim();if(name.length==0)
alert("Invalid entry.  Please try adding some characters.");else{var ret=name.validProfilename();if(!ret){alert(name+" contains invalid characters!");}
else{ret=!this.existingPathName(name);if(!ret){alert(name+" is already taken!");}}
if(ret){redact=false;setTimeout("profile.createNewPath('"+name+"');",20);}}
break;}
return false;};c_profile_obj.prototype.createNewPath=function(name)
{path=null;displayMessage("Loading route, please wait...");path=new c_path_obj();var cfgNode=selectNodes(this.m_cfgdom,"./DataPaths");var pth=this.m_cfgdom.ownerDocument.createElement("Path");pth.setAttribute("id",name);pth.setAttribute("name",name);cfgNode[0].appendChild(pth);cfgNode=selectNodes(this.m_cfgdom,"//Path[@id='"+name+"']");path.setCfgBase(cfgNode[0]);path.id=name;path.changed++;path.setGuvnor(this);classStack.push("path");setTimeout("path.load();",20);};c_profile_obj.prototype.getNewPathName=function()
{var i=1,j;var pname,sname,pfname;var pnode=this.m_xmldom.getElementsByTagName("Path");while(1)
{sname="Route"+i;for(j=0;j<pnode.length;j++)
{pname=pnode[j].getAttribute("name");if(pname.toLowerCase()==sname.toLowerCase()){break;}
pfname=pnode[j].getAttribute("id");if(pfname!=null){if(pfname.toLowerCase()==sname.toLowerCase()){break;}}}
if(j==pnode.length){break;}
i++;}
return sname;}
c_profile_obj.prototype.editAppCheck=function(value,value2,id,appname,appid)
{switch(id)
{case"Application":case"Application_Edit":var name=value.trim().toLowerCase();var i;var re=/(.)+\.exe$/i;if(!re.test(name))
{alert("Invalid application name.");return false;}
var ret=name.validFilename();if(!ret)
{alert(name+" contains invalid characters!");return false;}
if(value2.length>0){var wt=value2.split(wt_sep);i=0;while(i<wt.length){if(wt[i].length>0){if(this.appTitleAssignedInOtherProfiles(name,wt[i])){alert(name+" | "+wt[i]+"\r\n\r\nis already assigned in another profile.");return false;}}
i++;}}
else{if(this.appNoTitleAssignedInOtherProfiles(name)){alert(name+" | *\r\n\r\nis already assigned in another profile.");return false;}}
if(id=="Application")
{if(this.appAssignedInThisProfile(name)){alert("\""+name+"\" has already been added to this profile.\r\n\r\nPlease edit or delete the existing application.");return false;}}
if(id=="Application_Edit")
{if(name!=appname){if(this.appAssignedInThisProfile(name)){alert("\" "+name+"\" has already been added to this profile.\r\n\r\nPlease edit or delete the existing application.");return false;}}
else{;}}
redact=false;if(id=="Application"){this.addApplication(name,value2);}
if(id=="Application_Edit"){this.changeApplication(name,value2);locationbar.pop();}
this.changed++;this.editDone();break;}
return false;};c_profile_obj.prototype.editAppBox=function(name,title,value,value2,obj,id,appid)
{if(name!==null){if(name.length>0){locationbar.refresh(name);}}
var html;html="<div class=\"heading\">"+title+"</div> \
<form id=\"editform\" action=\"\" method=\"GET\" onsubmit=\"return "+obj+".editAppCheck(editbox.value, editbox2.value, '"+id+"', '"+value+"', '"+appid+"');\"> \
<div>Application name: (required)</div> \
<input class=\"txt\" name=\"editbox\" type=\"text\" value=\""+String(value)+"\"> \
<div class=\"eg\">&nbsp;</div> \
<div>Window title(s): (optional)</div> \
<textarea class=\"txt\" name=\"editbox2\" rows=\"3\">"+String(value2)+"</textarea> \
<div class=\"eg\"> </div> \
<br/> \
<input class=\"btn\" name=\"sav\" type=\"button\" value=\"Save\" onclick=\""+obj+".editAppCheck(editbox.value, editbox2.value, '"+id+"', '"+value+"', '"+appid+"');\" /> \
<input class=\"btn\" name=\"cancel\" type=\"button\" value=\"Cancel\" onclick=\""+obj+".editDone('"+id+"');\" /> \
</form>";document.getElementById("centerpanel").innerHTML=html;keytrap=false;redact=true;setTimeout("document.getElementById('editform').editbox.select();",50);};c_profile_obj.prototype.handleAddNew=function(node,idx)
{switch(node.nodeName)
{case"Application":var name=node.getAttribute("name");this.editAppBox(name,"Application","my.exe","","profile",node.nodeName,-1);break;case"Path":this.editBox(null,"New route name:",this.getNewPathName(),"profile",node.nodeName);break;}
return true;};c_profile_obj.prototype.handleDelete=function(node,idx)
{if(confirm("Are you sure you want to delete this?")){switch(node.parentNode.nodeName)
{case"Profile":if(connected()){var ret=deleteurl("/config/profiles/"+this.filename+".xml");if(ret!=null){dwconfig.removeProfile(this.name);dwconfig.save();this.changed=0;this.m_xpathStack.pop();keytrap=true;setTimeout("onSelect(666);",20);}
else{alert("Error deleting profile. DataWedge may not be running.");}
return true;}
break;case"Application":var name=node.parentNode.getAttribute("name");dwconfig.removeApplication(this.name,name);node=selectNodes(this.m_xmldom,"./Applications/Application[@name='"+name+"']");node[0].parentNode.removeChild(node[0]);this.changed++;locationbar.pop();this.m_xpathStack.pop();break;}}
locationbar.refresh();this.m_xpathStack.pop();this.refresh();return true;};c_profile_obj.prototype.handleEdit=function(node,idx)
{this.m_xpathStack.pop();var appname=node.parentNode.getAttribute("name");var titles=node.parentNode.getAttribute("titles");var id=node.parentNode.getAttribute("id");if(titles==null)titles="";this.editAppBox(null,"Application",appname,titles,"profile",node.parentNode.nodeName+"_Edit",id);return true;};c_profile_obj.prototype.updateRouteList=function(node,idx)
{var xpth=this.m_xpathStack.getLastValue();var cfgroutes=selectNodes(this.m_cfgdom,xpth.removePid().removeUid()+"/*");var cfglen=cfgroutes.length;if(cfglen==0){return;}
var xmlroutes=selectNodes(this.m_xmldom,xpth);var chld=xmlroutes[0].firstChild;while(chld!=null){chld.parentNode.removeChild(chld);chld=xmlroutes[0].firstChild;}
var i=0;var pname,pid,route,enabled,txt,node;while(i<cfglen)
{pid=cfgroutes[i].getAttribute("id");if(pid==null){pid="Route0";cfgroutes[i].setAttribute("id",pid);}
pname=cfgroutes[i].getAttribute("name");if(pname==null){pname=pid;}
route=this.m_xmldom.ownerDocument.createElement("Path");route.setAttribute("id",pid);route.setAttribute("name",pname);enabled=1;if(cfgroutes[i].childNodes.length>0){node=selectNodes(cfgroutes[i],"Enabled");if(node!=null){if(node.length>0){enabled=node[0].firstChild.nodeValue;if(enabled==null){enabled=1;}}}}
txt=this.m_xmldom.ownerDocument.createTextNode(enabled);node=this.m_xmldom.ownerDocument.createElement("Enabled");node.appendChild(txt);route.setAttribute("enabled",enabled);route.appendChild(node);xmlroutes[0].appendChild(route);i++;}
route=this.m_xmldom.ownerDocument.createElement("Path");route.setAttribute("type","add");route.setAttribute("name","Add new");xmlroutes[0].appendChild(route);};c_profile_obj.prototype.loadRoute0=function(redirect)
{path=new c_path_obj();var cfgNode=selectNodes(this.m_cfgdom,".//Path");path.setCfgBase(cfgNode[0]);path.id="Route0";path.setRedirect(redirect);path.setGuvnor(this);classStack.push("path");displayMessage("Loading route, please wait...");setTimeout("path.load();",10);};c_profile_obj.prototype.deletePath=function(id)
{var cfgNode=selectNodes(this.m_cfgdom,".//Path[@id='"+id+"']");cfgNode[0].parentNode.removeChild(cfgNode[0]);this.changed++;this.save();};c_profile_obj.prototype.loadPath=function(id)
{path=new c_path_obj();var cfgNode=selectNodes(this.m_cfgdom,".//Path[@id='"+id+"']");path.setCfgBase(cfgNode[0]);path.id=id;path.setGuvnor(this);classStack.push("path");displayMessage("Loading route, please wait...");setTimeout("path.load();",10);};c_profile_obj.prototype.handleUnknownNodeName=function(node,idx)
{switch(node.nodeName)
{case"DataPaths":this.updateRouteList();break;case"Path":var id=node.getAttribute("id");if(id==null){return true;}
this.loadPath(id);return true;break;}
return false;};c_profile_obj.prototype.loadPlugin=function(id)
{plugin=null;displayMessage("Loading plugin, please wait...");dwconfig.checkForUpdates();eval("plugin = new c_"+id.toLowerCase()+"_plugin();");var dfnNode=selectNodes(this.m_dfndom,"//PlugIn[@id='"+id+"']");plugin.setDfnBase(dfnNode[0]);var cfgNode=selectNodes(this.m_cfgdom,"//PlugIn[@id='"+id+"']");plugin.setCfgBase(cfgNode[0]);plugin.setGuvnor(this);classStack.push("plugin");setTimeout("plugin.load('"+id.toLowerCase()+"');",10);};c_profile_obj.prototype.handleUnknownType=function(node,idx)
{var type=node.getAttribute("type");var name=node.getAttribute("name");switch(type)
{case"plugin":if(name!=null){var id=node.getAttribute("id");if(id==null){return true;}
this.loadPlugin(id);}
return true;}
return false;};c_profile_obj.prototype.save=function()
{dwconfig.save();var filename=configroot+"profiles/"+this.filename+".xml";var str=xml2str(this.m_cfgdom);if(!connected()){keytrap=true;return;}
var ret=puturl(filename,str);if(ret!=null){this.changed=0;}
else{alert("Error saving profile. DataWedge may not be running.");}
keytrap=true;};c_profile_obj.prototype.existingPathName=function(name)
{var node=selectNodes(this.m_cfgdom,"//Path[@id='"+name+"']");if(node.length>0){return true;}
node=selectNodes(this.m_cfgdom,"//Path[@name='"+name+"']");if(node.length>0){return true;}
return false;};c_profile_obj.prototype.refresh=function()
{var xpath,nodeList;xpath=this.m_xpathStack.getLastValue();if(xpath==null){keytrap=true;setTimeout("onSelect(666);",10)
return;}
if(xpath=="./DataPaths"){this.updateRouteList();}
nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.refresh();this.updateMenu(nodeList);keytrap=true;};c_profile_obj.prototype.addNodeToXpath=function(xpath,node)
{var xp=this.parent.addNodeToXpath.call(this,xpath,node);if(node.getAttribute("type")!="select"){var attrName,attrVal=null;;attrName="value";attrVal=node.getAttribute(attrName);if(attrVal!==null){xp+="[@"+attrName+"='"+attrVal+"']";}}
return xp;};c_profile_obj.prototype.doSendEnterHack=function()
{uglySendEnterHack=false;var node=selectNodes(this.m_prflcfgdom,"/DWProfileConfig/DataPaths/Path/Process/PlugIn[@id='PRFIXSUFIX']");if(node==null){uglySendEnterHack=true;return;}
if(node.length==0){uglySendEnterHack=true;}};function pathAttributes(id,name,enabled)
{this.id=id;this.name=name;this.enabled=enabled;}
function c_path_obj()
{this.id=null;this.name=null;this.enabled=null;this.m_pathdom=null;this.m_xmldom=null;this.m_config=null;this.m_xpathStack=new c_stack_obj();this.changed=0;}
c_path_obj.prototype=new c_base_obj();c_path_obj.prototype.constructor=c_path_obj;c_path_obj.prototype.parent=c_base_obj.prototype;c_path_obj.prototype.getIOList=function(type)
{var plist=dwconfigdfn.getPluginList(type);var cfgnode=selectNodes(this.m_cfgdom,"./"+type);var i=0;var val=plist[0].id;if(cfgnode!=null){if(cfgnode.length>0){var cl=cfgnode[0].childNodes.length;var chld=cfgnode[0].firstChild;var newchld;var vi=null,vI=null,pid;while(chld!=null){pid=chld.getAttribute("id");switch(chld.nodeName){case"PlugIn":if(pid!=null){vI=pid;}
break;case"Plugin":chld.parentNode.removeChild(chld);if(pid!=null){vi=pid;newchld=this.m_cfgdom.ownerDocument.createElement("PlugIn");newchld.setAttribute("id",pid);cfgnode[0].appendChild(newchld);}
break;}
chld=chld.nextSibling;}
if(vi!=null){val=vi;}
else if(vI!=null){val=vI;}
else{var plug=this.m_cfgdom.ownerDocument.createElement("PlugIn");plug.setAttribute("id",plist[0].id);plug.setAttribute("desc",plist[0].desc);cfgnode[0].appendChild(plug);}}}
for(i=0;i<plist.length;i++){if(plist[i].id==val){oid=i;break;}}
var xml="<PlugIn name=\"Plugin\" type=\"select\" oid=\""+oid+"\" value=\""+val+"\">";i=0;while(i<plist.length)
{xml+="<option id=\""+i+"\" name=\""+plist[i].desc+"\" value=\""+plist[i].id+"\"/>";i++;}
xml+="</PlugIn>";return xml;};c_path_obj.prototype.getProcList=function()
{var plist=dwconfigdfn.getPluginList("Process");var i=0;var xml="";var cfgnode,cfgnew,node,enabled,enval,txt;while(i<plist.length)
{cfgnew=false;cfgnode=selectNodes(this.m_cfgdom,".//PlugIn[@id='"+plist[i].id+"']");if(cfgnode==null){cfgnew=true;}
if(cfgnode.length==0){cfgnew=true;}
if(cfgnew){cfgnew=this.m_cfgdom.ownerDocument.createElement("PlugIn");cfgnew.setAttribute("id",plist[i].id);cfgnew.setAttribute("desc",plist[i].desc);node=selectNodes(this.m_cfgdom,"./Process");node[0].appendChild(cfgnew);}
cfgnode=selectNodes(this.m_cfgdom,".//PlugIn[@id='"+plist[i].id+"']");enval=null;enabled=selectNodes(cfgnode[0],"./Enabled");if(enabled!=null){if(enabled.length>0){if(enabled[0].childNodes.length>0){enval=enabled[0].firstChild.nodeValue;}}}
if(enval==null){enabled=null;enabled=this.m_cfgdom.ownerDocument.createElement("Enabled");enval=eval("c_"+plist[i].id.toLowerCase()+"_plugin.default_Enabled;");txt=this.m_cfgdom.ownerDocument.createTextNode(enval);enabled.appendChild(txt);cfgnode[0].appendChild(enabled);}
xml+="<PlugIn id=\""+plist[i].id+"\" name=\""+plist[i].desc+"\" desc=\""+plist[i].desc+"\" version=\""+plist[i].version+"\" type=\"plugin\">";xml+="<Enabled>"+enval+"</Enabled>";xml+="</PlugIn>";i++;}
return xml;};c_path_obj.prototype.getInputPid=function()
{var cfgnode=selectNodes(this.m_cfgdom,"./Input/PlugIn");return cfgnode[0].getAttribute("id");};c_path_obj.prototype.create=function()
{var cfgnode=selectNodes(this.m_cfgdom,".");this.id=cfgnode[0].getAttribute("id");this.name=cfgnode[0].getAttribute("name");if(this.name==null){this.name=this.id;}
this.enabled=1;var en=selectNodes(cfgnode[0],"Enabled");if(en!=null){if(en.length>0){this.enabled=en[0].firstChild.nodeValue;}
else{en=this.m_cfgdom.ownerDocument.createElement("Enabled");var txt=this.m_cfgdom.ownerDocument.createTextNode(this.enabled);en.appendChild(txt);cfgnode[0].appendChild(en);}}
var pr=selectNodes(cfgnode[0],"Input");if(pr!=null){if(pr.length==0){pr=this.m_cfgdom.ownerDocument.createElement("Input");cfgnode[0].appendChild(pr);}}
pr=selectNodes(cfgnode[0],"Process");if(pr!=null){if(pr.length==0){pr=this.m_cfgdom.ownerDocument.createElement("Process");cfgnode[0].appendChild(pr);}}
pr=selectNodes(cfgnode[0],"Output");if(pr!=null){if(pr.length==0){pr=this.m_cfgdom.ownerDocument.createElement("Output");cfgnode[0].appendChild(pr);}}
var input=this.getIOList("Input");var output=this.getIOList("Output");var process=this.getProcList();var xml="<?xml version=\"1.0\" encoding=\"utf-8\"?><DataPaths name=\"Routes\"><Path id=\""+this.id+"\" name=\""+this.name+"\" enabled=\""+this.enabled+"\"><Enabled type=\"bool\">"+this.enabled+"</Enabled><Input>"+input+"</Input><Process>"+process+"</Process><Output>"+output+"</Output><Rename/>";if(this.id!="Route0"){xml+="<Delete/>";}
xml+="</Path></DataPaths>";this.m_pathdom=loadXMLString(xml);this.m_xmldom=selectNodes(this.m_pathdom,"//Path")[0];};c_path_obj.prototype.load=function()
{this.create();if(this.m_redirect!=null){this.loadPlugin(this.m_redirect);return;}
var xpath=".";this.m_xpathStack.push(xpath);var nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.push(this.name);this.updateMenu(nodeList);};c_path_obj.prototype.loadPlugin=function(id)
{plugin=null;displayMessage("Loading plugin, please wait...");dwconfig.checkForUpdates();eval("plugin = new c_"+id.toLowerCase()+"_plugin();");var dfnNode=selectNodes(dwconfigdfn.m_xmldom,"//PlugIn[@id='"+id+"']");plugin.setDfnBase(dfnNode[0]);var cfgNode=selectNodes(this.m_cfgdom,".//PlugIn[@id='"+id+"']");plugin.setCfgBase(cfgNode[0]);plugin.setGuvnor(this);classStack.push("plugin");setTimeout("plugin.load('"+id.toLowerCase()+"');",10);};c_path_obj.prototype.handleOption=function(node,idx)
{var xpath=this.m_xpathStack.get2ndToLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().removeUid());var pid=node.parentNode.getAttribute("oid");if((pid>=this.menupage*8)&&(pid<this.menupage*8+9)){document.getElementById("img"+(pid-this.menupage*8)).innerHTML=this.m_blank;}
var val=node.getAttribute("value");var oid=node.getAttribute("id");document.getElementById("img"+(oid-this.menupage*8)).innerHTML=this.m_ticked;node.parentNode.getAttributeNode("value").nodeValue=val;node.parentNode.getAttributeNode("oid").nodeValue=oid;if(node.parentNode.nodeName=="PlugIn"){cfgnode[0].setAttribute("id",val);var desc=dwconfigdfn.getPluginDescById(val);cfgnode[0].setAttribute("desc",desc);}
else{if(cfgnode[0].childNodes.length==0){var tnode=cfgnode[0].ownerDocument.createTextNode(val);cfgnode[0].appendChild(tnode);}
else{cfgnode[0].firstChild.nodeValue=val;}}
this.changed++;this.m_xpathStack.pop();return true;};c_path_obj.prototype.handleDelete=function(node,idx)
{this.m_xpathStack.pop();if(confirm("Are you sure you want to delete this?")){if(node.parentNode.nodeName=="Path")
{this.m_guvnor.deletePath(this.id);keytrap=true;setTimeout("onSelect(666);",20);return true;}}
this.refresh();return true;};c_path_obj.prototype.handleUnknownType=function(node,idx)
{var type=node.getAttribute("type");var name=node.getAttribute("name");switch(type)
{case"plugin":if(name!=null){var id=node.getAttribute("id");if(id==null){return true;}
this.loadPlugin(id);}
return true;}
return false;};c_path_obj.prototype.checkRename=function(value,id)
{var name=value.trim();if(name.length==0)
{alert("Invalid entry.  Please try adding some characters.");return false;}
var chk=false,dup=true;var errmsg=" contains invalid characters!";chk=name.validProfilename();if(chk){dup=this.m_guvnor.existingPathName(name);}
if(!chk){alert(name+errmsg);}
else{if(dup){alert(name+" is already taken!");return false;}
this.name=name;locationbar.setLastValue(name);var node=selectNodes(this.m_cfgdom,".");node[0].setAttribute("name",name);var xpath=this.m_xpathStack.get2ndToLastValue();var xmlnode=selectNodes(this.m_xmldom,xpath);if(xmlnode.length>0){xmlnode[0].setAttribute("name",name);}
this.changed++;return true;}
return false;};c_path_obj.prototype.updateProcessList=function()
{var xpath,nodeList;xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");var len=nodeList.length;var i=0;var enode,cfgnode,val,pid;while(i<len){enode=selectNodes(nodeList[i],"Enabled");if(enode!=null){if(enode.length>0){pid=nodeList[i].getAttribute("id");if(pid!=null){cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().removeUid()+"/PlugIn[@id='"+pid+"']/Enabled");if(cfgnode!=null){if(cfgnode.length>0){val=cfgnode[0].firstChild.nodeValue;enode[0].firstChild.nodeValue=val;}}}}}
i++;}};c_path_obj.prototype.refresh=function()
{var xpath,nodeList;xpath=this.m_xpathStack.getLastValue();if(xpath==null){keytrap=true;setTimeout("onSelect(666);",10)
return;}
if(xpath.indexOf("Process")>0){this.updateProcessList();}
nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.refresh();this.updateMenu(nodeList);keytrap=true;};function isIEMobile()
{if(navigator.userAgent.indexOf("IEMobile")>=0){return true;}
if(navigator.userAgent.indexOf("Phone")>=0){return true;}
return false;}
var charsize=[4,4,6,10,8,14,8.1,3,5,5,8,10,4,5,4,5,8,8,8,8,8,8,8,8,8,8,5,5,9,10,10,7,13,8,8,9,10,8,7,9,9,4,6,8,7,10,9,10,8,10,9,8,8,9,8,14,8,8,8,5,5,5,10,8,8,7,8,7,8,7,4,8,8,2,4,7,2,12,8,8,8,8,5,6,5,8,8,10,8,8,6,7,5,7,10,14];function getStringWidth(txt)
{var i,idx,width=0;for(i=0;i<txt.length;i++)
{idx=txt.charCodeAt(i);if(idx<32||idx>128){width+=8;}
else{width+=charsize[idx-32];}}
return width;}
String.prototype.fitToWidth=function(px)
{var i,idx,width,sum=0;var str=unescape(this);for(i=0;i<str.length;i++)
{idx=str.charCodeAt(i);if(idx<32||idx>128){width=8;}
else{width=charsize[idx-32];}
if(sum+width>px){return this.substring(0,i-1)+"..";}
sum+=width;}
return this;};function rowWidth(percent)
{if(isIEMobile()){return((screen.width-17)*40/57)*percent;}
if(document.all){return(document.body.clientWidth*percent)-16;}
else{return(window.innerWidth*percent)-16;}}
String.prototype.validString=function()
{return true;var re=/^[A-Za-z0-9!£\(\)_~ \-\.\\\;\,\/\[\]]+$/;return re.test(this);};String.prototype.validProfilename=function()
{var re=/^[A-Za-z0-9!£\(\)_~ \-]+$/;return re.test(this);}
String.prototype.validFilename=function()
{var re=/^[A-Za-z0-9!£\(\)_~ \-\.\\]+$/;return re.test(this);}
String.prototype.validInteger=function()
{var re=/^[+-]?[0-9]+$/;return re.test(this);}
String.prototype.consecutiveDots=function()
{var re=/\.{2,}/;return re.test(this);}
String.prototype.trim=function()
{return this.replace(/^[\s\s]*/,'').replace(/[\s\s]*$/,'');};String.prototype.hardspace=function()
{if(this.length===0){return"&nbsp;";}
else{return this.replace(/ /g,'&nbsp;');}};String.prototype.convertUid=function()
{var str=this;var strt=str.indexOf("[@uid=",0);if(strt>0)
{var q1=str.indexOf("'",strt)+1;var q2=str.indexOf("'",q1);var uid=str.substr(q1,q2-q1);var nuid=parseInt(uid,10)+1;str=str.replace("@uid='"+uid+"'",nuid);}
return str;};String.prototype.removeUid=function()
{var str=this;var sb1=str.indexOf("[@uid=",0);if(sb1>0)
{var sb2=str.indexOf("]",sb1)+1;str=str.substr(0,sb1)+str.substr(sb2);}
return str;};String.prototype.removePid=function()
{var str=this;var sb1=str.indexOf("[@pid=",0);if(sb1>0)
{var sb2=str.indexOf("]",sb1)+1;str=str.substr(0,sb1)+str.substr(sb2);}
return str;};String.prototype.removeAttributes=function()
{var str=this;var sb1=str.indexOf("[@",0);var sb2;while(sb1>0){sb2=str.indexOf("]",sb1)+1;str=str.substr(0,sb1)+str.substr(sb2);sb1=str.indexOf("[@",0);}
return str;};String.prototype.enclt=function()
{return this.replace(/</g,'&lt;');};String.prototype.dwencode=function()
{var str=this;return str;};String.prototype.dwdecode=function()
{var str=this;str=str.replace(/&lt;/gi,"<");str=str.replace(/&gt;/gi,">");str=str.replace(/&amp;/gi,"&");return str;};function navigatorProperties()
{var txt="appCodeName = "+navigator.appCodeName;txt+="\r\nappMinorVersion = "+navigator.appMinorVersion;txt+="\r\nappName = "+navigator.appName;txt+="\r\nappVersion = "+navigator.appVersion;txt+="\r\ncookieEnabled = "+navigator.cookieEnabled;txt+="\r\ncpuClass = "+navigator.cpuClass;txt+="\r\nonLine = "+navigator.onLine;txt+="\r\nplatform = "+navigator.platform;txt+="\r\nuserAgent = "+navigator.userAgent;txt+="\r\nbrowserLanguage = "+navigator.browserLanguage;txt+="\r\nsystemLanguage = "+navigator.systemLanguage;txt+="\r\nuserLanguage = "+navigator.userLanguage;return txt;}
function displayMessage(txt)
{var html;html="<br/><br/><p align='center'>"+txt+"</p>";document.getElementById("centerpanel").innerHTML=html;}
var BrowserDetect={init:function(){this.browser=this.searchString(this.dataBrowser)||"An unknown browser";this.version=this.searchVersion(navigator.userAgent)||this.searchVersion(navigator.appVersion)||"an unknown version";this.OS=this.searchString(this.dataOS)||"an unknown OS";},searchString:function(data){for(var i=0;i<data.length;i++){var dataString=data[i].string;var dataProp=data[i].prop;this.versionSearchString=data[i].versionSearch||data[i].identity;if(dataString){if(dataString.indexOf(data[i].subString)!=-1)
return data[i].identity;}
else if(dataProp)
return data[i].identity;}},searchVersion:function(dataString){var index=dataString.indexOf(this.versionSearchString);if(index==-1)return;return parseFloat(dataString.substring(index+this.versionSearchString.length+1));},dataBrowser:[{string:navigator.userAgent,subString:"IEMobile",identity:"IEMobile"},{string:navigator.userAgent,subString:"MSIE",identity:"Explorer",versionSearch:"MSIE"},{string:navigator.userAgent,subString:"Chrome",identity:"Chrome"},{string:navigator.userAgent,subString:"OmniWeb",versionSearch:"OmniWeb/",identity:"OmniWeb"},{string:navigator.vendor,subString:"Apple",identity:"Safari",versionSearch:"Version"},{prop:window.opera,identity:"Opera"},{string:navigator.vendor,subString:"iCab",identity:"iCab"},{string:navigator.vendor,subString:"KDE",identity:"Konqueror"},{string:navigator.userAgent,subString:"Firefox",identity:"Firefox"},{string:navigator.vendor,subString:"Camino",identity:"Camino"},{string:navigator.userAgent,subString:"Netscape",identity:"Netscape"},{string:navigator.userAgent,subString:"Gecko",identity:"Mozilla",versionSearch:"rv"},{string:navigator.userAgent,subString:"Mozilla",identity:"Netscape",versionSearch:"Mozilla"}],dataOS:[{string:navigator.platform,subString:"Win",identity:"Windows"},{string:navigator.platform,subString:"Mac",identity:"Mac"},{string:navigator.userAgent,subString:"iPhone",identity:"iPhone/iPod"},{string:navigator.platform,subString:"Linux",identity:"Linux"}]};BrowserDetect.init();function screenWidth()
{var width;if(document.body.clientWidth){width=document.body.clientWidth;}
else if(window.innerWidth){width=window.innerWidth;}
else{alert("screen.width");width=screen.width;}
return width;}
function c_menubody_obj()
{this.m_html=[];}
c_menubody_obj.screenwidth="";c_menubody_obj.prototype.getScreenWidth=function()
{var scrnwdth=" style='width:100%;'";if(isIEMobile()){var w=parseInt(screen.width)-16;if(w>320){w=w-13;}
scrnwdth=" style='width:"+w+"px;'";}
return scrnwdth;};c_menubody_obj.prototype.clear=function()
{this.m_html=[];this.screenwidth=this.getScreenWidth();document.getElementById("centerpanel").innerHTML="";};c_menubody_obj.prototype.add=function(func,img,sc,txt1,txt2)
{this.add_v2(func,img,sc,txt1,txt2);};c_menubody_obj.prototype.add_v1=function(func,img,sc,txt1,txt2)
{var len=this.m_html.length;var c1="c1";txt1=txt1.fitToWidth(rowWidth(0.60)).hardspace();if(txt2.length>0){if(txt2!="&nbsp;"){txt2=txt2.fitToWidth(rowWidth(0.25)).hardspace().enclt();}}
else{txt2="&nbsp;";}
this.m_html.push("<ul class='r"+len%2+"'"+this.screenwidth+"><li id='img"+len+"' class='"+c1+"'>"+img+"</li><li id='c2' class='c2'>"+sc+"</li><li id='c3' class='c3'><a name='' onclick='"+func+"'>"+txt1+"</a></li><li id='c4' class='c4'>"+txt2+"</li></ul>");};c_menubody_obj.prototype.add_v2=function(func,img,sc,txt1,txt2)
{var len=this.m_html.length;var c1="c1";var sub="";this.m_html.push("<div class='es' onclick='"+func+"'><div><span id='img"+len+"' class='c1'>"+img+"</span><span class='c2'>&nbsp;"+sc+"&nbsp;</span><span class='c3'><a name='#' onclick='"+func+"'>"+txt1+"</a></span><span class='c4'> "+sub+"</span></div><div id='value'><span class='c1'>&nbsp;&nbsp;&nbsp;</span><span class='c2'>&nbsp;</span><a name='' onclick='"+func+"'>"+txt2+"</a></div></div>");};c_menubody_obj.prototype.html=function()
{var i,htm="";var len=this.m_html.length;for(i=0;i<len;i++)
{htm=this.m_html.pop()+htm;}
delete this.m_html;return htm;};c_menubody_obj.prototype.refresh=function()
{document.getElementById("centerpanel").innerHTML=this.html();};menubody=new c_menubody_obj();function c_locationbar_obj()
{this.m_location=[];this.lock=false;}
locationbar=new c_locationbar_obj();c_locationbar_obj.prototype.push=function(txt)
{this.m_location.push(txt);this.refresh();};c_locationbar_obj.prototype.pop=function()
{this.m_location.pop();this.refresh();};c_locationbar_obj.prototype.refresh=function()
{this.refreshES2();};c_locationbar_obj.prototype.refreshOLD=function()
{var i=0;var sw=menubody.getScreenWidth();var html="<span "+sw+">DataWedge";while(i<this.m_location.length)
{if(i>0){html+=" | ";}
else{html+=": ";}
html+="<a href='#' onclick='locationbar.onSelect("+i+");'>"+this.m_location[i]+"</a>";i++;}
if(arguments.length>0){html+=" | "+arguments[0];}
html+="</span>";document.getElementById("toppanel").innerHTML=html;};c_locationbar_obj.prototype.refreshES=function()
{var i=0;var sw=menubody.getScreenWidth();var html="<div id='navbar'><ul>";if(this.m_location.length>1)
{html+="<li class='left' onclick='onSelect(666);'><a href='#' onclick='onSelect(666);'>Back</a></li>";}
else
{html+="<li class='left'>&nbsp;</li>";}
html+="<li class='sep'>&lt;</li>";var txt=this.m_location[this.m_location.length-1];var stxt=txt.split(" ");var lines=2;switch(stxt.length)
{case 1:txt=stxt[0];lines=1;break;case 2:txt=stxt[0]+"</br>"+stxt[1];break;case 3:txt=stxt[0]+" "+stxt[1]+"</br>"+stxt[2];break;case 4:txt=stxt[0]+" "+stxt[1]+"</br>"+stxt[2]+" "+stxt[3];break;case 5:txt=stxt[0]+" "+stxt[1]+"</br>"+stxt[2]+" "+stxt[3]+"</br>"+stxt[4];lines=3;break;case 6:txt=stxt[0]+" "+stxt[1]+"</br>"+stxt[2]+" "+stxt[3]+"</br>"+stxt[4]+" "+stxt[5];lines=3;break;}
switch(lines)
{case 1:html+="<li class='center'>"+txt+"</li>";break;case 2:html+="<li class='center' style='line-height: 15pt; font-size: 9pt; font-weight: bold;'>"+txt+"</li>";break;case 3:html+="<li class='center' style='line-height: 10pt; font-size: 9pt; font-weight: bold;'>"+txt+"</li>";}
html+="<li class='sep'>&gt;</li>";html+="<li class='right' onclick='locationbar.onSelect(0);'><a href='#' onclick='locationbar.onSelect(0);'>Home</a></li>";html+="</ul></div>";document.getElementById("toppanel").innerHTML=html;};c_locationbar_obj.prototype.refreshES2=function()
{var tick=getTick();var i=0;var sw=menubody.getScreenWidth();var html="<div id='navdiv'>";if(this.m_location.length>1)
{html+="<div class='itm' id='itm1' onclick='onSelect(666, "+tick+");'>";html+="<div id='sep_spacer'>&nbsp;</div>";html+="<div class='content'><a href='#' onclick='onSelect(666, "+tick+");'>Back</a></div>";html+="</div>";}
else
{html+="<div class='itm' id='itm1'>";html+="<div id='sep_spacer'>&nbsp;</div>";html+="</div>";}
html+="<div class='itm' id='sep'><div id='sep_spacer'>&nbsp;</div><div class='content'>&lt;</div></div>";var txt=this.m_location[this.m_location.length-1];var stxt=txt.split(" ");var lines=2;html+="<div class='itm' id='itm2'>";switch(stxt.length)
{case 1:html+="<div id='sep_spacer'>&nbsp;</div><div class='content'>"+stxt[0]+"</div>";lines=1;break;case 2:html+="<div class='content'>"+stxt[0]+"</div><div class='content'>"+stxt[1]+"</div>";break;case 3:html+="<div class='content'>"+stxt[0]+" "+stxt[1]+"</div><div class='content'>"+stxt[2]+"</div>";break;case 4:html+="<div class='content'>"+stxt[0]+" "+stxt[1]+"</div><div class='content'>"+stxt[2]+" "+stxt[3]+"</div>";break;case 5:html+="<div class='content'>"+txt+"</div>";lines=3;break;case 6:html+="<div class='content'>"+txt+"</div>";lines=3;break;}
html+="</div>";html+="<div class='itm' id='sep'><div id='sep_spacer'>&nbsp;</div><div class='content'>&gt;</div></div>";html+="<div class='itm' id='itm3' onclick='locationbar.onSelect(0, "+tick+");'>";html+="<div id='sep_spacer'>&nbsp;</div>";html+="<div class='content'><a href='#' onclick='locationbar.onSelect(0, "+tick+");'>Home</a></div>";html+="</div>";html+="</div>";document.getElementById("toppanel").innerHTML=html;};c_locationbar_obj.prototype.willFit=function(str,width)
{return true;var browseWidth=null,browseHeight=null;if(!document.all||(document.getElementById&&!document.all))
{browseWidth=window.outerWidth;browseHeight=window.outerHeight;}
else if(document.all)
{browseWidth=document.body.clientWidth;browseHeight=document.body.clientHeight;}
var ret=true;var w;if(browseWidth==null)
w=screen.width;else
w=browseWidth;var pwidth=parseInt(w)*width/100;var c=pwidth/7;if(str.length>c)
{ret=false;}
return ret;};c_locationbar_obj.prototype.getLastValue=function()
{return this.m_location[this.m_location.length-1];};c_locationbar_obj.prototype.setLastValue=function(val)
{this.m_location[this.m_location.length-1]=val;};c_locationbar_obj.prototype.onSelect=function(idx,tick)
{if(arguments.length>1){if(arguments[1]==lastTime){setTimeout("lastTime = 0;",100);return;}
lastTime=arguments[1];}
if(!keytrap)return;if(redact)return;if(this.lock)return;this.lock=true;var cls=classStack.getLastValue();eval(cls+".menupage = 0;");if((idx+1)==this.m_location.length){eval(cls+".refresh();");}
else{while((idx+2)<this.m_location.length)
{onSelect(777);}
if((idx+1)<this.m_location.length){onSelect(666);}}
this.lock=false;};function c_statusbar_obj()
{}
statusbar=new c_statusbar_obj();c_statusbar_obj.prototype.isEmpty=function()
{var txt=document.getElementById("bottompanel").innerHTML;return(txt.length==0);};c_statusbar_obj.prototype.show=function(txt)
{document.getElementById("bottompanel").innerHTML=txt;};c_statusbar_obj.prototype.hide=function()
{document.getElementById("bottompanel").innerHTML="";};function c_dwui_obj()
{this.m_xmldom=null;this.m_xpathStack=new c_stack_obj();this.dwuiView=1;this.cloneProfileName=null;}
c_dwui_obj.prototype=new c_base_obj();c_dwui_obj.prototype.constructor=c_dwui_obj;c_dwui_obj.prototype.parent=c_base_obj.prototype;var dwui=new c_dwui_obj();c_dwui_obj.prototype.viewType={basic:0,advanced:1};c_dwui_obj.prototype.load=function()
{if(location.href.indexOf("?mode=basic")>0){this.dwuiView=this.viewType.basic;}
else if(location.href.indexOf("?mode=advanced")>0){this.dwuiView=this.viewType.advanced;}
var url=htmlroot+"dwui.xml";var xml=geturl(url);if(xml!==null){if(xml.length>0)
{this.m_xmldom=loadXMLString(xml);this.addVersionInfo();this.addBrowserInfo();this.addUIBuildInfo();this.refreshProfileList();var xpath;if(this.dwuiView===this.viewType.basic)
{xpath="/DWUI/Basic";locationbar.push("Basic (Profile0)");}
else
{xpath="/DWUI/Advanced";locationbar.push("Advanced");}
this.m_xpathStack.push(xpath);this.menupageStack.push(this.menupage);var l_nodeList=selectNodes(this.m_xmldom,xpath+"/*");this.updateMenu(l_nodeList);}}};c_dwui_obj.prototype.addUIBuildInfo=function()
{if(typeof(dwui_buildnumber)=="undefined")return;var node=selectNodes(this.m_xmldom,"/DWUI/Advanced/About/UIBuild");if(node!=null){if(node.length>0){node[0].setAttribute("name","UI Build "+dwui_buildnumber);}}};c_dwui_obj.prototype.addBrowserInfo=function()
{var node=selectNodes(this.m_xmldom,"/DWUI/Advanced/About/Browser");BrowserDetect.init();node[0].setAttribute("name",BrowserDetect.browser+" "+BrowserDetect.version);};c_dwui_obj.prototype.addVersionInfo=function()
{var node=selectNodes(this.m_xmldom,"/DWUI/Advanced/About/Version");node[0].setAttribute("name","v"+dwconfigdfn.getDWVersion());node=selectNodes(this.m_xmldom,"/DWUI/Advanced/About");var el,tn;el=this.m_xmldom.createElement("Blank");el.setAttribute("name","");node[0].appendChild(el);var i=0;while(i<dwconfigdfn.pluginList.length)
{el=this.m_xmldom.createElement("Version");el.setAttribute("name",dwconfigdfn.pluginList[i].desc);tn=this.m_xmldom.createTextNode(dwconfigdfn.pluginList[i].version);el.appendChild(tn);node[0].appendChild(el);i++;}};c_dwui_obj.prototype.refreshProfileList=function()
{var pn=selectNodes(this.m_xmldom,"/DWUI/Advanced/Profiles");if(pn.length===0){return;}
var chld=pn[0].firstChild;while(chld!=null)
{pn[0].removeChild(chld);chld=pn[0].firstChild;}
var prfl;var prfl;var prflAttr=dwconfig.getFirstProfile();while(prflAttr!==null)
{prfl=this.m_xmldom.createElement("Profile");prfl.setAttribute("enabled",prflAttr.enabled);prfl.setAttribute("name",prflAttr.name);prfl.setAttribute("filename",prflAttr.filename);pn[0].appendChild(prfl);prflAttr=dwconfig.getNextProfile();}
var newel=this.m_xmldom.createElement("Profile");newel.setAttribute("name","Add new");newel.setAttribute("type","add");pn[0].appendChild(newel);newel=this.m_xmldom.createElement("ProfileClone");newel.setAttribute("name","Clone");pn[0].appendChild(newel);};c_dwui_obj.prototype.addProfilesToClone=function(node)
{var chld=node.firstChild;while(chld!=null)
{node.removeChild(chld);chld=node.firstChild;}
var prfl;var prflAttr=dwconfig.getFirstProfile();while(prflAttr!==null)
{prfl=this.m_xmldom.createElement("clone");prfl.setAttribute("name",prflAttr.name);prfl.setAttribute("filename",prflAttr.filename);node.appendChild(prfl);prflAttr=dwconfig.getNextProfile();}};c_dwui_obj.prototype.refresh=function()
{if(locationbar.getLastValue()=="Profiles"){this.refreshProfileList();}
c_base_obj.prototype.refresh.call(this);};c_dwui_obj.prototype.editDone=function(id)
{if(id=="clone"){locationbar.pop();}
this.parent.editDone.call(this,id);};c_dwui_obj.prototype.createNewProfile=function(value,id)
{redact=false;if(connected()){var pflAttr;var cloneFilename=null;if(id=="clone"){pflAttr=dwconfig.getProfileByName(this.cloneProfileName);cloneFilename=pflAttr.filename;}
dwconfig.addProfile(value,value,"0","1");pflAttr=new profileAttributes(value,value,"0","1");this.refreshProfileList();profile=null;profile=new c_profile_obj(pflAttr);profile.name=value;profile.filename=value;profile.cloneFilename=cloneFilename;profile.m_dfndom=dwconfigdfn.m_xmldom;classStack.push("profile");displayMessage("Loading profile, please wait...");setTimeout("profile.load();",10);}}
c_dwui_obj.prototype.checkUnknown=function(value,id)
{switch(id)
{case"clone":locationbar.pop();case"Profile":value=value.trim();if(value.length==0){alert("Invalid entry.  Please try adding some characters.");}
else{if(value.length>MAX_PROFILENAME){alert("Profile name is too long, please shorten.");}
else{if((value.toLowerCase()=="default")||(value.toLowerCase()=="profile0")){alert(value+" is reserved.  Please try another.");}
else{var ret=value.validProfilename();if(!ret){alert(value+" contains invalid characters!");}
else{ret=dwconfig.existingProfileName(value);if(ret){alert(value+" is already taken!");}
else
{setTimeout("dwui.createNewProfile('"+value+"', '"+id+"');",20);}}}}}
break;}
return false;};c_dwui_obj.prototype.close=function()
{if(isIEMobile()){geturl("/dwui/index.html?kill=foregroundwindow");}
else{window.close();}};c_dwui_obj.prototype.onBack=function(idx)
{if(this.menupage>0)
{this.menupage--;if(idx!==777){this.refresh();}
keytrap=true;return true;}
var xpath,ret;var nodeList;if(this.changed>0)
{xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");if(nodeList[0].parentNode.nodeName=="Settings")
{ret=confirm("Save changes to Settings?");if(ret){this.saveSettings();}}}
if(this.m_xpathStack.length()>1)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();xpath=this.m_xpathStack.getLastValue();nodeList=selectNodes(this.m_xmldom,xpath+"/*");locationbar.pop();this.updateMenu(nodeList);}
else{ret=confirm("Are you sure you want to exit?");if(ret){this.close();}}
keytrap=true;return true;};c_dwui_obj.prototype.handleAddNew=function(node,idx)
{this.editBox(name,"New profile name:",dwconfig.getNewProfileName(),"dwui",node.nodeName);return true;};c_dwui_obj.prototype.handleRedirect=function(node,idx)
{var prfl=node.firstChild.getAttribute("profile");var plug=node.firstChild.getAttribute("plugin");var xpth=node.firstChild.getAttribute("xpath");var name=node.getAttribute("name");if(prfl==null){this.m_xpathStack.pop();this.m_xpathStack.push(xpth);if(name==null){name=node.nodeName;}
locationbar.push(name);this.refresh();return true;}
profile=null;profile=new c_profile_obj(dwconfig.getProfileByName("Profile0"));classStack.push("profile");profile.m_dfndom=dwconfigdfn.m_xmldom;profile.setRedirect(plug);displayMessage("Loading profile, please wait...");setTimeout("profile.load();",10);return true;};c_dwui_obj.prototype.loadProfile=function(name)
{profile=null;displayMessage("Loading profile, please wait...");dwconfig.checkForUpdates();profile=new c_profile_obj(dwconfig.getProfileByName(name));classStack.push("profile");profile.m_dfndom=dwconfigdfn.m_xmldom;setTimeout("profile.load();",10);};c_dwui_obj.prototype.loadSettings=function()
{settings=null;displayMessage("Loading settings, please wait...");settings=new c_settings_obj();var cfgNode=selectNodes(dwconfig.m_xmldom,"/DWConfig");settings.setCfgBase(cfgNode[0]);var xmlNode=selectNodes(this.m_xmldom,"/DWUI/Advanced/Settings");settings.setXmlBase(xmlNode[0]);classStack.push("settings");setTimeout("settings.load();",10);};c_dwui_obj.prototype.handleUnknownNodeName=function(node,idx)
{switch(node.nodeName)
{case"Profiles":this.refreshProfileList();break;case"Profile":if(!connected())return false;var type=node.getAttribute("type");var name=node.getAttribute("name");if(type=="add"){this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();}
else{this.loadProfile(name);}
return true;break;case"ProfileClone":this.addProfilesToClone(node);break;case"clone":this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();var name=node.getAttribute("name");this.cloneProfileName=name;this.editBox(name,"Clone profile name:",dwconfig.getNewProfileName(),"dwui",node.nodeName);return true;break;case"Settings":this.loadSettings();return true;break;default:}
return false;};c_dwui_obj.prototype.updateNodeListValues=function(xpath,nodeList)
{return;};function c_settings_obj()
{this.m_xmldom=null;this.m_dfndom=null;this.m_cfgdom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;}
c_settings_obj.prototype=new c_base_obj();c_settings_obj.prototype.constructor=c_settings_obj;c_settings_obj.prototype.parent=c_base_obj.prototype;c_settings_obj.prototype.setOption=function(node,value)
{var i=0;var chld=node.firstChild;while(chld!=null)
{if(chld.getAttribute("value")==value)
{node.setAttribute("oid",chld.getAttribute("id"));break;}
chld=chld.nextSibling;}};c_settings_obj.prototype.refreshActiveProfileNode=function()
{var node=selectNodes(this.m_xmldom,"./ActiveProfile");if(node.length===0){return;}
var i;var chld=node[0].firstChild;while(chld!=null)
{node[0].removeChild(chld);chld=node[0].firstChild;}
var prfl;var prflAttr=dwconfig.getFirstProfile();i=0;while(prflAttr!==null)
{prfl=this.m_xmldom.ownerDocument.createElement("option");prfl.setAttribute("id",i);prfl.setAttribute("name",prflAttr.name);prfl.setAttribute("value",prflAttr.name);node[0].appendChild(prfl);if(this.changed==0){if(prflAttr.active=="1"){node[0].setAttribute("oid",i);node[0].setAttribute("value",prflAttr.name);}}
prflAttr=dwconfig.getNextProfile();i++;}};c_settings_obj.prototype.refreshAutoStartNode=function()
{var node=selectNodes(this.m_xmldom,"./DesktopAutoStart/Enabled");node[0].firstChild.nodeValue=dwconfig.getAutoStartEnabled();};c_settings_obj.prototype.getSettings=function()
{var node=selectNodes(this.m_xmldom,"./AutoProfileSwitching");this.setOption(node[0],dwconfig.getAutoProfileSwitching());node=selectNodes(this.m_xmldom,"./Log/LogSize");this.setOption(node[0],dwconfig.getLogSize());node=selectNodes(this.m_xmldom,"./Log/LogPath");node[0].firstChild.nodeValue=dwconfig.getLogPath();node=selectNodes(this.m_xmldom,"./Log/TempPath");node[0].firstChild.nodeValue=dwconfig.getTempPath();node=selectNodes(this.m_xmldom,"./Log/LogLevel");this.setOption(node[0],dwconfig.getLogLevel());node=selectNodes(this.m_xmldom,"./DesktopAutoStart/Enabled");node[0].firstChild.nodeValue=dwconfig.getAutoStartEnabled();node=selectNodes(this.m_xmldom,"./DesktopAutoStart/AutoStartApp");var val=dwconfig.getAutoStartApp();if(val!=null){node[0].setAttribute("value",val);node[0].setAttribute("name",val);}
this.changed=0;};c_settings_obj.prototype.saveSettings=function()
{if(!connected()){return;}
var node=selectNodes(this.m_xmldom,"./AutoProfileSwitching");dwconfig.setAutoProfileSwitching(node[0].getAttribute("value"));node=selectNodes(this.m_xmldom,"./ActiveProfile");dwconfig.setActiveProfile(node[0].getAttribute("value"));node=selectNodes(this.m_xmldom,"./Log/LogSize");dwconfig.setLogSize(node[0].getAttribute("value"));node=selectNodes(this.m_xmldom,"./Log/LogPath");dwconfig.setLogPath(node[0].firstChild.nodeValue);node=selectNodes(this.m_xmldom,"./Log/TempPath");dwconfig.setTempPath(node[0].firstChild.nodeValue);node=selectNodes(this.m_xmldom,"./Log/LogLevel");dwconfig.setLogLevel(node[0].getAttribute("value"));node=selectNodes(this.m_xmldom,"./DesktopAutoStart/Enabled");dwconfig.setAutoStartEnabled(node[0].firstChild.nodeValue);node=selectNodes(this.m_xmldom,"./DesktopAutoStart/AutoStartApp");dwconfig.setAutoStartEnabled(node[0].getAttribute("value"));if(!dwconfig.save()){alert("Error writing configuration.  DataWedge may not be running.  This window will now close.");this.close();}
this.changed=0;};c_settings_obj.prototype.load=function()
{this.refreshActiveProfileNode();this.refreshAutoStartNode();this.show();};c_settings_obj.prototype.handleEdit=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.editBox(name,"Autostart Application (.exe) name:",node.parentNode.getAttribute("value"),"settings",node.parentNode.nodeName);return true;};c_settings_obj.prototype.handleFile=function(node,idx)
{var name=node.getAttribute("name");this.editBox(null,name,node.firstChild.nodeValue,"settings","file");return true;};c_settings_obj.prototype.handleRestore=function(node,idx)
{this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();ret=confirm("This will delete all your profiles and settings and restore DataWedge back to its default configuration.\r\n\r\nNote: DataWedge must be in the Running state for the default configuration to be restored correctly.\r\n\r\nOK to proceed?");if(ret){displayMessage("Restoring defaults, please wait...");dwconfig.resetToDefault();setTimeout("location.reload();",1000);}
return true;};c_settings_obj.prototype.handleOption=function(node,idx)
{var xpath=this.m_xpathStack.get2ndToLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath);var pid=node.parentNode.getAttribute("oid");if((pid>=this.menupage*8)&&(pid<this.menupage*8+9)){document.getElementById("img"+(pid-this.menupage*8)).innerHTML=this.m_blank;}
var val=node.getAttribute("value");var oid=node.getAttribute("id");document.getElementById("img"+(oid-this.menupage*8)).innerHTML=this.m_ticked;node.parentNode.getAttributeNode("value").nodeValue=val;node.parentNode.getAttributeNode("oid").nodeValue=oid;if(node.parentNode.nodeName=="ActiveProfile"){dwconfig.setActiveProfile(val);}
else if(cfgnode[0].childNodes.length==0){var tnode=cfgnode[0].ownerDocument.createTextNode(val);cfgnode[0].appendChild(tnode);}
else{cfgnode[0].firstChild.nodeValue=val;}
this.changed++;this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();return true;};c_settings_obj.prototype.updateNodeValues0=function(xmlNode,cfgNode)
{var xid=xmlNode.getAttribute("id");var val=xmlNode.getAttribute("value");if(val==null){if(xmlNode.childNodes.length==0){return;}
val=xmlNode.firstChild.nodeValue;if(val==null){return;}}
if(cfgNode.childNodes.length==0){tnode=cfgNode.ownerDocument.createTextNode(val);cfgNode.appendChild(tnode);}
var value=cfgNode.firstChild.nodeValue;var type=xmlNode.getAttribute("type");switch(type)
{case"select":var val,id;xmlNode.setAttribute("value",value);var chld=xmlNode.firstChild;while(chld!=null)
{val=chld.getAttribute("value");if(val==value){id=chld.getAttribute("id");xmlNode.setAttribute("oid",id);break;}
chld=chld.nextSibling;}
break;default:xmlNode.firstChild.nodeValue=value;}};c_settings_obj.prototype.skipConfigNode=function(node)
{switch(node.nodeName){case"option":case"Edit":case"ActiveProfile":case"Restore":return true;default:}
return false;};c_settings_obj.prototype.updateNodeListValues0=function(xpath,nodeList)
{var xpth=xpath;var i=0;var len=nodeList.length;var xmlNode,cfgNode,nname,node,type,tnode;for(i=0;i<len;i++)
{xmlNode=nodeList[i];if(xmlNode.nodeType==3){continue;}
xid=xmlNode.getAttribute("id");if(xid==null){cfgNode=selectNodes(this.m_cfgdom,xpth+"/"+xmlNode.nodeName);}
else{cfgNode=selectNodes(this.m_cfgdom,xpth+"/"+xmlNode.nodeName+"[@id='"+xid+"']");}
var crnew=false;if(cfgNode==null){crnew=true;}
else if(cfgNode.length==0){crnew=true;}
if(crnew){nname=xmlNode.nodeName;switch(nname){case"option":case"Edit":case"ActiveProfile":case"Restore":return;}
cfgNode=selectNodes(this.m_cfgdom,xpth);node=cfgNode[0].ownerDocument.createElement(nname);if(xid!=null){node.setAttribute("id",xid);}
cfgNode[0].appendChild(node);if(xid==null){cfgNode=selectNodes(this.m_cfgdom,xpth+"/"+xmlNode.nodeName);}
else{cfgNode=selectNodes(this.m_cfgdom,xpth+"/"+xmlNode.nodeName+"[@id='"+xid+"']");}}
this.updateNodeValues(xmlNode,cfgNode[0]);}};c_settings_obj.prototype.setAutostartApp=function(name)
{var xpth="./DesktopAutoStart/AutoStartApp";var xmlnode=selectNodes(this.m_xmldom,xpth);var cfgnode=selectNodes(this.m_cfgdom,xpth);if(xmlnode.length>0){xmlnode[0].setAttribute("name",name);xmlnode[0].setAttribute("value",name);}
if(cfgnode!=null){if(cfgnode.length>0){if(cfgnode[0].childNodes.length>0){cfgnode[0].firstChild.nodeValue=name;}
else{var tnode=cfgnode[0].ownerDocument.createTextNode(name);cfgnode[0].appendChild(tnode);}}}};c_settings_obj.prototype.checkUnknown=function(value,id)
{redact=false;switch(id)
{case"AutoStartApp":var name=value.trim();var i;var re=/(.)+\.exe$/i;if(!re.test(name))
{alert("Invalid application name.");return false;}
var ret=name.validString();if(!ret)
{alert(name+" contains invalid characters!");return false;}
this.setAutostartApp(name);this.changed++;return true;break;}
return false;};c_settings_obj.prototype.save=function()
{if(this.changed>0){dwconfig.changed++;}
dwconfig.save();keytrap=true;};function c_plugins_obj()
{this.count=0;this.index=0;}
plugins=new c_plugins_obj();c_plugins_obj.prototype.load=function()
{this.index=0;this.count=dwconfigdfn.pluginList.length;this.callback();};c_plugins_obj.prototype.callback=function()
{var url,cls,plugin;if(this.index<this.count)
{plugin=dwconfigdfn.pluginList[this.index].id.toLowerCase();statusbar.show("Loading "+plugin+" plugin...");url=htmlroot+plugin+".js";cls=geturl(url);eval(cls);this.index++;setTimeout("plugins.callback();",10);}
else{statusbar.show("");keytrap=true;}};function doBack(idx)
{var ret=false;var cls;cls=classStack.pop();cls=classStack.getLastValue();eval(cls+".m_xpathStack.pop();");eval(cls+".menupage = "+cls+".menupageStack.pop();");ret=eval(cls+".m_xpathStack.length();");if(ret>0){locationbar.pop();}
if(idx!=777){eval(cls+".refresh();");}}
function getTick()
{var d=new Date();return d.getTime();};var lastTime=0;function onSelect(idx,tick)
{if(arguments.length>1){if(arguments[1]==lastTime){setTimeout("lastTime = 0;",100);return;}
lastTime=arguments[1];setTimeout("lastTime = 0;",100);}
if(!keytrap){return;}
var ret=false;var cls;cls=classStack.getLastValue();if(cls==null){classStack.push("dwui");cls="dwui";}
ret=eval(cls+".onSelect("+idx+");");if(!ret)
{if((idx===666)||(idx===-1)||(idx===777))
{if(idx===666){setTimeout("doBack(666);",20);}
else{doBack(idx);}}
else{;}}}
function keyCheck(ev)
{if(!keytrap){return true;}
var keyId;if(window.event){keyId=event.keyCode;}
else if(ev.which){keyId=ev.which;}
switch(keyId)
{case 37:break;case 38:break;case 39:break;case 40:break;}
var keychar=String.fromCharCode(keyId);var numcheck=/\d/;if(numcheck.test(keychar)){onSelect(keychar-1);}}
try{document.onkeypress=keyCheck;}
catch(e){}
function main()
{if(!dwconfigdfn.load()){return;}
dwconfig.load();dwui.load();classStack.push("dwui");plugins.load();keytrap=false;}