Next step
- get user - ok
- update user - ok
- if a user try to login but this user is not verified, send code again - ok 
-- if user existis and try to register again if the user does not verified, update user register by email and resend code - ok
- verify user code 
-- if users already register and they account is verified and try to register again, send a email with information about account already exists 
-----------------
- verify login 
- add user id in requests to verify permissions
-- handle permission for route, add in jwt token data about user informations
-----------------
- crud church
- add members in the church, set default voluntary
- set others members as a admin
-- only church admin can set others user as admin
----------------
- crud sectors
- add admins (only sector) and voluntaries
-- only church admin can create sectors and set sectors admin
----------------
- crud tasks
- related users and tasks
- crud scales
-- for scales and tasks, only admin church and admin sector can create and allocate users
-------------
- crud unavailability
- handle unavailability
-- if a user set unavailability, this user cannot be scales in any sectors scales
-- if user was scale in determinate sector, this user will be unavailability for others sectors with message "this user already scaled in sector ..."
--------------
## FUTURE FEATURE
- crud extra events, like aniversaries, conference, couple service 
-- this extra events to need to related with the church
--------------
- crud church assets, like music, schedules ....
 


