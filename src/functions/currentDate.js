export default function CurrentDate () {
  // Your default date object
  const startTime = new Date();
// Get the iso time (GMT 0 == UTC 0)
  const isoTime = new Date((new Date(startTime)).toISOString() );
// getTime() is the unix time value, in milliseconds.
// getTimezoneOffset() is UTC time and local time in minutes.
// 60000 = 60*1000 converts getTimezoneOffset() from minutes to milliseconds.
  const fixedTime = new Date(isoTime.getTime()-(startTime.getTimezoneOffset()*60000));
// toISOString() is always 24 characters long: YYYY-MM-DDTHH:mm:ss.sssZ.
// .slice(0, 19) removes the last 5 chars, ".sssZ",which is (UTC offset).
// .replace('T', ' ') removes the pad between the date and time.
  return fixedTime.toISOString().slice(0, 19).replace('T', ' ');
}