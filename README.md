# MQTT SERVICE

Handling mqtt events. Subscribe to system level events. Send emit device level events.

##### System Level Events: 
 - Certificates granted | updated, 
 - Upload URL updated, 
 - Download URL updated...
##### Device Level Events: 
 - New Device Register. 
 - Device On. 
 - Device Off. 
 - Device Status.
 - Download. 
 - Upload.
 - Upgrade. 



Design Notes:
- should stateless, multi instances
- only deliver device short signals