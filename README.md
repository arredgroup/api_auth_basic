# API for Authentication

- This is a readme with all routes

## Auth Routes

### POST ```/api/v1/auth/login```

- method must include a user and password
- method return a BASE64 token with this information:
- ```{ "name": ..., "email": ..., "roles": ..., "expiration":... }```


query params en findUsers: status, name, logAfter, logBefore

formato bulkCreate:
```
[ 
    {
        "name": "John Doe",
        "email": "johnssssssndoe@example.com",
        "password": "passwsord123",
        "password_second": "passwsord123",
        "cellphone": "123-456-7890"
    },
    {
        "name": "John Doe",
        "email": "johnssssssndoe@example.com",
        "password": "passwsord123",
        "password_second": "passwsord123",
        "cellphone": "123-456-7890"
    }
]
```

