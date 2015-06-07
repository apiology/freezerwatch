Warning
-------

You might find this code useful, but this doesn't actually work yet.  If you make progress on it, go ahead and submit a PR!


freezerwatch
============

Want to monitor a fridge/freezer and make sure the door isn't left open or it doesn't die or lose power?  La Crosse Technology sells alarms that do that.

Want a quick command-line way to make sure those alarms are up and working?  This utility can help.

The --live option will exit with a zero status if all of the devices you passed in are found and registered, we have readings within te last day, and all devices have adequate battery.

Config
------

Create a file called freezerwatch.json with the login information you use for lacrossealerts.com:
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
