Warning
-------

You might find this code useful, but this doesn't actually work yet.  If you make progress on it, go ahead and submit a PR!


freezerwatch
============

Returns health status from La Crosse Alerts sensors.

Useful for adding to your monitoring system--i.e., answers the
question "are my alarms actually live and working?"

The --live option will exit with a zero status if all of the devices you passed in are found and registered, we have readings within te last day, and all devices have adequate battery.

Config
------

Create a file called freezerwatch.json:
```json
{
    "username": "my@email.com",
    "password": "my_password"
}
```

Usage
-----
npm install freezerwatch

```sh
if freezerwatch --live --device="123" --device="456" --device="789"
then
  echo "All monitoring is live and working!"
else
  echo "Check your sensors!"
fi
```

Device IDs
----------

You can find device IDs by logging into lacrossealerts.com/login and
looking at the link that your 'Download' button points to.


Note
----
La Crosse Technology and La Crosse Alerts are registered trademarks of La Crosse Technology Ltd.  I use their products but am not employed by or connected to them in any other way.
