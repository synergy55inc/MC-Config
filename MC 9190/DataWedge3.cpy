########################################################################################################
#			DataWedge 3.3 Cold Boot Persistence CPY for Manual Deployments		       #
#												       #
#												       #
# Copy this cpy file to \Application folder of the device after deploying DataWedge Manualy 	       #
# Refer Readme.txt for DataWedge manual deployment instructions					       #
########################################################################################################

# Persist Start of DataWedge Tray Application on device start up. 
\Application\DataWedge\Link\DataWedge.txt > \%WSU%\DataWedge.lnk

# Replace the \Windows folder link file when DataWedge built into device OS.  
\Application\DataWedge\Link\DataWedge.txt > \windows\DataWedge.lnk

# Comment Above line and uncomment below to start DataWedge Without DataWedge System Tray menu.
#\Application\DataWedge\Link\DataWedgeOnly.txt > \%WSU%\DataWedge.lnk


# This Statement will Copy the DataWedge Control Panel applet to \Windows folder 
\Application\DataWedge\Link\DWCpl.cpl > \Windows\DWCpl.cpl	

# This Statement will Copy the Unload file for DataWedge for WinCE devices. 
#\Application\DataWedge\Link\Motorola DataWedge.unload > \Windows\Motorola DataWedge.unload	
