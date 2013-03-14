
c_clipboard_plugin=function()
{this.id=null;this.name=null;this.version=null;this.plugdom=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;};c_clipboard_plugin.prototype=new c_base_plugin();c_clipboard_plugin.prototype.constructor=c_clipboard_plugin;c_clipboard_plugin.prototype.parent=c_base_plugin.prototype;c_clipboard_plugin.prototype.setCtrlChars=function(val)
{var xpth=this.m_xpathStack.getLastValue();var xmlNode=selectNodes(this.m_xmldom,xpth);var cfgNode=selectNodes(this.m_cfgdom,xpth.removePid().removeUid());var nd=xmlNode[0].firstChild;while(nd!=null){if(nd.nodeName=="Char"){nd.firstChild.nodeValue=val;}
nd=nd.nextSibling;}
nd=cfgNode[0].firstChild;var tn;if(nd.childNodes.length==0){tn=nd.ownerDocument.createTextNode(val);nd.appendChild(tn);}
else{nd.firstChild.nodeValue=val;}
while(nd!=null){if(nd.nodeName=="Char"){if(nd.childNodes.length==0){tn=nd.ownerDocument.createTextNode(val);nd.appendChild(tn);}
else{nd.firstChild.nodeValue=val;}}
nd=nd.nextSibling;}
return true;};c_clipboard_plugin.prototype.enableAllCtrlChars=function()
{this.setCtrlChars(1);this.changed++;return true;};c_clipboard_plugin.prototype.disableAllCtrlChars=function()
{this.setCtrlChars(0);this.changed++;return true;};c_clipboard_plugin.prototype.handleFunction=function(node,idx)
{var fn=node.getAttribute("function");this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();eval("this."+fn+"();");this.refresh();return true;};c_clipboard_plugin.prototype.handleBool=function(node,idx)
{var xpath=this.m_xpathStack.getLastValue();var cfgnode=selectNodes(this.m_cfgdom,xpath.removePid().convertUid());var value;if(node.firstChild.nodeValue=="1")
{value=0;document.getElementById("img"+(idx-this.menupage*8)).innerHTML=this.m_blank;this.setCfgNodeValue(node,"0");}
else
{value=1;document.getElementById("img"+(idx-this.menupage*8)).innerHTML=this.m_ticked;this.setCfgNodeValue(node,"1");if(node.parentNode.getAttribute("type")=="mono")
{this.handleMono(node,idx);}}
if(node.nodeName=="Char")
{if(node.parentNode.nodeName=="CtrlChar")
{var dcdrnode;if(value==0){dcdrnode=cfgnode[0].parentNode.getElementsByTagName("EnableAll");if(dcdrnode!=null){if(dcdrnode.length>0){dcdrnode[0].firstChild.nodeValue=0;}}}}}
this.m_xpathStack.pop();this.menupage=this.menupageStack.pop();this.changed++;return true;};