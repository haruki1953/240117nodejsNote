```sh
curl -X GET \
  http://127.0.0.1:3007/e5post/posts/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE"

curl -X GET \
  http://127.0.0.1:3007/user/last-login/1 \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE"

curl -X PUT \
  http://127.0.0.1:3007/user/e5info \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE" \
  -H "Content-Type: application/json" \
  -d '{"subscriptionDate": "2024-02-24", "expirationDate": "2024-05-24"}'

curl -X GET \
  http://127.0.0.1:3007/user/profile \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE'

curl -X PUT \
  http://127.0.0.1:3007/user/password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword": "new_password", "newPassword": "example_password"}'

curl -X PUT \
  http://127.0.0.1:3007/user/password \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE" \
  -H "Content-Type: application/json" \
  -d '{"oldPassword": "example_password", "newPassword": "new_password"}'

curl -X PUT \
  http://127.0.0.1:3007/user/email \
  -H "Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTczMTcyNzUwN30.cwCk1lwZR6eHu0CY8tKjgdXce97iYaxNjCpROoFgLpE" \
  -H "Content-Type: application/json" \
  -d '{"email": "new_email@example.com"}'

curl -X PATCH \
  http://127.0.0.1:3007/user/profile \
  -H 'Content-Type: application/json' \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTcyOTc1NzAyOX0.jg0WbSdao_xLUP_NvXSvqOoGdoLvFgy0PuMJP94Rsyw' \
  -d '{
    "nickname": "new_nickname",
    "contactInfo": "new_contact_info",
    "bio": "new_bio"
}'

curl -X GET \
  http://127.0.0.1:3007/user/profile \
  -H 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwidXNlcm5hbWUiOiJ0ZXN0MSIsImV4cCI6MTcyOTc1NzAyOX0.jg0WbSdao_xLUP_NvXSvqOoGdoLvFgy0PuMJP94Rsyw'


curl -X GET \
  http://127.0.0.1:3007/user/profile \
  -H 'Authorization: Bearer xxx'


curl -X GET \
  http://127.0.0.1:3007/public/users

curl -X POST \
  http://127.0.0.1:3007/auth/login/email \
  -H 'Content-Type: application/json' \
  -d '{
    "email": "t@example.com",
    "password": "example_password"
}'

curl -X POST \
  http://127.0.0.1:3007/auth/login/username \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "test1",
    "password": "example_password"
}'

curl -X POST \
  http://127.0.0.1:3007/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "test1",
    "password": "example_password",
    "email": "t@example.com"
}'
```