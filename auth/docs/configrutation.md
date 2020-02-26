#### **pg.json**:
```json
{
  "connectionString": "postgres://localhost/cuppa-authentication",
  "user": "cuppa",
  "password": "toor-cuppa"
}
```

---

#### **jwt.json**:
```json
{
  "secret": "secret_key",
  "expiresIn": 900,
  "refreshExpiresIn": 86400,
  "refreshCookie": "refresh_token"
}
```

Note: `expiresIn`, `refreshExpiresIn` in seconds

---

#### **user.json**:
```json
{
  "rounds": 10
}
```

rounds - bcrypt: the cost of processing the data

---

#### **cookie.json**:
```json
{
  "secret": "my-secret",
  "parseOptions": {}
}
```

TBD

---
