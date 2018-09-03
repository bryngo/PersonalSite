# Architecture Review: Apple Payment Reminder

## Goal
One of the annoyances of life is making and requesting payments for both the 
payer and the payee. I manage an Apple Music family plan for a few people (
they're family, of course. Who would abuse this system to get Apple Music for
cheap with their friends? Definitely not me) and reminding people to make
payments can be a bit bothersome. 

Currently, I have a Google Apps Script running to send monthly email reminders to 
send me $2.50 on the first of every month. I would like to migrate this service
to my website so I can have more ownership and flexibility over it. 

The service will not change. The only difference is that the data will be logged
in my database and I can verify payments through my website instead of 
through Google Sheets (which I hate navigating to).

## Steps
1) Create collection `apple_pay_records`
    - Each entry will be of the form 
```JSON
{
  name: "Alice",
  month: 0,
  daysLate: 2,
  paid: false
}
```
  - `name`: STRING
  - `month`: INT (with values 0-11)
  - `datsLate`: INT
  - `paid`: BOOL

2) Set up a cron that populates `apple_pay_records` with X entries for month Y
at the beginning of each month.
Each entry will correspond to a user. For now, there won't be any entries
from the `accounts` table linked to the entries in the `apple_pay_records` 
table, as this will require account creation from each of the users.

  - Additionally, there should be a separate cron that sends out email reminders.
I would like to leave the option for the email frequency to be configurable,
but for now, once a month is all we need.

3) Create an **admin-only** page that is able to update individual entries from
`paid=false` to `paid=true`

## Testing
- Spam myself with emails (cron triggered) to verify that the notification
service works
- Run the table population cron to verify that X entires are populated, where
X is the number of users under the family plan. 
- Test the admin service and make sure the entries are properly updated and 
logged.


