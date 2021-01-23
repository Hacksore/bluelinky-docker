# bluelinky-docker
Unofficial Hyundai Blue Link API (bluelinky)

### Run

Make sure you have a `config.json` and a `users.json` file in the volume you mount
```
docker run -d -p 8080:8080 -v "${PWD}:/config" hacksore/bluelinky
```

### Routes

`GET /` status of the vehicle

`POST /lock` - lock the vehicle

`POST /unlock` - lock the vehicle

`POST /start` - lock the vehicle
