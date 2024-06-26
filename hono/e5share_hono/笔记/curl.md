```

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