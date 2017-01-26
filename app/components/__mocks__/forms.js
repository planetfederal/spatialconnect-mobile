export default [{
      "id": 74,
      "form_key": "test_form",
      "form_label": "test form",
      "version": 33,
      "team_id": 1,
      "fields": [
        {
          "constraints": {
            "pattern": "frank",
            "initial_value": "frankv3",
            "minimum_length": "60",
            "maximum_length": "44446"
          },
          "field_key": "test_textsss",
          "type": "string",
          "is_required": false,
          "field_label": "test textsss",
          "id": 497,
          "position": 0
        },
        {
          "constraints": {
            "integer": false,
            "initial_value": "50",
            "minimum": "0",
            "maximum": "100",
            "is_integer": true
          },
          "field_key": "test_number",
          "type": "number",
          "is_required": true,
          "field_label": "test number",
          "id": 498,
          "position": 2
        },
        {
          "constraints": {},
          "field_key": "repaired",
          "type": "boolean",
          "is_required": true,
          "field_label": "Repaired?",
          "id": 499,
          "position": 2
        },
        {
          "constraints": {},
          "field_key": "today",
          "type": "date",
          "is_required": true,
          "field_label": "Today",
          "id": 500,
          "position": 3
        },
        {
          "constraints": {
            "minimum": "0",
            "maximum": "100",
            "initial_value": "50"
          },
          "field_key": "severity",
          "type": "slider",
          "is_required": true,
          "field_label": "Severity",
          "id": 501,
          "position": 4
        },
        {
          "constraints": {
            "minimum": "0",
            "maximum": "100",
            "initial_value": "50"
          },
          "field_key": "number_of_cracks",
          "type": "counter",
          "is_required": true,
          "field_label": "Number of Cracks",
          "id": 502,
          "position": 5
        },
        {
          "constraints": {
            "options": [
              "A",
              "B",
              "C"
            ]
          },
          "field_key": "grade",
          "type": "select",
          "is_required": false,
          "field_label": "Grade",
          "id": 503,
          "position": 6
        }
      ]
    }];