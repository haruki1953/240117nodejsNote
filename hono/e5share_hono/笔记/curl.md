```



curl -X POST \
  http://127.0.0.1:3007/auth/register \
  -H 'Content-Type: application/json' \
  -d '{
    "username": "test1",
    "password": "example_password",
    "email": "t@example.com"
}'
```