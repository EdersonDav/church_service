Next step

- get user - ok
- update user - ok
- if a user try to login but this user is not verified, send code again - ok
  -- if user existis and try to register again if the user does not verified, update user register by email and resend code - ok
- verify user code - ok
  -- if users already register and they account is verified and try to register again, send a email with information about account already exists - ok

---

- verify login - ok
- reset password, when the user click in forgot my pass we send a code for there email - ok
- add user birthday - ok
  -- update user data - ok
- add user id in requests to verify permissions - ok

---

- crud church - ok
- add members in the church, set default voluntary - ok
- get members in the church - ok
- set others members as a admin - ok

---

- crud sectors
- add admins (only sector) and voluntaries
  -- only church admin can create sectors and set sectors admin

---

- crud tasks
- related users and tasks
- set in user perfil tasks like minister, guitar etc
- crud scales
  -- for scales and tasks, only admin church and admin sector can create and allocate users

---

- crud unavailability
- handle unavailability
  -- if a user set unavailability, this user cannot be scales in any sectors scales
  -- if user was scale in determinate sector, this user will be unavailability for others sectors with message "this user already scaled in sector ..."

---

## FUTURE FEATURE

- crud extra events, like aniversaries, conference, couple service
  -- this extra events to need to related with the church

---

- crud church assets, like music, schedules ....
  -- https://chatgpt.com/canvas/shared/6831b5aa751c8191aa5e5d38931009e7
