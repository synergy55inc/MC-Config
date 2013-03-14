
c_scanner_plugin=function()
{this.id=null;this.name=null;this.version=null;this.plugdom=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;};c_scanner_plugin.prototype=new c_base_plugin();c_scanner_plugin.prototype.constructor=c_scanner_plugin;c_scanner_plugin.prototype.parent=c_base_plugin.prototype;c_scanner_plugin.prototype.refresh=function()
{this.updateDeviceList();this.parent.refresh.call(this);};c_scanner_plugin.prototype.handleUnknownNodeName=function(node,idx)
{var nname=node.nodeName;var nid=node.getAttribute("id");var name=node.getAttribute("name");switch(nname)
{case"Device":device=null;displayMessage("Loading device, please wait...");device=new c_scanner_device();var cfgNode=selectNodes(this.m_cfgdom,"//PlugIn[@id='"+this.id+"']/Device[@id='"+nid+"']");device.setCfgBase(cfgNode[0]);var dfnNode=selectNodes(this.m_dfndom,"//PlugIn[@id='"+this.id+"']/Device[@id='"+nid+"']");device.setDfnBase(dfnNode[0]);device.setGuvnor(this);device.id=nid;device.name=name;classStack.push("device");setTimeout("device.load();",10);return true;break;}
return false;};c_scanner_plugin.prototype.removeNode=function(node)
{switch(node.nodeName){case"DisableAll":case"option":break;default:if(node.parentNode!=null){node.parentNode.removeChild(node);}
return true;}
return false;};c_scanner_device=function()
{this.id=null;this.name=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;};c_scanner_device.prototype=new c_base_obj();c_scanner_device.prototype.constructor=c_scanner_device;c_scanner_device.prototype.parent=c_base_obj.prototype;c_scanner_device.prototype.subload=function(id)
{var xmlnode=selectNodes(this.m_xmldom,"./*");var len=xmlnode.length;var i=0;var dfnnode,nname,exists;while(i<len){nname=xmlnode[i].nodeName;dfnnode=selectNodes(this.m_dfndom,nname);exists=false;if(dfnnode!=null){if(dfnnode.length>0){exists=true;}}
if(!exists){xmlnode[i].parentNode.removeChild(xmlnode[i]);}
i++;}};c_scanner_device.prototype.load=function()
{var url=htmlroot+"dwui_scanner.xml";var xml=geturl(url);if(xml!=null){if(xml.match("<?xml"))
{this.plugdom=loadXMLString(xml);this.m_xmldom=selectNodes(this.plugdom,"/PlugIn/Device")[0];this.m_xmldom.setAttribute("id",this.id);this.m_xmldom.setAttribute("name",this.name);this.upgradeSoftTriggerCfg();this.show();return;}}
alert("Error loading plug-in template.");this.onSelect(666);};c_scanner_device.prototype.upgradeSoftTriggerCfg=function()
{var xpth="./SoftTrigger";var cfgNode=selectNodes(this.m_cfgdom,xpth);if(cfgNode.length>0)
{if(cfgNode[0].childNodes.length>0)
{if(cfgNode[0].firstChild.nodeType==3)
{var st=cfgNode[0].firstChild.nodeValue;cfgNode[0].removeChild(cfgNode[0].firstChild);var en=cfgNode[0].ownerDocument.createElement("Enabled");var tn=cfgNode[0].ownerDocument.createTextNode(st);en.appendChild(tn);cfgNode[0].appendChild(en);this.changed++;}}}};c_scanner_device.prototype.setDecoderEnabled=function(val)
{var xpth=this.m_xpathStack.getLastValue();var xmlNode=selectNodes(this.m_xmldom,xpth);var cfgNode=selectNodes(this.m_cfgdom,xpth.removePid().removeUid());var nd=xmlNode[0].firstChild;while(nd!=null){if(nd.nodeName=="Decoder"){if(nd.firstChild.childNodes.length>0){nd.firstChild.firstChild.nodeValue=val;}}
nd=nd.nextSibling;}
nd=cfgNode[0].firstChild;var tn,en;while(nd!=null){if(nd.nodeName=="Decoder"){if(nd.childNodes.length==0){en=nd.ownerDocument.createElement("Enabled");tn=nd.ownerDocument.createTextNode(val);en.appendChild(tn);nd.appendChild(en);}
else{if(nd.firstChild.childNodes.length==0){tn=nd.ownerDocument.createTextNode(val);nd.firstChild.appendChild(tn);}
else{nd.firstChild.firstChild.nodeValue=val;}}}
else if(nd.nodeName=="EnableAll"){nd.firstChild.nodeValue=val;}
nd=nd.nextSibling;}
return true;};c_scanner_device.prototype.enableAllDecoders=function()
{this.setDecoderEnabled(1);this.changed++;return true;};c_scanner_device.prototype.disableAllDecoders=function()
{this.setDecoderEnabled(0);this.changed++;return true;};c_scanner_device.prototype.handleFunction=function(node,idx)
{var fn=node.getAttribute("function");this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();eval("this."+fn+"();");this.refresh();return true;};c_scanner_device.prototype.handleUnknownNodeName=function(node,idx)
{return false;var nname=node.nodeName;var pid=node.getAttribute("pid");var name=node.getAttribute("name");switch(nname)
{case"Params":alert(this.m_xpathStack.getLastValue());var el=selectNodes(this.m_xmldom,this.m_xpathStack.getLastValue());locationbar.push(el[0].getAttribute("name"));this.refresh();return true;break;case"Enabled":alert("enabled");break;}
return false;};c_scanner_device.prototype.removeNode=function(node)
{switch(node.nodeName){case"DisableAll":case"option":break;default:if(node.parentNode!=null){node.parentNode.removeChild(node);}
return true;}
return false;};