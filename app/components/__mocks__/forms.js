export default [{
  id: 1,
  version: 0,
  form_key: 'weed_inspector',
  form_label: 'Weed Inspector',
  fields: [{
    id: 1,
    type: 'number',
    field_label: 'Weed Stage',
    field_key: 'weed_stage',
    is_required: true,
    position: 0,
    is_integer: false
  }, {
    id: 2,
    type: 'counter',
    field_label: 'Number of Plants',
    field_key: 'number_of_plants',
    position: 1,
    initial_value: '0'
  }, {
    id: 3,
    type: 'slider',
    field_label: 'Infestation Size',
    field_key: 'infestation_size',
    position: 2,
    initial_value: '0',
    minimum: '0',
    maximum: '100'
  }, {
    id: 4,
    type: 'counter',
    field_label: 'Degree',
    field_key: 'degree',
    is_required: true,
    position: 3,
    initial_value: '0',
    minimum: '0'
  }, {
    id: 5,
    type: 'slider',
    field_label: 'Density',
    field_key: 'density',
    position: 4,
    initial_value: '0',
    minimum: '0',
    maximum: '100'
  }, {
    id: 6,
    type: 'string',
    field_label: 'Source',
    field_key: 'source',
    is_required: true,
    position: 5,
    pattern: ''
  }, {
    id: 7,
    type: 'date',
    field_label: 'Data Discovered',
    field_key: 'date_discovered',
    position: 6
  }, {
    id: 8,
    type: 'string',
    field_label: 'Common Name',
    field_key: 'common_name',
    is_required: true,
    position: 7,
    pattern: ''
  }, {
    id: 9,
    type: 'string',
    field_label: 'Genus',
    field_key: 'genus',
    is_required: true,
    position: 8,
    pattern: ''
  }, {
    id: 10,
    type: 'string',
    field_label: 'Species',
    field_key: 'species',
    position: 9,
    pattern: ''
  }, {
    id: 11,
    type: 'string',
    field_label: 'Scientific Name',
    field_key: 'scientific_name',
    position: 10,
    pattern: ''
  }, {
    id: 12,
    type: 'string',
    field_label: 'Class',
    field_key: 'class',
    position: 11,
    pattern: ''
  }]
}, {
  id: 2,
  version: 0,
  form_key: 'baseball_team',
  form_label: 'Baseball Team',
  fields: [{
    id: 13,
    type: 'string',
    field_label: 'Favorite?',
    field_key: 'team',
    position: 0
  }, {
    id: 14,
    type: 'string',
    field_label: 'Why?',
    field_key: 'why',
    position: 1
  }]
}, {
  id: 5,
  version: 3,
  form_key: 'bird_counter',
  form_label: 'Bird Counter',
  fields: [{
    id: 18,
    type: 'counter',
    field_label: 'Bird Count',
    field_key: 'bird_count',
    is_required: true,
    position: 1,
    initial_value: '0'
  }, {
    id: 17,
    type: 'string',
    field_label: 'Bird Species',
    field_key: 'bird_species',
    is_required: true,
    position: 0,
    pattern: ''
  }]
}];