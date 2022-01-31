
# URL Monitor
an uptime monitoring RESTful API server which allows authorized users to enter URLs they want monitored, and get detailed uptime reports about their availability, average response time, and total uptime/downtime.


## API Reference

#### user signup

```http
  Post http://localhost:5000/api/user/register
```

| Parameter  | Type     | Description                        |
| :--------  | :------- | :----------------------------------|
| `name`     | `String` | **Required**. the name of the user |
| `email`    | `String` | **Required**. user's email         |
| `password` | `String` | **Required**. password             |

#### user login

```http
  Post http://localhost:5000/api/user/login
```

| Parameter | Type     | Description    |
| :-------- | :------- | :--------------|
| `email`   | `string` | **Required**.  |
| `password`| `string` | **Required**.  |

* To Proceed for using checks you need to provide token that is generated after login in the header of your request 
* set the Authorization to token

#### Create Check

```http
  post http://localhost:5000/api/check/create-check
```
| Parameter | Type     | Description    |
| :-------- | :------- | :--------------|
| `name`   | `string` | **Required**. name of the check  |
| `url`| `string` | **Required**. The URL to be monitored. |
| `protocol`| `string` | **Required**. The resource protocol name HTTP, HTTPS, or TCP. |
| `path`| `string` |  A specific path to be monitored (optional). |
| `port`| `Number` |  The server port number (optional). |
| `webhooks`| `Object` |  Array of webhooks URL to receive a notification on (optional). |
| `timeout`| `Number` |   (defaults to 5 seconds) - The timeout of the polling request (optional). |
| `interval`| `Number` |  (defaults to 10 minutes) - The time interval for polling requests (optional). |
| `authentication`| `Object` |  An HTTP authentication header, with the Basic scheme, to be sent with the polling request (optional).  |
| `httpHeaders`| `Object` |  A list of key/value pairs custom HTTP headers to be sent with the polling request (optional). |
| `tags`| `Array` |  A list of the check tags (optional). |

#### get all Checks

```http
  get http://localhost:5000/api/check/all-checks
```
* get checks per user not all the checks in database.

#### edit Check


```http
  put http://localhost:5000/api/check/:_id
```
* _id is the id of the check.

#### delete Check

```http
  Delete http://localhost:5000/api/check/:_id
```
* _id is the id of the check.

#### Start/Stop Check


```http
  put http://localhost:5000/startstop/:_id
```
* _id is the id of the check to be started or stopped

#### get report for check

```http
  get http://localhost:5000/api/report/:_id
```
* _id is the id of the check you want it's report
