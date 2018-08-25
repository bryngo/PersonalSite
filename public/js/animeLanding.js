
function epochToDate() {
  date = new Date(1535187128951);

  var d = date.getUTCDate().toString(),           // getUTCDate() returns 1 - 31
  		m = (date.getUTCMonth() + 1).toString(),    // getUTCMonth() returns 0 - 11
  		y = date.getUTCFullYear().toString(),       // getUTCFullYear() returns a 4-digit year
  formatted = '';

  if (d.length === 1) {                           // pad to two digits if needed
  	d = '0' + d;
  }

  if (m.length === 1) {                           // pad to two digits if needed
  	m = '0' + m;
  }

  formatted = m + '/' + d + '/' + y;              // concatenate for output

  return formatted;
}