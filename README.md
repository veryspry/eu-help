## Give slack users access to slash command `/eu-help`, post help question to `#general` and write to google sheets document

### Instructions to set Up Slack App

1. Create a new slack app <https://api.slack.com/apps>
2. Add the following permissions scopes to your bot:
   - `chat:write:bot`
   - `chat:write:user`
   - `commands`
   - `users:read`
3. Create a new slash command for you app <https://api.slack.com/slash-commands>
   - Point the request URL to `<your-app-host>/eu-help`
4. Turn on interactive components
   - Point the request URL to `<your-app-host>/help/submit`

**An important note on Slack Request URL's** - Slack disallows the use of `localhost`. Instead setup [`ngrok`](https://ngrok.com/) to create a public tunnel for your localhost

### Create a Zap with Zapier

1. Create a Web Hook and choose type `Catch Hook`
   - You will need the webhook URL later to use as the value for the environment variable `ZAPIER_WEBHOOK_URL`
   - No need no set any other option for this, like picking off child objects, etc.
2. Create Google sheets action `Create Spreadsheet Row`
   - This will simply append to the next unwritten row in your spreadsheet
   - Connect the action to your Google Sheet
   - Edit the template (connect to the `sheet` and `worksheet` you want to use)
   - Connect Each field to the `Catch Hook`. If you aren't writing the correct data to each column, you likely didn't name the column

### Google Sheets setup

    1. Create a new Google Sheet
    2. Add named ranges to the sheet
        - Click: `Data` -> `Named Ranges`
        - Add the following ranges: (of format <name>, <range>)
            - `name`, `<sheet-name>!A:A`
            - `description`, `<sheet-name>!C:C`
            - `summary`, `<sheet-name>!B:B`

### How to run in dev mode

1. Pull down repo and `yarn install` or `npm install`, whichever flavor you prefer
2. in the project directory `touch .env`
3. add the following to `.env`: (Filling in the slack access token and signing secret with the appropriate values)
   ```
   SLACK_ACCESS_TOKEN=<Your token>
   SLACK_SIGNING_SECRET=<You signing secret>
   SLACK_API_URL="https://slack.com/api"
   ZAPIER_WEBHOOK_URL=<You Zapier webhook URL>
   ```
4. Fire up the project in watch mode with `yarn dev` or `npm run dev`

### Production Notes

The app is hosted at <https://eu-help.herokuapp.com/>
