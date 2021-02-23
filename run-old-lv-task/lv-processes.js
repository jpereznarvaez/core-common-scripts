const processes = [
  { id: 3, code: 'AL', description: 'Alabama', command: 'AL LICENSES' },
  { id: 29, code: 'AK', description: 'Alaska', command: 'AK LICENSES' },
  { id: 4, code: 'AZ', description: 'Arizona', command: 'AZ LICENSES' },
  { id: 16, code: 'AR', description: 'Arkansas', command: 'AR LICENSES' },
  {
    id: 30,
    code: 'BC',
    description: 'British Columbia',
    command: 'BC LICENSES'
  },
  { id: 9, code: 'CA', description: 'California', command: 'CA LICENSES' },
  {
    id: 56,
    code: 'CERT',
    description: 'Certifications',
    command: 'CERTIFICATIONS'
  },
  { id: 11, code: 'CO', description: 'Colorado', command: 'CO LICENSES' },
  { id: 31, code: 'CT', description: 'Connecticut', command: 'CT LICENSES' },
  { id: 17, code: 'DE', description: 'Delaware', command: 'DE LICENSES' },
  {
    id: 2,
    code: 'DC',
    description: 'District of Columbia',
    command: 'DC LICENSES'
  },
  { id: 1, code: 'FL', description: 'Florida', command: 'FL LICENSES' },
  { id: 32, code: 'GA', description: 'Georgia', command: 'GA LICENSES' },
  { id: 57, code: 'GU', description: 'Guam', command: 'GU LICENSES' },
  { id: 33, code: 'HI', description: 'Hawaii', command: 'HI LICENSES' },
  { id: 18, code: 'ID', description: 'Idaho', command: 'ID LICENSES' },
  { id: 10, code: 'IL', description: 'Illinois', command: 'IL LICENSES' },
  { id: 12, code: 'IN', description: 'Indiana', command: 'IN LICENSES' },
  { id: 34, code: 'IA', description: 'Iowa', command: 'IA LICENSES' },
  { id: 35, code: 'KS', description: 'Kansas', command: 'KS LICENSES' },
  { id: 19, code: 'KY', description: 'Kentucky', command: 'KY LICENSES' },
  { id: 36, code: 'LA', description: 'Louisiana', command: 'LA LICENSES' },
  { id: 20, code: 'ME', description: 'Maine', command: 'ME LICENSES' },
  {
    id: 58,
    code: 'MP',
    description: 'Mariana Islands',
    command: 'MP LICENSES'
  },
  { id: 37, code: 'MD', description: 'Maryland', command: 'MD LICENSES' },
  { id: 38, code: 'MA', description: 'Massachusetts', command: 'MA LICENSES' },
  { id: 39, code: 'MI', description: 'Michigan', command: 'MI LICENSES' },
  { id: 40, code: 'MN', description: 'Minnesota', command: 'MN LICENSES' },
  { id: 41, code: 'MS', description: 'Mississippi', command: 'MS LICENSES' },
  { id: 15, code: 'MO', description: 'Missouri', command: 'MO LICENSES' },
  { id: 42, code: 'MT', description: 'Montana', command: 'MT LICENSES' },
  { id: 21, code: 'NE', description: 'Nebraska', command: 'NE LICENSES' },
  { id: 43, code: 'NV', description: 'Nevada', command: 'NV LICENSES' },
  { id: 22, code: 'NH', description: 'New Hampshire', command: 'NH LICENSES' },
  { id: 44, code: 'NJ', description: 'New Jersey', command: 'NJ LICENSES' },
  { id: 28, code: 'NM', description: 'New Mexico', command: 'NM LICENSES' },
  { id: 13, code: 'NY', description: 'New York', command: 'NY LICENSES' },
  { id: 23, code: 'NC', description: 'North Carolina', command: 'NC LICENSES' },
  { id: 45, code: 'ND', description: 'North Dakota', command: 'ND LICENSES' },
  { id: 7, code: 'OH', description: 'Ohio', command: 'OH LICENSES' },
  { id: 46, code: 'OK', description: 'Oklahoma', command: 'OK LICENSES' },
  { id: 47, code: 'OR', description: 'Oregon', command: 'OR LICENSES' },
  { id: 48, code: 'PA', description: 'Pennsylvania', command: 'PA LICENSES' },
  { id: 49, code: 'PR', description: 'Puerto Rico', command: 'PR LICENSES' },
  { id: 50, code: 'QC', description: 'Quebec Canada', command: 'QC LICENSES' },
  { id: 24, code: 'RI', description: 'Rhode Island', command: 'RI LICENSES' },
  { id: 27, code: 'SC', description: 'South Carolina', command: 'SC LICENSES' },
  { id: 51, code: 'SD', description: 'South Dakota', command: 'SD LICENSES' },
  { id: 5, code: 'TN', description: 'Tennessee', command: 'TN LICENSES' },
  { id: 6, code: 'TX', description: 'Texas', command: 'TX LICENSES' },
  { id: 25, code: 'UT', description: 'Utah', command: 'UT LICENSES' },
  { id: 53, code: 'VT', description: 'Vermont', command: 'VT LICENSES' },
  { id: 52, code: 'VI', description: 'Virgin Islands', command: 'VI LICENSES' },
  { id: 14, code: 'VA', description: 'Virginia', command: 'VA LICENSES' },
  { id: 54, code: 'WA', description: 'Washington', command: 'WA LICENSES' },
  { id: 55, code: 'WV', description: 'West Virginia', command: 'WV LICENSES' },
  { id: 26, code: 'WI', description: 'Wisconsin', command: 'WI LICENSES' },
  { id: 8, code: 'WY', description: 'Wyoming', command: 'WY LICENSES' },
  {
    id: 101,
    code: 'EXPIRED',
    description: 'Custom process for Expired licenses',
    command: 'CUSTOM_PROCESS EXPIRED'
  },
  {
    id: 102,
    code: 'EXP_30',
    description: 'Custom process for Expired licenses',
    command: 'CUSTOM_PROCESS EXP_30'
  },
  {
    id: 103,
    code: 'NOT_FOUND',
    description: 'Custom process for Expired licenses',
    command: 'CUSTOM_PROCESS NOT_FOUND'
  },
  {
    id: 104,
    code: 'NEW_LICENSE',
    description: 'Custom process for Expired licenses',
    command: 'CUSTOM_PROCESS NEW_LICENSE'
  }
];

module.exports = {
  processes
};
