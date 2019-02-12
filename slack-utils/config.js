const dialogOneFields = [
  {
    label: "App URL",
    name: "appURL",
    type: "text",
    hint: "What website are you working on?"
  },
  {
    label: "Flywheel Admin URL",
    name: "adminURL",
    type: "text"
  },
  {
    label: "Zendesk Ticket URL",
    name: "zendeskURL",
    type: "text",
    optional: true
  }
];

const dialogTwoFields = [
  {
    label: "Channel",
    type: "select",
    name: "channelName",
    options: [
      {
        label: "T1",
        value: "t1"
      },
      {
        label: "T2",
        value: "t2"
      },
      {
        label: "Triage",
        value: "triage"
      },
      {
        label: "Chat",
        value: "chat"
      },
      {
        label: "Other",
        value: "other"
      }
    ]
  },

  {
    label: "What is your question?",
    name: "question",
    type: "textarea",
    hint: "A thorough description of the problem"
  },
  {
    label: "Steps taken so far?",
    name: "stepsTaken",
    type: "textarea",
    hint: "Steps you have taken so far"
  },
  {
    label: "Is this question urgent?",
    name: "urgencyStatus",
    type: "select",
    options: [
      {
        label: "Yes",
        value: "true"
      },
      {
        label: "No",
        value: "false"
      }
    ]
  }
];

module.exports = { dialogOneFields, dialogTwoFields };

const test = [
  {
    callback_id: "app_url",
    text: "<https://google.com>",
    id: 2,
    fallback: "<https://google.com>"
  },
  {
    callback_id: "admin_url",
    text: "<https://google.com>",
    id: 4,
    fallback: "<https://google.com>"
  },
  {
    callback_id: "zendesk_url",
    text: "<https://google.com>",
    id: 6,
    fallback: "<https://google.com>"
  }
];
