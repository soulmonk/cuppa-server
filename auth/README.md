[![JavaScript Style Guide](https://cdn.rawgit.com/standard/standard/master/badge.svg)](https://github.com/standard/standard)

## Docker


### local
- `docker build -t cuppa-auth .` - for local
- `docker run -t cuppa-auth cuppa-auth` - for local

### pi
- `docker build -t cuppa/auth:v{VERSION} --platform linux/arm64 .` - for pi
- `docker tag cuppa/auth:v{VERSION} rpisoulv1.kube:31320/cuppa/auth:latest`
- `docker push rpisoulv1.kube:31320/cuppa/auth:latest`


docker tag cuppa/auth:v4 rpisoulv1.kube:31320/cuppa/auth:latest
