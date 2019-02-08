## Give slack users access to slash command `/eu-help`, post help question to `#general` and write to google sheets document

### How to run in dev mode

1. Pull down repo and `yarn install` or `npm install`, whichever flavor you prefer
2. in the project directory `touch .env`
3. add the following to `.env`: (Filling in the slack access token and signing secret with the appropriate values)
   ```
   SLACK_ACCESS_TOKEN=<Your token>
   SLACK_SIGNING_SECRET=<You signing secret>
   SLACK_API_URL="https://slack.com/api"
   ZAPIER_WEBHOOK_URL=<You Zapier webhook token>
   ```
4. Fire up the project in watch mode with `yarn dev` or `npm run dev`

### Production Notes

The app is hosted at <https://eu-help.herokuapp.com/>
