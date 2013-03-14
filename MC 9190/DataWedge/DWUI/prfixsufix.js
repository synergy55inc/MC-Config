
c_prfixsufix_plugin=function()
{this.id=null;this.name=null;this.version=null;this.plugdom=null;this.m_xmldom=null;this.m_cfgdom=null;this.m_dfndom=null;this.m_xpathStack=new c_stack_obj();this.changed=0;};c_prfixsufix_plugin.prototype=new c_base_plugin();c_prfixsufix_plugin.prototype.constructor=c_prfixsufix_plugin;c_prfixsufix_plugin.prototype.parent=c_base_plugin.prototype;c_prfixsufix_plugin.default_Enabled=1;c_prfixsufix_plugin.prototype.show=function()
{var xpath=".";if(arguments.length>0){xpath=arguments[0];}
this.m_xpathStack.push(xpath);this.menupageStack.push(this.menupage);var nodeList=selectNodes(this.m_xmldom,xpath+"/*");this.updateNodeListValues(xpath,nodeList);var name=this.name;if(name==null){name=nodeList[0].parentNode.getAttribute("name");}
if(name==null){name=nodeList[0].parentNode.nodeName;}
if(uglySendEnterHack){var node=selectNodes(this.m_xmldom,"SendEnter");if(node!=null){if(node.length>0){node[0].firstChild.nodeValue="0";}}}
locationbar.push(name);this.updateMenu(nodeList);};